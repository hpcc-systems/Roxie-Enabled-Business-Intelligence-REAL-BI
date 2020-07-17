import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Create styles
const useStyles = makeStyles({
  textContent: { paddingLeft: 8, paddingBottom: 8 },
});

const TextBox = ({ data, options }) => {
  const { chartDescription } = options;
  let { textBoxContent } = options;
  const { textContent } = useStyles();

  if (data && data.length > 0) {
    const dataField = data[0];
    const fields = Object.keys(dataField);

    fields.forEach(field => {
      var rgx = new RegExp(`{{${field}}}`, 'gi');
      textBoxContent = textBoxContent.replace(rgx, dataField[field]);
    });
  }

  return (
    <Fragment>
      {chartDescription ? (
        <Typography variant='subtitle2' align='left' color='inherit' className={textContent}>
          {chartDescription}
        </Typography>
      ) : null}
      {textBoxContent ? (
        <Typography variant='body2' align='left' color='inherit' className={textContent}>
          {textBoxContent}
        </Typography>
      ) : null}
    </Fragment>
  );
};

export default TextBox;
