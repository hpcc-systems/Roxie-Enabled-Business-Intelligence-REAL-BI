/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapIcons from './MapIcons';
import mapboxgl from '!mapbox-gl';
import _ from 'lodash';

const useStyles = makeStyles(() => ({
  mapWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  mapContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  popup: { width: '240px' },
}));

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function Map({ chartID, configuration, data }) {
  const classes = useStyles();
  const mapContainer = useRef(null);

  const mapWrapper = useRef(null);

  const [map, setMap] = useState(null);

  const [settings, setSettings] = useState({
    longitude: -73.935242,
    latitude: 40.73061,
    zoom: 9,
  });

  const saveToLs = (settings, chartID) =>
    localStorage.setItem(`${chartID}viewport`, JSON.stringify(settings));

  const deboucedSaveToLS = _.debounce(saveToLs, 1000);

  useEffect(() => {
    //creating array of features to show on map
    const [emptyMarker, ...mapMarkers] = configuration.mapMarkers;

    const geoFeatures = data
      .map(row =>
        mapMarkers.map(marker => {
          //first el in marker.popUpInfo is always empty, we dont want to loop over it
          const popUps = _.dropRight(marker.popUpInfo);
          return {
            type: 'Feature',
            properties: {
              icon: marker.markerIcon,
              color: marker.markerColor,
              popup: popUps.map(el => ({ ...el, data: row[el.datafieldName] })),
            },
            geometry: {
              type: 'Point',
              coordinates: [Number(row[marker.longitude]), Number(row[marker.latitude])],
            },
          };
        }),
      )
      .flat(Infinity);

    // getting settings from LS
    const LSsettings = localStorage.getItem(`${chartID}viewport`);
    let cashedSettings;
    if (LSsettings) {
      cashedSettings = JSON.parse(LSsettings);
      setSettings(cashedSettings);
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      // style: 'mapbox://styles/chrishuman/ckmus4lae0pew17p3kk58y1ia',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [
        parseFloat(cashedSettings.longitude) || settings.longitude,
        parseFloat(cashedSettings.latitude) || settings.latitude,
      ],
      zoom: parseFloat(cashedSettings.zoom) || settings.zoom,
    })
      .addControl(new mapboxgl.FullscreenControl())
      .addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));

    map.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'imperial',
      }),
    );

    map.on('move', () => {
      const currentSettings = {
        longitude: map.getCenter().lng.toFixed(4),
        latitude: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      };
      deboucedSaveToLS(currentSettings, chartID);
      setSettings(currentSettings);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'data', function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'data', function () {
      map.getCanvas().style.cursor = '';
    });

    //Main event, adding source and layer.
    map.on('load', async function () {
      //In order to use addImage() we need to provide HTMLimageDOMelment and it doesnt want to work synchronosly.
      const imgPromises = Promise.all(
        mapMarkers.map(
          marker =>
            new Promise(resolve => {
              const img = document.createElement('img');
              img.style.width = 48;
              img.style.height = 48;
              img.src = MapIcons[marker.markerIcon];
              resolve({ domElement: img, iconName: marker.markerIcon });
            }),
        ),
      );

      imgPromises.then(imgs => {
        imgs.forEach(img => {
          if (!map.hasImage(img.iconName)) {
            map.addImage(img.iconName, img.domElement, { sdf: true });
          }
        });

        // Add a data source containing one point feature.
        map.addSource('chart', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: geoFeatures,
          },
        });

        // Add a layer to use the image to represent the data.
        map.addLayer({
          id: 'data',
          type: 'symbol',
          source: 'chart', // reference the data source
          layout: {
            'icon-allow-overlap': true,
            'icon-image': ['get', 'icon'], // reference the image
            'icon-size': 0.5,
          },
          paint: {
            'icon-color': ['get', 'color'],
            'icon-halo-color': '#ffffff',
            'icon-halo-blur': 1,
            'icon-halo-width': 1,
          },
        });
      });

      // Creating Popup
      map.on('click', function (e) {
        map.resize();
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['data'],
        });
        if (!features.length) return;
        const feature = features[0];
        const isZoomed = map.getZoom().toFixed(2) > 11;

        const flyObject = {
          center: feature.geometry.coordinates,
          speed: 0.4,
        };

        if (!isZoomed) flyObject.zoom = 11;

        map.flyTo(flyObject);

        const popupArray = JSON.parse(feature.properties.popup);

        const text = popupArray
          .map(popup => `<p><strong>${popup.label.toUpperCase()}</strong> : ${popup.data}</p>`)
          .join('');

        const popup = new mapboxgl.Popup({
          offset: [115, -20],
          anchor: 'center',
          className: classes.popup,
        })
          .setLngLat(feature.geometry.coordinates)
          .setHTML(text)
          .addTo(map);
      });
    });
    //setting map to state if we need to reference it later
    setMap(map);
    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div ref={mapWrapper} className={classes.mapWrapper}>
      <div ref={mapContainer} className={classes.mapContainer} />
    </div>
  );
}

export default Map;
