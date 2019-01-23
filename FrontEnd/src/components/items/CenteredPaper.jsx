import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';


const styles = {
  paper: {
    maxWidth: 900,
    width: '100%',
    margin: 'auto',
    marginTop: 100,
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
};

function CenteredPaper(props) {
  const { classes, children } = props;

  return (
    <Paper className={classes.paper} elevation={10}>
      {children}
    </Paper>
  );
}

CenteredPaper.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
};

CenteredPaper.defaultProps = {
  children: null,
};


export default withStyles(styles)(CenteredPaper);
