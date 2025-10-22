import React from "react";
import { Typography } from "@mui/material";
import { useExercises } from "../../context";
import Form from "./Form";

const Preview = () => {
  const { muscles, editMode, exercise, onEdit } = useExercises();
  const { id, title, description } = exercise;

  return (
    <>
      <Typography gutterBottom variant="h4" color="secondary">
        {title || "Welcome!"}
      </Typography>
      {editMode ? (
        <Form
          key={id}
          exercise={exercise}
          muscles={muscles}
          onSubmit={onEdit}
        />
      ) : (
        <Typography variant="subtitle1">
          {description ||
            "Please select an exercise from the list on the left."}
        </Typography>
      )}
    </>
  );
};

export default Preview;
