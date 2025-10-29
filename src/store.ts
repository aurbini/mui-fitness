import { Exercise } from "./types/exercise";

// Static muscle groups - these will be replaced by Supabase data
export const muscles: string[] = ["shoulders", "chest", "arms", "back", "legs"];

// Default exercises structure for reference - actual data comes from Supabase
export const defaultExercises: Exercise[] = [
  {
    id: "overhead-press",
    title: "Overhead Press",
    description: "Delts exercise...",
    muscles: "shoulders",
  },
  {
    id: "dips",
    title: "Dips",
    description: "Triceps exercise...",
    muscles: "arms",
  },
  {
    id: "barbell-curls",
    title: "Barbell Curls",
    description: "Biceps exercise...",
    muscles: "arms",
  },
  {
    id: "bench-press",
    title: "Bench Press",
    description: "Chest exercise...",
    muscles: "chest",
  },
  {
    id: "pull-ups",
    title: "Pull Ups",
    description: "Back and biceps exercise...",
    muscles: "back",
  },
  {
    id: "deadlifts",
    title: "Deadlifts",
    description: "Back and leg exercise...",
    muscles: "back",
  },
  {
    id: "squats",
    title: "Squats",
    description: "Legs exercise...",
    muscles: "legs",
  },
];

// Legacy export for backward compatibility - will be replaced by Supabase data
export const exercises = defaultExercises;
