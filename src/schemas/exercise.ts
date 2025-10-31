// Exercise validation schemas
export const exerciseSchema = {
  title: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: "Title must be between 2 and 100 characters",
  },
  description: {
    maxLength: 500,
    message: "Description must be less than 500 characters",
  },
  muscles: {
    required: true,
    message: "Please select a muscle group",
  },
  sets: {
    type: "number",
    min: 0,
    max: 100,
    message: "Sets must be between 0 and 100",
  },
  reps: {
    type: "number",
    min: 0,
    max: 1000,
    message: "Reps must be between 0 and 1000",
  },
  weight: {
    type: "number",
    min: 0,
    max: 1000,
    message: "Weight must be between 0 and 1000",
  },
  duration: {
    type: "number",
    min: 0,
    max: 3600,
    message: "Duration must be between 0 and 3600 seconds",
  },
  notes: {
    maxLength: 1000,
    message: "Notes must be less than 1000 characters",
  },
};

export const muscleGroupSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: "Muscle group name must be between 2 and 50 characters",
  },
};

