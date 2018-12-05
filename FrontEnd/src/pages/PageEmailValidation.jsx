import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


import CenteredPaper from '../components/items/CenteredPaper';

const styles = {
  paper: {
    backgroundColor: 'rgba(255, 10, 0, 1)',
  },
};

class PageEmailValidation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isValidate: 'false',
    };
  }

  render() {
    const { classes } = this.props;
    const { isValidate } = this.state;

    return (
      <CenteredPaper className={classes.paper}>
          <Typography variant="h3" color="secondary">
            Validation d'email 
          </Typography>
      </CenteredPaper>
    );
  }
}

export default withStyles(styles)(PageEmailValidation);
