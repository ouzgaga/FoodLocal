import React, { Component, Fragment } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


import MarkerCarotte from '../../img/strawberry.png';
import { IncriptionProducerContext } from './InscriptionProducer';
import DaySchedule from './DaySchedule';

const styles = theme => ({
  root: {
    width: 600,
  },
  media: {
    height: 80,
    width: 80,
  },
  media2: {
    height: 80,
    width: 80,
  }
});

class ProductsDescriptionForm extends Component {
  render() {
    const { classes } = this.props;

    return (
      <IncriptionProducerContext>
        {({
          values, nextStep, handleChange, prevStep
        }) => (
            <div className={classes.root}>
              <Grid container spacing={24}>

                <List subheader={<li />}>
                  {values.items.map(product => (
                    <ListItem className={classes.root} key={product}>
                      <Grid item xs={3}>
                        <Card className={classes.media}>

                          <CardMedia className={classes.media2} image={MarkerCarotte} title={product} />
                        </Card>
                        <div className={classes.paper}>
                          <Typography className={classes.typo} variant="body1" gutterBottom> {product} </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={9}>

                        <TextField
                          className={classes.textField}
                          id="description"
                          margin="normal"
                          variant="outlined"
                          fullWidth

                          multiline
                          onChange={handleChange('description')}
                          placeholder="Entrez une description de votre produit (facultatif)"
                          defaultValue={values.description}
                        />
                      </Grid>
                    </ListItem>
                  ))}


                </List>
              </Grid>
              <Grid container>
                <Grid item xs={6}>
                  <div className={classes.paper}>

                    <Button variant="contained" onClick={(e) => { e.preventDefault(); prevStep(); }} color="inherit">PRÉCÉDENT</Button>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.paper}>

                    <Button variant="contained" onClick={(e) => { e.preventDefault(); nextStep(); }} color="primary">SUIVANT</Button>
                  </div>
                </Grid>
              </Grid>
            </div>
          )
        }
      </IncriptionProducerContext>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ProductsDescriptionForm);
