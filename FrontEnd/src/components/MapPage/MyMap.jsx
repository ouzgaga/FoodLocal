import React from 'react';
import L from 'leaflet';
import {
  Map, TileLayer, Marker, Popup, CircleMarker,
} from 'react-leaflet';
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';

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

    this.state = {
      items: [],

      location: {
        // par défaut, position de Lausanne
        latitude: 46.5333,
        longitude: 6.6667,
      },
      zoom: 8, // on zoom sur la location de l'utilisateur
      salespoints: [],
      userHasALocation: false, // indique si l'utilisateur a accepté de donner sa position
    };
  }

  componentDidMount() {
    this.setState({
      location: {
        // par défaut, position de Lausanne
        latitude: 46.533,
        longitude: 6.667,
      },
      zoom: 10, // on zoom sur la location de l'utilisateur
    });

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        zoom: 12, // on zoom sur la location de l'utilisateur
        userHasALocation: true,
      });
    });
  }


  // ouvre le pop-up pour les filtres
  handleClickOpenFilters = () => {
    this.setState({ openFiltres: true });
  };

  // ferme le pop-up des filtres
  handleClose = () => {
    this.setState({ openFiltres: false });
  };

  addItem = newItem => () => {
    const { items } = this.state;
    this.setState({
      items: [...items, newItem]
    });
  }

  // supprime un produit du tableau des produits
  removeItem = itemToDelete => () => {
    const { items } = this.state;
    const newItems = items.filter(item => item !== itemToDelete);

    this.setState({
      items: [...newItems]
    });
  }

  render() {
    const { location, zoom, userHasALocation } = this.state;
    const { latitude, longitude } = location;
    const { classes, data, items, addItem, removeItem } = this.props;


    return (

      <div className={classes.map}>

        <FilterProducts items={items} addItem={addItem} removeItem={removeItem} />
        <Map key="map" className={classes.map} center={[latitude, longitude]} zoom={zoom} ref={(c) => { this.map = c; }}>

          <TileLayer
            key="tileLayer"
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=YrAASUxwnBPU963DZEig"
          />

          {
            // si l'utilisateur a accepté de donner sa location, l'affiche sur la carte
            userHasALocation
            && (
              <CircleMarker key="userPosition" center={[this.state.location.latitude, longitude]} />
            )
          }

          {
            data.producers.map(tile => (
              tile.salesPoint !== null && (
                this.props.iconDrag === tile.id ? (
                  <Marker key={tile.id} position={[tile.salesPoint.address.latitude, tile.salesPoint.address.longitude]} icon={myIcon2}>
                    <Popup key={tile.id} position={[tile.salesPoint.address.latitude, tile.salesPoint.address.longitude]} closeButton={false}>
                      <ItemProducerPopUp producer={tile} />
                    </Popup>
                  </Marker>
                ) : (
                    <Marker key={tile.id} position={[tile.salesPoint.address.latitude, tile.salesPoint.address.longitude]} icon={myIcon}>
                      <Popup key={tile.id} position={[tile.salesPoint.address.latitude, tile.salesPoint.address.longitude]} closeButton={false}>
                        <ItemProducerPopUp producer={tile} />
                      </Popup>
                    </Marker>
                  )
              )))}
        </Map>
      </div>
    );
  }
}

export default withStyles(styles)(withMobileDialog()(MyMap));
