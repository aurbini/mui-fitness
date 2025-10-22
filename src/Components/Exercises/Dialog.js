import React, { useState } from "react";
import {
  Fab,
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import Form from "./Form";
import { useExercises } from "../../context";

const Dialog = () => {
  const [open, setOpen] = useState(false);
  const { muscles, onCreate } = useExercises();

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleFormSubmit = (exercise) => {
    handleToggle();
    onCreate(exercise);
  };

  return (
    <>
      <Fab onClick={handleToggle} color="secondary" size="small">
        <Add />
      </Fab>

      <MuiDialog open={open} onClose={handleToggle} fullWidth maxWidth="xs">
        <DialogTitle>Create a New Exercise</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill out the form below.</DialogContentText>
          <Form muscles={muscles} onSubmit={handleFormSubmit} />
        </DialogContent>
      </MuiDialog>
    </>
  );
};

export default Dialog;
