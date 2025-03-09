# BrainBash - Interactive Quiz Platform

An interactive quiz platform built with Next.js, Supabase, and shadcn/ui.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Docker Desktop (for local Supabase)
- Supabase CLI

### Initial Setup

1. Install Supabase CLI globally:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Initialize Supabase:
   ```bash
   supabase init
   ```

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Start local Supabase:
   ```bash
   npm run supabase:start
   ```
   This will output your local database URL and anon key. Update your `.env` file with these values.

### Database Migrations

1. Create a new migration:
   ```bash
   npm run supabase:migration:new your_migration_name
   ```
   This creates a new timestamped SQL file in `supabase/migrations/`.

2. Apply migrations:
   ```bash
   npm run supabase:migration:up
   ```

3. Revert last migration:
   ```bash
   npm run supabase:migration:down
   ```

4. Check Supabase status:
   ```bash
   npm run supabase:status
   ```

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Production Deployment

1. Link to your Supabase project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. Push migrations to production:
   ```bash
   supabase db push
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

## Local Development Tips

1. View Database:
   - Local dashboard: http://localhost:54323
   - Studio URL will be shown when you run `supabase start`

2. Stopping Supabase:
   ```bash
   npm run supabase:stop
   ```

3. Troubleshooting:
   - If Docker containers aren't running: `docker ps`
   - Check Supabase status: `npm run supabase:status`
   - Reset local database: `supabase db reset`