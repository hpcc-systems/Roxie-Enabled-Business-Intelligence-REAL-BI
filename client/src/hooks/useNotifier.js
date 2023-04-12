import React from 'react';
import { Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';

const useNotifier = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const closeSnackbarButton = key => {
    const onClose = () => closeSnackbar(key);
    return <Button onClick={onClose}>Dismiss</Button>;
  };

  const notifyResult = (type, message, position = null) => {
    if (type === 'error') {
      enqueueSnackbar(message, {
        anchorOrigin: { horizontal: 'right', vertical: position || 'top' },
        variant: 'error',
        preventDuplicate: true,
      });
    }
    if (type === 'Add') {
      enqueueSnackbar('New item has been added to dashboard', {
        variant: 'success',
        anchorOrigin: {
          vertical: position || 'bottom',
          horizontal: 'left',
        },
      });
    }
    if (type === 'Delete') {
      enqueueSnackbar('Item deleted successfully!', {
        variant: 'success',
        anchorOrigin: {
          vertical: position || 'bottom',
          horizontal: 'left',
        },
      });
    }
    if (type === 'warning') {
      enqueueSnackbar(message, {
        anchorOrigin: { horizontal: 'center', vertical: position || 'bottom' },
        variant: 'warning',
        action: closeSnackbarButton,
      });
    }
    if (type === 'info') {
      enqueueSnackbar(message, {
        anchorOrigin: { horizontal: 'center', vertical: position || 'bottom' },
        variant: 'info',
        action: closeSnackbarButton,
      });
    }

    if (type === 'success') {
      enqueueSnackbar(message, {
        variant: 'success',
        autoHideDuration: 3000,
        preventDuplicate: true,
        anchorOrigin: {
          vertical: position || 'bottom',
          horizontal: 'left',
          preventDuplicate: true,
        },
      });
    }
  };
  return notifyResult;
};

export default useNotifier;
