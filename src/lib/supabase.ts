import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  "https://yejmovdqgtvqrmbrxqsk.supabase.co";
const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllam1vdmRxZ3R2cXJtYnJ4cXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MDM0OTEsImV4cCI6MjA3NzE3OTQ5MX0.lxG299sqX0FqCWdIRzI3dus8y01IOB9_X8OVNt4uXyM";

console.log("Supabase configuration:", {
  url: supabaseUrl,
  keyPresent: supabaseAnonKey ? "Yes" : "No",
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
    console.log("Starting Google OAuth flow...");
    console.log("Redirect URL:", `${window.location.origin}`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    console.log("OAuth response:", { data, error });
    return { data, error };
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
      .single();
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
  createExercise: async (exerciseData: any) => {
    const { data, error } = await supabase
      .from("exercises")
      .insert(exerciseData)
      .select();
    return { data, error };
  },

  // Update exercise
  updateExercise: async (exerciseId: string, updates: any) => {
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

export default supabase;
