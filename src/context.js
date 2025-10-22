import React, { createContext, useContext } from "react";

export const ExercisesContext = createContext();

export const { Provider } = ExercisesContext;

export const useExercises = () => {
  const context = useContext(ExercisesContext);
  if (!context) {
    throw new Error("useExercises must be used within an ExercisesProvider");
  }
  return context;
};

// Legacy HOC for backward compatibility during transition
export const withContext = (Component) => (props) => {
  const context = useExercises();
  return <Component {...context} {...props} />;
};
