import React, { Fragment } from 'react';
import { Grid, Paper, Typography, List, ListItemSecondaryAction} from '@material-ui/core';
import { ListItem, ListItemText, IconButton } from "@material-ui/core"
import { exercises } from '../../store';
import { Delete, Edit } from '@material-ui/icons/';
import Form from './Form'

const styles = {
  root: {
    flexGrow: 1
  },
  Paper: { padding: 20, maginTop: 10, marginBottom: 10, height: 600 }
}


export default ({ 
  exercises,
  category,
  onSelect,
  editMode,
  onEdit,
  exercise,
  muscles,
  onDelete,
  onSelectEdit,
  exercise: {
    id,
    description="Select an exercise from the left",
    title="Welcome!"
    }
  }) => {
  return (
  <Grid container className={styles.root}>
    <Grid item xs={12} sm={6}> 
      <Paper style={styles.Paper} >
        {exercises.map(([group, exercises]) =>
          !category || category === group
          ? <Fragment> 
              <Typography 
              variant="h6"
              style={{textTransform:'capitalize'}}
              >
                {group}
              </Typography>
              <List component="ul">
                {exercises.map(({id, title}) =>
                  <ListItem 
                    button
                    onClick={()=> onSelect(id)} >
                    <ListItemText 
                      primary={title} />
                    <ListItemSecondaryAction> 
                    <IconButton 
                        onClick={() => onSelectEdit(id)}>
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => onDelete(id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )}
              </List>
            </Fragment>
          : null
        )}
      </Paper> 
    </Grid> 
    <Grid item xs={12} sm={6}> 
      <Paper style={styles.Paper}>
        { editMode 
        ? <Form 
            exercise={exercise}
            muscles={muscles}
            onSubmit={onEdit}
          /> : 
        <Fragment> 
          <Typography 
            variant="h3"
            style={{marginBottom: 20}}
            >
            { title }
          </Typography>
          <Typography 
            variant="subtitle1" 
            >
            { description }
          </Typography>
        </Fragment>}
      </Paper> 
    </Grid> 
  </Grid>
  ) 
}