import React, { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import MarkerCarotte from '../../img/MarkerCarotte.png';
import { IncriptionProducerContext } from './InscriptionProducer';

const styles = theme => ({
  checkboxDay: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

class DaySchedule extends Component {
  render() {
    const { classes } = this.props;

    const { dayEnable,
      time1Start,
      time1End,
      time2Start,
      time2End,
      handleChange,
      handleChangeCheckbox,
      nameDayEnable,
      nameTime1Start,
      nameTime1End,
      nameTime2Start,
      nameTime2End } = this.props;

    return (
      <Fragment>
        {dayEnable ? (
          <Fragment>
            <Grid item sm={1} xs={2}>
              <Typography className={classes.typo} variant="body1"> Lundi </Typography>
            </Grid>
            <Grid item sm={1} xs={1}>

              <FormControlLabel
                control={(
                  <Checkbox
                    className={classes.checkboxDay}
                    checked={dayEnable}
                    onChange={handleChangeCheckbox(nameDayEnable)}
                    value={dayEnable}
                    color="primary"
                  />
                )}

              />
            </Grid>
          </Fragment>
        )
          : (
            <Fragment>
              <Grid item sm={2} xs={3}>
                <Typography className={classes.typo} variant="body1"> Lundi </Typography>
              </Grid>
              <Grid item sm={10} xs={9}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      className={classes.checkboxDay}
                      checked={dayEnable}
                      onChange={handleChangeCheckbox(nameDayEnable)}
                      value={dayEnable}
                      color="primary"
                    />
                  )}
                  label="Ajouter un horaire pour lundi"
                />
              </Grid>
            </Fragment>
          )
        }

        {dayEnable && (
          <Fragment>
            <Grid item sm={2} xs={2}>
              <Typography className={classes.typo3} variant="body1" color="inherit">
                {'Matin'}
              </Typography>
            </Grid>
            <Grid item sm={8} xs={5} style={{ padding: 0 }}>
              <div style={{ display: 'flex' }}>

                <TextField
                  className={classes.timePicker}
                  id="timeMondayStart1"
                  variant="outlined"
                  type="time"
                  onChange={handleChange(nameTime1Start)}
                  defaultValue={time1Start}
                 
                />
                <Typography className={classes.typo3} variant="body1" color="inherit">
                  {'-'}
                </Typography>

                <TextField
                  className={classes.timePicker}
                  id="timeMondayEnd1"
                  variant="outlined"
                  type="time"
                  onChange={handleChange(nameTime1End)}
                  defaultValue={time1End}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 900, // 15 min
                  }}
                />
              </div>
            </Grid>
            <Grid container>
              <Grid item sm={2} xs={2} />

              <Grid item sm={2} xs={2}>
                <Typography className={classes.typo3} variant="body1" color="inherit">
                  {'Après-midi'}
                </Typography>
              </Grid>
              <Grid item sm={8} xs={8} style={{ padding: 0 }}>

                <div style={{ display: 'flex' }}>
                  <TextField
                    className={classes.timePicker}
                    id="timeMondayStart1"
                    variant="outlined"
                    type="time"
                    onChange={handleChange(nameTime2Start)}
                    defaultValue={time2Start}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 900, // 15 min
                    }}
                  />
                  <TextField
                    className={classes.timePicker}
                    id="timeMondayEnd1"
                    variant="outlined"
                    type="time"
                    onChange={handleChange(nameTime2End)}
                    defaultValue={time2End}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 900, // 15 min
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DaySchedule);
