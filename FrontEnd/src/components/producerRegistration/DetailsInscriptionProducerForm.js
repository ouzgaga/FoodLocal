import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { IncriptionProducerContext } from './InscriptionProducer';
import DaySchedule from './DaySchedule';
import AddressForm from './AddressForm';
import InputForm from './InputForm';

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
  },
  fabAdd: {
    color: '#FFFFFF',
    height: 36,
    width: 36,
  },
});

class DetailsInscriptionProducerForm extends Component {

  handleChange = (handleChangeProperty, fieldNameToChange) => (e) => {
    handleChangeProperty(fieldNameToChange, e.target.value);
  }

  changeCheckbox = (handleChangeProperty, fieldNameToChange) => (event) => {
    handleChangeProperty(fieldNameToChange, event.target.checked);
  };

  handleSubmit = prop => (event) => {
    event.preventDefault();
    prop();
  };

  render() {
    const { classes } = this.props;


    return (
      <IncriptionProducerContext>
        {({
          values, nextStep, handleChangeProperty
        }) => (
          <form id="form-detail-producer-form" onSubmit={this.handleSubmit(nextStep)}>
            <div className={classes.root}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                    <FormControl margin="normal" required fullWidth>
                      <InputForm
                        required
                        type="text"
                        handleChangeProperty={handleChangeProperty}
                        inputTitle="Nom du point de vente"
                        fieldNameToChange="name"
                        placeholder=""
                        value={values.name}
                        multiline={false}
                      />
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <InputForm
                    
                    type="text"
                    handleChangeProperty={handleChangeProperty}
                    inputTitle="Description (facultatif)"
                    fieldNameToChange="description"
                    placeholder="Entrez une description de votre point de vente"
                    value={values.description}
                    multiline
                  />
                </Grid>

                <Grid item sm={5} xs={12} align="space-between">
                  <FormControl margin="normal" required>
                    <InputForm
                      
                      handleChangeProperty={handleChangeProperty}
                      type="text"
                      inputTitle="Numéro de téléphone"
                      fieldNameToChange="phoneNumber"
                      placeholder=""
                      value={values.phoneNumber}
                      multiline={false}
                    />
                  </FormControl>
                </Grid>

                <Grid item sm={7} xs={12} align="space-between">
                  <InputForm
                    
                    handleChangeProperty={handleChangeProperty}
                    type="text"
                    inputTitle="Site Web (facultatif)"
                    fieldNameToChange="website"
                    placeholder="Entrez le lien de votre site Web"
                    value={values.website}
                    multiline={false}
                  />
                </Grid>

                {/* Adresse du producteur */}
                <AddressForm />

                <Grid item xs={12} sm={4}>
                  <Typography className={classes.typo} variant="subheading" gutterBottom> Horaire (facultatif) </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        className={classes.checkboxDay}

                        checked={values.scheduleActive}
                        onChange={this.changeCheckbox(handleChangeProperty, 'scheduleActive')}
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
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item xs={4} />

                    <Grid item xs={4}>
                      <div className={classes.paper}>
                        <Button

                          id="form-detail-producer-button"
                          type="submit"
                          variant="contained"
                          color="primary">SUIVANT</Button>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              
              </div>
            </form>
          )}
      </IncriptionProducerContext>
    );
  }
}

export default withStyles(styles, { withTheme: true })(DetailsInscriptionProducerForm);
