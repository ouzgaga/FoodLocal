import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import PapillonImg from '../img/papillon.png';

const styles = {
  paper: {
    maxWidth: 600,
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

class PageError404 extends Component {
  render() {
    const {classes, location } = this.props;
    return (
      <div>
        <Paper className={classes.paper} elevation={10}>
          <Typography variant="h3" color="Secondary"  >Error404: Page NotFound. </Typography>
          <Typography variant="h6" color="Primary" >No match for: www.foodlocal.ch{location.pathname} </Typography>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(PageError404);