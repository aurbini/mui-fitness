-- Seed default exercises based on store.js data
-- This migration populates the exercises table with the default exercises for new users

-- Create a function to seed default exercises for a user
CREATE OR REPLACE FUNCTION public.seed_default_exercises(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    shoulders_id INTEGER;
    arms_id INTEGER;
    chest_id INTEGER;
    back_id INTEGER;
    legs_id INTEGER;
BEGIN
    -- Get muscle group IDs
    SELECT id INTO shoulders_id FROM public.muscle_groups WHERE name = 'shoulders';
    SELECT id INTO arms_id FROM public.muscle_groups WHERE name = 'arms';
    SELECT id INTO chest_id FROM public.muscle_groups WHERE name = 'chest';
    SELECT id INTO back_id FROM public.muscle_groups WHERE name = 'back';
    SELECT id INTO legs_id FROM public.muscle_groups WHERE name = 'legs';
    
    -- Insert default exercises for the user
    INSERT INTO public.exercises (user_id, title, description, muscle_group_id) VALUES
        (user_uuid, 'Overhead Press', 'Delts exercise...', shoulders_id),
        (user_uuid, 'Dips', 'Triceps exercise...', arms_id),
        (user_uuid, 'Barbell Curls', 'Biceps exercise...', arms_id),
        (user_uuid, 'Bench Press', 'Chest exercise...', chest_id),
        (user_uuid, 'Pull Ups', 'Back and biceps exercise...', back_id),
        (user_uuid, 'Deadlifts', 'Back and leg exercise...', back_id),
        (user_uuid, 'Squats', 'Legs exercise...', legs_id)
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to automatically seed default exercises for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_with_exercises()
RETURNS TRIGGER AS $$
BEGIN
    -- First create the profile (this is handled by the existing trigger)
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Then seed default exercises
    PERFORM public.seed_default_exercises(NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the old trigger and create the new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_with_exercises();

-- Create a function to get user's exercises with muscle groups
CREATE OR REPLACE FUNCTION public.get_user_exercises(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    muscle_group TEXT,
    sets INTEGER,
    reps INTEGER,
    weight DECIMAL(10,2),
    duration INTEGER,
    notes TEXT,
    is_favorite BOOLEAN,
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
        e.sets,
        e.reps,
        e.weight,
        e.duration,
        e.notes,
        e.is_favorite,
        e.created_at,
        e.updated_at
    FROM public.exercises e
    JOIN public.muscle_groups mg ON e.muscle_group_id = mg.id
    WHERE e.user_id = user_uuid
    ORDER BY e.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.exercises TO authenticated;
GRANT ALL ON public.muscle_groups TO authenticated;
GRANT EXECUTE ON FUNCTION public.seed_default_exercises(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_exercises(UUID) TO authenticated;
