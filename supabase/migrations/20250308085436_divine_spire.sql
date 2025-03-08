/*
  # BrainBash Database Schema

  1. New Tables
    - users (extends auth.users)
      - role: Admin or Player
      - display_name: User's display name
    - quizzes
      - Basic quiz information
      - Created by admin users
    - questions
      - Questions for each quiz
      - Multiple choice options
    - responses
      - User responses to quiz questions
      - Tracks score and timing
    - leaderboard
      - Real-time quiz leaderboard
      - Updated via triggers

  2. Security
    - Enable RLS on all tables
    - Admins can manage quizzes and questions
    - Players can view quizzes and submit responses
    - Everyone can view leaderboard
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'player');

-- Create profiles table that extends auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'player',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_earned INTEGER NOT NULL,
  response_time_seconds FLOAT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  total_time_seconds FLOAT NOT NULL DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(quiz_id, user_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Quizzes policies
CREATE POLICY "Quizzes are viewable by everyone"
  ON quizzes FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update own quizzes"
  ON quizzes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
    AND created_by = auth.uid()
  );

-- Questions policies
CREATE POLICY "Questions are viewable by everyone"
  ON questions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage questions"
  ON questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Responses policies
CREATE POLICY "Users can view own responses"
  ON responses FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert responses"
  ON responses FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Leaderboard policies
CREATE POLICY "Leaderboard is viewable by everyone"
  ON leaderboard FOR SELECT
  USING (true);

-- Function to update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO leaderboard (quiz_id, user_id, total_points, total_time_seconds)
  VALUES (
    NEW.quiz_id,
    NEW.user_id,
    (
      SELECT COALESCE(SUM(points_earned), 0)
      FROM responses
      WHERE quiz_id = NEW.quiz_id AND user_id = NEW.user_id
    ),
    (
      SELECT COALESCE(SUM(response_time_seconds), 0)
      FROM responses
      WHERE quiz_id = NEW.quiz_id AND user_id = NEW.user_id
    )
  )
  ON CONFLICT (quiz_id, user_id)
  DO UPDATE SET
    total_points = EXCLUDED.total_points,
    total_time_seconds = EXCLUDED.total_time_seconds,
    updated_at = now();

  -- Update ranks for this quiz
  WITH ranked_scores AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY quiz_id
        ORDER BY total_points DESC, total_time_seconds ASC
      ) as new_rank
    FROM leaderboard
    WHERE quiz_id = NEW.quiz_id
  )
  UPDATE leaderboard l
  SET rank = r.new_rank
  FROM ranked_scores r
  WHERE l.id = r.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update leaderboard on new responses
CREATE TRIGGER update_leaderboard_trigger
AFTER INSERT ON responses
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard();