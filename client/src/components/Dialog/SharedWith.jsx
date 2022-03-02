import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LoadingSpinner from '../Common/LoadingSpinner';

// Utils
import { getSharedWithUsers, updateDashboardPermissions } from '../../utils/dashboard';
import { Alert } from '@material-ui/lab';
import useNotifier from '../../hooks/useNotifier';

// Create styles
const useStyles = makeStyles(theme => ({
  paper: {
    maxHeight: '80vh',
    maxWidth: '40vw',
    minWidth: '40vw',
  },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const SharedWithDialog = ({ show, toggleDialog }) => {
  const { id: dashboardID } = useSelector(state => state.dashboard.dashboard);
  const [users, setUsers] = useState({ error: '', loading: false, data: [] });
  const { paper, tableHead } = useStyles();

  useEffect(() => {
    (async () => {
      try {
        setUsers(prevState => ({ ...prevState, loading: true, error: '' }));
        const users = await getSharedWithUsers(dashboardID);
        setUsers(prevState => ({ ...prevState, data: users, loading: false }));
      } catch (error) {
        setUsers(prev => ({ ...prev, error: error.message, loading: false }));
      }
    })();
  }, []);

  const toggleSwitch = updatedUser => {
    const updatedUsers = users.data.map(user => (user.id === updatedUser.id ? updatedUser : user));
    setUsers(prev => ({ ...prev, data: updatedUsers }));
  };

  return (
    <Dialog onClose={toggleDialog} open={show} classes={{ paper }}>
      <DialogTitle>Dashboard Shared Info</DialogTitle>
      <DialogContent style={{ paddingBottom: 24 }}>
        {users.error && (
          <Alert style={{ marginBottom: '20px' }} severity='error'>
            {users.error}
          </Alert>
        )}

        {users.data.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '60%' }} className={tableHead}>
                    Email
                  </TableCell>
                  <TableCell className={tableHead}>Permissions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.data.map(user => {
                  return (
                    <UserRecord
                      key={user.id}
                      user={user}
                      dashboardID={dashboardID}
                      toggleSwitch={toggleSwitch}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <>
            {users.loading ? (
              <LoadingSpinner />
            ) : (
              <Alert severity='info'>This dashboard is not shared yet</Alert>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SharedWithDialog;

const UserRecord = ({ user, dashboardID, toggleSwitch }) => {
  const [loading, setLoading] = useState(false);
  const notifyResult = useNotifier();

  const changePermission = async user => {
    try {
      const updatedUser = { ...user, permission: user.permission === 'Read-Only' ? 'Owner' : 'Read-Only' };
      setLoading(true);
      toggleSwitch(updatedUser);
      const newPermission = await updateDashboardPermissions({ dashboardID, ...updatedUser });
      if (!newPermission) throw new Error('Failed to Update Permission');
      setLoading(false);
      notifyResult('success', 'Permission updated successfully', 'top');
    } catch (error) {
      toggleSwitch(user);
      setLoading(false);
      notifyResult('error', 'Failed to update permission', 'top');
    }
  };

  const switchState = user.permission === 'Owner' ? true : false;

  return (
    <TableRow key={user.email}>
      <TableCell style={{ width: '60%' }}>{user.email}</TableCell>
      <TableCell>
        <Grid container wrap='nowrap' alignItems='center'>
          <Grid item>Read only</Grid>
          <Grid item>
            <Switch disabled={loading} checked={switchState} onChange={() => changePermission(user)} />
          </Grid>
          <Grid item>Owner</Grid>
          {loading && <CircularProgress style={{ marginLeft: 10 }} size={14} color='inherit' />}
        </Grid>
      </TableCell>
    </TableRow>
  );
};
