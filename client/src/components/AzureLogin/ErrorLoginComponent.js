/* eslint-disable no-unused-vars */
import { AppBar, Box, Button, makeStyles, Paper, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  appbar: {
    height: 65,
  },
  logo: {
    margin: theme.spacing('auto', 3, 1.5),
    color: '#ff5722',
    fontWeight: 'bold',
  },
  messageBox: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(5, 4),
  },
}));

function ErrorLoginComponent(props) {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState('We have problem sign in with Microsoft');
  console.log(`props`, props);
  return (
    <>
      <AppBar className={classes.appbar} position='static'>
        <Typography className={classes.logo} variant='h5' component='h1' color='inherit'>
          REAL BI
        </Typography>
      </AppBar>
      <Container component='main' maxWidth='md'>
        <Paper className={classes.messageBox} elevation={3}>
          <Typography variant='h4' component='h2'>
            Something went wrong
          </Typography>
          <Box my={3} p={2} bgcolor='#ff5545' color='white' borderRadius={3}>
            <Typography variant='h6' component='p'>
              {errorMessage}
            </Typography>
          </Box>
          <Button variant='contained' fullWidth size='large' color='secondary'>
            Try Again
          </Button>
        </Paper>
      </Container>
    </>
  );
}

export default ErrorLoginComponent;
