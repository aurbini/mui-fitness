import React, { useState, useMemo } from "react";
import { CssBaseline } from "@mui/material";
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import Viewer from "./Exercises/Viewer";
import { muscles, exercises } from "../store";
import { Provider } from "../context";

const App = () => {
  const [exercisesList, setExercisesList] = useState(exercises);
  const [exercise, setExercise] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [category, setCategory] = useState("");

  const getExercisesByMuscles = useMemo(() => {
    const initExercises = muscles.reduce(
      (exercises, category) => ({
        ...exercises,
        [category]: [],
      }),
      {}
    );

    return Object.entries(
      exercisesList.reduce((exercises, exercise) => {
        const { muscles } = exercise;
        exercises[muscles] = [...exercises[muscles], exercise];
        return exercises;
      }, initExercises)
    );
  }, [exercisesList]);

  const handleCategorySelect = (category) => {
    setCategory(category);
  };

  const handleExerciseSelect = (id) => {
    const selectedExercise = exercisesList.find((ex) => ex.id === id);
    setExercise(selectedExercise);
    setEditMode(false);
  };

  const handleExerciseCreate = (newExercise) => {
    setExercisesList((prev) => [...prev, newExercise]);
  };

  const handleExerciseDelete = (id) => {
    setExercisesList((prev) => prev.filter((ex) => ex.id !== id));
    if (exercise.id === id) {
      setExercise({});
      setEditMode(false);
    }
  };

  const handleExerciseSelectEdit = (id) => {
    const selectedExercise = exercisesList.find((ex) => ex.id === id);
    setExercise(selectedExercise);
    setEditMode(true);
  };

  const handleExerciseEdit = (updatedExercise) => {
    setExercisesList((prev) => [
      ...prev.filter((ex) => ex.id !== updatedExercise.id),
      updatedExercise,
    ]);
    setExercise(updatedExercise);
  };

  const contextValue = {
    muscles,
    exercises: exercisesList,
    exercise,
    editMode,
    category,
    exercisesByMuscles: getExercisesByMuscles,
    onCategorySelect: handleCategorySelect,
    onCreate: handleExerciseCreate,
    onEdit: handleExerciseEdit,
    onSelectEdit: handleExerciseSelectEdit,
    onDelete: handleExerciseDelete,
    onSelect: handleExerciseSelect,
  };

  return (
    <Provider value={contextValue}>
      <CssBaseline />
      <Header />
      <Viewer />
      <Footer />
    </Provider>
  );
};

export default App;
