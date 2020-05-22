import React, { Fragment, useEffect, useState } from 'react';
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

// Redux Actions
import { updateDashboardParam } from '../../features/dashboard/actions';

// Utils
import { sortArr } from '../../utils/misc';

// Constants
import { thousandsSeparator } from '../../constants';

const useStyles = makeStyles({
  columnHeader: { textTransform: 'capitalize' },
});

const TableComp = ({ data, dispatch, params = [], options }) => {
  const { fields, uniqueField } = options;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(uniqueField);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const { columnHeader } = useStyles();

  // Determine if the uniqueField matches any dashboard params
  const matchedParam = params.some(({ field }) => field === uniqueField);
  const paramObj = matchedParam ? params.find(({ field }) => field === uniqueField) : {};

  // Update table with already selected values
  useEffect(() => {
    if (matchedParam) {
      const selectedString = selected.join(',');
      let { value = '' } = paramObj;

      // Convert null to empty string
      value = value === null ? '' : value;

      if (selectedString !== value) {
        if (value === '') {
          setSelected([]);
        } else {
          setSelected(value.split(','));
        }
      }
    }
  }, [matchedParam, paramObj, selected]);

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

  const updateParams = value => {
    // Join array together as string
    value = value.sort().join(',');

    updateDashboardParam({ ...paramObj, value }).then(action => dispatch(action));
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

    if (matchedParam) {
      updateParams(newSelected);
    }
  };

  const handleSelectAllClick = event => {
    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(row => row[uniqueField]);
    }

    if (matchedParam) {
      updateParams(newSelected);
    }

    return setSelected(newSelected);
  };

  // Sort data
  data = sortArr(data, orderBy, order);

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
