import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Toolbar,
  Typography,
} from '@material-ui/core';

// Redux Actions
import { createDashboardParam } from '../../features/dashboard/actions';

// React Components
import FilterEditor from '../FilterEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { createParamObj } from '../../utils/dashboardParam';
import { addQuery } from '../../utils/query';

const initState = {
  dataset: '',
  datasets: [],
  field: '',
  keyword: '',
  name: '',
  mappedParams: [{ chartID: '', parameter: '', queryID: '' }],
  queries: [],
  query: '',
};

// Create styles
const useStyles = makeStyles(theme => ({
  button: { margin: 0, marginTop: theme.spacing(3.25), minWidth: 30, padding: 0 },
  formControl: { margin: 0, marginTop: theme.spacing(1), marginBottom: theme.spacing(1) },
  progress: { marginRight: 15 },
  toolbar: { padding: 0 },
  typography: { flex: 1, marginLeft: 12 },
}));

const NewFilter = ({ show, toggleDialog }) => {
  const { values: localState, handleChange, handleChangeArr } = useForm(initState);
  const [loading, setLoading] = useState(false);
  const { charts } = useSelector(state => state.chart);
  const { dashboard } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();
  const { progress, toolbar, typography } = useStyles();

  const saveFilter = async () => {
    setLoading(true);

    try {
      const { queryID } = await addQuery(dashboard.id, localState.query);
      const filterObj = await createParamObj(localState, dashboard.id);

      createDashboardParam({ ...filterObj, queryID }).then(action => dispatch(action));
    } catch (err) {
      console.error(err);
    }

    return toggleDialog();
  };

  return (
    <Dialog open={show} fullWidth maxWidth='lg'>
      <Toolbar className={toolbar}>
        <Typography variant='h6' color='inherit' className={typography}>
          New Dashboard Filter
        </Typography>
      </Toolbar>
      <DialogContent>
        <FilterEditor
          charts={charts}
          dashboard={dashboard}
          localState={localState}
          handleChange={handleChange}
          handleChangeArr={handleChangeArr}
        />
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button variant='contained' color='primary' disabled={loading} onClick={saveFilter}>
          {loading && <CircularProgress color='inherit' size={20} className={progress} />}
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewFilter;
