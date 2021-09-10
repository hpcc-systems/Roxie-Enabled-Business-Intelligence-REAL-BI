import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Link,
} from '@material-ui/core';

import _orderBy from 'lodash/orderBy';
import { evaluateFormattingRules } from '../../utils/chart';
import { updateChart } from '../../features/dashboard/actions';

const useStyles = makeStyles(() => ({
  activeCell: { fontWeight: '700', textDecoration: 'underline' },
  columnHeader: { textTransform: 'capitalize' },
  tableCell: {
    padding: '5px',
    '&:hover': { cursor: 'pointer' },
  },
  tableContainer: {
    height: 'calc(100% - 45px)',
  },
  paginationRoot: {
    '& .MuiToolbar-root ': {
      justifyContent: 'flex-end',
      maxWidth: '100%',
    },
    '& .MuiToolbar-gutters': {
      padding: 0,
    },
    '& .MuiTablePagination-actions': {
      margin: 0,
    },
    '& .MuiTablePagination-spacer	': {
      display: 'none',
    },
    '& .MuiIconButton-root': {
      padding: '4px',
    },
    '& .MuiTablePagination-selectRoot': {
      margin: 0,
    },
  },
}));

const TableComp = ({ chartID, configuration, data, interactiveClick, interactiveObj }) => {
  const { charts, id: dashboardID } = useSelector(state => state.dashboard.dashboard);
  const dispatch = useDispatch();
  const {
    conditionals = [],
    fields = [],
    order: configOrder = 'asc',
    orderBy: configOrderBy = null,
    rowsPerPage: configRowsPerPage = 10,
  } = configuration;
  const { chartID: interactiveChartID, field: interactiveField, value: interactiveValue } = interactiveObj;
  const [order, setOrder] = useState(configOrder);
  const [orderBy, setOrderBy] = useState(configOrderBy);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(configRowsPerPage);
  const { paginationRoot, activeCell, columnHeader, tableCell, tableContainer } = useStyles();

  // Update chart in DB and store
  const updateConfig = async keys => {
    const source = charts.find(({ id }) => id === chartID).source;
    const newConfig = { ...configuration, ...keys };

    try {
      const updatedChartObj = { id: chartID, configuration: newConfig, source };
      const action = await updateChart(updatedChartObj, dashboardID);

      dispatch(action);
    } catch (error) {
      return dispatch(error);
    }
  };

  const updateOrderByField = property => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';

    setOrder(newOrder);
    setOrderBy(property);
    updateConfig({ order: newOrder, property });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    const numRows = Number(event.target.value);

    setRowsPerPage(numRows);
    setPage(0);
    updateConfig({ rowsPerPage: numRows });
  };

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !fields) {
    return null;
  }

  // Sort data
  if (orderBy) {
    data = _orderBy(data, [orderBy], [order]);
  }

  // Reference values
  const rowCount = data.length;
  const sliceStart = page * rowsPerPage;
  const sliceLength = page * rowsPerPage + rowsPerPage;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowCount - page * rowsPerPage);

  const createTableCellValue = (asLink, linkBase, cellValue, activeItem) => {
    const activeClass = activeItem ? activeCell : null; // apply active class on clicked item
    let replaceValue = String(cellValue).trim();
    if (asLink && linkBase) {
      let link = linkBase.replace('${Field}', replaceValue);
      const pattern = /^http/i;
      const validLink = pattern.test(link);

      if (!validLink) {
        link = `http://${link}`;
      }

      return (
        <Link className={activeClass} href={link} target='_blank' rel='noopener'>
          {cellValue}
        </Link>
      );
    } else {
      return (
        <Typography variant='body2' component='span' className={activeClass}>
          {cellValue}
        </Typography>
      );
    }
  };

  return (
    <Fragment>
      <TableContainer className={tableContainer}>
        <Table stickyHeader aria-label='sticky table'>
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
                  {fields.map(({ color = '#FFF', name, text = '#000', asLink, linkBase }, index) => {
                    const conditionIndex = conditionals.findIndex(({ field }) => field === name);
                    const conditionalRules = conditionIndex > -1 ? conditionals[conditionIndex].rules : [];
                    const activeItem =
                      chartID === interactiveChartID &&
                      name === interactiveField &&
                      row[name] === interactiveValue;
                    return (
                      <TableCell
                        key={index}
                        component='th'
                        scope='row'
                        className={tableCell}
                        style={evaluateFormattingRules(row[name], color, text, conditionalRules)}
                        onClick={() => interactiveClick(chartID, name, row[name])}
                      >
                        {createTableCellValue(asLink, linkBase, row[name], activeItem)}
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
        classes={{
          root: paginationRoot,
        }}
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

export default TableComp;
