import React, { Component } from 'react';
import L from 'leaflet';
import {
  Map, TileLayer, Marker, Popup, CircleMarker,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import MapBounds from 'react-leaflet-bounds';
import ListItemProducer from '../ListItemProducer';
import MarkerCarotte from '../../img/MarkerCarotte.png';

const myIcon = L.icon({
  iconUrl: MarkerCarotte,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  PopupAnchor: [-20, -20],
});

function getSalespoints2() {
  const tab = [];
  for (let i = 0; i < 10000; ++i) {
    tab.push({ _id: i, address: { latitude: 46.77 + (i / 1000.0), longitude: 6.65 + (i / 1000.0), } });
  }
  return tab;
}

class Markers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducers: getSalespoints2(),
      markers: [],
    };
  }

  loadProducer() {
    const tab = [];
    getSalespoints2().map(tile => (

      tab.push(<Marker key={tile._id} position={[tile.address.latitude, tile.address.longitude]} icon={myIcon}>
        <Popup key={tile._id} position={[tile.address.latitude, tile.address.longitude]} closeButton={false}>
          <ListItemProducer salepoint={tile} />
        </Popup>
               </Marker>)
    ));
    this.setState({
      markers: tab,
    });
  }

  render() {
    return (
      <MarkerClusterGroup showCoverageOnHover={false} maxClusterRadius={80}>
        {this.state.markers}
      </MarkerClusterGroup>
    );
  }
}
export default Markers;
