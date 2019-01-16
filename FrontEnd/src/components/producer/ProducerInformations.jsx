import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import L from 'leaflet';
import {
  Map, TileLayer, Marker,
} from 'react-leaflet';
import DayScheduleInfo from './DayScheduleInfo';

import MarkerCarotte from '../../img/MarkerCarotte.png';
import MapLocator from './MapLocator';
import AddressInfo from './AddressInfo';

const myIcon = L.icon({
  iconUrl: MarkerCarotte,
  iconSize: [40, 40],
  iconAnchor: [20, 37],
  PopupAnchor: [-20, -20],
});


const styles = theme => ({
  map: {
    height: 400,
  },
});

function ProducerInformations(props) {

  const { classes, data } = props;
  const { email, website, phoneNumber, salespoint } = data.producer;
  const { name, address, schedule } = salespoint;
  const {
    monday, tuesday, wednesday, thursday, friday, saturday, sunday
  } = schedule;

  const {
    longitude, latitude
  } = address;


  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Typography>
            {`Adresse email : ${email}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            {`Téléphone : ${phoneNumber}`}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MapLocator latitude={latitude} longitude={longitude} height={400} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AddressInfo address={address} />
          <br />

          <Typography color="primary">
            {'Horaires'}
          </Typography>
          <DayScheduleInfo dayName="Lundi" data={monday} />
          <DayScheduleInfo dayName="Mardi" data={tuesday} />
          <DayScheduleInfo dayName="Mercredi" data={wednesday} />
          <DayScheduleInfo dayName="Jeudi" data={thursday} />
          <DayScheduleInfo dayName="Vendredi" data={friday} />
          <DayScheduleInfo dayName="Samedi" data={saturday} />
          <DayScheduleInfo dayName="Dimanche" data={sunday} />

        </Grid>

      </Grid>
    </div>
  );
}


export default withStyles(styles)(ProducerInformations);
