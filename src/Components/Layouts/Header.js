import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import CreateDialog from '../Exercises/Dialog'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  Heading: {
    flex: 1
  },
})


export default () => {
  const classes = useStyles()

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h4' color='inherent' className={classes.Heading}>
          Exercise Databasess
        </Typography>
        <CreateDialog />
      </Toolbar>
    </AppBar>
  )
}