-- Create exercises table migration
-- This table stores user-specific exercises based on the store.js data structure

-- Create muscle_groups table for reference
CREATE TABLE IF NOT EXISTS public.muscle_groups (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default muscle groups from store.js
INSERT INTO public.muscle_groups (name) VALUES 
    ('shoulders'),
    ('chest'),
    ('arms'),
    ('back'),
    ('legs')
ON CONFLICT (name) DO NOTHING;

-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    muscle_group_id INTEGER REFERENCES public.muscle_groups(id) ON DELETE RESTRICT NOT NULL,
    sets INTEGER DEFAULT 0,
    reps INTEGER DEFAULT 0,
    weight DECIMAL(10,2) DEFAULT 0,
    duration INTEGER DEFAULT 0, -- in seconds
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.muscle_groups ENABLE ROW LEVEL SECURITY;

-- Create policies for muscle_groups table (read-only for all authenticated users)
CREATE POLICY "Muscle groups are viewable by authenticated users" ON public.muscle_groups
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for exercises table
-- Users can only view their own exercises
CREATE POLICY "Users can view own exercises" ON public.exercises
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own exercises
CREATE POLICY "Users can insert own exercises" ON public.exercises
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own exercises
CREATE POLICY "Users can update own exercises" ON public.exercises
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own exercises
CREATE POLICY "Users can delete own exercises" ON public.exercises
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at for exercises
CREATE OR REPLACE TRIGGER on_exercises_updated
    BEFORE UPDATE ON public.exercises
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON public.exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group_id ON public.exercises(muscle_group_id);
CREATE INDEX IF NOT EXISTS idx_exercises_created_at ON public.exercises(created_at);

-- Create a view for exercises with muscle group names for easier querying
CREATE OR REPLACE VIEW public.exercises_with_muscle_groups AS
SELECT 
    e.id,
    e.user_id,
    e.title,
    e.description,
    e.sets,
    e.reps,
    e.weight,
    e.duration,
    e.notes,
    e.is_favorite,
    e.created_at,
    e.updated_at,
    mg.name as muscle_group
FROM public.exercises e
JOIN public.muscle_groups mg ON e.muscle_group_id = mg.id;

-- Enable RLS on the view
ALTER VIEW public.exercises_with_muscle_groups SET (security_invoker = true);
