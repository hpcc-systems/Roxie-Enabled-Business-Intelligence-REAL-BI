import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
const ReactMarkdown = require('react-markdown');
import moment from 'moment';

// Create styles
const useStyles = makeStyles(theme => ({
  div: {
    padding: theme.spacing(0, 1),
    wordBreak: 'break-all',
    height: '120%',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 0 /* Remove scrollbar space */,
      background: 'transparent' /* Optional: just make scrollbar invisible */,
    },
    '& *': {
      textAlign: props => props.textBoxAlignText,
    },
  },
  textDesc: { color: 'grey', fontSize: 12 },
}));

const TextBox = ({ data, configuration }) => {
  const { description } = configuration;
  let { textBoxContent = '' } = configuration;
  const { div, textDesc } = useStyles(configuration);

  const isDate = value => {
    return value && moment(value, 'YYYYMMDD').isValid();
  };

  if (data && data.length > 0) {
    const dataField = data[0];
    const fields = Object.keys(dataField);

    fields.forEach(field => {
      const rgx = new RegExp(`{{${field}}}`, 'gi');

      let fieldVal = dataField[field];

      if (parseInt(fieldVal).toString() === fieldVal) {
        const date = isDate(parseInt(fieldVal));
        if (date) fieldVal = moment(fieldVal).format('MM/DD/YYYY');
      }

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
