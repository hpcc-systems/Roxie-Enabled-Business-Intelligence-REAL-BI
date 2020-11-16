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
import classnames from 'classnames';

// React Components
import Header from './Layout/Header';

// React Hooks
import useForm from '../hooks/useForm';

// Utils
import { updatePassword } from '../utils/auth';

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
  err: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
  },
  grid: { margin: '2rem' },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: '#ff5722',
    padding: theme.spacing(1.25, 0, 1.25, 2),
  },
  message: {
    borderRadius: 4,
    marginBottom: theme.spacing(1.5),
    padding: theme.spacing(0.5, 0),
  },
  progress: { marginRight: theme.spacing(2) },
  success: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  textfield: { margin: theme.spacing(1, 0) },
  typography: {
    display: 'inline',
    fontWeight: 'bold',
    marginLeft: theme.spacing(3),
    textTransform: 'uppercase',
  },
}));

const initState = {
  error: '',
  errors: [],
  loading: false,
  newPwd: '',
  newPwd2: '',
  oldPwd: '',
  successMsg: '',
};

const ChangePwd = () => {
  const { values: localState, handleChange, resetState } = useForm(initState);
  const history = useHistory();
  const {
    button,
    closeBtn,
    content,
    err,
    grid,
    header,
    message,
    progress,
    success,
    textfield,
    typography,
  } = useStyles();

  const handleSubmit = async event => {
    event.preventDefault();
    handleChange(null, { name: 'loading', value: true });

    try {
      const response = await updatePassword(localState);
      resetState(initState);
      handleChange(null, { name: 'successMsg', value: response.message });

      setTimeout(() => history.goBack(), 1500); // Wait 1.5 seconds then redirect back to previous page
    } catch (error) {
      resetState(initState);

      if (error.errors) {
        return handleChange(null, { name: 'errors', value: error.errors });
      }

      return handleChange(null, { name: 'error', value: error.message });
    }
  };

  const { error, errors, loading, oldPwd, newPwd, newPwd2, successMsg } = localState;

  const oldPwdErr = errors.find(err => err['oldPwd']);
  const newPwdErr = errors.find(err => err['newPwd']);
  const newPwd2Err = errors.find(err => err['newPwd2']);

  return (
    <Fragment>
      <Header />
      <Container maxWidth='xl'>
        <Grid container direction='column' justify='center' alignItems='center' className={grid}>
          <Grid item style={{ maxWidth: '25vw' }}>
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader
                  className={header}
                  title={
                    <Fragment>
                      <Button className={closeBtn} disabled={loading} onClick={() => history.goBack()}>
                        <ArrowBackOutlinedIcon fontSize='large' />
                      </Button>
                      <Typography className={typography} variant='h6'>
                        Change Password
                      </Typography>
                    </Fragment>
                  }
                />
                <CardContent className={content}>
                  {/* Error message */}
                  {error && error !== '' && (
                    <Typography className={classnames(message, err)} align='center'>
                      {error}
                    </Typography>
                  )}

                  {/* Success Message */}
                  {successMsg && successMsg !== '' && (
                    <Typography className={classnames(message, success)} align='center'>
                      {successMsg}
                    </Typography>
                  )}

                  <TextField
                    className={textfield}
                    label='Old Password'
                    name='oldPwd'
                    value={oldPwd}
                    type='password'
                    onChange={handleChange}
                    autoComplete='false'
                    fullWidth
                    error={oldPwdErr !== undefined}
                    helperText={oldPwdErr !== undefined ? oldPwdErr['oldPwd'] : ''}
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
                    error={newPwdErr !== undefined}
                    helperText={newPwdErr !== undefined ? newPwdErr['newPwd'] : ''}
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
                    error={newPwd2Err !== undefined}
                    helperText={newPwd2Err !== undefined ? newPwd2Err['newPwd2'] : ''}
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
