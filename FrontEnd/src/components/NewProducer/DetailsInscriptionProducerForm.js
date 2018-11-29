import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
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
  MuiOutlinedInput: {
    padding: 0,
  }
};

class DetailsInscriptionProducerForm extends Component {
  continue = (e) => {
    const { nextStep } = this.props;
    e.preventDefault();
    nextStep();
  };

  render() {
    const { values, handleChange } = this.props;
    const { classes } = this.props;

    return (
      <MuiThemeProvider>


        <div className={classes.root}>

          <Grid container spacing={24} >
            <Grid item xs={12}>
              <Typography variant="subheading" className={classes.typo} gutterBottom> Nom du commerce </Typography>
              <TextField
                className={classes.textField}
                id="salePointName"
                margin="normal"
                variant="outlined"
                fullWidth
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
                onChange={handleChange('address.zip')}
                defaultValue={values.address.zip}
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
                onChange={handleChange('address.city')}
                defaultValue={values.address.city}
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
                onChange={handleChange('address.countryState')}
                defaultValue={values.address.countryState}
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
                onChange={handleChange('address.country')}
                defaultValue={values.address.country}
              />
            </Grid>
            <br />
            <Grid item xs={12} sm={12}>
              <Button variant="contained" onClick={this.continue} color="primary"> SUIVANT </Button>
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(DetailsInscriptionProducerForm);
