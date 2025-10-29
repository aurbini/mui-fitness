import { useState, useEffect } from "react";
import { db, realtime } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import {
  Exercise,
  MuscleGroup,
  CreateExerciseData,
  UpdateExerciseData,
} from "../types/exercise";

export const useExercises = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load muscle groups (always needed)
  useEffect(() => {
    const loadMuscleGroups = async () => {
      try {
        console.log("🔍 Loading muscle groups...");
        const { data: muscleGroupsData, error: muscleGroupsError } =
          await db.getMuscleGroups();
        console.log("🔍 Muscle groups result:", {
          data: muscleGroupsData,
          error: muscleGroupsError,
        });

        if (muscleGroupsError) throw muscleGroupsError;
        setMuscleGroups(muscleGroupsData || []);
        console.log("✅ Muscle groups loaded:", muscleGroupsData);
      } catch (err: any) {
        console.error("❌ Error loading muscle groups:", err);
        setError(err.message);
      }
    };

    loadMuscleGroups();
  }, []);

  // Load exercises (only when user is logged in)
  useEffect(() => {
    const loadExercises = async () => {
      if (user) {
        try {
          setLoading(true);
          setError(null);
          console.log("🔍 Loading exercises for user:", user.id);

          const { data: exercisesData, error: exercisesError } =
            await db.getExercises(user.id);

          if (exercisesError) throw exercisesError;
          setExercises(exercisesData || []);
          console.log("✅ Exercises loaded:", exercisesData);
        } catch (err: any) {
          setError(err.message);
          console.error("❌ Error loading exercises:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setExercises([]);
        setLoading(false);
      }
    };

    loadExercises();
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
      // Get muscle group ID from name
      const muscleGroup = muscleGroups.find(
        (mg) => mg.name === exerciseData.muscles
      );
      if (!muscleGroup) {
        throw new Error("Invalid muscle group");
      }

      const createData: CreateExerciseData = {
        title: exerciseData.title || "",
        description: exerciseData.description || "",
        muscle_group_id: muscleGroup.id,
        sets: exerciseData.sets || 0,
        reps: exerciseData.reps || 0,
        weight: exerciseData.weight || 0,
        duration: exerciseData.duration || 0,
        notes: exerciseData.notes || "",
        is_favorite: exerciseData.is_favorite || false,
        user_id: user.id,
      };

      const { data, error } = await db.createExercise(createData);
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
      // If muscle group is being updated, get the muscle group ID
      let updateData: UpdateExerciseData = {};

      // Copy over all the fields except muscles
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined)
        updateData.description = updates.description;
      if (updates.sets !== undefined) updateData.sets = updates.sets;
      if (updates.reps !== undefined) updateData.reps = updates.reps;
      if (updates.weight !== undefined) updateData.weight = updates.weight;
      if (updates.duration !== undefined)
        updateData.duration = updates.duration;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.is_favorite !== undefined)
        updateData.is_favorite = updates.is_favorite;

      if (updates.muscles) {
        const muscleGroup = muscleGroups.find(
          (mg) => mg.name === updates.muscles
        );
        if (!muscleGroup) {
          throw new Error("Invalid muscle group");
        }
        updateData.muscle_group_id = muscleGroup.id;
      }

      const { data, error } = await db.updateExercise(exerciseId, updateData);
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
