import React, { useEffect, useRef, useState } from 'react';

import { IconButton, Typography, TextField, Paper, Grid, Box } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { v4 as uuidv4 } from 'uuid';

const defaultEdge = {
  uuid: '',
  source: '', //one of them should be own id "Source id"
  target: '', //Target id
  value: '', //optional 'Source A'
};

const GraphEdgesSettings = props => {
  const graphNodes = props.localState.configuration.graphNodes;
  const allEdges = graphNodes.edges;

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
      configuration: { ...configuration, graphNodes: { ...graphNodes, edges: newAllEdges } },
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
      configuration: { ...configuration, graphNodes: { ...graphNodes, edges: newAllEdges } },
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

          <Grid item xs={3} sm={2}>
            <IconButton onClick={resetForm}>
              <ClearIcon />
            </IconButton>
            <IconButton onClick={handleSaveEdge}>
              <SaveIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      {allEdges.map(edge => {
        return (
          <Box key={edge.uuid} p={2} my={1} component={Paper}>
            <Grid container spacing={1} alignItems='flex-end'>
              <Grid item xs={12} sm={3}>
                <Typography variant='body1'>
                  Source id: <strong> {edge.source}</strong>
                </Typography>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant='body1'>
                  Target id: <strong>{edge.target}</strong>
                </Typography>
              </Grid>

              <Grid item xs={9} sm={4}>
                <Typography variant='body1'>
                  Line Text: <strong>{edge.value}</strong>
                </Typography>
              </Grid>

              <Grid item xs={3} sm={2}>
                <IconButton onClick={() => handleDeleteEdge(edge)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => handleEditEdge(edge)}>
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </>
  );
};

export default GraphEdgesSettings;
