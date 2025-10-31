import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Fab,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip,
  Paper,
} from "@mui/material";
import { Add, FilterList } from "@mui/icons-material";
import WorkoutList from "./WorkoutList";
import WorkoutForm from "./WorkoutForm";
import { useWorkouts } from "../../hooks/useWorkouts";
import { WorkoutFormData, Workout } from "../../types/workout";

type TimeFilter = "all" | "today" | "week" | "month" | "year";

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
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

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

  const handleFilterChange = (
    event: React.SyntheticEvent,
    newValue: TimeFilter
  ) => {
    setTimeFilter(newValue);
  };

  // Filter workouts based on selected time period
  const filteredWorkouts = useMemo(() => {
    if (timeFilter === "all") {
      return workouts;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.workout_date);

      switch (timeFilter) {
        case "today":
          return workoutDate >= today;
        case "week":
          return workoutDate >= startOfWeek;
        case "month":
          return workoutDate >= startOfMonth;
        case "year":
          return workoutDate >= startOfYear;
        default:
          return true;
      }
    });
  }, [workouts, timeFilter]);

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
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 600, mb: 0.5 }}
            >
              My Workouts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track and manage your fitness journey
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateWorkout}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            Create Workout
          </Button>
        </Box>

        {/* Time Filter Tabs */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1.5,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <FilterList sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              Filter by:
            </Typography>
            <Tabs
              value={timeFilter}
              onChange={handleFilterChange}
              sx={{
                minHeight: "auto",
                "& .MuiTab-root": {
                  minHeight: 36,
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                },
              }}
            >
              <Tab label="All" value="all" />
              <Tab label="Today" value="today" />
              <Tab label="This Week" value="week" />
              <Tab label="This Month" value="month" />
              <Tab label="This Year" value="year" />
            </Tabs>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Chip
              label={`${filteredWorkouts.length} workout${
                filteredWorkouts.length !== 1 ? "s" : ""
              }`}
              size="small"
              color="primary"
              variant="outlined"
            />
            {timeFilter !== "all" && (
              <Chip
                label={`${workouts.length - filteredWorkouts.length} hidden`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Paper>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <WorkoutList
        workouts={filteredWorkouts}
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
