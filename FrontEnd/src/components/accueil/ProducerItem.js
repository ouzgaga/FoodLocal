import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { Grid, Card, Hidden } from '@material-ui/core';

import AddressInfo from '../producer/AddressInfo';
import MapLocator from '../producer/MapLocator';
import RatingItem from '../items/RatingItem';

const styles = theme => ({
  paper: {
    width: '100%',
    marginBottom: theme.spacing.unit * 3,
  },
  marginBottom: {
    marginBottom: 20,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    marginTop: 20,
    padding: 10,
    maxHeight: 200,
    maxWidth: 600
  },
  gridListTile: {
    maxHeight: 150,
    maxWidth: 100,
  },
  media: {
    height: 60,
    width: 60,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  gridItem: {
    textAlign: 'center',
    maxHeight: 120,
    maxWidth: 100,
  },
  rating: {
    display: 'inline-block',
  },
  actionArea: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  }
});

function ProducerItem(props) {
  const { classes, producer, userLocation } = props;
  const { salespoint } = producer;
  const { address } = salespoint;
  const { latitude, longitude, distance } = address;
  const { rating } = producer;
  const link = `/producer/${producer.id}`;

  return (
    <Fragment>
      {producer.salespoint !== null && (
        <Card className={classes.paper} elevation={1}>

          <Grid container spacing={24}>

            <Grid item key={producer.id} xs={12} sm={6}>
              <CardActionArea className={classes.actionArea} href={link} target="_blank">

                <Typography className={classes.marginBottom} variant="h5" gutterBottom>{producer.salespoint.name}</Typography>

                <Grid container direction="row" alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Grid container direction="row" alignItems="center">

                      <Grid item>
                        <RatingItem
                          readOnly
                          defaultValue={Math.round(rating ? rating.grade : 0)}
                        />
                      </Grid>
                      <Grid item>

                        <Typography>
                          {`(${rating ? rating.nbRatings : 0} votes)`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item>
                    <Grid container direction="row" alignItems="center">

                      <Typography variant="body1">
                        {`Distance : ${(distance / 1000).toFixed(1)} km`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <AddressInfo className={classes.marginBottom} address={salespoint.address} />

                <GridList className={classes.gridList}>
                  {producer.products.edges.map(({ node }) => (
                    <div className={classes.gridItem} key={node.productType.id}>
                      <GridListTile key={node.productType.name} className={classes.gridListTile} style={{ margin: '0 auto' }}>
                        <CardMedia className={classes.media} image={node.productType.image} title={node.productType.name} />
                        <Typography className={classes.typo} gutterBottom>
                          {node.productType.name}
                        </Typography>
                      </GridListTile>
                    </div>
                  ))}
                </GridList>
              </CardActionArea>

            </Grid>

            <Hidden smDown>
              <Grid item key={producer.id} xs={12} sm={6}>
                <MapLocator latitude={latitude} longitude={longitude} height={350} userLocation={userLocation} />
              </Grid>
            </Hidden>

          </Grid>

        </Card>
      )}
    </Fragment>
  );
}

ProducerItem.propTypes = {
  classes: PropTypes.shape().isRequired,
  userLocation: PropTypes.shape().isRequired,
  producer: PropTypes.shape().isRequired,
};

export default withStyles(styles, { withTheme: true })(ProducerItem);
