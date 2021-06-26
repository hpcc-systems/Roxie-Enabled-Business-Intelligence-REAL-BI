import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
const ReactMarkdown = require('react-markdown');

// Create styles
const useStyles = makeStyles(theme => ({
  div: { padding: theme.spacing(0, 1), wordBreak: 'break-all', height: '110%', overflow: 'auto' },
  textDesc: { color: 'grey', fontSize: 12 },
}));

const TextBox = ({ data, configuration }) => {
  const { description } = configuration;
  let { textBoxContent = '' } = configuration;
  const { div, textDesc } = useStyles();

  if (data && data.length > 0) {
    const dataField = data[0];
    const fields = Object.keys(dataField);

    fields.forEach(field => {
      const rgx = new RegExp(`{{${field}}}`, 'gi');
      const fieldVal = isNaN(dataField[field])
        ? dataField[field]
        : Intl.NumberFormat('en-US').format(dataField[field]);

      textBoxContent = textBoxContent.replace(rgx, fieldVal);
    });
  }

  return (
    <div className={div}>
      <Typography className={textDesc}>{description}</Typography>
      <ReactMarkdown>{textBoxContent}</ReactMarkdown>
    </div>
  );
};

export default TextBox;
