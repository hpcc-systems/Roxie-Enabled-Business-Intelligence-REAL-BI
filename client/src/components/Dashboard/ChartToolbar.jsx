import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  FormControlLabel,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
  Zoom,
} from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon } from '@material-ui/icons';
import classnames from 'classnames';

// Utils
import { canDeleteCharts, canEditCharts, createDateTimeStamp } from '../../utils/misc';

// Constants
import { chartSizes } from '../../constants';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { minWidth: 40 },
  description: { fontSize: '0.875rem', fontWeight: 'normal', margin: theme.spacing(1.5, 10, 1, 6.5) },
  formControl: { margin: theme.spacing(0, 2, 0, 0) },
  outlined: { padding: 0 },
  select: { marginLeft: theme.spacing(1), padding: theme.spacing(1, 0, 1, 1.5) },
  tableDesc: { marginLeft: theme.spacing(1.5) },
  toolbar: { position: 'absolute', top: '5px', right: '3px', padding: 0, minHeight: 'initial' },
  toolbarNoTitle: { marginTop: theme.spacing(0) },
  typography: { fontSize: '1.15rem', fontWeight: 'bold', marginTop: theme.spacing(2) },
}));

const ChartToolbar = ({ chart, dashboard, removeChart, toggleDialog, updateChartWidth }) => {
  const { config, id: chartID, sourceID } = chart;
  const { role } = dashboard;
  const { chartDescription = '', size = 12, title = '', type } = config;
  const {
    button,
    description,
    formControl,
    outlined,
    select,
    tableDesc,
    toolbar,
    toolbarNoTitle,
    typography,
  } = useStyles();

  return (
    <Fragment>
      <Typography className={typography} align='center'>
        {title}
      </Typography>
      <Typography className={classnames(description, { [tableDesc]: type === 'table' })}>
        {/*
          Conditionally render the chart description and <br /> only if a description is provided
          Always render the datetime stamp
        */}
        {chartDescription !== '' ? chartDescription : null}
        {chartDescription !== '' ? <br /> : null}
        <small>{createDateTimeStamp()}</small>
      </Typography>
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
                onChange={event => updateChartWidth(event, chart)}
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
    </Fragment>
  );
};

export default ChartToolbar;
