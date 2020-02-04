import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, Menu, MenuItem } from '@material-ui/core';
import {
  AddCircle as AddCircleIcon,
  Email as EmailIcon,
  GetApp as GetAppIcon,
  Share as ShareIcon,
} from '@material-ui/icons';

// React Components
import NewChartDialog from '../Dialog/newChart';

// React Hooks
import useShare from '../../hooks/useShare';
import useDialog from '../../hooks/useDialog';

const useStyles = makeStyles({
  addBtn: { padding: 0 },
  shareBtn: { marginBottom: 10 },
  menuIcon: { marginRight: 10 },
});

const Dashboard = () => {
  const { dashboard } = useSelector(state => state.dashboard);
  const { charts = [] } = dashboard; // Provide default value of [] if dashboard hasn't been chosen yet
  const { showDialog, toggleDialog } = useDialog(false);
  const { menuAnchor, showMenu, hideMenu } = useShare(null);
  const { addBtn, menuIcon, shareBtn } = useStyles();

  return (
    Object.keys(dashboard).length > 0 && (
      <Container maxWidth="xl">
        <Grid container direction="row" justify="space-between" alignItems="flex-start">
          <Grid item xs={11}>
            <Button color="primary" className={addBtn} onClick={toggleDialog}>
              <AddCircleIcon fontSize="large" />
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" className={shareBtn} onClick={showMenu}>
              <ShareIcon className={menuIcon} />
              Share
            </Button>
          </Grid>
          <Menu anchorEl={menuAnchor} keepMounted open={Boolean(menuAnchor)} onClose={hideMenu}>
            <MenuItem onClick={hideMenu}>
              <EmailIcon className={menuIcon} />
              Email
            </MenuItem>
            <MenuItem onClick={hideMenu}>
              <GetAppIcon className={menuIcon} />
              Download PDF
            </MenuItem>
          </Menu>
        </Grid>
        <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={3}>
          {charts.map((chart, index) => {
            return (
              <Grid key={index} item xs={12} md={6} xl={4}>
                {chart}
              </Grid>
            );
          })}
        </Grid>
        <NewChartDialog show={showDialog} toggleDialog={toggleDialog} />
      </Container>
    )
  );
};

export default Dashboard;
