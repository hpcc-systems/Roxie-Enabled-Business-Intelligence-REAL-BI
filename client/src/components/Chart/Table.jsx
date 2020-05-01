import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

const useStyles = makeStyles({
  columnHeader: { textTransform: 'capitalize' },
});

const TableComp = ({ data, options }) => {
  const { fields } = options;
  const { columnHeader } = useStyles();

  return (
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
          {data.map((row, index) => {
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
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComp;
