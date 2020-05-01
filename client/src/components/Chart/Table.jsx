import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';

// Constants
import { thousandsSeparator } from '../../constants';

const useStyles = makeStyles({
  columnHeader: { textTransform: 'capitalize' },
});

const TableComp = ({ data, options }) => {
  const { fields, uniqueField } = options;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(uniqueField);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const { columnHeader } = useStyles();

  const updateOrderByField = property => {
    const isAsc = orderBy === property && order === 'asc';

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckbox = event => {
    const { name } = event.target;
    let newSelected = [];

    if (selected.indexOf(name) === -1) {
      newSelected = [...selected, name];
    } else {
      newSelected = selected.filter(val => val !== name);
    }

    setSelected(newSelected);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = data.map(row => row[uniqueField]);
      return setSelected(newSelected);
    }

    return setSelected([]);
  };

  const sortArr = (a, b, field) => {
    let aField = a[field];
    let bField = b[field];

    // Format value
    aField = isNaN(Number(aField)) ? aField.trim().toLowerCase() : Number(aField);
    bField = isNaN(Number(bField)) ? bField.trim().toLowerCase() : Number(bField);

    if (aField < bField) {
      return -1;
    } else if (aField > bField) {
      return 1;
    }

    return 0;
  };

  // Sort data
  data.sort((a, b) => (order === 'desc' ? -sortArr(a, b, orderBy) : sortArr(a, b, orderBy)));

  // Reference values
  const rowCount = data.length;
  const sliceStart = page * rowsPerPage;
  const sliceLength = page * rowsPerPage + rowsPerPage;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowCount - page * rowsPerPage);
  const numSelected = selected.length;

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {fields.map((field, index) => {
                return (
                  <TableCell key={index} className={columnHeader}>
                    <TableSortLabel
                      active={orderBy === field}
                      direction={orderBy === field ? order : 'asc'}
                      onClick={() => updateOrderByField(field)}
                    >
                      {field}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(sliceStart, sliceLength).map((row, index) => {
              const isSelected = selected.indexOf(row[uniqueField]) > -1;

              return (
                <TableRow key={index}>
                  <TableCell padding='checkbox'>
                    <Checkbox name={row[uniqueField]} checked={isSelected} onClick={handleCheckbox} />
                  </TableCell>
                  {fields.map((field, index) => {
                    return (
                      <TableCell key={index} component='th' scope='row'>
                        {!isNaN(Number(row[field])) && !field.includes('date')
                          ? thousandsSeparator(Number(row[field]))
                          : row[field]}
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
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Fragment>
  );
};

export default TableComp;
