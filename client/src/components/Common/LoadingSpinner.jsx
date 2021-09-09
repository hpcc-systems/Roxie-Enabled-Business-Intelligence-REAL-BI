import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';

function LoadingSpinner(props) {
  const { text, textStyle, size, ...restProps } = props;
  return (
    <Box display='flex' alignItems='center' {...restProps}>
      {text && (
        <Box marginRight={2}>
          <Typography variant={textStyle}>{text}</Typography>
        </Box>
      )}
      <Box>
        <CircularProgress color='inherit' size={size} />
      </Box>
    </Box>
  );
}

export default LoadingSpinner;
