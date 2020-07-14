import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import {
  Dashboard as DashboardIcon,
  ExpandMore as ExpandMoreIcon,
  FavoriteTwoTone as FavoriteTwoToneIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  button: { margin: `0 ${theme.spacing(1)}px`, minWidth: 25, padding: 0 },
  buttonsDiv: { padding: theme.spacing(1, 0) },
  itemDiv: { display: 'flex' },
  labelDiv: { display: 'flex', padding: theme.spacing(1, 0) },
  labelIcon: { marginRight: theme.spacing(1) },
  labelText: { flexGrow: 1 },
  redIcon: { color: red[500] },
  root: { marginBottom: theme.spacing(3) },
  rootText: { fontSize: 20 },
  treeItem: { flexGrow: 1 },
}));

const FavoritesTree = ({ favorites, getDashboardInfo, updateDirectoryObj }) => {
  const {
    button,
    buttonsDiv,
    itemDiv,
    labelDiv,
    labelIcon,
    labelText,
    redIcon,
    root,
    rootText,
    treeItem,
  } = useStyles();

  const rootLabel = <Typography className={rootText}>Favorites</Typography>;

  return (
    <TreeView
      className={root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId='root' label={rootLabel}>
        {favorites.map(({ id, name }) => {
          const label = (
            <div className={labelDiv}>
              <DashboardIcon color='inherit' className={labelIcon} />
              <Typography className={labelText}>{name}</Typography>
            </div>
          );

          return (
            <div key={id} className={itemDiv}>
              <TreeItem
                className={treeItem}
                nodeId={String(id)}
                label={label}
                onClick={() => getDashboardInfo(id)}
              />
              <div className={buttonsDiv}>
                <Button className={button} onClick={() => updateDirectoryObj(id, 'favorite', false)}>
                  <FavoriteTwoToneIcon className={redIcon} />
                </Button>
              </div>
            </div>
          );
        })}
      </TreeItem>
    </TreeView>
  );
};

export default FavoritesTree;
