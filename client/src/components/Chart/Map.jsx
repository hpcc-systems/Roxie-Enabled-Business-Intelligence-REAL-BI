import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { makeStyles } from '@material-ui/core/styles';
import pinIcon from '../../assets/images/map-pin.svg';
import { Fragment } from 'react';
import { Typography } from '@material-ui/core';

mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const useStyles = makeStyles(theme => ({
  mapError: {
    marginBottom: theme.spacing(2),
    marginTop: 0,
  },
  mapPin: {
    height: 24,
    width: 24,
    transform: 'translate(-50%, -100%)',
  },
  popup: { zIndex: 1 },
}));

const Map = ({ configuration, data }) => {
  const [apiKey, setApiKey] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 44.968243,
    longitude: -103.771556,
    zoom: 2.5,
  });
  const [showPopup, setShowPopup] = useState({});
  const { mapError, mapPin, popup } = useStyles();

  const { axis1: { value: longValue } = {}, axis2: { value: latValue } = {}, mapFields = [] } = configuration;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !longValue || !latValue) {
    return null;
  }

  // Convert necessary values to specified data type
  data = data.map(row => ({
    ...row,
    [longValue]: Number(row[longValue]),
    [latValue]: Number(row[latValue]),
  }));

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get('/api/v1/keys/map_key');
        setApiError(null);
        setApiKey(resp.data.key);
      } catch (error) {
        setApiError(error.response.data.message);
      }
    })();
  }, []);

  return apiError ? (
    <Typography variant='h6' align='center' className={mapError}>
      {apiError}
    </Typography>
  ) : apiKey ? (
    <ReactMapGL
      {...viewport}
      width='100%'
      height={400}
      className='map'
      onViewportChange={viewport => setViewport(viewport)}
      mapStyle='mapbox://styles/chrishuman/ckmus4lae0pew17p3kk58y1ia'
      mapboxApiAccessToken={apiKey}
    >
      {data.map((row, index) => {
        return (
          <Fragment key={index}>
            <Marker latitude={row[latValue]} longitude={row[longValue]}>
              <div onClick={() => setShowPopup({ [index]: true })}>
                <img className={mapPin} src={pinIcon} />
              </div>
            </Marker>
            {showPopup[index] && (
              <Popup
                latitude={row[latValue]}
                longitude={row[longValue]}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setShowPopup({ [index]: false })}
                dynamicPosition={true}
                anchor='top'
                className={popup}
              >
                <div>
                  {mapFields.map(({ label, name }) => {
                    return (
                      <p key={name}>
                        <strong>{label || name}</strong>: {row[name]}
                      </p>
                    );
                  })}
                </div>
              </Popup>
            )}
          </Fragment>
        );
      })}
    </ReactMapGL>
  ) : null;
};

export default Map;
