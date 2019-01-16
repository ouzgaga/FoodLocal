import React from 'react';
import L from 'leaflet';
import {
  Map, TileLayer, Marker, Popup, CircleMarker,
} from 'react-leaflet';
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import MarkerCarotte from '../../img/MarkerCarotte.png';
import FilterProducts from './FilterProducts';
import ItemProducerPopUp from './ItemProducerPopUp';

const styles = {
  map: {
    backgroundColor: '#CCCCCC',
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    height: 'calc(100vh - 114px)',
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    height: 50,
    width: '100%',
    borderBottom: '1px solid grey',
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
const myIcon = L.icon({
  iconUrl: MarkerCarotte,
  iconSize: [40, 40],
  iconAnchor: [20, 37],
  PopupAnchor: [-20, -20],
});

const myIcon2 = L.icon({
  iconUrl: MarkerCarotte,
  iconSize: [100, 100],
  iconAnchor: [50, 95],
  PopupAnchor: [-20, -20],
});

class MyMap extends React.Component {
  constructor(props) {
    super(props);
  }

  // ouvre le pop-up pour les filtres
  handleClickOpenFilters = () => {
    this.setState({ openFiltres: true });
  };

  // ferme le pop-up des filtres
  handleClose = () => {
    this.setState({ openFiltres: false });
  };


  render() {
    const { classes, producers, products, addProduct, removeProduct, location, maxDistance, changeMaxDistance } = this.props;
    const { latitude, longitude } = location;


    return (

      <div className={classes.map}>

        <Map key="map" className={classes.map} center={[latitude, longitude]} zoom={12} maxZoom={20}>

          <TileLayer
            key="tileLayer"
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=YrAASUxwnBPU963DZEig"
          />

          <CircleMarker key="userPosition" center={[latitude, longitude]} />

          <MarkerClusterGroup>

            {
              producers.map(({ node }) => (
                node.salespoint !== null && (


                  this.props.iconDrag === node.id
                    ? (
                      <Marker key={node.id} position={[node.salespoint.address.latitude, node.salespoint.address.longitude]} icon={myIcon2}>
                        <Popup key={node.id} position={[node.salespoint.address.latitude, node.salespoint.address.longitude]} closeButton={false}>
                          <ItemProducerPopUp producerId={node.id} />
                        </Popup>
                      </Marker>
                    )
                    : (
                      <Marker key={node.id} position={[node.salespoint.address.latitude, node.salespoint.address.longitude]} icon={myIcon}>
                        <Popup key={node.id} position={[node.salespoint.address.latitude, node.salespoint.address.longitude]} closeButton={false}>
                          <ItemProducerPopUp producerId={node.id} />
                        </Popup>
                      </Marker>
                    )

                )))}
          </MarkerClusterGroup>

        </Map>
      </div>
    );
  }
}

export default withStyles(styles)(withMobileDialog()(MyMap));
