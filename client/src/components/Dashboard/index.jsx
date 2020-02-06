import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, Menu, MenuItem, Paper, Typography } from '@material-ui/core';
import {
  AddCircle as AddCircleIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  GetApp as GetAppIcon,
  Share as ShareIcon,
} from '@material-ui/icons';

// Redux Actions
import { deleteChart } from '../../features/dashboard/actions';

// React Components
import NewChartDialog from '../Dialog/newChart';
import BarChart from '../Chart/Bar';
import LineChart from '../Chart/Line';

// React Hooks
import useShare from '../../hooks/useShare';
import useDialog from '../../hooks/useDialog';

// Create styles
const useStyles = makeStyles({
  addBtn: { padding: 0 },
  close: { padding: '10px 0', width: 16 },
  grid: { marginTop: 20 },
  shareBtn: { marginBottom: 10 },
  menuIcon: { marginRight: 10 },
  typography: { fontSize: 24, marginBottom: 20 },
});

const Dashboard = () => {
  const { dashboard } = useSelector(state => state.dashboard);
  const { charts, name } = dashboard;
  const { showDialog, toggleDialog } = useDialog(false);
  const { menuAnchor, showMenu, hideMenu } = useShare(null);
  const dispatch = useDispatch();
  const { addBtn, close, grid, menuIcon, shareBtn, typography } = useStyles();

  const removeChart = chartID => {
    deleteChart(charts, chartID).then(action => dispatch(action));
  };

  return (
    Object.keys(dashboard).length > 0 && (
      <Container maxWidth="xl">
        <Typography variant="h2" className={typography}>
          {name}
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
            const { id, type } = chart;

            return (
              <Grid key={index} item md={12} lg={6} xl={4}>
                <Paper>
                  <Button className={close} onClick={() => removeChart(id)}>
                    <CloseIcon />
                  </Button>
                  {(() => {
                    switch (type) {
                      case 'bar':
                        return <BarChart chart={chart} dashboard={dashboard} />;
                      case 'line':
                        return <LineChart chart={chart} dashboard={dashboard} />;
                      default:
                        return 'Unknown chart type';
                    }
                  })()}
                </Paper>
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
