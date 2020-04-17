import React, { Fragment, useState } from 'react';
import { DialogContent, DialogTitle } from '@material-ui/core';
import { Button, Dialog } from '@material-ui/core'
import Add from '@material-ui/icons/Add';
import Form from './Form'

export default props => {

  const [ state, setState ] = useState({
    open: false
  })
 
  const handleToggle = () => {
    setState({
      ...state, 
      open: !state.open
    })
  }

  const handleFormSubmit = exercise => {
    handleToggle()

    props.onCreate(exercise)
  }


  const { open } = state,
        { muscles, onCreate } = props 

  return (
    <Fragment>
      <Button 
        variant="outlined"
        mini 
        color="default"
        onClick={handleToggle}>
        <Add />
      </Button>
      <Dialog 
        open={open}
        onClose={handleToggle} 
      >
        <DialogTitle id="form-dialog-title">Create a new Exercise</DialogTitle>
        <DialogContent>
        <Form 
          muscles={muscles} 
          onSubmit={handleFormSubmit} /> 
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}