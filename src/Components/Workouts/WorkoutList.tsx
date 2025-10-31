import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import {
  Edit,
  Delete,
  FitnessCenter,
  Star,
  CalendarToday,
} from "@mui/icons-material";
import { Workout } from "../../types/index";

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
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // Check if it's this week
    const daysDiff = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff < 7 && date <= today) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    }

    // Otherwise return full date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Group workouts by date
  const groupedWorkouts = useMemo(() => {
    const groups: { [key: string]: Workout[] } = {};

    workouts.forEach((workout) => {
      const dateKey = new Date(workout.workout_date).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(workout);
    });

    // Sort dates in descending order (newest first)
    return Object.entries(groups).sort((a, b) => {
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });
  }, [workouts]);

  if (workouts.length === 0) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 6,
            }}
          >
            <FitnessCenter
              sx={{
                fontSize: 64,
                color: "text.secondary",
                mb: 2,
                opacity: 0.5,
              }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No workouts found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first workout to get started!
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {groupedWorkouts.map(([dateKey, dateWorkouts]) => (
        <Box key={dateKey}>
          {/* Date Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
              px: 1,
            }}
          >
            <CalendarToday sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {formatDateHeader(dateWorkouts[0].workout_date)}
            </Typography>
            <Chip
              label={dateWorkouts.length}
              size="small"
              sx={{ ml: "auto", height: 20, fontSize: "0.75rem" }}
            />
          </Box>

          {/* Workouts for this date */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {dateWorkouts.map((workout) => (
              <Card
                key={workout.id}
                elevation={1}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => onSelect(workout)}
              >
                <CardContent sx={{ py: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {workout.title}
                        </Typography>
                        {workout.is_favorite && (
                          <Star
                            sx={{
                              fontSize: 18,
                              color: "warning.main",
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          mb: workout.description ? 1 : 0,
                        }}
                      >
                        {formatDate(workout.workout_date)}
                      </Typography>
                      {workout.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {workout.description}
                        </Typography>
                      )}
                    </Box>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ ml: 2, flexShrink: 0 }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(workout);
                        }}
                        sx={{
                          color: "text.secondary",
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(workout.id);
                        }}
                        sx={{
                          color: "text.secondary",
                          "&:hover": { color: "error.main" },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default WorkoutList;
