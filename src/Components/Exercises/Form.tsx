import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Exercise, ExerciseFormData } from "../../types/exercise";
import { MuscleGroup } from "../../types/exercise";

interface FormProps {
  exercise?: Exercise | {};
  muscleGroups: MuscleGroup[];
  onSubmit: (exercise: ExerciseFormData) => void;
}

const Form = ({ exercise, muscleGroups, onSubmit }: FormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    muscle_group_id: 0,
  });

  useEffect(() => {
    if (exercise && "title" in exercise) {
      setFormData({
        title: exercise.title || "",
        description: exercise.description || "",
        muscle_group_id: exercise.muscle_group_id || 0,
      });
    }
  }, [exercise]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
    const { value, name } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "muscle_group_id" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      id: formData.title.toLowerCase().replace(/ /g, "-"),
      ...formData,
    });
  };

  return (
    <form>
      <TextField
        label="Title"
        value={formData.title}
        name="title"
        onChange={handleChange}
        margin="normal"
        fullWidth
      />
      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="muscle_group_id">Muscle Group</InputLabel>
        <Select
          value={formData.muscle_group_id}
          name="muscle_group_id"
          onChange={handleChange}
        >
          {muscleGroups.map((muscleGroup) => (
            <MenuItem key={muscleGroup.id} value={muscleGroup.id}>
              {muscleGroup.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        multiline
        rows="4"
        label="Description"
        value={formData.description}
        name="description"
        onChange={handleChange}
        margin="normal"
        fullWidth
      />
      <Button
        color="primary"
        variant="contained"
        onClick={handleSubmit}
        disabled={!formData.title || !formData.muscle_group_id}
      >
        {exercise ? "Edit" : "Create"}
      </Button>
    </form>
  );
};

export default Form;
