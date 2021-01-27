import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';

// React Components
import ChartTile from '../Dashboard/ChartTile';

// Create styles
const useStyles = makeStyles(theme => ({
  typography: {
    margin: '0',
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
}));

const PdfPreview = ({ charts, compData, dashboard, localState }) => {
  const { headerURI } = localState;
  const { typography } = useStyles();

  return (
    <div id='pdfPreview'>
      <Container maxWidth='xl'>
        {headerURI ? (
          <img src={headerURI} style={{ width: '100%' }} alt='header' />
        ) : (
          <Typography align='center' variant='h4' color='inherit' className={typography}>
            {dashboard.name}
          </Typography>
        )}

        <Grid container direction='row' spacing={3}>
          {_.orderBy(charts, [({ configuration }) => configuration.sort], ['asc']).map((chart, index) => {
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
