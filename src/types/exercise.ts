// Exercise related types
export interface Exercise {
  id: string;
  user_id: string;
  title: string;
  description: string;
  muscle_group_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExerciseWithMuscleGroup extends Exercise {
  muscle_group: string;
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
  id?: string;
  title: string;
  description: string;
  muscle_group_id: number;
}

// Database exercise creation data
export interface CreateExerciseData {
  title: string;
  description: string;
  muscle_group_id: number;
  user_id: string;
}

// Database exercise update data
export interface UpdateExerciseData {
  title?: string;
  description?: string;
  muscle_group_id?: number;
}
