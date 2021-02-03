import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import clsx from 'clsx';

// Utils
import { getSharedWithUsers } from '../../utils/dashboard';

// Create styles
const useStyles = makeStyles(theme => ({
  paper: {
    maxHeight: '80vh',
    maxWidth: '40vw',
    minWidth: '40vw',
  },
  oddCell: { backgroundColor: grey[400] },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const initState = {
  error: '',
  users: [],
};

const SharedWithDialog = ({ show, toggleDialog }) => {
  const { id: dashboardID } = useSelector(state => state.dashboard.dashboard);
  const [localState, setLocalState] = useState(initState);
  const { paper, oddCell, tableHead } = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const users = await getSharedWithUsers(dashboardID);
        return setLocalState(prevState => ({ ...prevState, users }));
      } catch (error) {
        return setLocalState(prevState => ({ ...prevState, error: error.message }));
      }
    })();
  }, []);

  return (
    <Dialog onClose={toggleDialog} open={show} classes={{ paper }}>
      <DialogTitle>Dashboard Shared Info</DialogTitle>
      <DialogContent style={{ paddingBottom: 24 }}>
        {localState.users.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='left' className={tableHead}>
                    Email
                  </TableCell>
                  <TableCell align='center' className={tableHead}>
                    Permission
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {localState.users.map(({ email, permission }, index) => {
                  const oddNum = index % 2 > 0;

                  return (
                    <TableRow key={index}>
                      <TableCell align='left' className={clsx('', { [oddCell]: oddNum })}>
                        {email}
                      </TableCell>
                      <TableCell align='center' className={clsx('', { [oddCell]: oddNum })}>
                        {permission}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant='h5' align='center'>
            {localState.error ? localState.error : 'Dashboard is not shared'}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SharedWithDialog;
