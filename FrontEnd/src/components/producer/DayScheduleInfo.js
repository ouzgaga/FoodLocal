import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';

const styles = {
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    widht: 1000,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
};


function DayScheduleInfo(props) {

  const { classes, dayName, data } = props;


  return (

    <Grid container spacing={24}>

      <Grid item xs={4}>
        <Typography>
          {`${dayName} :`}
        </Typography>
      </Grid>

      <Grid item xs={4}>

        {data.length === 0 ? (
          <Typography>
            {'Fermé'}
          </Typography>
        ) : (
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
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DayScheduleInfo);