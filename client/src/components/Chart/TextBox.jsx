import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
const ReactMarkdown = require('react-markdown');

// Create styles
const useStyles = makeStyles(theme => ({
  div: { padding: theme.spacing(0, 3, 0, 3), wordBreak: 'break-all' },
  textDesc: { color: 'grey', fontFamily: 'auto', fontSize: 12 },
}));

const TextBox = ({ data, config }) => {
  const { description } = config;
  let { textBoxContent = '' } = config;
  const { div, textDesc } = useStyles();

  if (data && data.length > 0) {
    const dataField = data[0];
    const fields = Object.keys(dataField);

    fields.forEach(field => {
      var rgx = new RegExp(`{{${field}}}`, 'gi');
      textBoxContent = textBoxContent.replace(rgx, dataField[field]);
    });
  }

  return (
    <div className={div}>
      <Typography align='left' color='inherit' className={textDesc}>
        {description}
      </Typography>
      <ReactMarkdown>{textBoxContent}</ReactMarkdown>
    </div>
  );
};

export default TextBox;
