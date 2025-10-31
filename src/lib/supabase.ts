import { createClient } from "@supabase/supabase-js";
import { CreateExerciseData, UpdateExerciseData } from "../types/exercise";
import {
  CreateWorkoutData,
  UpdateWorkoutData,
  CreateWorkoutExerciseData,
  UpdateWorkoutExerciseData,
} from "../types/workout";

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

console.log("🔧 Supabase configuration:", {
  url: supabaseUrl,
  keyPresent: supabaseAnonKey ? "Yes" : "No",
  keyLength: supabaseAnonKey?.length || 0,
});

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, userData: any = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    // Always use the current origin - this will be correct in production (Vercel URL)
    // and in development (localhost). The browser knows where it's running.
    const redirectUrl = `${window.location.origin}${window.location.pathname}`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("OAuth error:", error);
      return { data: null, error };
    }

    // OAuth redirects the user, so this return won't be reached normally
    return { data, error: null };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: any) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helper functions
export const db = {
  // Get user profile
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows
    return { data, error };
  },

  // Update user profile
  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select();
    return { data, error };
  },

  // Get all muscle groups
  getMuscleGroups: async () => {
    const { data, error } = await supabase
      .from("muscle_groups")
      .select("*")
      .order("name");
    return { data, error };
  },

  // Get user's exercises
  getExercises: async (userId: string) => {
    const { data, error } = await supabase
      .from("exercises_with_muscle_groups")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  // Get exercises by muscle group
  getExercisesByMuscleGroup: async (userId: string, muscleGroup: string) => {
    const { data, error } = await supabase
      .from("exercises_with_muscle_groups")
      .select("*")
      .eq("user_id", userId)
      .eq("muscle_group", muscleGroup)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  // Create new exercise
  createExercise: async (exerciseData: CreateExerciseData) => {
    const { data, error } = await supabase
      .from("exercises")
      .insert(exerciseData)
      .select();
    return { data, error };
  },

  // Update exercise
  updateExercise: async (exerciseId: string, updates: UpdateExerciseData) => {
    const { data, error } = await supabase
      .from("exercises")
      .update(updates)
      .eq("id", exerciseId)
      .select();
    return { data, error };
  },

  // Delete exercise
  deleteExercise: async (exerciseId: string) => {
    const { error } = await supabase
      .from("exercises")
      .delete()
      .eq("id", exerciseId);
    return { error };
  },

  // Toggle exercise favorite status
  toggleFavorite: async (exerciseId: string, isFavorite: boolean) => {
    const { data, error } = await supabase
      .from("exercises")
      .update({ is_favorite: isFavorite })
      .eq("id", exerciseId)
      .select();
    return { data, error };
  },
};

// Real-time subscriptions
export const realtime = {
  // Subscribe to exercises changes
  subscribeToExercises: (userId: string, callback: any) => {
    return supabase
      .channel("exercises")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "exercises",
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to profile changes
  subscribeToProfile: (userId: string, callback: any) => {
    return supabase
      .channel("profile")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};

// Workout database functions
export const workoutDb = {
  // Get all workouts for a user
  getWorkouts: async (userId: string) => {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", userId)
      .order("workout_date", { ascending: false });
    return { data, error };
  },

  // Get a single workout with exercises
  getWorkoutWithExercises: async (workoutId: string) => {
    const { data, error } = await supabase
      .from("workouts_with_exercises")
      .select("*")
      .eq("workout_id", workoutId)
      .order("order_index", { ascending: true });
    return { data, error };
  },

  // Create a new workout
  createWorkout: async (workoutData: CreateWorkoutData) => {
    const { data, error } = await supabase
      .from("workouts")
      .insert(workoutData)
      .select()
      .single();
    return { data, error };
  },

  // Update a workout
  updateWorkout: async (workoutId: string, updates: UpdateWorkoutData) => {
    const { data, error } = await supabase
      .from("workouts")
      .update(updates)
      .eq("id", workoutId)
      .select()
      .single();
    return { data, error };
  },

  // Delete a workout
  deleteWorkout: async (workoutId: string) => {
    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", workoutId);
    return { error };
  },

  // Add exercise to workout
  addExerciseToWorkout: async (
    workoutExerciseData: CreateWorkoutExerciseData
  ) => {
    const { data, error } = await supabase
      .from("workout_exercises")
      .insert(workoutExerciseData)
      .select()
      .single();
    return { data, error };
  },

  // Update workout exercise
  updateWorkoutExercise: async (
    workoutExerciseId: string,
    updates: UpdateWorkoutExerciseData
  ) => {
    const { data, error } = await supabase
      .from("workout_exercises")
      .update(updates)
      .eq("id", workoutExerciseId)
      .select()
      .single();
    return { data, error };
  },

  // Remove exercise from workout
  removeExerciseFromWorkout: async (workoutExerciseId: string) => {
    const { error } = await supabase
      .from("workout_exercises")
      .delete()
      .eq("id", workoutExerciseId);
    return { error };
  },

  // Subscribe to workout changes
  subscribeToWorkouts: (userId: string, callback: any) => {
    return supabase
      .channel("workouts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workouts",
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};

export default supabase;
