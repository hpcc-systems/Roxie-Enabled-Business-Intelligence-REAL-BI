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
  TableSortLabel,
} from '@material-ui/core';
import clsx from 'clsx';
import _ from 'lodash';
import { evaluateFormattingRules } from '../../utils/chart';

const useStyles = makeStyles(() => ({
  activeCell: { fontWeight: 'bold' },
  columnHeader: { textTransform: 'capitalize' },
  tableCell: { '&:hover': { cursor: 'pointer' } },
}));

const TableComp = ({ chartID, configuration, data, interactiveClick, interactiveObj }) => {
  const { conditionals = [], fields = [] } = configuration;
  const { chartID: interactiveChartID, field: interactiveField, value: interactiveValue } = interactiveObj;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { activeCell, columnHeader, tableCell } = useStyles();

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

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !fields) {
    return null;
  }

  // Sort data
  if (orderBy) {
    data = _.orderBy(data, [orderBy], [order]);
  }

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
              {fields.map(({ label, name }, index) => {
                const header = label || name;
                return (
                  <TableCell key={index} className={columnHeader}>
                    <TableSortLabel
                      active={orderBy === name}
                      direction={orderBy === name ? order : 'asc'}
                      onClick={() => updateOrderByField(name)}
                    >
                      {header}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(sliceStart, sliceLength).map((row, index) => {
              return (
                <TableRow key={index}>
                  {fields.map(({ color = '#FFF', name, text = '#000' }, index) => {
                    const conditionIndex = conditionals.findIndex(({ field }) => field === name);
                    const conditionalRules = conditionIndex > -1 ? conditionals[conditionIndex].rules : [];

                    return (
                      <TableCell
                        key={index}
                        component='th'
                        scope='row'
                        className={clsx(tableCell, {
                          [activeCell]:
                            chartID === interactiveChartID &&
                            name === interactiveField &&
                            row[name] === interactiveValue,
                        })}
                        style={evaluateFormattingRules(row[name], color, text, conditionalRules)}
                        onClick={() => interactiveClick(chartID, name, row[name])}
                      >
                        {row[name]}
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
