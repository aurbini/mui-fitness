import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Divider,
  IconButton,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { WorkoutFormData, WorkoutExerciseFormData } from "../../types/workout";
import { useExercises } from "../../hooks/useExercises";
import { useWorkouts } from "../../hooks/useWorkouts";

interface WorkoutFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (workout: WorkoutFormData) => void;
  workout?: WorkoutFormData | null;
  title: string;
}

interface ExerciseFormState extends WorkoutExerciseFormData {
  id?: string;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({
  open,
  onClose,
  onSubmit,
  workout,
  title,
}) => {
  const { exercises, loading: exercisesLoading, muscleGroups } = useExercises();
  const {
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    loadWorkoutWithExercises,
    updateWorkout,
    createWorkout,
  } = useWorkouts();

  const [formData, setFormData] = useState<WorkoutFormData>({
    title: "",
    description: "",
    workout_date: new Date().toISOString().split("T")[0],
    notes: "",
    is_favorite: false,
  });

  const [workoutExercises, setWorkoutExercises] = useState<ExerciseFormState[]>(
    []
  );
  const [newExercise, setNewExercise] = useState<ExerciseFormState>({
    exercise_id: "",
    sets: 0,
    reps: 0,
    weight: 0,
    duration: 0,
    notes: "",
    order_index: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workoutId, setWorkoutId] = useState<string | null>(null);

  useEffect(() => {
    if (workout) {
      setFormData(workout);
      if (workout.id) {
        setWorkoutId(workout.id);
        loadExercisesForWorkout(workout.id);
      }
    } else {
      setFormData({
        title: "",
        description: "",
        workout_date: new Date().toISOString().split("T")[0],
        notes: "",
        is_favorite: false,
      });
      setWorkoutExercises([]);
      setWorkoutId(null);
    }
  }, [workout, open]);

  const loadExercisesForWorkout = async (id: string) => {
    const { data } = await loadWorkoutWithExercises(id);
    if (data && data.exercises) {
      setWorkoutExercises(
        data.exercises.map((ex) => ({
          id: ex.id,
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          duration: ex.duration,
          notes: ex.notes || "",
          order_index: ex.order_index,
        }))
      );
    }
  };

  const handleChange =
    (field: keyof WorkoutFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleExerciseChange =
    (field: keyof ExerciseFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      const value =
        field === "exercise_id" || field === "notes"
          ? (event.target as HTMLInputElement).value
          : Number((event.target as HTMLInputElement).value) || 0;

      setNewExercise((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleAddExercise = () => {
    if (!newExercise.exercise_id) return;

    const exerciseToAdd: ExerciseFormState = {
      ...newExercise,
      order_index: workoutExercises.length,
    };

    setWorkoutExercises([...workoutExercises, exerciseToAdd]);
    setNewExercise({
      exercise_id: "",
      sets: 0,
      reps: 0,
      weight: 0,
      duration: 0,
      notes: "",
      order_index: 0,
    });
  };

  const handleRemoveExercise = (index: number) => {
    setWorkoutExercises(
      workoutExercises
        .filter((_, i) => i !== index)
        .map((ex, i) => ({
          ...ex,
          order_index: i,
        }))
    );
  };

  const handleUpdateExercise = (
    index: number,
    field: keyof ExerciseFormState,
    value: any
  ) => {
    const updated = [...workoutExercises];
    updated[index] = { ...updated[index], [field]: value };
    setWorkoutExercises(updated);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // First, create or update the workout
      if (workoutId && workout) {
        // Editing existing workout
        const { error: updateError } = await updateWorkout(workoutId, formData);
        if (updateError) throw updateError;

        // Update exercises - remove all existing and add new ones
        const currentExercises = await loadWorkoutWithExercises(workoutId);
        if (currentExercises.data?.exercises) {
          for (const ex of currentExercises.data.exercises) {
            await removeExerciseFromWorkout(ex.id);
          }
        }

        // Add updated exercises
        for (const exercise of workoutExercises) {
          const { error } = await addExerciseToWorkout(workoutId, exercise);
          if (error) throw error;
        }
      } else {
        // Creating new workout - we'll create it first, then add exercises
        const { data: newWorkout, error: createError } = await createWorkout(
          formData
        );
        if (createError || !newWorkout)
          throw createError || new Error("Failed to create workout");

        // Add exercises to the newly created workout
        for (const exercise of workoutExercises) {
          const { error } = await addExerciseToWorkout(newWorkout.id, exercise);
          if (error) throw error;
        }
      }

      // Close the form
      onClose();

      // Call the parent's onSubmit callback (for any additional handling/cleanup)
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting workout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            {/* Workout Basic Info */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Workout Details
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Workout Title"
                  value={formData.title}
                  onChange={handleChange("title")}
                  fullWidth
                  required
                />
                <TextField
                  label="Description"
                  value={formData.description || ""}
                  onChange={handleChange("description")}
                  fullWidth
                  multiline
                  rows={2}
                />
                <TextField
                  label="Workout Date"
                  type="date"
                  value={formData.workout_date}
                  onChange={handleChange("workout_date")}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Notes"
                  value={formData.notes || ""}
                  onChange={handleChange("notes")}
                  fullWidth
                  multiline
                  rows={3}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_favorite || false}
                      onChange={handleChange("is_favorite")}
                    />
                  }
                  label="Mark as Favorite"
                />
              </Box>
            </Box>

            <Divider />

            {/* Add Exercise Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Add Exercises
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel color="primary">Select Exercise</InputLabel>
                      <Select
                        value={newExercise.exercise_id}
                        onChange={(e) =>
                          setNewExercise({
                            ...newExercise,
                            exercise_id: e.target.value as string,
                          })
                        }
                        label="Select Exercise"
                        disabled={exercisesLoading}
                        sx={{ color: "text.primary" }}
                      >
                        {exercises.map((exercise) => {
                          const muscleGroupName =
                            (exercise as any).muscle_group ||
                            muscleGroups.find(
                              (mg) => mg.id === exercise.muscle_group_id
                            )?.name;
                          return (
                            <MenuItem
                              key={exercise.id}
                              value={exercise.id}
                              sx={{ color: "text.primary" }}
                            >
                              {exercise.title}
                              {muscleGroupName && (
                                <Chip
                                  label={muscleGroupName}
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>

                  {newExercise.exercise_id && (
                    <>
                      <Grid item xs={6} sm={3}>
                        <TextField
                          label="Sets"
                          type="number"
                          value={newExercise.sets}
                          onChange={handleExerciseChange("sets")}
                          fullWidth
                          inputProps={{ min: 0 }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField
                          label="Reps"
                          type="number"
                          value={newExercise.reps}
                          onChange={handleExerciseChange("reps")}
                          fullWidth
                          inputProps={{ min: 0 }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField
                          label="Weight (lbs)"
                          type="number"
                          value={newExercise.weight}
                          onChange={handleExerciseChange("weight")}
                          fullWidth
                          inputProps={{ min: 0, step: 0.5 }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField
                          label="Duration (sec)"
                          type="number"
                          value={newExercise.duration}
                          onChange={handleExerciseChange("duration")}
                          fullWidth
                          inputProps={{ min: 0 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Notes"
                          value={newExercise.notes}
                          onChange={handleExerciseChange("notes")}
                          fullWidth
                          multiline
                          rows={2}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={handleAddExercise}
                      disabled={!newExercise.exercise_id}
                      fullWidth
                    >
                      Add Exercise to Workout
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            {/* Added Exercises List */}
            {workoutExercises.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Exercises ({workoutExercises.length})
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {workoutExercises.map((exercise, index) => {
                    const exerciseDetails = exercises.find(
                      (ex) => ex.id === exercise.exercise_id
                    );
                    return (
                      <Paper key={index} sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {exerciseDetails?.title || "Unknown Exercise"}
                            </Typography>
                            {(() => {
                              const muscleGroupName =
                                (exerciseDetails as any)?.muscle_group ||
                                (exerciseDetails &&
                                  muscleGroups.find(
                                    (mg) =>
                                      mg.id === exerciseDetails.muscle_group_id
                                  )?.name);
                              return (
                                muscleGroupName && (
                                  <Chip
                                    label={muscleGroupName}
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                  />
                                )
                              );
                            })()}
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveExercise(index)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              label="Sets"
                              type="number"
                              value={exercise.sets}
                              onChange={(e) =>
                                handleUpdateExercise(
                                  index,
                                  "sets",
                                  Number(e.target.value) || 0
                                )
                              }
                              fullWidth
                              size="small"
                              inputProps={{ min: 0 }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              label="Reps"
                              type="number"
                              value={exercise.reps}
                              onChange={(e) =>
                                handleUpdateExercise(
                                  index,
                                  "reps",
                                  Number(e.target.value) || 0
                                )
                              }
                              fullWidth
                              size="small"
                              inputProps={{ min: 0 }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              label="Weight (lbs)"
                              type="number"
                              value={exercise.weight}
                              onChange={(e) =>
                                handleUpdateExercise(
                                  index,
                                  "weight",
                                  Number(e.target.value) || 0
                                )
                              }
                              fullWidth
                              size="small"
                              inputProps={{ min: 0, step: 0.5 }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              label="Duration (sec)"
                              type="number"
                              value={exercise.duration}
                              onChange={(e) =>
                                handleUpdateExercise(
                                  index,
                                  "duration",
                                  Number(e.target.value) || 0
                                )
                              }
                              fullWidth
                              size="small"
                              inputProps={{ min: 0 }}
                            />
                          </Grid>
                          {exercise.notes && (
                            <Grid item xs={12}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Notes: {exercise.notes}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Paper>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : workout ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WorkoutForm;
