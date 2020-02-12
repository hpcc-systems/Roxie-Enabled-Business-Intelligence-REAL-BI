import React, { Fragment, useState } from 'react';
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
import EditChartDialog from '../Dialog/editChart';

// React Hooks
import useDialog from '../../hooks/useDialog';

const Dashboard = () => {
  const [chartID, setChartID] = useState(null);
  const { dashboard } = useSelector(state => state.dashboard);
  const { charts } = useSelector(state => state.chart);
  const { showDialog: newChartShow, toggleDialog: newChartToggle } = useDialog(false);
  const { showDialog: editChartShow, toggleDialog: editChartToggle } = useDialog(false);
  const dispatch = useDispatch();

  const editChart = chartID => {
    setChartID(chartID);
    editChartToggle();
  };

  const removeChart = chartID => {
    deleteChart(charts, chartID).then(action => dispatch(action));
  };

  return Object.keys(dashboard).length > 0 ? (
    <Fragment>
      <Toolbar name={dashboard.name} toggleDialog={newChartToggle} />
      <Container maxWidth="xl">
        <Grid container direction="row" justify="space-between" alignItems="center" spacing={3}>
          {charts.map((chart, index) => {
            const { id } = chart;

            return (
              <Grid key={index} item md={12} lg={6} xl={4}>
                <Paper>
                  <ChartToolbar chartID={id} toggleDialog={editChart} removeChart={removeChart} />
                  <Chart chart={chart} dashboard={dashboard} />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
        {newChartShow ? <NewChartDialog show={newChartShow} toggleDialog={newChartToggle} /> : null}
        {editChartShow ? (
          <EditChartDialog chartID={chartID} show={editChartShow} toggleDialog={editChartToggle} />
        ) : null}
      </Container>
    </Fragment>
  ) : (
    <NoCharts />
  );
};

export default Dashboard;
