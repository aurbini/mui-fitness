// Component prop types
import { ReactNode } from "react";
import { ExerciseFormData, ExerciseWithMuscleGroup } from "./exercise";

// Form component props
export interface FormProps {
  exercise?: ExerciseWithMuscleGroup | {};
  muscles: string[];
  onSubmit: (exercise: ExerciseFormData) => void;
}

// Dialog component props
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

// Layout component props
export interface LayoutProps {
  children: ReactNode;
}

// Auth form props
export interface AuthFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (
    email: string,
    password: string,
    userData?: Record<string, any>
  ) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  loading: boolean;
  error: string;
  message: string;
}

// Exercise list props
export interface ExerciseListProps {
  exercises: ExerciseWithMuscleGroup[];
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

// Exercise preview props
export interface ExercisePreviewProps {
  exercise: ExerciseWithMuscleGroup | {};
  editMode: boolean;
  muscles: string[];
  onEdit: (exercise: ExerciseFormData) => void;
}
