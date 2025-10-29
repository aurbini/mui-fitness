# Supabase Migrations

This folder contains SQL migration files for setting up the Supabase database schema for the MUI Fitness application.

## Migration Files

### 001_create_users_table.sql

- Creates the `profiles` table that extends `auth.users`
- Sets up Row Level Security (RLS) policies for user data protection
- Creates triggers for automatic profile creation and timestamp updates
- Ensures users can only access their own profile data

### 002_create_exercises_table.sql

- Creates the `muscle_groups` reference table with default muscle groups
- Creates the `exercises` table with user-specific exercise data
- Sets up RLS policies to ensure users can only access their own exercises
- Creates indexes for better query performance
- Creates a view `exercises_with_muscle_groups` for easier querying

### 003_seed_default_exercises.sql

- Creates functions to seed default exercises for new users
- Updates the user creation trigger to automatically create default exercises
- Creates helper functions for exercise management
- Grants necessary permissions to authenticated users

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:

- Users can only view, create, update, and delete their own data
- Muscle groups are readable by all authenticated users
- No cross-user data access is possible

### Data Protection

- All user data is tied to the authenticated user's ID
- Automatic profile creation on user signup
- Secure functions with `SECURITY DEFINER` for controlled access
- Proper foreign key constraints and cascading deletes

## Usage

1. Run these migrations in order in your Supabase SQL editor
2. Set up your environment variables (see `env.example`)
3. Install dependencies: `npm install`
4. Configure your Supabase client in `src/lib/supabase.js`

## Environment Variables

Create a `.env` file with:

```
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Schema

### Tables

- `profiles` - User profile information
- `muscle_groups` - Reference table for exercise muscle groups
- `exercises` - User-specific exercise data

### Views

- `exercises_with_muscle_groups` - Exercises with muscle group names for easier querying

### Functions

- `handle_new_user()` - Creates profile and seeds default exercises for new users
- `seed_default_exercises(user_uuid)` - Seeds default exercises for a specific user
- `get_user_exercises(user_uuid)` - Retrieves user's exercises with muscle group names
