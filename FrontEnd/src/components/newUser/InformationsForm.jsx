import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core';
import InputPassword from '../items/InputPassword';


const styles = theme => ({
  form: {
    //width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
});


function InformationsForm(props) {
  document.title = 'Nouveau Compte - Informations'; // changement du titre de la page
  const {
    classes, onChange, email, lastName, firstName, password, passwordConf
  } = props;
  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.form}>

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Adresse mail</InputLabel>
          <Input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={onChange('email')}
            value={email}
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="text">Nom de famille</InputLabel>
          <Input
            type="text"
            id="lastNameInput"
            name="lastNameInput"
            autoComplete="lastNameInput"
            onChange={onChange('lastName')}
            value={lastName}
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="text">Prénom</InputLabel>
          <Input
            type="text"
            id="firstNameInput"
            name="firstNameInput"
            autoComplete="firstNameInput"
            onChange={onChange('firstName')}
            value={firstName}
          />
        </FormControl>
        <InputPassword
          label={'Mot de passe'}
          required
          onChange={onChange}
          id="password"
          value={password}
        />
        <InputPassword
          label={'Confirmation du mot de passe'}
          required
          onChange={onChange}
          id="passwordConf"
          value={passwordConf}
        />
      </div>
    </React.Fragment>
  );
}


InformationsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  email: PropTypes.string,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
  password: PropTypes.string,
  passwordConf: PropTypes.string,
};

InformationsForm.defaultProps = {
  email: '',
  lastName: false,
  firstName: 'password',
  password: '',
  passwordConf: '',
};

export default withStyles(styles)(InformationsForm);