import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 1200,
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
  },
  leftBox: {
    flexGrow: 1,
    maxWidth: 128,
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
  },
  adress: {
    paddingLeft: 10,
  },
});

function AdressContainer(props) {
  const { classes, road, city, country } = props;

  return (
    <div className={classes.root}>
      <Typography variant="h6">
        Adresse
      </Typography>
      <div className={classes.adress}>
        <Typography color="secondary">
          {road}
        </Typography>
        <Typography color="secondary">
          {city}
        </Typography>
        <Typography color="secondary">
          {country}
        </Typography>
      </div>
    </div>
  );
}

AdressContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  road: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,

};
export default withStyles(styles)(AdressContainer);