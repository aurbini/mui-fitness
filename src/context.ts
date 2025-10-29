import React, { createContext, useContext } from "react";
import { ExercisesContextType } from "./types/context";

export const ExercisesContext = createContext<ExercisesContextType | undefined>(
  undefined
);

export const { Provider } = ExercisesContext;

export const useExercises = (): ExercisesContextType => {
  const context = useContext(ExercisesContext);
  if (!context) {
    throw new Error("useExercises must be used within an ExercisesProvider");
  }
  return context;
};

// Legacy HOC for backward compatibility during transition
export const withContext =
  <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    const context = useExercises();
    return React.createElement(Component, { ...context, ...props });
  };
