import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';

function DayScheduleInfo(props) {
  const { dayName, data } = props;

  return (

    <Grid container spacing={24}>

      <Grid item xs={4}>
        <Typography>
          {`${dayName} :`}
        </Typography>
      </Grid>

      <Grid item xs={4}>

        {data.length === 0
          ? (
            <Typography>
              {'Fermé'}
            </Typography>
          )
          : (
            <Typography>
              {`${data[0].openingHour} - ${data[0].closingHour}`}
            </Typography>
          )}
      </Grid>

      <Grid item xs={4}>
        {data.length === 2 && (
          <Typography>
            {`${data[1].openingHour} - ${data[1].closingHour}`}
          </Typography>
        )}
      </Grid>

    </Grid>
  );
}

DayScheduleInfo.propTypes = {
  dayName: PropTypes.string.isRequired,
  data: PropTypes.shape().isRequired
};

export default DayScheduleInfo;
