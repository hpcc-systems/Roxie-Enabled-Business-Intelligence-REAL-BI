import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, Menu, MenuItem, Typography } from '@material-ui/core';
import {
  AddCircle as AddCircleIcon,
  Email as EmailIcon,
  GetApp as GetAppIcon,
  Share as ShareIcon,
} from '@material-ui/icons';

// React Components
import NewChartDialog from '../Dialog/newChart';
import BarChart from '../Chart/Bar';

// React Hooks
import useShare from '../../hooks/useShare';
import useDialog from '../../hooks/useDialog';

const useStyles = makeStyles({
  addBtn: { padding: 0 },
  grid: { marginTop: 20 },
  shareBtn: { marginBottom: 10 },
  menuIcon: { marginRight: 10 },
  typography: { fontSize: 24, marginBottom: 20 },
});

const Dashboard = () => {
  const { dashboard } = useSelector(state => state.dashboard);
  const { charts = [] } = dashboard; // Provide default value of [] if dashboard hasn't been chosen yet
  const { showDialog, toggleDialog } = useDialog(false);
  const { menuAnchor, showMenu, hideMenu } = useShare(null);
  const { addBtn, grid, menuIcon, shareBtn, typography } = useStyles();

  return (
    Object.keys(dashboard).length > 0 && (
      <Container maxWidth="xl">
        <Typography variant="h2" className={typography}>
          {dashboard.name}
        </Typography>
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
        <Grid
          container
          className={grid}
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={3}
        >
          {charts.map((chart, index) => {
            return (
              <Grid key={index} item xs={12} md={6} xl={4}>
                <BarChart chart={chart} dashboard={dashboard} />
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
