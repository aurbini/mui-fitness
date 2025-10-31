import { useState, useEffect, useCallback } from "react";
import { workoutDb } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import {
  Workout,
  WorkoutWithExercises,
  WorkoutFormData,
  WorkoutExerciseFormData,
  CreateWorkoutData,
  CreateWorkoutExerciseData,
} from "../types/workout";

export const useWorkouts = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] =
    useState<WorkoutWithExercises | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load workouts when user changes
  useEffect(() => {
    const loadWorkouts = async () => {
      if (user) {
        try {
          setLoading(true);
          setError(null);
          console.log("🔍 Loading workouts for user:", user.id);

          const { data: workoutsData, error: workoutsError } =
            await workoutDb.getWorkouts(user.id);
          console.log("🔍 Workouts result:", {
            data: workoutsData,
            error: workoutsError,
          });

          if (workoutsError) throw workoutsError;
          setWorkouts(workoutsData || []);
          console.log("✅ Workouts loaded:", workoutsData);
        } catch (err: any) {
          setError(err.message);
          console.error("❌ Error loading workouts:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setWorkouts([]);
        setCurrentWorkout(null);
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [user]);

  // Function to manually refresh workouts
  const refreshWorkouts = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const { data: workoutsData, error: workoutsError } =
        await workoutDb.getWorkouts(user.id);
      if (workoutsError) throw workoutsError;
      setWorkouts(workoutsData || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error refreshing workouts:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Set up real-time subscription for workouts
  useEffect(() => {
    if (!user) return;

    const subscription = workoutDb.subscribeToWorkouts(
      user.id,
      (payload: any) => {
        console.log("Real-time workout update:", payload);

        // Handle both payload formats (eventType as property or nested)
        const eventType = payload.eventType || payload.event || payload.type;
        const newData = payload.new || payload.record;
        const oldData = payload.old;

        switch (eventType) {
          case "INSERT":
          case "insert":
            if (newData) {
              setWorkouts((prev) => [newData, ...prev]);
            }
            break;
          case "UPDATE":
          case "update":
            if (newData) {
              setWorkouts((prev) =>
                prev.map((workout) =>
                  workout.id === newData.id ? newData : workout
                )
              );
            }
            break;
          case "DELETE":
          case "delete":
            if (oldData || newData) {
              setWorkouts((prev) =>
                prev.filter(
                  (workout) => workout.id !== (oldData?.id || newData?.id)
                )
              );
            }
            break;
          default:
            // If we can't determine the event type, refresh manually
            refreshWorkouts();
            break;
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user, refreshWorkouts]);

  const createWorkout = async (workoutData: WorkoutFormData) => {
    if (!user) return { data: null, error: new Error("No user logged in") };

    try {
      const createData: CreateWorkoutData = {
        title: workoutData.title,
        description: workoutData.description,
        workout_date: workoutData.workout_date,
        notes: workoutData.notes,
        is_favorite: workoutData.is_favorite || false,
        user_id: user.id,
      };

      const { data, error } = await workoutDb.createWorkout(createData);
      if (error) throw error;

      return { data, error: null };
    } catch (err: any) {
      console.error("Error creating workout:", err);
      return { data: null, error: err };
    }
  };

  const updateWorkout = async (workoutId: string, updates: WorkoutFormData) => {
    if (!user) return { data: null, error: new Error("No user logged in") };

    try {
      const { data, error } = await workoutDb.updateWorkout(workoutId, updates);
      if (error) throw error;

      return { data, error: null };
    } catch (err: any) {
      console.error("Error updating workout:", err);
      return { data: null, error: err };
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    if (!user) return { error: new Error("No user logged in") };

    try {
      const { error } = await workoutDb.deleteWorkout(workoutId);
      if (error) throw error;

      return { error: null };
    } catch (err: any) {
      console.error("Error deleting workout:", err);
      return { error: err };
    }
  };

  const loadWorkoutWithExercises = async (workoutId: string) => {
    try {
      const { data, error } = await workoutDb.getWorkoutWithExercises(
        workoutId
      );
      if (error) throw error;

      // Transform the data into WorkoutWithExercises format
      if (data && data.length > 0) {
        const workout = data[0];
        const exercises = data.map((item: any) => ({
          id: item.workout_exercise_id,
          workout_id: item.workout_id,
          exercise_id: item.exercise_id,
          sets: item.sets,
          reps: item.reps,
          weight: item.weight,
          duration: item.duration,
          notes: item.exercise_notes,
          order_index: item.order_index,
          created_at: item.exercise_added_at,
          exercise_title: item.exercise_title,
          exercise_description: item.exercise_description,
          muscle_group: item.muscle_group,
          muscle_group_id: item.muscle_group_id,
        }));

        const workoutWithExercises: WorkoutWithExercises = {
          id: workout.workout_id,
          user_id: workout.user_id,
          title: workout.workout_title,
          description: workout.workout_description,
          workout_date: workout.workout_date,
          notes: workout.workout_notes,
          is_favorite: workout.workout_is_favorite,
          created_at: workout.workout_created_at,
          updated_at: workout.workout_updated_at,
          exercises,
        };

        setCurrentWorkout(workoutWithExercises);
        return { data: workoutWithExercises, error: null };
      } else {
        setCurrentWorkout(null);
        return { data: null, error: null };
      }
    } catch (err: any) {
      console.error("Error loading workout with exercises:", err);
      return { data: null, error: err };
    }
  };

  const addExerciseToWorkout = async (
    workoutId: string,
    exerciseData: WorkoutExerciseFormData
  ) => {
    if (!user) return { data: null, error: new Error("No user logged in") };

    try {
      const createData: CreateWorkoutExerciseData = {
        workout_id: workoutId,
        exercise_id: exerciseData.exercise_id,
        sets: exerciseData.sets,
        reps: exerciseData.reps,
        weight: exerciseData.weight,
        duration: exerciseData.duration,
        notes: exerciseData.notes,
        order_index: exerciseData.order_index,
      };

      const { data, error } = await workoutDb.addExerciseToWorkout(createData);
      if (error) throw error;

      return { data, error: null };
    } catch (err: any) {
      console.error("Error adding exercise to workout:", err);
      return { data: null, error: err };
    }
  };

  const removeExerciseFromWorkout = async (workoutExerciseId: string) => {
    if (!user) return { error: new Error("No user logged in") };

    try {
      const { error } = await workoutDb.removeExerciseFromWorkout(
        workoutExerciseId
      );
      if (error) throw error;

      return { error: null };
    } catch (err: any) {
      console.error("Error removing exercise from workout:", err);
      return { error: err };
    }
  };

  return {
    workouts,
    currentWorkout,
    loading,
    error,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    loadWorkoutWithExercises,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    refreshWorkouts,
  };
};
