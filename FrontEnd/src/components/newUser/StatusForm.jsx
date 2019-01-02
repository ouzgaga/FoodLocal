import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import { withStyles } from '@material-ui/core';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
});

const INFO_PRODUCER = (

  <React.Fragment>


    L'option Producteur vous permet d'ajouter un point de vente.

    Il vous permet aussi de référencer les produits que vous voulez vendre.

    Vous pouvez aussi tenir un mur d'actualités.
    <br/>
    <br/>
    Ne pas cocher cette option si vous voulez seulement suivre des producteurs.
  </React.Fragment>
);

const INFO_USER = (
  <React.Fragment>
    {`
    L'option Utilisateur vous permet de suivre  et d'attriber une note aux producteurs.
    `}
  </React.Fragment>
);

const chooseInformation = (value) => {
  if (value === 'user') {
    return INFO_USER;
  }
  return INFO_PRODUCER;
};


function StatusForm(props) {
  document.title = 'Nouveau Compte - Status';
  const { classes, value, onChange } = props;
  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.form}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Voulez-vous être:</FormLabel>
          <RadioGroup
            aria-label="Gender"
            name="gender1"
            className={classes.group}
            value={value}
            onChange={onChange('status')}
          >
            <FormControlLabel value="user" autoFocus control={<Radio />} label="Utilisateur" />
            <FormControlLabel value="producer" control={<Radio />} label="Producteur" />
          </RadioGroup>
        </FormControl>
        <Typography align="justify">
          {chooseInformation(value)}
        </Typography>
      </div>
    </React.Fragment>
  );
}

StatusForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType('user' || 'producer'),
};

StatusForm.defaultProps = {
  value: 'user',
  onChange: chooseInformation,
};


export default withStyles(styles)(StatusForm);