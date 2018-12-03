import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

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

class AvailableProductsForm extends Component {
  state = {
    value: undefined,
  }

  render() {
    const { classes } = this.props;
    const { item } = this.state;
    return (
      <IncriptionProducerContext>
        {({ values, nextStep, prevStep, addItem, removeItem }) => (
          <div className={classes.root}>
            <Grid container spacing={24}>

              {Products.products.map((product) => {
                return (
                  <Grid item xs={4} sm={2} key={product.name} >

                    <div className={classes.paper}>
                      <Button key={product.name} color="primary" value={product.name} onClick={() => { this.setState({ value: product.items }); }}>
                        {product.name}
                      </Button>
                    </div>
                  </Grid>
                );
              })}

              {this.state.value !== undefined && this.state.value.map(product => (
                <Grid item xs={4} sm={2}>

                  <Card className={classes.media} style={{ margin: '0 auto' }}>
                    {values.items.includes(product) ? (
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
                    <Typography className={classes.typo} variant="body1" gutterBottom> {product} </Typography>
                  </div>
                </Grid>

              ))}

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
            </Grid>
          </div>

        )}
      </IncriptionProducerContext>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AvailableProductsForm);
