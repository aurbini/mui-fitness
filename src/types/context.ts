// Context related types
import { Exercise, ExerciseWithMuscleGroup, MuscleGroup } from "./exercise";
import { Workout, WorkoutWithExercises } from "./workout";

export interface ExercisesContextType {
  muscles: string[];
  muscleGroups: MuscleGroup[];
  exercises: Exercise[];
  exercise: Exercise | {};
  editMode: boolean;
  category: string;
  exercisesByMuscles: [string, Exercise[]][];
  loading: boolean;
  onCategorySelect: (category: string) => void;
  onCreate: (exercise: Partial<Exercise>) => Promise<void>;
  onEdit: (exercise: Partial<Exercise>) => Promise<void>;
  onSelectEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onSelect: (id: string) => void;
}

export interface WorkoutsContextType {
  workouts: Workout[];
  currentWorkout: WorkoutWithExercises | null;
  loading: boolean;
  onCreateWorkout: (workout: Partial<Workout>) => Promise<void>;
  onUpdateWorkout: (id: string, workout: Partial<Workout>) => Promise<void>;
  onDeleteWorkout: (id: string) => Promise<void>;
  onLoadWorkout: (id: string) => Promise<void>;
  onAddExerciseToWorkout: (workoutId: string, exercise: any) => Promise<void>;
  onRemoveExerciseFromWorkout: (workoutExerciseId: string) => Promise<void>;
}
