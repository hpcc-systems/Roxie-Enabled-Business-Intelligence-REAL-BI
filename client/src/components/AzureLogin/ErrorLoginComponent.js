/* eslint-disable no-unused-vars */
import { AppBar, Box, Button, CircularProgress, makeStyles, Paper, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

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

  const [reload, setReload] = useState(false);

  const reduxErrorsMessages = useSelector(state => [state.auth.errorObj, state.workspace?.errorObj]);

  const handleReload = () => {
    setReload(!reload);
    setTimeout(() => window.location.reload(), 1000);
  };

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
            Something went wrong {reload && <CircularProgress size={30} />}
          </Typography>
          <Box my={3} p={2} bgcolor='#ff5545' color='white' borderRadius={3}>
            <Typography variant='h6' component='p'>
              {props?.error?.message || 'We have an issue trying to sign you in'}
            </Typography>
            {reduxErrorsMessages.map(
              (message, index) =>
                message && (
                  <Typography key={index} variant='h6' component='p'>
                    {message}
                  </Typography>
                ),
            )}
          </Box>
          <Button onClick={handleReload} variant='contained' fullWidth size='large' color='secondary'>
            Try Again
          </Button>
        </Paper>
      </Container>
    </>
  );
}

export default ErrorLoginComponent;
