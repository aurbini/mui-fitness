import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Button, MenuItem, Select, FormHelperText,
  TextField, DialogContentText } from '@material-ui/core'



const useStyles = makeStyles((theme) => ({
  formControl: {
    width: 300
  }
}));


export default props => {


  // const getInitialState = () => {
    // const { exercise } = props
    const [ state, setState ] = useState({})

  //   return exercise ? exercise : {
  //     title: "", 
  //     description: "", 
  //     muscles: ""
  //   }
  // }

  useEffect(() => {
    setState(
      props.exercise 
      ? props.exercise : {exercise: {
        title: '', 
        description: '', 
        muscles: ''
      }})
  }, [props.exercise])


  const handleChange = name => ({ target: { value } }) => {
    setState({
      ...state,  
      [name] : value 
    })
    console.log(state)
  } 

  const handleSubmit = () => {
    //Validate
    console.log(state)
    const { title } = state
    props.onSubmit({
      id: title.toLowerCase().replace(/ /g, '-'),
      ...state
    })
    }

  // setState({
  //   open: false, 
  //   exercise: {
  //     title: '', 
  //     description: '', 
  //     muscles: ''
  //   }
  // })

  const { title, description, muscles } = state,
        { muscles: categories } = props
  const classes = useStyles()


  return (
    <form >
      <DialogContentText>
        Fill out the form below
      </DialogContentText>
      <TextField
        fullWidth
        label="Title"
        onChange={handleChange('title')}
        value={title}
        type="email"
        className={classes.formControl}
      />
      <br />
      <FormControl 
        fullWidth
        className={ classes.formControl }>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        onChange={handleChange('muscles')}
        value={muscles}
      >
      { categories.map(category =>
        <MenuItem
          value={category}>{ category }
        </MenuItem>
        )}
      </Select>
      <FormHelperText>Some important helper text</FormHelperText>
      </FormControl>
        <TextField
        multiline
        fullWidth
        label="Description"
        onChange={handleChange('description')}
        value={description}
        className={classes.formControl}
      />
      <br /> 
      <Button 
        onClick={handleSubmit} 
        color="primary"
        variant="raised">
        { props.exercise ? 'Edit' : 'Create' }  
      </Button>
  </form>
  )
}