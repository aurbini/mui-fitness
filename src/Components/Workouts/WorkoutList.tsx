import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import { Edit, Delete, FitnessCenter } from "@mui/icons-material";
import { Workout } from "../../types/workout";

interface WorkoutListProps {
  workouts: Workout[];
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
  onSelect: (workout: Workout) => void;
}

const WorkoutList: React.FC<WorkoutListProps> = ({
  workouts,
  onEdit,
  onDelete,
  onSelect,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {workouts.length === 0 ? (
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 4,
              }}
            >
              <FitnessCenter
                sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No workouts yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first workout to get started!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        workouts.map((workout) => (
          <Card
            key={workout.id}
            sx={{
              cursor: "pointer",
              "&:hover": {
                boxShadow: 3,
              },
            }}
            onClick={() => onSelect(workout)}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" component="div">
                    {workout.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(workout.workout_date)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  {workout.is_favorite && (
                    <Chip label="Favorite" size="small" color="primary" />
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(workout);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(workout.id);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Stack>
              </Box>
              {workout.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {workout.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default WorkoutList;

