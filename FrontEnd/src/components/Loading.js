import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import logo from '../img/LogoCarrote.png';
import { Dialog, DialogContent } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: 100,
    width: 100
  },
  wrapper: {
    margin: theme.spacing.unit,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  imgLogo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -25,
    height: '60px',
    outline: 'none',
  },
  fabProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 1,
    marginTop: -50,
    marginLeft: -50,
  },
});

function CircularIndeterminate(props) {
  const { classes } = props;
  return (
    <Dialog open>
      <DialogContent>
        <div className={classes.root}>
          <div className={classes.wrapper}>
            <img src={logo} className={classes.imgLogo} alt="logo" readOnly tabIndex="-1" />
            <CircularProgress size={100} className={classes.fabProgress} />
          </div>
        </div>
      </DialogContent>

    </Dialog>



  );
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(styles)(CircularIndeterminate);