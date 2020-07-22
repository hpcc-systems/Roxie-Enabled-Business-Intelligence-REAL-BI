import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
const ReactMarkdown = require('react-markdown');

// Create styles
const useStyles = makeStyles(theme => ({
  textContent: { padding: theme.spacing(1), paddingTop: 0 },
}));

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
          <ReactMarkdown>{chartDescription}</ReactMarkdown>
        </Typography>
      ) : null}
      {textBoxContent ? (
        <Typography variant='body2' align='left' color='inherit' className={textContent}>
          <ReactMarkdown>{textBoxContent}</ReactMarkdown>
        </Typography>
      ) : null}
    </Fragment>
  );
};

export default TextBox;
