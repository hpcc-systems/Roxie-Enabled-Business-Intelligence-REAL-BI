import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, Toolbar, Typography } from '@material-ui/core';

// Redux Actions
import { updateDashboardParam } from '../../features/dashboard/actions';

// React Components
import FilterEditor from '../FilterEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { setEditorState } from '../../utils/dashboardParam';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { margin: 0, marginTop: theme.spacing(3.25), minWidth: 30, padding: 0 },
  formControl: { margin: 0, marginTop: theme.spacing(1), marginBottom: theme.spacing(1) },
  toolbar: { padding: 0 },
  typography: { flex: 1, marginLeft: 12 },
}));

const EditFilterDialog = ({ filterID, show, toggleDialog }) => {
  // Get selected filter
  const { params } = useSelector(state => state.dashboard.dashboard);
  const initState = setEditorState(params, filterID);

  const { values: localState, handleChange, handleChangeArr } = useForm(initState);
  const { charts } = useSelector(state => state.chart);
  const { dashboard } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();
  const { toolbar, typography } = useStyles();

  const editFilter = async () => {
    try {
      updateDashboardParam({ ...localState }).then(action => dispatch(action));
    } catch (err) {
      console.error(err);
    }

    return toggleDialog();
  };

  return (
    <Dialog open={show} fullWidth maxWidth='lg'>
      <Toolbar className={toolbar}>
        <Typography variant='h6' color='inherit' className={typography}>
          Edit Dashboard Filter
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
        <Button variant='contained' color='primary' onClick={editFilter}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFilterDialog;
