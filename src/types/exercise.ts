// Exercise related types
export interface Exercise {
  id: string;
  title: string;
  description: string;
  muscles: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
  is_favorite?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MuscleGroup {
  id: number;
  name: string;
  created_at: string;
}

export interface ExerciseWithMuscleGroup extends Exercise {
  muscle_group: string;
  user_id: string;
}

export interface ExerciseFormData {
  title: string;
  description: string;
  muscles: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
  is_favorite?: boolean;
}

// Database exercise creation data
export interface CreateExerciseData {
  title: string;
  description: string;
  muscle_group_id: number;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
  is_favorite?: boolean;
  user_id: string;
}
