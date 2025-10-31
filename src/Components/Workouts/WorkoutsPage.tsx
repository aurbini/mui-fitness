import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Fab,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { WorkoutList, WorkoutForm } from "./index";
import { useWorkouts } from "../../hooks/useWorkouts";
import { WorkoutFormData, Workout } from "../../types/workout";

const WorkoutsPage: React.FC = () => {
  const {
    workouts,
    loading,
    error,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    refreshWorkouts,
  } = useWorkouts();

  const [formOpen, setFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [formTitle, setFormTitle] = useState("Create Workout");

  const handleCreateWorkout = () => {
    setEditingWorkout(null);
    setFormTitle("Create Workout");
    setFormOpen(true);
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setFormTitle("Edit Workout");
    setFormOpen(true);
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      const { error } = await deleteWorkout(workoutId);
      if (error) {
        console.error("Error deleting workout:", error);
      }
    }
  };

  const handleSelectWorkout = (workout: Workout) => {
    // For now, just log the selection. You can expand this later
    console.log("Selected workout:", workout);
  };

  const handleFormSubmit = async (workoutData: WorkoutFormData) => {
    // The form now handles creating/updating the workout and exercises internally
    // Refresh the workouts list to ensure it's up to date
    await refreshWorkouts();
    setFormOpen(false);
    setEditingWorkout(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingWorkout(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Workouts
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateWorkout}
        >
          Create Workout
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <WorkoutList
        workouts={workouts}
        onEdit={handleEditWorkout}
        onDelete={handleDeleteWorkout}
        onSelect={handleSelectWorkout}
      />

      <WorkoutForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        workout={editingWorkout}
        title={formTitle}
      />

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add workout"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { xs: "flex", sm: "none" },
        }}
        onClick={handleCreateWorkout}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default WorkoutsPage;
