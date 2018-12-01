import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

import DefaultUserLogo from '../../img/DefaultUserLogo.jpg';

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 1200,
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
  },
  leftBox: {
    flexGrow: 1,
    maxWidth: 128,
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

function ProducerPost(props) {
  const { classes, name, date, image, post } = props;

  return (
    <Paper className={classes.root}>
      <Grid container spacing={16}>
      
        <Grid item xs={4} container className={classes.leftBox}>
          <ButtonBase className={classes.image}>
            <img className={classes.img} alt="complex" src={image} />
          </ButtonBase>
        </Grid>

        
        <Grid item xs={12} sm container alignItems="center">
        
          <Grid item xs container direction="column" spacing={16}>
            <Grid item xs>
              
              <Typography wrap="nowrap">
                {name}
              </Typography>
              <Typography>
                {date}
              </Typography>
              <Paper elevation={1}>
                <Typography gutterBottom variant="body1">
                  {post}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

ProducerPost.propTypes = {
  classes: PropTypes.object.isRequired,
};


ProducerPost.defaultProps = {
  image: DefaultUserLogo,
};

export default withStyles(styles)(ProducerPost);