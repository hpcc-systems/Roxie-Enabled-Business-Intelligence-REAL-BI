import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
  Zoom,
} from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon, MoreHoriz as MoreHorizIcon } from '@material-ui/icons';
import classnames from 'classnames';

// React Components
import ToolbarSubMenu from './ToolbarSubMenu';

// Redux Actions
import { updateChart } from '../../features/chart/actions';

// Utils
import { canDeleteCharts, canEditCharts, createDateTimeStamp } from '../../utils/misc';

// Constants
import { chartSizes } from '../../constants';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { minWidth: 40 },
  description: { fontSize: '0.875rem', fontWeight: 'normal', margin: theme.spacing(1.5, 10, 1, 6.5) },
  ellipseBtn: { marginTop: theme.spacing(1) },
  formControl: { margin: theme.spacing(1, 2, 0, 0) },
  outlined: { padding: 0 },
  select: { marginLeft: theme.spacing(1), padding: theme.spacing(1, 0, 1, 1.5) },
  tableDesc: { marginLeft: theme.spacing(1.5) },
  toolbar: { position: 'absolute', top: '5px', right: '3px', padding: 0, minHeight: 'initial' },
  toolbarNoTitle: { marginTop: theme.spacing(0) },
  typography: { fontSize: '1.15rem', fontWeight: 'bold', marginTop: theme.spacing(2) },
}));

const ChartToolbar = props => {
  const { chart, dashboard, removeChart, toggleDialog } = props;
  const { config, id: chartID, sourceID } = chart;
  const { role } = dashboard;
  const { chartDescription = '', size = 12, title = '', type } = config;
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const {
    button,
    description,
    ellipseBtn,
    formControl,
    outlined,
    select,
    tableDesc,
    toolbar,
    toolbarNoTitle,
    typography,
  } = useStyles();

  const showMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const updateChartWidth = async event => {
    const { value } = event.target;
    const newChartObj = { ...chart };
    const { sourceID, sourceType } = newChartObj;
    let action;

    // Update size in chart config
    newChartObj.config.size = value;

    try {
      action = await updateChart(newChartObj, dashboard.id, sourceID, sourceType);
    } catch (error) {
      return console.error(error);
    }

    dispatch(action);
  };

  const toolbarComp = () => {
    return (
      <Toolbar className={classnames(toolbar, { [toolbarNoTitle]: title === '' })}>
        {canEditCharts(role) && (
          <FormControlLabel
            className={formControl}
            control={
              <Select
                autoWidth
                className={select}
                variant='outlined'
                classes={{ outlined }}
                value={size || 12}
                onChange={updateChartWidth}
              >
                {chartSizes.map(({ label, value }, index) => {
                  return (
                    <MenuItem key={index} value={value}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            }
            label='Chart Width:'
            labelPlacement='start'
          />
        )}
        {canEditCharts(role) && (
          <Tooltip title='Edit Chart' TransitionComponent={Zoom} arrow placement='top'>
            <Button className={button}>
              <EditIcon onClick={() => toggleDialog(chartID)} />
            </Button>
          </Tooltip>
        )}
        {canDeleteCharts(role) && (
          <Tooltip title='Delete Chart' TransitionComponent={Zoom} arrow placement='top'>
            <Button className={button} onClick={() => removeChart(chartID, sourceID)}>
              <CloseIcon />
            </Button>
          </Tooltip>
        )}
      </Toolbar>
    );
  };

  return (
    <Fragment>
      {size <= 6 ? (
        <Grid container spacing={1}>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            <Typography className={typography} align='center'>
              {title}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            {canEditCharts(role) && (
              <Fragment>
                <MoreHorizIcon className={ellipseBtn} onClick={showMenu} />
                <ToolbarSubMenu
                  {...props}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  updateChartWidth={updateChartWidth}
                />
              </Fragment>
            )}
          </Grid>
        </Grid>
      ) : (
        <Fragment>
          <Typography className={typography} align='center'>
            {title}
          </Typography>
          {toolbarComp()}
        </Fragment>
      )}

      <Typography className={classnames(description, { [tableDesc]: type === 'table' })}>
        {/*
          Conditionally render the chart description and <br /> only if a description is provided
          Always render the datetime stamp
        */}
        {chartDescription !== '' ? chartDescription : null}
        {chartDescription !== '' ? <br /> : null}
        <small>{createDateTimeStamp()}</small>
      </Typography>
    </Fragment>
  );
};

export default ChartToolbar;
