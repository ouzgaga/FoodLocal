import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DayScheduleInfo from './DayScheduleInfo';
import MapLocator from './MapLocator';
import AddressInfo from './AddressInfo';

function ProducerInformations(props) {
  const { classes, data } = props;
  const {
    email, website, phoneNumber, salespoint
  } = data.producer;
  const { name, address, schedule } = salespoint;
  const {
    monday, tuesday, wednesday, thursday, friday, saturday, sunday
  } = schedule;

  const {
    longitude, latitude
  } = address;

  return (
    <div>
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

          {/* Affichage de l'horaire d'un producter */}
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

ProducerInformations.propTypes = {
  classes: PropTypes.shape().isRequired,
  data: PropTypes.shape().isRequired,
};

export default ProducerInformations;
