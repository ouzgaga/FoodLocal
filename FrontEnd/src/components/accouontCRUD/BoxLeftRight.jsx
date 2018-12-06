import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width:'100%',
    height: '100%',
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
    backgroundColor: 'rgba(255, 255, 240, 0.8)',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  centerBox: {
    justifyContent: 'flex-start',
  },
  rightBox: {
    justifyContent: 'flex-start',
  },
  leftBox: {
    justifyContent: 'flex-end',
  },
});

function BoxLeftRight(props) {
  const { classes, title, children } = props;

  return (
    <>
      <Grid container spacing={16}>
        <Grid item xs={2} container alignItems="center" className={classes.leftBox}>
          <Typography>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={10} container alignItems="center" className={classes.rightBox}>
          {children}
        </Grid>
      </Grid>
    </>
  );
}

BoxLeftRight.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default withStyles(styles)(BoxLeftRight);
