import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

// Create styles
const useStyles = makeStyles(() => ({
  textField: { marginBottom: 24 },
}));

const SearchQuery = ({ handleChange, keyword }) => {
  const { textField } = useStyles();

  return (
    <TextField
      className={textField}
      fullWidth
      label="Query Name Keyword"
      name="keyword"
      value={keyword}
      onChange={handleChange}
      autoComplete="off"
    />
  );
};

export default SearchQuery;
