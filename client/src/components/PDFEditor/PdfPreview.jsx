import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// React Components
import ChartTile from '../Dashboard/ChartTile';

// Utils
import { sortArr } from '../../utils/misc';

// Create styles
const useStyles = makeStyles(theme => ({
  typography: {
    margin: '0',
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
}));

const PdfPreview = ({ charts, compData, dashboard }) => {
  const { typography } = useStyles();

  return (
    <div id='pdfPreview'>
      <Container maxWidth='xl'>
        <Typography align={'center'} variant={'h4'} color={'inherit'} className={typography}>
          {dashboard.name}
        </Typography>
        <Grid container direction='row' spacing={3}>
          {sortArr(charts, 'configuration::sort').map((chart, index) => {
            return (
              <ChartTile
                key={index}
                chart={chart}
                compData={compData}
                dashboard={dashboard}
                pdfPreview={true}
              />
            );
          })}
        </Grid>
      </Container>
    </div>
  );
};

export default PdfPreview;
