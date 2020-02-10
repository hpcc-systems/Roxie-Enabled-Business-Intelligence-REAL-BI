import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, Paper } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

// Redux Actions
import { deleteChart } from '../../features/chart/actions';

// React Components
import NoCharts from './NoCharts';
import Toolbar from './Toolbar';
import NewChartDialog from '../Dialog/newChart';
import BarChart from '../Chart/Bar';
import LineChart from '../Chart/Line';

// React Hooks
import useDialog from '../../hooks/useDialog';

// Create styles
const useStyles = makeStyles({
  close: { padding: '10px 0', width: 16 },
  header: { fontSize: 40, fontWeight: 'bold', marginBottom: 20 },
  menuIcon: { marginRight: 10 },
  subheader: { fontSize: 20 },
  typography: { flex: 1, fontSize: 24, marginBottom: 20 },
});

const Dashboard = () => {
  const { dashboard } = useSelector(state => state.dashboard);
  const { charts } = useSelector(state => state.chart);
  const { showDialog, toggleDialog } = useDialog(false);
  const dispatch = useDispatch();
  const { close } = useStyles();

  const removeChart = chartID => {
    deleteChart(charts, chartID).then(action => dispatch(action));
  };

  return Object.keys(dashboard).length > 0 ? (
    <Fragment>
      <Toolbar name={dashboard.name} toggleDialog={toggleDialog} />
      <Container maxWidth="xl">
        <Grid container direction="row" justify="space-between" alignItems="center" spacing={3}>
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
    </Fragment>
  ) : (
    <NoCharts />
  );
};

export default Dashboard;
