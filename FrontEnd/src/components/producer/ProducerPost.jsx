import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Moment from 'react-moment';

import DefaultUserLogo from '../../img/DefaultUserLogo.jpg';
import MapLocator from './MapLocator';
import AddressInfo from './AddressInfo';

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 1200,
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
  },
  leftBox: {
    flexGrow: 1,
    maxWidth: 64,
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
  },
  image: {
    width: 64,
    height: 64,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  postHeader: {
    marginTop: 10,
    marginLeft: 10
  }
});

function ProducerPost(props) {
  const {
    classes, firstname, lastname, date, image, post, address
  } = props;

  return (
    <Paper className={classes.root}>
      <Grid container spacing={24}>

        <Grid item xs={3} className={classes.leftBox}>
          <ButtonBase className={classes.image}>
            <img className={classes.img} alt="complex" src={image} />
          </ButtonBase>
        </Grid>

        <Grid item xs={9}  className={classes.postHeader}>
          <Typography className={classes.name} color="primary">
            {`${firstname} ${lastname}`}
          </Typography>
          <Typography>
            <Moment fromNow>{date}</Moment>
          </Typography>

        </Grid>

        <Grid container spacing={24}>

          <Grid item xs={12}>
            <Typography gutterBottom variant="body1">
              {post}
            </Typography>
          </Grid>

          {address && (
            <Fragment>
              <Grid item xs={6} sm={6}>
                <MapLocator latitude={address.latitude} longitude={address.longitude} height={200} />
              </Grid>
              <Grid item xs={6} sm={6} style={{ marginTop: 50 }}>
                <AddressInfo address={address} />
              </Grid>
            </Fragment>
          )}

        </Grid>

      </Grid>
    </Paper>
  );
}

ProducerPost.propTypes = {
  classes: PropTypes.shape().isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  post: PropTypes.string.isRequired,
  image: PropTypes.string,
};


ProducerPost.defaultProps = {
  image: DefaultUserLogo,
};

export default withStyles(styles)(ProducerPost);
