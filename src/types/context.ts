// Context related types
import { ExerciseWithMuscleGroup } from "./exercise";

export interface ExercisesContextType {
  muscles: string[];
  exercises: ExerciseWithMuscleGroup[];
  exercise: ExerciseWithMuscleGroup | {};
  editMode: boolean;
  category: string;
  exercisesByMuscles: [string, ExerciseWithMuscleGroup[]][];
  loading: boolean;
  onCategorySelect: (category: string) => void;
  onCreate: (exercise: Partial<ExerciseWithMuscleGroup>) => Promise<void>;
  onEdit: (exercise: Partial<ExerciseWithMuscleGroup>) => Promise<void>;
  onSelectEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onSelect: (id: string) => void;
}
