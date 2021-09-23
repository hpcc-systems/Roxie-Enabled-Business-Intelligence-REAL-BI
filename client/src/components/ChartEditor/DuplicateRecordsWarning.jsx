import React from 'react';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.contrastText,
    '& svg': { color: theme.palette.info.contrastText },
  },
  details: {
    maxHeight: '150px',
    paddingTop: 0,
    paddingBottom: '30px',
    '& ul': {
      width: '100%',
      overflowY: 'scroll',
      margin: 0,
    },
  },
}));

function DuplicateRecordsWarning({ duplicatedRecords }) {
  const [expanded, setExpanded] = React.useState(false);
  const list = React.useRef(null);
  const classes = useStyles();

  const handleExpanded = () => {
    setExpanded(expanded => !expanded);

    if (!expanded) {
      setTimeout(() => {
        list.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 250);
    }
  };

  return (
    <Accordion ref={list} classes={{ root: classes.root }} expanded={expanded} onChange={handleExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
        <Box display='flex' alignItems='center'>
          <Box component={ErrorOutlineIcon} display='inline-blocK' mr='10px' />
          <Typography variant='body2'>There are duplicated keys on X axis</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <ul>
          {duplicatedRecords.map(([key, value]) => (
            <li key={key}>
              {key}: + {value - 1} records
            </li>
          ))}
        </ul>
      </AccordionDetails>
    </Accordion>
  );
}

export default React.memo(DuplicateRecordsWarning);
