import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { IncriptionProducerContext } from './InscriptionProducer';

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

class FirstStep extends Component {
  render() {
    const { classes } = this.props;

    return (
      <IncriptionProducerContext>
        {({
          values, nextStep, handleChangeProperty
        }) => (
            <div className={classes.root}>

              <Grid container spacing={24}>
                <Typography variant="h5"> Ajout du point de vente <br /> la modification ne fonctionne pas trop... </Typography>
                <Grid item xs={12}>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item xs={4} />

                    <Grid item xs={4}>
                      <div className={classes.paper}>
                        <Button variant="contained" onClick={(e) => { e.preventDefault(); nextStep(); }} color="primary">SUIVANT</Button>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          )}
      </IncriptionProducerContext>
    );
  }
}

export default withStyles(styles, { withTheme: true })(FirstStep);
