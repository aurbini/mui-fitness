import React, { useState, useMemo } from "react";
import { CssBaseline, CircularProgress, Box } from "@mui/material";
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import Viewer from "./Exercises/Viewer";
import LoginForm from "./Auth/LoginForm";
import { muscles } from "../store";
import { Provider } from "../context";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useExercises } from "../hooks/useExercises";
import { Exercise } from "../types/exercise";
// Main App Component with Supabase integration
const AppContent = () => {
  const { user, loading: authLoading } = useAuth();

  const {
    exercises: exercisesList,
    muscleGroups,
    loading: exercisesLoading,
    createExercise,
    updateExercise,
    deleteExercise,
  } = useExercises();

  const [exercise, setExercise] = useState<Exercise | {}>({});
  const [editMode, setEditMode] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");

  // Get muscle groups from Supabase or fallback to static data
  const availableMuscles =
    muscleGroups.length > 0 ? muscleGroups.map((mg) => mg.name) : muscles;

  const getExercisesByMuscles = useMemo(() => {
    const initExercises = availableMuscles.reduce(
      (exercises, category) => ({
        ...exercises,
        [category]: [],
      }),
      {} as Record<string, Exercise[]>
    );

    return Object.entries(
      exercisesList.reduce((exercises, exercise) => {
        const { muscles } = exercise;
        exercises[muscles] = [...exercises[muscles], exercise];
        return exercises;
      }, initExercises)
    );
  }, [exercisesList, availableMuscles]);

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show login form if user is not authenticated
  if (!user) {
    const contextValue = {
      muscles: availableMuscles,
      exercises: exercisesList,
      exercise: {},
      editMode: false,
      category: "",
      exercisesByMuscles: [],
      loading: false,
      onCategorySelect: () => {},
      onCreate: async () => {},
      onEdit: async () => {},
      onSelectEdit: () => {},
      onDelete: async () => {},
      onSelect: () => {},
    };

    return (
      <Provider value={contextValue}>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <CssBaseline />
          <Header />
          <Box sx={{ flex: 1 }}>
            <LoginForm />
          </Box>
          <Footer />
        </Box>
      </Provider>
    );
  }

  const handleCategorySelect = (category: string) => {
    setCategory(category);
  };

  const handleExerciseSelect = (id: string) => {
    const selectedExercise = exercisesList.find((ex) => ex.id === id);
    setExercise(selectedExercise || {});
    setEditMode(false);
  };

  const handleExerciseCreate = async (newExercise: Partial<Exercise>) => {
    try {
      // Get muscle group ID from name
      const muscleGroup = muscleGroups.find(
        (mg) => mg.name === newExercise.muscles
      );
      if (!muscleGroup) {
        throw new Error("Invalid muscle group");
      }

      const exerciseData = {
        title: newExercise.title || "",
        description: newExercise.description || "",
        muscles: newExercise.muscles || "",
        sets: newExercise.sets || 0,
        reps: newExercise.reps || 0,
        weight: newExercise.weight || 0,
        duration: newExercise.duration || 0,
        notes: newExercise.notes || "",
        is_favorite: newExercise.is_favorite || false,
      };

      const { error } = await createExercise(exerciseData);
      if (error) throw error;
    } catch (error) {
      console.error("Error creating exercise:", error);
    }
  };

  const handleExerciseDelete = async (id: string) => {
    try {
      const { error } = await deleteExercise(id);
      if (error) throw error;

      if ("id" in exercise && exercise.id === id) {
        setExercise({});
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  const handleExerciseSelectEdit = (id: string) => {
    const selectedExercise = exercisesList.find((ex) => ex.id === id);
    setExercise(selectedExercise || {});
    setEditMode(true);
  };

  const handleExerciseEdit = async (updatedExercise: Partial<Exercise>) => {
    try {
      // Get muscle group ID from name
      const muscleGroup = muscleGroups.find(
        (mg) => mg.name === updatedExercise.muscles
      );
      if (!muscleGroup) {
        throw new Error("Invalid muscle group");
      }

      const exerciseData = {
        title: updatedExercise.title || "",
        description: updatedExercise.description || "",
        muscles: updatedExercise.muscles || "",
        sets: updatedExercise.sets || 0,
        reps: updatedExercise.reps || 0,
        weight: updatedExercise.weight || 0,
        duration: updatedExercise.duration || 0,
        notes: updatedExercise.notes || "",
        is_favorite: updatedExercise.is_favorite || false,
      };

      if (!updatedExercise.id) {
        throw new Error("Exercise ID is required for editing");
      }

      const { error } = await updateExercise(updatedExercise.id, exerciseData);
      if (error) throw error;

      setExercise(updatedExercise);
    } catch (error) {
      console.error("Error updating exercise:", error);
    }
  };

  const contextValue = {
    muscles: availableMuscles,
    exercises: exercisesList,
    exercise,
    editMode,
    category,
    exercisesByMuscles: getExercisesByMuscles,
    loading: exercisesLoading,
    onCategorySelect: handleCategorySelect,
    onCreate: handleExerciseCreate,
    onEdit: handleExerciseEdit,
    onSelectEdit: handleExerciseSelectEdit,
    onDelete: handleExerciseDelete,
    onSelect: handleExerciseSelect,
  };

  return (
    <Provider value={contextValue}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <CssBaseline />
        <Header />
        <Box sx={{ flex: 1 }}>
          {exercisesLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="50vh"
            >
              <CircularProgress />
            </Box>
          ) : (
            <Viewer />
          )}
        </Box>
        <Footer />
      </Box>
    </Provider>
  );
};

// Main App component with AuthProvider wrapper
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
