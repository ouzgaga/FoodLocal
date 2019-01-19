import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import {
  Map, TileLayer, Marker, Popup, CircleMarker,
} from 'react-leaflet';
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import MarkerCarotte from '../../img/MarkerCarotte.png';
import ItemProducerPopUp from './ItemProducerPopUp';

const styles = {
  map: {
    backgroundColor: '#CCCCCC',
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    height: 'calc(100vh - 64px)',
  },
  media: {
    height: 80,
    width: 80,
  },
  media2: {
    height: 80,
    width: 80,
    backgroundColor: '#66CCCC',
  },
};

// Marker pour la carte
const myIcon = L.icon({
  iconUrl: MarkerCarotte,
  iconSize: [40, 40],
  iconAnchor: [20, 37],
  PopupAnchor: [-20, -20],
});

function MyMap(props) {
  const {
    classes, producers, location, onLoadMore
  } = props;
  const { latitude, longitude } = location;

  return (

    <div className={classes.map}>

      <Map
        key="map"
        className={classes.map}
        center={[latitude, longitude]}
        zoom={12}
        maxZoom={20}
        onViewportChanged={(e) => { onLoadMore(e.center[0], e.center[1]); }}
      >

        {/* Layer utilisé pour afficher la carte */}
        <TileLayer
          key="tileLayer"
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=YrAASUxwnBPU963DZEig"
        />

        {/* Indique la position de l'utilisateur sur la carte */}
        <CircleMarker key="userPosition" center={[latitude, longitude]} />

        {/* Groupe les markers sur en cluster sur la carte */}
        <MarkerClusterGroup>
          {
            producers.map(({ node }) => (
              node.salespoint !== null && (
                <Marker key={node.id} position={[node.salespoint.address.latitude, node.salespoint.address.longitude]} icon={myIcon}>
                  <Popup key={node.id} position={[node.salespoint.address.latitude, node.salespoint.address.longitude]} closeButton={false}>
                    <ItemProducerPopUp producer={node} />
                  </Popup>
                </Marker>
              )
            ))}
        </MarkerClusterGroup>
      </Map>
    </div>
  );
}

MyMap.propTypes = {
  classes: PropTypes.shape().isRequired,
  producers: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default withStyles(styles)(withMobileDialog()(MyMap));
