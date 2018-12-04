import React, { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import red from '@material-ui/core/colors/red';

import CardMedia from '@material-ui/core/CardMedia';
import MarkerCarotte from '../../img/MarkerCarotte.png';
import { IncriptionProducerContext } from './InscriptionProducer';

const styles = theme => ({
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
});

class DaySchedule extends Component {
  render() {
    const { classes, day, dayName, printName } = this.props;
    let i = -1;
    return (
      <IncriptionProducerContext>
        {({
          values, addNewSchedule, deleteLastSchedule, handleChangeSchedule
        }) => (
            <Fragment>
              <Grid container spacing={24}>
                <Grid item sm={2} xs={2}>
                  <Typography className={classes.typo} variant="body1">
                    {printName}
                  </Typography>
                </Grid>

                {day.map((schedule) => {
                  ++i;
                  return (

                    <Fragment>
                      <Grid item sm={4} xs={6}>

                        <div style={{ display: 'flex' }}>

                          <TextField
                            className={classes.timePicker}
                            id={`open${dayName}${i}`}
                            variant="outlined"
                            type="time"
                            onChange={handleChangeSchedule(day, dayName, i, 'open')}
                            defaultValue={schedule.open}
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
                            onChange={handleChangeSchedule(day, dayName, i, 'close')}
                            defaultValue={schedule.close}
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
                            <Grid item xs={2} sm={false} />
                          </Hidden>
                        </Fragment>
                      )
                      }
                    </Fragment>
                  );
                })}

                {day.length > 0
                  && (
                    <Grid item xs={1}>
                      <Fab color={red} aria-label="Add" className={classes.fabDelete} onClick={deleteLastSchedule(day, dayName)}>
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
                    <Grid item xs={6} sm={4}>
                      <FormControlLabel
                        control={(
                          <Fab color="primary" label="Ajouter un horaire" aria-label="Add" className={classes.fabAdd} onClick={addNewSchedule(day, dayName)}>
                            <AddIcon />
                          </Fab>
                        )}
                        label="Ajouter un horaire"
                      />
                    </Grid>
                  )
                }
              </Grid>
            </Fragment>
        )}
      </IncriptionProducerContext>
    );
  }
}

export default withStyles(styles, { withTheme: true })(DaySchedule);
