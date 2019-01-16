import React from 'react';
import Typography from '@material-ui/core/Typography';

import L from 'leaflet';
import {
  Map, TileLayer, Marker,
} from 'react-leaflet';
import DayScheduleInfo from './DayScheduleInfo';

import MarkerCarotte from '../../img/MarkerCarotte.png';

const myIcon = L.icon({
  iconUrl: MarkerCarotte,
  iconSize: [40, 40],
  iconAnchor: [20, 37],
  PopupAnchor: [-20, -20],
});

function MapLocator(props) {
  const {
    longitude, latitude, height
  } = props;

  return (
    <Map key="map" style={{ height }} center={[latitude, longitude]} zoom={15}>

      <Typography>{height}</Typography>
      <TileLayer
        key="tileLayer"
        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=YrAASUxwnBPU963DZEig"
      />
      <Marker position={[latitude, longitude]} icon={myIcon} />
    </Map>
  );
}


export default (MapLocator);
