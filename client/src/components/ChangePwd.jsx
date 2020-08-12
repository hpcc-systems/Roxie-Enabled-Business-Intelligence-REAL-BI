import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { ArrowBackOutlined as ArrowBackOutlinedIcon } from '@material-ui/icons';

// React Components
import Header from './Layout/Header';

// React Hooks
import useForm from '../hooks/useForm';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
    marginTop: theme.spacing(3),
    width: 200,
  },
  closeBtn: {
    color: '#ff5722',
    maxWidth: 20,
    minWidth: 20,
    padding: 0,
  },
  content: { padding: theme.spacing(1, 2) },
  errMsg: {
    backgroundColor: theme.palette.error.dark,
    borderRadius: 4,
    color: theme.palette.error.contrastText,
    marginBottom: theme.spacing(1.5),
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: '#ff5722',
    padding: theme.spacing(1.25, 0, 1.25, 2),
  },
  progress: { marginRight: theme.spacing(2) },
  textfield: { margin: theme.spacing(1, 0) },
  typography: {
    display: 'inline',
    fontWeight: 'bold',
    marginLeft: theme.spacing(3),
    textTransform: 'uppercase',
  },
}));

const initState = {
  errorMsg: '',
  loading: false,
  newPwd: '',
  newPwd2: '',
  oldPwd: '',
};

const ChangePwd = () => {
  const { values: localState, handleChange } = useForm(initState);
  const history = useHistory();
  const { button, closeBtn, content, header, progress, textfield, typography } = useStyles();

  const handleSubmit = event => {
    // Prevent form from reloading page
    event.preventDefault();

    handleChange(null, { name: 'loading', value: true });

    console.log(localState);

    handleChange(null, { name: 'loading', value: false });
  };

  const { loading, oldPwd, newPwd, newPwd2 } = localState;

  return (
    <Fragment>
      <Header />
      <Container maxWidth='xl'>
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
          spacing={0}
          style={{ minHeight: '50vh' }}
        >
          <Grid item style={{ maxWidth: '25vw' }}>
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader
                  className={header}
                  title={
                    <Fragment>
                      <Button className={closeBtn} onClick={() => history.goBack()}>
                        <ArrowBackOutlinedIcon fontSize='large' />
                      </Button>
                      <Typography className={typography} variant='h6'>
                        Change Password
                      </Typography>
                    </Fragment>
                  }
                />
                <CardContent className={content}>
                  {/* {errorMsg && errorMsg !== '' && (
                    <Typography className={errMsg} align='center'>
                      {errorMsg}
                    </Typography>
                  )} */}
                  <TextField
                    className={textfield}
                    label='Old Password'
                    name='oldpwd'
                    value={oldPwd}
                    type='password'
                    onChange={handleChange}
                    autoComplete='false'
                    fullWidth
                  />
                  <TextField
                    className={textfield}
                    label='New Password'
                    name='newPwd'
                    value={newPwd}
                    type='password'
                    onChange={handleChange}
                    autoComplete='false'
                    fullWidth
                  />
                  <TextField
                    className={textfield}
                    label='Confirm New Password'
                    name='newPwd2'
                    value={newPwd2}
                    type='password'
                    onChange={handleChange}
                    autoComplete='false'
                    fullWidth
                  />
                  <Grid container direction='row' justify='center' alignItems='center' spacing={0}>
                    <Grid item>
                      <Button className={button} variant='contained' type='submit' disabled={loading}>
                        {loading && <CircularProgress color='inherit' size={20} className={progress} />}
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default ChangePwd;
