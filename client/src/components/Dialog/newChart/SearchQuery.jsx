import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

// Create styles
const useStyles = makeStyles(() => ({
  textField: { marginBottom: 24 },
}));

const SearchQuery = ({ handleChange, keyword, query, setSingleValue }) => {
  const { textField } = useStyles();

  // If a user goes back and searches for a different query, clear the query state field
  useEffect(() => {
    if (query !== '') {
      setSingleValue({ name: 'query', value: '' });
    }
  });

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
