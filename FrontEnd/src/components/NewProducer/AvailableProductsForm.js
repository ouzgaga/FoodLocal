import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';


import MarkerCarotte from '../../img/strawberry2.png';
import { IncriptionProducerContext } from './InscriptionProducer';

const Products = require('../../Datas/Products.json');

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
  },
  media: {
    height: 80,
    width: 80,
  },
  media2: {
    height: 80,
    width: 80,
    backgroundColor: '#66CCCC',
  },
});

function has(items, product) {
  let hasItem = false;
  items.forEach((item) => {
    if (item.item === product) {
      hasItem = true;
    }
  });
  return hasItem;
}

class AvailableProductsForm extends Component {
  state = {
    value: Products.products[0].items,
  }

  render() {
    const { classes } = this.props;
    return (
      <IncriptionProducerContext>
        {({
          values, nextStep, prevStep, addItem, removeItem
        }) => (
            <div className={classes.root}>
              <Grid container spacing={24}>
                {Products.products.map(product => (
                  <Grid item xs={4} sm={2} key={product.name}>
                    <div className={classes.paper}>
                      <Card className={classes.media} style={{ margin: '0 auto' }}>
                        <CardActionArea onClick={() => { this.setState({ value: product.items }); }}>
                          {this.state.value === product.items
                            ? (
                              <CardMedia className={classes.media2} image={MarkerCarotte} title={product.name} />
                            ) : (
                              <CardMedia className={classes.media} image={MarkerCarotte} title={product.name} />
                            )}
                        </CardActionArea>
                      </Card>

                      <div className={classes.paper}>
                        <Typography className={classes.typo} variant="body1" gutterBottom>
                          {product.name}
                        </Typography>
                      </div>
                    </div>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Divider variant="middle" />
                </Grid>
                {this.state.value !== undefined && this.state.value.map(product => (
                  <Grid item xs={4} sm={2}>

                    <Card className={classes.media} style={{ margin: '0 auto' }}>
                      {has(values.items, product) ? (
                        <CardActionArea onClick={removeItem(product)}>

                          <CardMedia className={classes.media2} image={MarkerCarotte} title={product} />
                        </CardActionArea>

                      ) : (
                          <CardActionArea onClick={addItem(product)}>
                            <CardMedia className={classes.media} image={MarkerCarotte} title={product} />
                          </CardActionArea>
                        )
                      }

                    </Card>
                    <div className={classes.paper}>
                      <Typography className={classes.typo} variant="body1" gutterBottom>
                        {product}
                      </Typography>
                    </div>
                  </Grid>

                ))}

                <Grid item xs={12}>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item xs={4}>
                      <div className={classes.paper}>

                        <Button variant="contained" onClick={(e) => { e.preventDefault(); prevStep(); }} color="inherit">PRÉCÉDENT</Button>
                      </div>
                    </Grid>
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

export default withStyles(styles, { withTheme: true })(AvailableProductsForm);
