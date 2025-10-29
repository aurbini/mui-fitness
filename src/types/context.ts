// Context related types
import { Exercise, ExerciseWithMuscleGroup } from "./exercise";

export interface ExercisesContextType {
  muscles: string[];
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
