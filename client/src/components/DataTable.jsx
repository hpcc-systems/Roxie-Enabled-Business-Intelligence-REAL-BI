import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  columnHeader: { textTransform: 'capitalize' },
}));

// Convenient variable to quickly change how many rows the data snippet returns
const dataSnippetSize = 50;

const DataSnippet = ({ data }) => {
  const fields = Object.keys(data[0] || {}).filter(field => field !== '__fileposition__');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { columnHeader } = useStyles();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !fields) {
    return null;
  }

  // Slice data to get first x rows
  data = data.slice(0, dataSnippetSize);

  // Reference values
  const rowCount = data.length;
  const sliceStart = page * rowsPerPage;
  const sliceLength = page * rowsPerPage + rowsPerPage;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowCount - page * rowsPerPage);

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              {fields.map((field, index) => {
                return (
                  <TableCell key={index} className={columnHeader}>
                    {field}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(sliceStart, sliceLength).map((row, index) => {
              return (
                <TableRow key={index}>
                  {fields.map((field, index) => {
                    return (
                      <TableCell key={index} component='th' scope='row'>
                        {row[field]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 33 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component='div'
        count={rowCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Fragment>
  );
};

export default DataSnippet;
