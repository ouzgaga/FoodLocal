import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';

import { Grid } from '@material-ui/core';

const styles = {
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    widht: 1000,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  media: {
    height: 70,
    width: 70,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
};


function ProductsInformations(props) {
  const { classes, products } = props;


  return (

    <Grid container spacing={24}>

      <Grid item xs={12}>

        {products.length > 0 ? (
          products.map(item => (
            <Grid container spacing={24}>
              <Grid item xs={4}>

                <CardMedia className={classes.media} image={item.productType.image} title={item.productType.name} />
                <Typography>
                  {item.productType.name}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>
                  {item.description}
                </Typography>
              </Grid>
            </Grid>
          ))
        ) : (
            <Typography>
              {'Aucun produit renseigné'}
            </Typography>
          )}

      </Grid>

    </Grid>
  );
}


ProductsInformations.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductsInformations);
