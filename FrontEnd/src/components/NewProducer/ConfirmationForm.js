import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root:{
    textAlign: 'center',
  },
  typography:{
    margin: '0 auto',
  },
};

function ConfirmationForm(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Typography className={classes.typography} variant="h3">
        {'Félicitations'}
      </Typography>
      <Typography className={classes.typography} variant="h6">
        {'Votre point de vente a bien été créé'}
      </Typography>
      <Typography className={classes.typography} variant="h6">
        {'Ce dernier sera visible une fois qu\'il aura été validé par l\'équipe FoodLocal'}
      </Typography>
    </div>
  );
}

ConfirmationForm.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(styles)(ConfirmationForm);
