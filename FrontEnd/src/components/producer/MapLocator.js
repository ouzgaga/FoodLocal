import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import {
  Map, TileLayer, Marker, CircleMarker
} from 'react-leaflet';

import MarkerCarotte from '../../img/MarkerCarotte.png';

const myIcon = L.icon({
  iconUrl: MarkerCarotte,
  iconSize: [40, 40],
  iconAnchor: [20, 37],
  PopupAnchor: [-20, -20],
});

function MapLocator(props) {
  const {
    longitude, latitude, height, userLocation
  } = props;

  return (
    <Map key="map" style={{ height }} center={[latitude, longitude]} zoom={13}>

      {userLocation
        && <CircleMarker center={[userLocation.latitude, userLocation.longitude]} />
      }

      <TileLayer
        key="tileLayer"
        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=YrAASUxwnBPU963DZEig"
      />
      <Marker position={[latitude, longitude]} icon={myIcon} />
    </Map>
  );
}

MapLocator.propTypes = {
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  userLocation: PropTypes.shape().isRequired,
};

export default (MapLocator);
