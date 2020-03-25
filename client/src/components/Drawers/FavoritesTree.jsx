import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import {
  Dashboard as DashboardIcon,
  ExpandMore as ExpandMoreIcon,
  Favorite as FavoriteIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: { flexGrow: 1, marginBottom: theme.spacing(3) },
  button: { margin: `0 ${theme.spacing(1)}px`, minWidth: 25, padding: 0 },
  buttonsDiv: { marginRight: theme.spacing(2) },
  labelIcon: { marginRight: theme.spacing(1) },
  labelRoot: {
    alignItems: 'center',
    display: 'flex',
    padding: theme.spacing(1, 0),
  },
  labelText: { flexGrow: 1 },
  rootText: { fontSize: 20 },
}));

const FavoritesTree = ({ favorites, getDashboardInfo, updateDirectoryObj }) => {
  const { button, buttonsDiv, labelIcon, labelRoot, labelText, root, rootText } = useStyles();

  const rootLabel = <Typography className={rootText}>Favorites</Typography>;

  return (
    <TreeView
      className={root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId="root" label={rootLabel}>
        {favorites.map(({ id, name }) => {
          const label = (
            <div className={labelRoot}>
              <DashboardIcon color="inherit" className={labelIcon} />
              <Typography className={labelText}>{name}</Typography>
              <div className={buttonsDiv}>
                <Button
                  className={button}
                  onClick={() => updateDirectoryObj(id, 'favorite', false)}
                >
                  <FavoriteIcon />
                </Button>
              </div>
            </div>
          );

          return (
            <TreeItem
              key={id}
              nodeId={String(id)}
              label={label}
              onClick={() => getDashboardInfo(id)}
            />
          );
        })}
      </TreeItem>
    </TreeView>
  );
};

export default FavoritesTree;
