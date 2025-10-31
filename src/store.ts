import { Exercise } from "./types/exercise";

// Static muscle groups - these will be replaced by Supabase data
export const muscles: string[] = ["shoulders", "chest", "arms", "back", "legs"];

// Default exercises structure for reference - actual data comes from Supabase
// Note: These are fallback exercises and won't be used in production since data comes from Supabase
export const defaultExercises: Exercise[] = [
  {
    id: "overhead-press",
    user_id: "default",
    title: "Overhead Press",
    description: "Delts exercise...",
    muscle_group_id: 1, // shoulders
  },
  {
    id: "dips",
    user_id: "default",
    title: "Dips",
    description: "Triceps exercise...",
    muscle_group_id: 3, // arms
  },
  {
    id: "barbell-curls",
    user_id: "default",
    title: "Barbell Curls",
    description: "Biceps exercise...",
    muscle_group_id: 3, // arms
  },
  {
    id: "bench-press",
    user_id: "default",
    title: "Bench Press",
    description: "Chest exercise...",
    muscle_group_id: 2, // chest
  },
  {
    id: "pull-ups",
    user_id: "default",
    title: "Pull Ups",
    description: "Back and biceps exercise...",
    muscle_group_id: 4, // back
  },
  {
    id: "deadlifts",
    user_id: "default",
    title: "Deadlifts",
    description: "Back and leg exercise...",
    muscle_group_id: 4, // back
  },
  {
    id: "squats",
    user_id: "default",
    title: "Squats",
    description: "Legs exercise...",
    muscle_group_id: 5, // legs
  },
];

// Legacy export for backward compatibility - will be replaced by Supabase data
export const exercises = defaultExercises;
