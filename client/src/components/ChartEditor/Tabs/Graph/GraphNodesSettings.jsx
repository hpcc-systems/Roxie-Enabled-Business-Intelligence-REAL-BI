import React, { Fragment, useEffect, useState, useRef } from 'react';
import { IconButton, TextField, Button, Paper, Grid, Box } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { v4 as uuidv4 } from 'uuid';
import NodeCard from './NodeCard';

const defaultItem = {
  text: '', //Add New Node field
  value: '', //Add New Node value
  icon: '', //item icon
};

const defaultNode = {
  uuid: '',
  id: '',
  value: {
    title: '', //Add New Node Title
    items: [{ ...defaultItem }], //items are optional and  all values inside are optional
  },
};

function GraphNodeSettings(props) {
  const graphChart = props.localState.configuration.graphChart;
  const allNodes = graphChart.nodes;

  const configuration = props.localState.configuration;
  const formFieldsUpdate = props.formFieldsUpdate;

  const [node, setNode] = useState({ ...defaultNode });
  const [isEditing, setEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleNodeChange = e => {
    const fieldName = e.target.name;
    if (fieldName === 'id') {
      setNode(prev => ({ ...prev, [fieldName]: e.target.value }));
    } else {
      setNode(prev => ({ ...prev, value: { ...prev.value, [fieldName]: e.target.value } }));
    }
  };

  const handleItemChange = (e, index) => {
    const fieldName = e.target.name;
    const currentItem = node.value.items[index];
    const newItem = { ...currentItem, [fieldName]: e.target.value };
    const newItemsList = [...node.value.items];
    newItemsList[index] = newItem;
    // add default item to end of array if all values are present
    if (newItem.text && newItem.value && node.value.items.length - 1 === index)
      newItemsList.push({ ...defaultItem });
    setNode(prev => ({ ...prev, value: { ...prev.value, items: newItemsList } }));
  };

  const handleDeleteItem = index => {
    const filteredItems = node.value.items.filter((el, indx) => indx !== index);
    if (filteredItems.length === 0) filteredItems.push({ ...defaultItem });
    setNode(prev => ({ ...prev, value: { ...prev.value, items: filteredItems } }));
  };

  const handleSaveNode = () => {
    if (!node.id || !node.value.title) return;
    const itemsList = node.value.items;
    if (!itemsList[itemsList.length - 1].text && !itemsList[itemsList.length - 1].value) itemsList.pop(); // remove empty value from items list
    let newAllNodes = [...allNodes];
    const index = newAllNodes.findIndex(el => el.uuid === node.uuid);
    if (index === -1) {
      node.uuid = uuidv4();
      newAllNodes.push(node);
    } else {
      newAllNodes[index] = node;
    }
    formFieldsUpdate({
      configuration: { ...configuration, graphChart: { ...graphChart, nodes: newAllNodes } },
    });

    resetForm();
  };

  const resetForm = () => {
    setNode(() => ({ ...defaultNode, value: { ...defaultNode.value, items: [{ ...defaultItem }] } })); // reset form values
    if (isEditing) setEditing(false);
  };

  const handleEditNode = editedNode => {
    if (editedNode.value.items.length === 0) editedNode.value.items.push({ ...defaultItem });
    setNode(editedNode);
    setEditing(true);
  };

  const handleDeleteNode = node => {
    const newAllNodes = allNodes.filter(el => el.uuid !== node.uuid);
    formFieldsUpdate({
      configuration: { ...configuration, graphChart: { ...graphChart, nodes: newAllNodes } },
    });
  };

  return (
    <>
      <Box p={1} my={1} component={Paper}>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item xs={12} sm={5}>
            <TextField
              inputRef={inputRef}
              name='id'
              required={!!node.value.title}
              value={node.id}
              onChange={handleNodeChange}
              fullWidth
              label='ID'
              placeholder='Should be a unique integer ex. 1, 2, 3 or -1, -2, -3'
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name='title'
              required={!!node.id}
              value={node.value.title}
              onChange={handleNodeChange}
              fullWidth
              label='Title'
              placeholder='Name of the node'
            />
          </Grid>
          {node.value.items.map((item, index) => {
            return (
              <Fragment key={index}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    name='text'
                    value={item.text}
                    onChange={e => handleItemChange(e, index)}
                    label='Node field text'
                    placeholder='Text inside a node'
                  />
                </Grid>

                <Grid item xs={9} sm={6}>
                  <TextField
                    fullWidth
                    name='value'
                    value={item.value}
                    onChange={e => handleItemChange(e, index)}
                    label='Node field Value'
                    placeholder='Associated value with field'
                  />
                </Grid>

                <Grid item xs={3} sm={1}>
                  <IconButton size='small' onClick={() => handleDeleteItem(index)} component='button'>
                    <ClearIcon />
                  </IconButton>
                </Grid>
              </Fragment>
            );
          })}
        </Grid>
        <Box mt={2} mr={2} textAlign='right'>
          <Box component={Button} mr={2} variant='contained' onClick={resetForm} size='small'>
            Cancel
          </Box>
          <Button variant='contained' onClick={handleSaveNode} size='small'>
            {isEditing ? 'Edit Node' : 'Create New Node'}
          </Button>
        </Box>
      </Box>
      <Grid item container spacing={1}>
        {allNodes.map(node => (
          <Grid key={node.uuid} item xs={12} sm={4}>
            <NodeCard node={node} handleEditNode={handleEditNode} handleDeleteNode={handleDeleteNode} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default GraphNodeSettings;
