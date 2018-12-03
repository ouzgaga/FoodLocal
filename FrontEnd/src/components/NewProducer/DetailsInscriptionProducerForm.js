import React, { Component, Fragment } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import MarkerCarotte from '../../img/strawberry.png';
import { IncriptionProducerContext } from './InscriptionProducer';
import DaySchedule from './DaySchedule';

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
  typo2: {
    width: 30,
  },
  typo3: {
    marginLeft: 10,
    marginRight: 10,
  },
  fab: {
    height: 30,
    width: 30,
    minHeight: 30,
  },
  checkboxDay: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  timePicker: {
    padding: 5,
  }
});

class DetailsInscriptionProducerForm extends Component {
  render() {
    const { classes } = this.props;

    return (
      <IncriptionProducerContext>
        {({
          values, nextStep, handleChange, handleChangeCheckbox
        }) => (
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

                <Grid item xs={12} align="space-between">
                  <Typography className={classes.typo} variant="subheading" gutterBottom> Description (facultatif) </Typography>
                  <TextField
                    className={classes.textField}
                    id="description"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    multiline
                    onChange={handleChange('description')}
                    placeholder="Entrez une description de votre point de vente"
                    defaultValue={values.description}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography className={classes.typo} variant="subheading" gutterBottom> Horaire (facultatif) </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        className={classes.checkboxDay}

                        checked={values.scheduleActive}
                        onChange={handleChangeCheckbox('scheduleActive')}
                        value={values.scheduleActive}
                        color="primary"
                      />
                    )}
                    label="Cochez pour rentrez un horaire"
                  />
                </Grid>

                {values.scheduleActive
                  && (
                    <Fragment>
                      <DaySchedule
                        day={values.monday}
                        dayName="monday"
                        printName="Lundi"
                      />
                      <DaySchedule
                        day={values.tuesday}
                        dayName="tuesday"
                        printName="Mardi"
                      />
                      <DaySchedule
                        day={values.wednesday}
                        dayName="wednesday"
                        printName="Mercredi"
                      />
                      <DaySchedule
                        day={values.thursday}
                        dayName="thursday"
                        printName="Jeudi"
                      />
                      <DaySchedule
                        day={values.friday}
                        dayName="friday"
                        printName="Vendredi"
                      />
                      <DaySchedule
                        day={values.saturday}
                        dayName="saturday"
                        printName="Samedi"
                      />
                      <DaySchedule
                        day={values.sunday}
                        dayName="sunday"
                        printName="Dimanche"
                      />
                    </Fragment>
                  )
                }

                <Grid item xs={12}>
                  <Button variant="contained" onClick={(e) => { e.preventDefault(); nextStep(); }} color="primary"> SUIVANT </Button>
                </Grid>
              </Grid>
            </div>
          )}
      </IncriptionProducerContext>
    );
  }
}

export default withStyles(styles, { withTheme: true })(DetailsInscriptionProducerForm);
