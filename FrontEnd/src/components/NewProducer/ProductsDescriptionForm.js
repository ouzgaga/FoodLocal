import React, { Component, Fragment } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


import MarkerCarotte from '../../img/strawberry.png';
import { IncriptionProducerContext } from './InscriptionProducer';

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
          values, nextStep, handleChangeDescription, prevStep
        }) => (
            <div className={classes.root}>
              <Grid container spacing={24}>
                <List subheader={<li />}>
                  {values.items.map(product => (
                    <ListItem className={classes.root} key={product.item}>
                      <Grid item xs={3}>
                        <Card className={classes.media}>

                          <CardMedia className={classes.media2} image={MarkerCarotte} title={product.item} />
                        </Card>
                        <div className={classes.paper}>
                          <Typography className={classes.typo} variant="body1" gutterBottom>
                            {product.item}
                          </Typography>
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
                          onChange={handleChangeDescription(product.item)}
                          placeholder="Entrez une description de votre produit (facultatif)"
                          defaultValue={product.description}
                        />
                      </Grid>
                    </ListItem>
                  ))}

                </List>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Grid item xs={4}>
                    <div className={classes.paper}>
                      <Button variant="contained" onClick={(e) => { e.preventDefault(); prevStep(); }} color="inherit">PRÉCÉDENT</Button>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className={classes.paper}>
                      <Button variant="contained" onClick={(e) => { e.preventDefault(); nextStep(); }} color="primary">TERMINER</Button>
                    </div>
                  </Grid>
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
