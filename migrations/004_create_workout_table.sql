-- Create workouts and workout_exercises tables
-- Workouts are workout sessions that contain multiple exercises
-- Exercises are just templates/types of exercises

-- Create workouts table (workout sessions)
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    workout_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_exercises table (junction table linking workouts to exercises)
-- This is where sets, reps, weight, duration, notes are stored
CREATE TABLE IF NOT EXISTS public.workout_exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
    sets INTEGER DEFAULT 0,
    reps INTEGER DEFAULT 0,
    weight DECIMAL(10,2) DEFAULT 0,
    duration INTEGER DEFAULT 0, -- in seconds
    notes TEXT,
    order_index INTEGER DEFAULT 0, -- Order of exercise in the workout
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workout_id, exercise_id, order_index)
);

-- Enable Row Level Security
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- Create policies for workouts table
CREATE POLICY "Users can view own workouts" ON public.workouts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts" ON public.workouts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON public.workouts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts" ON public.workouts
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for workout_exercises table
CREATE POLICY "Users can view own workout exercises" ON public.workout_exercises
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workouts 
            WHERE id = workout_exercises.workout_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own workout exercises" ON public.workout_exercises
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workouts 
            WHERE id = workout_exercises.workout_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own workout exercises" ON public.workout_exercises
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workouts 
            WHERE id = workout_exercises.workout_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own workout exercises" ON public.workout_exercises
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workouts 
            WHERE id = workout_exercises.workout_id 
            AND user_id = auth.uid()
        )
    );

-- Create trigger to automatically update updated_at for workouts
CREATE OR REPLACE TRIGGER on_workouts_updated
    BEFORE UPDATE ON public.workouts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger to automatically update updated_at for workout_exercises
CREATE OR REPLACE TRIGGER on_workout_exercises_updated
    BEFORE UPDATE ON public.workout_exercises
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_workout_date ON public.workouts(workout_date);
CREATE INDEX IF NOT EXISTS idx_workouts_created_at ON public.workouts(created_at);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON public.workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise_id ON public.workout_exercises(exercise_id);

-- Create a view for workouts with exercise details
CREATE OR REPLACE VIEW public.workouts_with_exercises AS
SELECT 
    w.id as workout_id,
    w.user_id,
    w.title as workout_title,
    w.description as workout_description,
    w.workout_date,
    w.notes as workout_notes,
    w.is_favorite as workout_is_favorite,
    w.created_at as workout_created_at,
    w.updated_at as workout_updated_at,
    we.id as workout_exercise_id,
    we.exercise_id,
    e.title as exercise_title,
    e.description as exercise_description,
    mg.name as muscle_group,
    we.sets,
    we.reps,
    we.weight,
    we.duration,
    we.notes as exercise_notes,
    we.order_index,
    we.created_at as exercise_added_at
FROM public.workouts w
LEFT JOIN public.workout_exercises we ON w.id = we.workout_id
LEFT JOIN public.exercises e ON we.exercise_id = e.id
LEFT JOIN public.muscle_groups mg ON e.muscle_group_id = mg.id
ORDER BY w.workout_date DESC, we.order_index ASC;

-- Enable RLS on the view
ALTER VIEW public.workouts_with_exercises SET (security_invoker = true);

-- Grant necessary permissions
GRANT ALL ON public.workouts TO authenticated;
GRANT ALL ON public.workout_exercises TO authenticated;