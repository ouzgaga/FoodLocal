import React, { Component, Fragment } from 'react';
import L from 'leaflet';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import {
  Map, TileLayer, Marker,
} from 'react-leaflet';
import MarkerCarotte from '../../../img/MarkerCarotte.png';

import AddressSuggest from './AddressSuggest';
import AddressInput from './AddressInput';
import { IncriptionProducerContext } from '../InscriptionProducer';

const myIcon = L.icon({
  iconUrl: MarkerCarotte,
  iconSize: [40, 40],
  iconAnchor: [20, 37],
  PopupAnchor: [-20, -20],
});

const provider = new OpenStreetMapProvider({
  params: {
    addressdetails: 1,
    countrycodes: 'CH',
  },
});

const styles = {
  popper: {
    zIndex: 2000,
  },
  root: {
    maxWidth: 600,
  },
  textField: {
    margin: 0,
    padding: 0,
  },
  typo: {
    marginBottom: 0,
  },
  typo2: {
    width: 30,
  },
  typo3: {
    marginLeft: 10,
    marginRight: 10,
  },
  map: {
    height: 400,
  },
};

class AddressForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      open: false,
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  chooseItem = (address, handleChangeProperty) => (e) => {
    e.preventDefault();
    this.setState({ open: false });
    console.log(address)
    const {
      city, country, postcode, road, state, house_number
    } = address.raw.address;

    const { lat, lon } = address.raw;
    handleChangeProperty('addressCity', city);
    handleChangeProperty('addressCountry', country);
    handleChangeProperty('addressZip', postcode);
    handleChangeProperty('addressRoad', road);
    handleChangeProperty('addressCountryState', state);
    handleChangeProperty('addressNumber', house_number);
    handleChangeProperty('showCompleteAddress', true);
    handleChangeProperty('addressLatitude', lat);
    handleChangeProperty('addressLongitude', lon);
  }


  load = (event) => {
    this.setState({ open: 'true' });

    provider.search({ query: event.target.value }).then((results2) => {
      this.setState({
        results: results2,
      });
    });
  }

  changeMarkerPos = handleChangeProperty => (event) => {
    const { lat, lng } = event.target._latlng; // TODO : demander à paul
    handleChangeProperty('addressLatitude', lat);
    handleChangeProperty('addressLongitude', lng);
  }

  render() {
    const { classes } = this.props;

    return (
      <IncriptionProducerContext>
        {({
          values, handleChangeProperty, handleChange
        }) => (

            <Fragment>
              {values.showCompleteAddress
                ? (
                  <Fragment>
                    <Grid item xs={8}>
                      <Typography variant="body1" className={classes.typo} gutterBottom> Nom de la rue</Typography>
                      <TextField
                        className={classes.textField}
                        id="road"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange('addressRoad')}
                        defaultValue={values.addressRoad}
                      />
                    </Grid>
                    <Grid item xs={4}>

                      <Typography className={classes.typo} variant="body1" gutterBottom> Numéro </Typography>
                      <TextField
                        className={classes.textField}
                        id="addressNumber"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange('addressNumber')}
                        defaultValue={values.addressNumber}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography className={classes.typo} variant="body1" gutterBottom> Code postal </Typography>
                      <TextField
                        className={classes.textField}
                        id="zip"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange('addressZip')}
                        defaultValue={values.addressZip}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography className={classes.typo} variant="body1" gutterBottom> Ville </Typography>
                      <TextField
                        className={classes.textField}
                        id="zip"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange('addressCity')}
                        defaultValue={values.addressCity}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography className={classes.typo} variant="body1" gutterBottom> État </Typography>
                      <TextField
                        className={classes.textField}
                        id="countryState"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange('addressCountryState')}
                        defaultValue={values.addressCountryState}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography className={classes.typo} variant="body1" gutterBottom> Pays </Typography>
                      <TextField
                        className={classes.textField}
                        id="country"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange('addressCountry')}
                        defaultValue={values.addressCountry}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        {'Carte'}
                      </Typography>
                      <Typography className={classes.typo} variant="caption" gutterBottom>
                        {'Vous pouvez ajuster le repère s\'il ne se trouve pas au bon endroit'}
                      </Typography>

                      <Map key="map" className={classes.map} center={[values.addressLatitude, values.addressLongitude]} zoom={17}>

                        <TileLayer
                          key="tileLayer"
                          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                          url="https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=YrAASUxwnBPU963DZEig"
                        />
                        <Marker draggable position={[values.addressLatitude, values.addressLongitude]} icon={myIcon} onDragEnd={this.changeMarkerPos(handleChangeProperty)} />

                      </Map>
                    </Grid>


                  </Fragment>
                ) : (
                  <Fragment>
                    <Grid item xs={12}>
                      <Typography className={classes.typo} variant="body1" gutterBottom> Adresse </Typography>
                      <TextField
                        className={classes.textField}
                        id="fullAddress"
                        margin="normal"
                        variant="outlined"
                        multiline
                        placeholder="Nom/numéro du logement + rue/route"
                        fullWidth
                        onChange={this.load}
                      />

                      <Popper open={this.state.open} className={classes.popper} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                          >
                            <Paper>
                              <ClickAwayListener onClickAway={this.handleClose}>
                                <MenuList>
                                  {this.state.results.map(item => (
                                    <MenuItem onClick={this.chooseItem(item, handleChangeProperty)}>{item.label}</MenuItem>
                                  ))}
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </Grid>

                  </Fragment>
                )
              }
            </Fragment>
          )
        }
      </IncriptionProducerContext>
    );
  }
}

export default withStyles(styles)(AddressForm);
