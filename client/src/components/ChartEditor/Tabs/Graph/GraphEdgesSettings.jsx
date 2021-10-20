import React, { useEffect, useRef, useState } from 'react';

import {
  IconButton,
  TextField,
  Paper,
  Grid,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';

import { v4 as uuidv4 } from 'uuid';

const defaultEdge = {
  uuid: '',
  source: '', //one of them should be own id "Source id"
  target: '', //Target id
  value: '', //optional 'Source A'
};

const GraphEdgesSettings = props => {
  const graphChart = props.localState.configuration.graphChart;
  const allEdges = graphChart.edges;

  const configuration = props.localState.configuration;
  const formFieldsUpdate = props.formFieldsUpdate;

  const [edge, setEdge] = useState({ ...defaultEdge });
  const [isEditing, setEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdgeChange = e => {
    setEdge(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveEdge = () => {
    if (!edge.source || !edge.target) return;
    let newAllEdges = [...allEdges];
    const index = newAllEdges.findIndex(el => el.uuid === edge.uuid);
    if (index === -1) {
      edge.uuid = uuidv4();
      newAllEdges.push(edge);
    } else {
      newAllEdges[index] = edge;
    }
    formFieldsUpdate({
      configuration: { ...configuration, graphChart: { ...graphChart, edges: newAllEdges } },
    });
    resetForm();
  };

  const resetForm = () => {
    setEdge({ ...defaultEdge }); // reset form values
    if (isEditing) setEditing(false);
  };

  const handleDeleteEdge = edge => {
    const newAllEdges = allEdges.filter(el => el.uuid !== edge.uuid);
    formFieldsUpdate({
      configuration: { ...configuration, graphChart: { ...graphChart, edges: newAllEdges } },
    });
  };

  const handleEditEdge = editedEdge => {
    setEdge(editedEdge);
    setEditing(true);
  };

  return (
    <>
      <Box p={2} my={1} component={Paper}>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item xs={12} sm={3}>
            <TextField
              inputRef={inputRef}
              fullWidth
              required={!!edge.target}
              name='source'
              value={edge.source}
              onChange={handleEdgeChange}
              label='Source Node ID'
              placeholder='Should be a unique integer ex. 1, 2, 3 or -1, -2, -3'
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              required={!!edge.source}
              name='target'
              value={edge.target}
              onChange={handleEdgeChange}
              label='Target Node ID'
              placeholder='Should be a unique integer ex. 1, 2, 3 or -1, -2, -3'
            />
          </Grid>

          <Grid item xs={9} sm={4}>
            <TextField
              fullWidth
              name='value'
              value={edge.value}
              onChange={handleEdgeChange}
              label='Line text'
              placeholder='Connecting line text'
            />
          </Grid>

          <Grid item xs={3} sm={2} container wrap='nowrap'>
            <Grid item>
              <IconButton size='small' onClick={resetForm}>
                <ClearIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton size='small' onClick={handleSaveEdge}>
                <SaveIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <EdgesTable allEdges={allEdges} handleDeleteEdge={handleDeleteEdge} handleEditEdge={handleEditEdge} />
    </>
  );
};

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: '8px',
  },
  container: {
    maxHeight: 250,
    overflowY: 'scroll',
  },
});

const EdgesTable = ({ allEdges, handleDeleteEdge, handleEditEdge }) => {
  const classes = useStyles();

  const columns = [
    { id: 'source', label: 'Source id', minWidth: 50 },
    { id: 'target', label: 'Target id', minWidth: 50 },
    { id: 'text', label: 'Line text', minWidth: 250 },
  ];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align='center' style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell style={{ minWidth: 170 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allEdges.map((edge, index) => {
              return (
                <TableRow hover key={index}>
                  {columns.map(column => {
                    return (
                      <TableCell padding='none' align='center' key={column.id}>
                        <strong>{edge[column.id]}</strong>
                      </TableCell>
                    );
                  })}
                  <TableCell padding='none'>
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteEdge(edge);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        handleEditEdge(edge);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default GraphEdgesSettings;
