import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import { ArrowBackOutlined as ArrowBackOutlinedIcon } from '@material-ui/icons';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';

// React Components
import Header from './Layout/Header';

// React Hooks
import useForm from '../hooks/useForm';

// Utils
import { updatePassword } from '../utils/auth';
import { Alert, AlertTitle } from '@material-ui/lab';

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
  grid: { marginTop: '2rem' },
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
  const { button, closeBtn, content, grid, header, progress, textfield, typography } = useStyles();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    handleChange(null, { name: 'loading', value: true });
    try {
      const response = await updatePassword(localState);
      resetState(initState);
      handleChange(null, { name: 'successMsg', value: response.message });
    } catch (error) {
      resetState(initState);
      if (error.errors) {
        return handleChange(null, { name: 'errors', value: error.errors });
      }

      return handleChange(null, { name: 'error', value: error.message || 'Can not update password' });
    }
  };

  const { error, errors, loading, oldPwd, newPwd, newPwd2, successMsg } = localState;

  const oldPwdErr = errors.find(err => err['oldPwd']);
  const newPwdErr = errors.find(err => err['newPwd']);
  const newPwd2Err = errors.find(err => err['newPwd2']);

  const alertMessage = error || successMsg;
  const alertSeverity = error ? 'error' : 'success';
  const alertTitle = error ? 'Error' : 'Success';

  return (
    <Fragment>
      <Header />
      <Container maxWidth='xl'>
        <Grid container direction='column' justifyContent='center' alignItems='center' className={grid}>
          <Grid item style={{ maxWidth: '600px' }}>
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
                  {/* Info Message */}
                  {alertMessage && (
                    <Box my={1}>
                      <Alert severity={alertSeverity}>
                        <AlertTitle>{alertTitle}</AlertTitle>
                        {alertMessage}
                      </Alert>
                    </Box>
                  )}

                  <PasswordTextfield
                    showPassword={showPassword}
                    setShowPassword={handleClickShowPassword}
                    className={textfield}
                    label='Old Password'
                    name='oldPwd'
                    value={oldPwd}
                    onChange={handleChange}
                    autoComplete='false'
                    fullWidth
                    error={oldPwdErr !== undefined}
                    helperText={oldPwdErr !== undefined ? oldPwdErr['oldPwd'] : ''}
                  />
                  <PasswordTextfield
                    showPassword={showPassword}
                    setShowPassword={handleClickShowPassword}
                    className={textfield}
                    label='New Password'
                    name='newPwd'
                    value={newPwd}
                    onChange={handleChange}
                    autoComplete='false'
                    fullWidth
                    error={newPwdErr !== undefined}
                    helperText={newPwdErr !== undefined ? newPwdErr['newPwd'] : ''}
                  />
                  <PasswordTextfield
                    showPassword={showPassword}
                    setShowPassword={handleClickShowPassword}
                    className={textfield}
                    label='Confirm New Password'
                    name='newPwd2'
                    value={newPwd2}
                    onChange={handleChange}
                    autoComplete='false'
                    fullWidth
                    error={newPwd2Err !== undefined}
                    helperText={newPwd2Err !== undefined ? newPwd2Err['newPwd2'] : ''}
                  />
                  <Grid container direction='row' justifyContent='center' alignItems='center' spacing={0}>
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

const PasswordTextfield = ({ showPassword, setShowPassword, ...otherProps }) => {
  return (
    <TextField
      {...otherProps}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton aria-label='toggle password visibility' onClick={setShowPassword} edge='end'>
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
