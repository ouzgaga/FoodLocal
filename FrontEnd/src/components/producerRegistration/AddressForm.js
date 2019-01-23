import React, { Component, Fragment } from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
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
import MarkerCarotte from '../../img/MarkerCarotte.png';

import { IncriptionProducerContext } from './InscriptionProducer';

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
    const {
      city, country, postcode, road, state, house_number
    } = address.raw.address;

    const { lat, lon } = address.raw;
    handleChangeProperty('city', city);
    handleChangeProperty('country', country);
    handleChangeProperty('postalCode', postcode);
    handleChangeProperty('street', road);
    handleChangeProperty('state', state);
    handleChangeProperty('number', house_number);
    handleChangeProperty('showCompleteAddress', true);
    handleChangeProperty('latitude', lat);
    handleChangeProperty('longitude', lon);
  }

  handleChange = (propertyName, handleChangeProperty) => (e) => {
    handleChangeProperty(propertyName, e.target.value);
  }

  load = (event) => {
    this.setState({ open: true });

    provider.search({ query: event.target.value }).then((results2) => {
      this.setState({
        results: results2,
      });
    });
  }

  changeMarkerPos = handleChangeProperty => (event) => {
    const { lat, lng } = event.target._latlng; // TODO : demander à paul
    handleChangeProperty('latitude', lat);
    handleChangeProperty('longitude', lng);
  }

  render() {
    const { classes } = this.props;
    const { open, results } = this.state;

    return (
      <IncriptionProducerContext>
        {({
          values, handleChangeProperty
        }) => (
            <>
              {values.showCompleteAddress
                ? (
                  <Fragment>
                    <Grid item xs={8}>
                      <Typography variant="body1" className={classes.typo} gutterBottom> Nom de la rue</Typography>
                      <TextField
                        type="text"
                        required
                        className={classes.textField}
                        id="street"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={this.handleChange('street', handleChangeProperty)}
                        defaultValue={values.street}
                      />
                    </Grid>
                    <Grid item xs={4}>

                      <Typography className={classes.typo} variant="body1" gutterBottom> Numéro </Typography>
                      <TextField
                        type="number"
                        required
                        className={classes.textField}
                        id="number"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={this.handleChange('number', handleChangeProperty)}
                        defaultValue={values.number}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography className={classes.typo} variant="body1" gutterBottom> Code postal </Typography>
                      <TextField
                        type="text"
                        required
                        className={classes.textField}
                        id="postalCode"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={this.handleChange('postalCode', handleChangeProperty)}
                        defaultValue={values.postalCode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography className={classes.typo} variant="body1" gutterBottom> Ville </Typography>
                      <TextField
                        type="text"
                        required
                        className={classes.textField}
                        id="city"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={this.handleChange('city', handleChangeProperty)}
                        defaultValue={values.city}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography className={classes.typo} variant="body1" gutterBottom> État </Typography>
                      <TextField
                        type="text"
                        required
                        className={classes.textField}
                        id="countryState"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={this.handleChange('state', handleChangeProperty)}
                        defaultValue={values.state}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography className={classes.typo} variant="body1" gutterBottom> Pays </Typography>
                      <TextField
                        type="text"
                        required
                        className={classes.textField}
                        id="country"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={this.handleChange('country', handleChangeProperty)}
                        defaultValue={values.country}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        {'Carte'}
                      </Typography>
                      <Typography className={classes.typo} variant="caption" gutterBottom>
                        {'Vous pouvez ajuster le repère s\'il ne se trouve pas au bon endroit'}
                      </Typography>

                      <Map key="map" className={classes.map} center={[values.latitude, values.longitude]} zoom={17}>

                        <TileLayer
                          key="tileLayer"
                          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                          url="https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=YrAASUxwnBPU963DZEig"
                        />
                        <Marker draggable position={[values.latitude, values.longitude]} icon={myIcon} onDragEnd={this.changeMarkerPos(handleChangeProperty)} />

                      </Map>
                    </Grid>


                  </Fragment>
                )
                : (
                  <Fragment>
                    <Grid item xs={12}>
                      <Typography className={classes.typo} variant="body1" gutterBottom>
                        {'Adresse'}
                      </Typography>
                      <TextField
                        type="text"
                        required
                        className={classes.textField}
                        id="fullAddress"
                        margin="normal"
                        variant="outlined"
                        multiline
                        placeholder="Nom/numéro du logement + rue/route"
                        fullWidth
                        onChange={this.load}
                      />

                      <Popper open={open} className={classes.popper} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                          >
                            <Paper>
                              <ClickAwayListener onClickAway={this.handleClose}>
                                <MenuList>
                                  {results.map(item => (
                                    <MenuItem key={item.label} onClick={this.chooseItem(item, handleChangeProperty)}>{item.label}</MenuItem>
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
            </>
        )}
      </IncriptionProducerContext>
    );
  }
}


AddressForm.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(styles)(AddressForm);
