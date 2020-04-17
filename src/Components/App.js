import React, { Component, Fragment } from 'react';
import { Header, Footer } from "./Layouts"; 
import Exercises from "./Exercises"; 
import { muscles, exercises } from "../store"; 

const syles = theme => console.log(theme);

export default class extends Component {

  state = {
    exercises, 
    category: '',
    exercise: {}
  }

  getExerciseByMuscle(){
    const initExercises = muscles.reduce((exercises, category) => ({
      ...exercises,
      [category]: []
    }), {})

    return Object.entries(
      this.state.exercises.reduce(( exercises, exercise ) => {
        const { muscles } = exercise; 

        exercises[muscles] = [...exercises[muscles], exercise] 

        return exercises; 
      }, initExercises)
    )
  }

  handleCategoryChange = category => 
    this.setState({
      category 
    })
  
  handleExerciseSelect = id => 
    this.setState(({ exercises }) => ({
      exercise: exercises.find(ex => ex.id === id),
      editMode: false
    }))
  

  onExerciseCreate = exercise => 
    this.setState(({ exercises }) => ({
      exercises: [ 
        ...exercises, 
        exercise
      ]
    }))

  handleExerciseDelete = id => 
    this.setState(({ exercises, exercise, editMode }) => ({
      exercises: exercises.filter( ex => ex.id !== id), 
      editMode: false, 
      exercise: exercise.id === id ? {} : exercise,
      editMode: exercise.id === id ? {} : editMode
    }))
  
  handleExerciseSelectEdit = id => 
    this.setState(({ exercises }) => ({
      exercise: exercises.find(ex => ex.id === id),
      editMode: true
    }))

  handleExerciseEdit = exercise => 
    this.setState(({ exercises }) => ({
      exercises: [
        ...exercises.filter(ex => ex.id !== exercise.id),
        exercise
      ], 
      exercise
    }))
  
  render(){
    const exercises = this.getExerciseByMuscle();
    const { category, exercise, editMode } = this.state 
    console.log(exercises); 
    return (
      <Fragment> 
        <Header 
          muscles={muscles}
          onExerciseCreate= {this.onExerciseCreate}/>
        <Exercises 
          onEdit={this.handleExerciseEdit}
          editMode={editMode}
          exercise={exercise}
          muscles={muscles}
          onSelect={this.handleExerciseSelect}
          onSelectEdit={this.handleExerciseSelectEdit}
          onDelete={this.handleExerciseDelete}
          exercises={exercises} 
          category={category}
        /> 
        <Footer 
          muscles={muscles} 
          onSelect={this.handleCategoryChange}
          category={category}  
        />
      </Fragment>
    )
  }
}
      