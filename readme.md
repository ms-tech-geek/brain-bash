# BrainBash - Interactive Quiz Platform

An interactive quiz platform built with Next.js, Supabase, and shadcn/ui.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account
- Git (optional)

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Click the "Connect to Supabase" button in the top right corner of the editor
   - This will automatically create a new Supabase project
   - The environment variables will be automatically added to your `.env` file

### Database Setup

1. Navigate to your Supabase project dashboard
2. Go to "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `supabase/migrations/create_profiles_table.sql`
5. Paste the SQL into the query editor
6. Click "Run" to execute the migration

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- User authentication with Supabase Auth
- User profiles with role-based access
- Interactive quiz creation and participation
- Real-time leaderboard
- Beautiful UI with shadcn/ui components

## Project Structure

```
├── app/                  # Next.js app directory
├── components/          # React components
├── lib/                 # Utility functions and configurations
├── public/             # Static assets
└── supabase/           # Supabase configurations and migrations
    └── migrations/     # SQL migration files
```

## Database Schema

### Profiles Table
- `id`: UUID (Primary Key, references auth.users)
- `display_name`: Text
- `role`: Enum ('admin' | 'player')
- `created_at`: Timestamp
- `updated_at`: Timestamp

Row Level Security (RLS) policies ensure users can only:
- Read their own profile
- Update their own profile
- Insert their profile during signup