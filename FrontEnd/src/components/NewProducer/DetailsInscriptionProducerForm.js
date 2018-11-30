import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';

import MarkerCarotte from '../../img/MarkerCarotte.png';

const styles = theme => ({
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
  media: {
    height: 80,
    width: 80,
    backgroundColor: theme.palette.primary,
  }
});

class DetailsInscriptionProducerForm extends Component {
  continue = (e) => {
    const { nextStep } = this.props;
    e.preventDefault();
    nextStep();
  };

  handleChangeCheckbox = name => event => {
    this.props.handleChange({ [name]: event.target.checked });
  };

  render() {
    const { values, handleChange } = this.props;
    const { classes } = this.props;

    return (
      <MuiThemeProvider>


        <div className={classes.root}>

          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Typography variant="subheading" className={classes.typo} gutterBottom> Nom du commerce </Typography>
              <TextField
                className={classes.textField}
                id="salePointName"
                variant="outlined"
                fullWidth
                margin="none"
                onChange={handleChange('salePointName')}
                defaultValue={values.salePointName}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subheading" className={classes.typo} gutterBottom> Nom de la rue et numéro </Typography>
              <TextField
                className={classes.textField}
                id="road"
                margin="normal"
                variant="outlined"
                fullWidth
                onChange={handleChange('road')}
                defaultValue={values.road}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography className={classes.typo} variant="subheading" gutterBottom> Code postal </Typography>
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
              <Typography className={classes.typo} variant="subheading" gutterBottom> Ville </Typography>
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
              <Typography className={classes.typo} variant="subheading" gutterBottom> État </Typography>
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
              <Typography className={classes.typo} variant="subheading" gutterBottom> Pays </Typography>
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
              <Typography className={classes.typo} variant="subheading" gutterBottom> Description (facultatif) </Typography>
              <TextField
                className={classes.textField}
                id="descrition"
                variant="outlined"
                multiline
                fullWidth
                onChange={handleChange('description')}
                defaultValue={values.time}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography className={classes.typo} variant="subheading" gutterBottom> Horaire (facultatif) </Typography>
              <Checkbox
                checked={values.scheduleActive}
                onChange={handleChange('scheduleActive')}
                value={values.scheduleActive}
              />
              <TextField
                className={classes.textField}
                id="time"
                variant="outlined"
                type="time"
                onChange={handleChange('address.time')}
                defaultValue={values.time}
              />
            </Grid>

            <Grid item xs={12}>
              <div style={{ backgroundColor: this.props.theme.palette.primary }}>
                <CardMedia className={classes.media} image={MarkerCarotte} title="Paella dish" />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={this.continue} color="primary"> SUIVANT </Button>
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles, { withTheme: true })(DetailsInscriptionProducerForm);
