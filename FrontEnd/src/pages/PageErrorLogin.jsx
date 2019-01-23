import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import {
  Route,
  Redirect,
} from 'react-router-dom';

import { AuthContext } from '../components/providers/AuthProvider';

import CenteredPaper from '../components/items/CenteredPaper';

const styles = {
  paper: {

    backgroundColor: 'rgba(255, 10, 0, 1)',
  },
};

class PageErrorLogin extends Component {
  constructor(props) {
    super(props);
    document.title = 'EmailConfirmation';
  }

  render() {
    const { classes } = this.props;
    return (
      <CenteredPaper className={classes.paper}>
        <Typography variant="h3" color="secondary">Erreur connexion requise.</Typography>
        <Typography variant="h6" color="primary">
          {`Veuillez vous connecter avant de pouvoir accéder à cette page`} 
        </Typography>
      </CenteredPaper>
    );
  }
}

export default withStyles(styles)(PageErrorLogin);
