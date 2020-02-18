import React, { Fragment, useEffect, useState } from 'react';
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

// Utils
import { getChartData } from '../../utils/chart';

const Dashboard = () => {
  const [queryData, setQueryData] = useState({});
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

  useEffect(() => {
    if (charts.length > 0) {
      // Get unique query values
      const uniqueQueries = Array.from(new Set(charts.map(({ query }) => query))).map(query => {
        return charts.find(({ query: query2 }) => query === query2);
      });

      // Set initial object keys and loading
      uniqueQueries.forEach(({ query }) => {
        setQueryData(prevState => ({ ...prevState, [query]: { loading: true } }));
      });

      // Fetch data for each unique query
      uniqueQueries.forEach(({ id, query }) => {
        getChartData(id, dashboard.clusterID).then(data => {
          // Set data in local state object with query name as key
          setQueryData(prevState => ({ ...prevState, [query]: { data, loading: false } }));
        });
      });
    }
  }, [charts, dashboard.clusterID]);

  return Object.keys(dashboard).length > 0 ? (
    <Fragment>
      <Toolbar name={dashboard.name} toggleDialog={newChartToggle} />
      <Container maxWidth="xl">
        <Grid container direction="row" justify="space-between" alignItems="center" spacing={3}>
          {charts.map((chart, index) => {
            const { id, query } = chart;
            const dataObj = Object.keys(queryData).length > 0 ? queryData[query] : {};

            return (
              <Grid key={index} item md={12} lg={6} xl={4}>
                <Paper>
                  <ChartToolbar chartID={id} toggleDialog={editChart} removeChart={removeChart} />
                  <Chart chart={chart} dataObj={dataObj} />
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
