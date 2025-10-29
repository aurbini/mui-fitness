import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const Form = ({ exercise, muscles: categories, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    muscles: "",
  });

  useEffect(() => {
    if (exercise) {
      setFormData({
        title: exercise.title || "",
        description: exercise.description || "",
        muscles: exercise.muscles || "",
      });
    }
  }, [exercise]);

  const handleChange = ({ target: { value, name } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        <InputLabel htmlFor="muscles">Muscles</InputLabel>
        <Select value={formData.muscles} name="muscles" onChange={handleChange}>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
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
        disabled={!formData.title || !formData.muscles}
      >
        {exercise ? "Edit" : "Create"}
      </Button>
    </form>
  );
};

export default Form;
