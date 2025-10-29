import { useState, useEffect } from "react";
import { db, realtime } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Exercise, MuscleGroup } from "../types/exercise";

export const useExercises = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          setLoading(true);
          setError(null);

          // Load exercises
          const { data: exercisesData, error: exercisesError } =
            await db.getExercises(user.id);
          if (exercisesError) throw exercisesError;
          setExercises(exercisesData || []);

          // Load muscle groups
          const { data: muscleGroupsData, error: muscleGroupsError } =
            await db.getMuscleGroups();
          if (muscleGroupsError) throw muscleGroupsError;
          setMuscleGroups(muscleGroupsData || []);
        } catch (err: any) {
          setError(err.message);
          console.error("Error loading data:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setExercises([]);
        setMuscleGroups([]);
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const subscription = realtime.subscribeToExercises(
      user.id,
      (payload: any) => {
        console.log("Real-time update:", payload);

        switch (payload.eventType) {
          case "INSERT":
            setExercises((prev) => [payload.new, ...prev]);
            break;
          case "UPDATE":
            setExercises((prev) =>
              prev.map((exercise) =>
                exercise.id === payload.new.id ? payload.new : exercise
              )
            );
            break;
          case "DELETE":
            setExercises((prev) =>
              prev.filter((exercise) => exercise.id !== payload.old.id)
            );
            break;
          default:
            break;
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const loadExercises = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await db.getExercises(user.id);
      if (error) throw error;
      setExercises(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error loading exercises:", err);
    } finally {
      setLoading(false);
    }
  };

  const createExercise = async (exerciseData: Partial<Exercise>) => {
    if (!user) return { data: null, error: new Error("No user logged in") };

    try {
      const exerciseWithUser = {
        ...exerciseData,
        user_id: user.id,
      };

      const { data, error } = await db.createExercise(exerciseWithUser);
      if (error) throw error;

      // Real-time subscription will handle adding to state
      return { data, error: null };
    } catch (err: any) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const updateExercise = async (
    exerciseId: string,
    updates: Partial<Exercise>
  ) => {
    try {
      const { data, error } = await db.updateExercise(exerciseId, updates);
      if (error) throw error;

      // Real-time subscription will handle updating state
      return { data, error: null };
    } catch (err: any) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const deleteExercise = async (exerciseId: string) => {
    try {
      const { error } = await db.deleteExercise(exerciseId);
      if (error) throw error;

      // Real-time subscription will handle removing from state
      return { error: null };
    } catch (err: any) {
      setError(err.message);
      return { error: err };
    }
  };

  const toggleFavorite = async (exerciseId: string, isFavorite: boolean) => {
    try {
      const { data, error } = await db.toggleFavorite(exerciseId, isFavorite);
      if (error) throw error;

      // Real-time subscription will handle updating state
      return { data, error: null };
    } catch (err: any) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const getExercisesByMuscleGroup = (muscleGroup: string) => {
    return exercises.filter((exercise) => exercise.muscles === muscleGroup);
  };

  return {
    exercises,
    muscleGroups,
    loading,
    error,
    createExercise,
    updateExercise,
    deleteExercise,
    toggleFavorite,
    getExercisesByMuscleGroup,
    refreshExercises: loadExercises,
  };
};
