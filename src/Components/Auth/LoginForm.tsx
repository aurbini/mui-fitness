import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Container,
  Divider,
} from "@mui/material";
import { Google } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const LoginForm = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError("");
    setMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
      });
      if (error) throw error;
      setMessage("Check your email for verification link!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      console.log("Attempting Google sign-in...");
      const { data, error } = await signInWithGoogle();
      console.log("Google sign-in response:", { data, error });

      if (error) {
        console.error("Google sign-in error:", error);
        throw error;
      }

      // Google OAuth redirects, so we won't reach here normally
      console.log("Google sign-in successful, redirecting...");
    } catch (err: any) {
      console.error("Google sign-in failed:", err);
      setError(err.message || "Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            MUI Fitness
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Track your fitness journey
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={tabValue === 0 ? handleSignIn : handleSignUp}
          >
            {tabValue === 1 && (
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
              />
            )}

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
              disabled={loading}
            />

            {tabValue === 1 && (
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : tabValue === 0 ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={handleGoogleSignIn}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              Continue with Google (Setup Required)
            </Button>
          </Box>

          <Typography variant="body2" align="center" color="text.secondary">
            {tabValue === 0
              ? "Don't have an account? Click 'Sign Up' tab above."
              : "Already have an account? Click 'Sign In' tab above."}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm;
