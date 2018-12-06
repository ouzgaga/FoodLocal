import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import red from '@material-ui/core/colors/red';

import { IncriptionProducerContext } from './InscriptionProducer';

const styles = ({
  checkboxDay: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  timePicker: {
    paddingRight: 0,
  },
  fabAdd: {
    color: '#FFFFFF',
    height: 36,
    width: 36,
  },
  fabDelete: {
    backgroundColor: '#f44336',
    color: '#FFFFFF',
    height: 36,
    width: 36,
  },
  typo: {
    paddingTop: 10,
  },
  grid: {
    padding: 0,
  }
});

class DaySchedule extends Component {
  render() {
    const {
      classes, day, dayName, printName
    } = this.props;
    let i = -1;
    return (
      <IncriptionProducerContext>
        {({
          addNewSchedule, deleteLastSchedule, handleChangeSchedule
        }) => (
          <Fragment>
            <Grid item xs={12} className={classes.grid}>
              <Grid container spacing={24} style={{ marginBottom: '-30' }}>
                <Grid item sm={2} xs={4} className={classes.grid}>
                  <Typography className={classes.typo} variant="body1">
                    {printName}
                  </Typography>
                </Grid>

                {day.map((schedule) => {
                  ++i;
                  return (

                    <Fragment>
                      <Grid item sm={4} xs={6} className={classes.grid}>

                        <div style={{ display: 'flex' }}>

                          <TextField
                            className={classes.timePicker}
                            id={`open${dayName}${i}`}
                            variant="outlined"
                            type="time"
                            onChange={handleChangeSchedule(dayName, i, 'openingHour')}
                            defaultValue={schedule.openingHour}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              step: 900, // 15 min
                            }}
                          />

                          <TextField
                            className={classes.timePicker}
                            id={`close${dayName}${i}`}
                            variant="outlined"
                            type="time"
                            onChange={handleChangeSchedule(dayName, i, 'closingHour')}
                            defaultValue={schedule.closingHour}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              step: 900, // 15 min
                            }}
                          />
                        </div>
                      </Grid>
                      {day.length === 2 && i !== 1 && (

                        <Fragment>
                          <Hidden smUp>
                            <Grid item xs={4} sm={false} />
                          </Hidden>
                        </Fragment>
                      )
                      }
                    </Fragment>
                  );
                })}

                {day.length > 0
                  && (
                    <Grid item xs={1} className={classes.grid}>
                      <Fab color={red} aria-label="Add" className={classes.fabDelete} onClick={deleteLastSchedule(dayName)}>
                        <DeleteIcon />
                      </Fab>
                    </Grid>)
                }

                {day.length === 1 && (
                  <Fragment>
                    <Hidden smUp>
                      <Grid item xs={2} />
                      <Grid item xs={2} />

                    </Hidden>
                  </Fragment>)

                }

                {day.length < 2
                  && (
                    <Grid item xs={8} sm={4} className={classes.grid}>
                      <FormControlLabel
                        control={(
                          <Fab color="primary" label="Ajouter un horaire" aria-label="Add" className={classes.fabAdd} onClick={addNewSchedule(dayName)}>
                            <AddIcon />
                          </Fab>
                        )}
                        label="Ajouter un horaire"
                      />
                    </Grid>
                  )
                }
              </Grid>
            </Grid>
          </Fragment>
        )}
      </IncriptionProducerContext>
    );
  }
}

DaySchedule.propTypes = {
  classes: PropTypes.shape().isRequired,
  day: PropTypes.shape().isRequired,
  dayName: PropTypes.string.isRequired,
  printName: PropTypes.string.isRequired,
};

export default withStyles(styles)(DaySchedule);
