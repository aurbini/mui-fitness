import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import CreateDialog from '../Exercises/Dialog'




export default ({ muscles, onExerciseCreate }) => 
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h4" color="inherent" style={{flex: 1}}> 
        Exercise Databasess
      </Typography>
      <CreateDialog 
        muscles={ muscles }
        onCreate={ onExerciseCreate } />
    </Toolbar>
  </AppBar>