import React from 'react';
import L from 'leaflet';
import {
  Map, TileLayer, Marker, Popup, CircleMarker,
} from 'react-leaflet';
import { withStyles } from '@material-ui/core/styles';
import ListItemProducer from './ListItemProducer';
import MarkerCarotte from '../img/MarkerCarotte.png';

const styles = {
  map: {
    backgroundColor: '#CCCCCC',
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
};
const myIcon = L.icon({
  iconUrl: MarkerCarotte,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  PopupAnchor: [-20, -20],
});

function getSalespoints() {
  return fetch('http://api.foodlocal.ch/salespoints?limit=10&page=0')
    .then(res => res.json())
    .catch(err => console.log(err));
}


class MyMap extends React.Component { 
  constructor(props) {
    super(props);

    this.state = {
      location: {
        // par défaut, position de Lausanne
        latitude: 46.5333,
        longitude: 6.6667,
      },
      salespoints: [],
      zoom: 10, // on zoom sur la location de l'utilisateur
      userHasALocation: false, // indique si l'utilisateur a accepté de donner sa position
    };
    getSalespoints().then((res) => {
      this.setState({ salespoints: res });
    });
  }


  componentDidMount() {
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

  loadProducer() {
    return (
      this.state.salespoints.map(tile => (

        <Marker key={tile.id} position={[tile.address.longitude, tile.address.latitude]} icon={myIcon}>
          <Popup key={tile.id} position={[tile.address.longitude, tile.address.latitude]} closeButton={false}>
            <ListItemProducer salepoint={tile} />
          </Popup>
        </Marker>
      ))
    );
  }

  

  render() {
    const { location, zoom, userHasALocation } = this.state;
    const { latitude, longitude } = location;
    const { classes } = this.props;
    return (
      <div className={classes.map}>
        <Map className={classes.map} center={[latitude, longitude]} zoom={zoom} ref={(c) => { this.map = c; }}>

          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=YrAASUxwnBPU963DZEig"
          />

          {
            // si l'utilisateur a accepté de donner sa location, l'affiche sur la carte
            userHasALocation
            && (
              <CircleMarker center={[latitude, longitude]} />
            )
          }
          {
            this.loadProducer()
          }
        </Map>

      </div>
    );
  }
}

export default withStyles(styles)(MyMap);
