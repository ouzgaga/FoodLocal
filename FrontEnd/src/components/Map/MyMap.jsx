import React from 'react';
import {
  Map, TileLayer, Viewport, CircleMarker,
} from 'react-leaflet';
import { withStyles } from '@material-ui/core/styles';
import CanvasMarkersLayer from '../CanvasMarkerLayer';

import ListItemProducer from '../ListItemProducer';
import Markers from './Markers';

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


function getSalespoints() {
  return fetch('http://api.foodlocal.ch/salespoints?limit=10&page=0')
    .then(res => res.json())
    .catch(err => console.log(err));
}

function getSalespoints2() {
  const tab = [];
  for (let i = 0; i < 1000; ++i) {
    tab.push({ address: { latitude: 46.77 + (i / 1000.0), longitude: 6.65 + (i / 1000.0), } });
  }
  return tab;
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
      zoom: 8, // on zoom sur la location de l'utilisateur
      salespoints: getSalespoints2(),
      userHasALocation: false, // indique si l'utilisateur a accepté de donner sa position
      markers: [],
      viewport: {},
    };

    /*
getSalespoints().then((res) => {
  this.setState({ salespoints: res });
});
*/
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
        zoom: 15, // on zoom sur la location de l'utilisateur
        userHasALocation: true,
      });
    });
  }
 
  onViewportChanged = (viewport: Viewport) => {
    this.child.loadProducer(viewport);
  }

  render() {
    const { location, zoom, userHasALocation } = this.state;
    const { latitude, longitude } = location;
    const { classes } = this.props;
    return (
      <Map
        key="map"
        className={classes.map}
        center={[latitude, longitude]}
        zoom={zoom}
        maxZoom={19}
        onViewportChanged={this.onViewportChanged}
        ref={(c) => { this.state.map = c; }}
      >

        <TileLayer
          key="tileLayer"
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=YrAASUxwnBPU963DZEig"
        />
        {
          userHasALocation
          && (
            <CircleMarker key="userPosition" center={[this.state.location.latitude, longitude]} />
          )
        }
        <Markers ref={(markers) => { this.child = markers; }} />

      </Map>

    );
  }
}

export default withStyles(styles)(MyMap);
