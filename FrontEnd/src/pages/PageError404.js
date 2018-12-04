import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


import CenteredPaper from '../components/items/CenteredPaper';

const styles = {
  paper: {

    backgroundColor: 'rgba(255, 10, 0, 1)',
  },
};

class PageError404 extends Component {
  render() {
    const { classes, location } = this.props;
    return (
      <CenteredPaper className={classes.paper}>
          <Typography variant="h3" color="Secondary">Error404: Page NotFound. </Typography>
          <Typography variant="h6" color="Primary">
            No match for: www.foodlocal.ch
            {location.pathname}
            {' '}
          </Typography>
      </CenteredPaper>
    );
  }
}

export default withStyles(styles)(PageError404);
