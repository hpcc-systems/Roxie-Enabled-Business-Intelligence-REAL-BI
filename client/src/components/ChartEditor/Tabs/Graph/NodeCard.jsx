import React, { useState } from 'react';
import { IconButton, Typography, Card, CardHeader, Collapse, CardContent } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  cardHeaderRoot: {
    overflow: 'hidden',
  },
  cardHeaderContent: {
    overflow: 'hidden',
  },
}));

const NodeCard = ({ node, handleDeleteNode, handleEditNode }) => {
  const [expanded, setExpanded] = useState(false);

  const classes = useStyles();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        classes={{
          root: classes.cardHeaderRoot,
          content: classes.cardHeaderContent,
        }}
        action={
          <>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </IconButton>
            <IconButton aria-label='settings' onClick={() => handleEditNode(node)}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label='settings' onClick={() => handleDeleteNode(node)}>
              <DeleteIcon />
            </IconButton>
          </>
        }
        title={<Typography noWrap>{node.value.title}</Typography>}
        subheader={<strong>ID: {node.id}</strong>}
      />
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          {node.value.items.map((item, index) => (
            <Typography key={index} variant='body1'>
              <strong>{item.text}</strong> - {item.value}
            </Typography>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default NodeCard;
