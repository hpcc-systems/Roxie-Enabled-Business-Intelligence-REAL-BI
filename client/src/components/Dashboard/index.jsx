import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Paper } from '@material-ui/core';

// Redux Actions
import { deleteChart } from '../../features/chart/actions';

// React Components
import NoCharts from './NoCharts';
import Toolbar from './Toolbar';
import ChartToolbar from './ChartToolbar';
import Chart from '../Chart';
import NewChartDialog from '../Dialog/newChart';

// React Hooks
import useDialog from '../../hooks/useDialog';

const Dashboard = () => {
  const { dashboard } = useSelector(state => state.dashboard);
  const { charts } = useSelector(state => state.chart);
  const { showDialog, toggleDialog } = useDialog(false);
  const dispatch = useDispatch();

  const removeChart = chartID => {
    deleteChart(charts, chartID).then(action => dispatch(action));
  };

  return Object.keys(dashboard).length > 0 ? (
    <Fragment>
      <Toolbar name={dashboard.name} toggleDialog={toggleDialog} />
      <Container maxWidth="xl">
        <Grid container direction="row" justify="space-between" alignItems="center" spacing={3}>
          {charts.map((chart, index) => {
            const { id } = chart;

            return (
              <Grid key={index} item md={12} lg={6} xl={4}>
                <Paper>
                  <ChartToolbar chartID={id} removeChart={removeChart} />
                  <Chart chart={chart} dashboard={dashboard} />
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
