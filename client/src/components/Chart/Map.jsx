import React, { useState, useEffect, useCallback } from 'react';

import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { makeStyles } from '@material-ui/core/styles';

import { Divider, Box, Paper, Typography } from '@material-ui/core';
import MaterialIcon from './MaterialIcon';
import _ from 'lodash';

mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const useStyles = makeStyles(() => ({
  popUp: { zIndex: 1, maxWidth: '40%' },
  popUpText: { paddingBottom: '10px' },
  marker: { cursor: 'ponter' },
}));

const Map = ({ chartID, configuration, data }) => {
  const [showPopup, setShowPopup] = useState({});
  const [viewport, setViewport] = useState({
    latitude: 33.79481085083743,
    longitude: -84.36616178412112,
    zoom: 4,
  }); // default Atlanta,GE

  const classes = useStyles();

  const saveToLs = (settings, chartID) => {
    const initialSettings = {
      latitude: settings.latitude,
      longitude: settings.longitude,
      zoom: settings.zoom,
    };
    const stringifySettings = JSON.stringify(initialSettings);
    localStorage.setItem(`${chartID}viewport`, stringifySettings);
  };

  const deboucedSaveToLS = useCallback(_.debounce(saveToLs, 1500), []);

  const handleViewportChange = viewport => {
    deboucedSaveToLS(viewport, chartID);
    setViewport(viewport);
  };

  useEffect(() => {
    const settings = localStorage.getItem(`${chartID}viewport`);
    if (settings) {
      setViewport(JSON.parse(settings));
    }
  }, []);

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0) {
    return null;
  }

  const [emptyMarker, ...mapMarkers] = configuration.mapMarkers;
  data.length = 200; // THIS IS TEMP HACK TO AVOID BIG SETS OF DATA DISPLAY

  const MemoMarker = React.memo(
    ({ latitude, longitude, marker, index }) => {
      const handleMarkerClick = event => {
        event.stopPropagation();
        console.log('i got triggered :>> ');
        setShowPopup(prev => ({ ...prev, [index + marker.id]: true }));
      };
      console.log('MemoMarker :>> ');
      return (
        <Marker latitude={latitude} longitude={longitude}>
          <Box onClick={handleMarkerClick} bgcolor={marker.markerColor} p={0.2} borderRadius={4}>
            <MaterialIcon icon={marker.markerIcon} color={marker.markerColor} />
          </Box>
        </Marker>
      );
    },
    (prevProps, nextProps) => {
      return prevProps.latitude === nextProps.latitude && prevProps.longitude === nextProps.longitude;
    },
  );

  const markers = React.useMemo(() => {
    return data.map((row, index) => {
      console.log('i ran markers :>> ');
      return mapMarkers.map(marker => {
        const latitude = Number(row[marker.latitude]);
        const longitude = Number(row[marker.longitude]);
        return (
          <MemoMarker
            key={index + marker.id}
            index={index}
            latitude={latitude}
            longitude={longitude}
            marker={marker}
          />
        );
      });
    });
  }, []);

  // const MemoPopup = React.memo(
  //   ({ latitude, longitude, marker, index, popUps, row }) => {
  //     console.log('i ran MemoPopup :>> ');
  //     const handleClosePopup = () => setShowPopup(prev => ({ ...prev, [index + marker.id]: false }));
  //     return (
  //       <Popup
  //         className={classes.popUp}
  //         offsetLeft={0}
  //         offsetTop={0}
  //         latitude={latitude}
  //         longitude={longitude}
  //         closeButton={true}
  //         closeOnClick={false}
  //         onClose={handleClosePopup}
  //         anchor='bottom'
  //       >
  //         <Box m={1}>
  //           {popUps.map(popup => (
  //             <Box key={popup.id}>
  //               <Typography component='span' variant='body1'>
  //                 <strong>{popup.label}</strong>:{' '}
  //               </Typography>
  //               <Typography className={classes.popUpText} component='span' variant='body2'>
  //                 {row[popup.datafieldName]}
  //               </Typography>
  //               <Divider />
  //             </Box>
  //           ))}
  //         </Box>
  //       </Popup>
  //     );
  //   },
  //   (prevProps, nextProps) => {
  //     return prevProps.latitude === nextProps.latitude && prevProps.longitude === nextProps.longitude;
  //   },
  // );

  // const popUps = React.useMemo(
  //   () =>
  //     data.map((row, index) => {
  //       console.log('i ran popUps :>> ');
  //       return mapMarkers.map(marker => {
  //         const popUps = _.dropRight(marker.popUpInfo);
  //         if (popUps.length === 0) return;
  //         const latitude = Number(row[marker.latitude]);
  //         const longitude = Number(row[marker.longitude]);
  //         return (
  //           showPopup[index + marker.id] && (
  //             <MemoPopup
  //               latitude={latitude}
  //               longitude={longitude}
  //               marker={marker}
  //               index={index}
  //               popUps={popUps}
  //               row={row}
  //               key={index + marker.id}
  //             />
  //           )
  //         );
  //       });
  //     }),
  //   [showPopup],
  // );

  return (
    <ReactMapGL
      {...viewport}
      width='100%'
      height='100%'
      onViewportChange={handleViewportChange}
      mapStyle='mapbox://styles/chrishuman/ckmus4lae0pew17p3kk58y1ia'
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
    >
      {markers}
      {/* {popUps} */}
    </ReactMapGL>
  );
};

export default Map;
