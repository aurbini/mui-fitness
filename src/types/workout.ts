// Workout related types

export interface Workout {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  workout_date: string;
  notes?: string;
  is_favorite?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number; // in seconds
  notes?: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutWithExercises extends Workout {
  exercises: WorkoutExerciseWithDetails[];
}

export interface WorkoutExerciseWithDetails extends WorkoutExercise {
  exercise_title: string;
  exercise_description?: string;
  muscle_group: string;
  muscle_group_id: number;
}

export interface WorkoutFormData {
  id?: string;
  title: string;
  description?: string;
  workout_date: string;
  notes?: string;
  is_favorite?: boolean;
}

export interface WorkoutExerciseFormData {
  id?: string;
  exercise_id: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  notes?: string;
  order_index: number;
}

// Database creation/update types
export interface CreateWorkoutData {
  title: string;
  description?: string;
  workout_date: string;
  notes?: string;
  is_favorite?: boolean;
  user_id: string;
}

export interface UpdateWorkoutData {
  title?: string;
  description?: string;
  workout_date?: string;
  notes?: string;
  is_favorite?: boolean;
}

export interface CreateWorkoutExerciseData {
  workout_id: string;
  exercise_id: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  notes?: string;
  order_index: number;
}

export interface UpdateWorkoutExerciseData {
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
  order_index?: number;
}




