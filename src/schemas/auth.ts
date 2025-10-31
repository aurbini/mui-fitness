// Authentication validation schemas
export const loginSchema = {
  email: {
    required: true,
    type: "email",
    message: "Please enter a valid email address",
  },
  password: {
    required: true,
    minLength: 6,
    message: "Password must be at least 6 characters",
  },
};

export const signupSchema = {
  email: {
    required: true,
    type: "email",
    message: "Please enter a valid email address",
  },
  password: {
    required: true,
    minLength: 6,
    message: "Password must be at least 6 characters",
  },
  confirmPassword: {
    required: true,
    message: "Please confirm your password",
  },
  fullName: {
    required: true,
    minLength: 2,
    message: "Please enter your full name",
  },
};

export const profileUpdateSchema = {
  full_name: {
    minLength: 2,
    message: "Name must be at least 2 characters",
  },
  avatar_url: {
    type: "url",
    message: "Please enter a valid URL",
  },
};

