import React, { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { makeStyles } from '@material-ui/core/styles';
import pinIcon from '../../assets/images/map-pin.svg';
import { Fragment } from 'react';

const useStyles = makeStyles(() => ({
  mapPin: {
    height: 24,
    width: 24,
    transform: 'translate(-50%, -100%)',
  },
  popup: { zIndex: 1 },
}));

const Map = ({ configuration, data }) => {
  const [viewport, setViewport] = useState({
    latitude: 44.968243,
    longitude: -103.771556,
    zoom: 2.5,
  });
  const [showPopup, setShowPopup] = useState({});
  const { mapPin, popup } = useStyles();

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

  return (
    <ReactMapGL
      {...viewport}
      width='100%'
      height={400}
      className='map'
      onViewportChange={viewport => setViewport(viewport)}
      mapStyle='mapbox://styles/chrishuman/ckmus4lae0pew17p3kk58y1ia'
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
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
  );
};

export default Map;
