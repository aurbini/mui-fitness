-- Remove workout-specific columns from exercises table
-- Exercises should only be templates/types, not workout instances
-- Workout data (sets, reps, weight, etc.) should be in workout_exercises table

-- Drop the old exercises_with_muscle_groups view if it exists
DROP VIEW IF EXISTS public.exercises_with_muscle_groups;

-- Remove columns from exercises table
ALTER TABLE public.exercises 
    DROP COLUMN IF EXISTS sets,
    DROP COLUMN IF EXISTS reps,
    DROP COLUMN IF EXISTS weight,
    DROP COLUMN IF EXISTS duration,
    DROP COLUMN IF EXISTS notes,
    DROP COLUMN IF EXISTS is_favorite;

-- Recreate the exercises_with_muscle_groups view without workout-specific columns
CREATE OR REPLACE VIEW public.exercises_with_muscle_groups AS
SELECT 
    e.id,
    e.user_id,
    e.title,
    e.description,
    e.created_at,
    e.updated_at,
    mg.name as muscle_group,
    mg.id as muscle_group_id
FROM public.exercises e
JOIN public.muscle_groups mg ON e.muscle_group_id = mg.id;

-- Enable RLS on the view
ALTER VIEW public.exercises_with_muscle_groups SET (security_invoker = true);

-- Drop the existing get_user_exercises function if it exists (required when changing return type)
DROP FUNCTION IF EXISTS public.get_user_exercises(UUID);

-- Update the get_user_exercises function to match new structure
CREATE OR REPLACE FUNCTION public.get_user_exercises(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    muscle_group TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.description,
        mg.name as muscle_group,
        e.created_at,
        e.updated_at
    FROM public.exercises e
    JOIN public.muscle_groups mg ON e.muscle_group_id = mg.id
    WHERE e.user_id = user_uuid
    ORDER BY e.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;




