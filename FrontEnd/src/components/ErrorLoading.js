import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import CenteredPaper from './items/CenteredPaper';

const styles = {
  paper: {
    backgroundColor: 'rgba(255, 10, 0, 1)',
  },
};

class ErrorLoading extends Component {
  constructor(props) {
    super(props);
    document.title = 'Error 404';
  }

  render() {
    const { classes, location } = this.props;
    return (
      <CenteredPaper className={classes.paper}>
        <Typography align="center" variant="h3" color="secondary">Erreur de chargement des données</Typography>
        <Typography align="center" variant="h6" color="primary">Veuillez rafraichir la page ou nous contacter si le problème persiste</Typography>
      </CenteredPaper>
    );
  }
}

export default withStyles(styles)(ErrorLoading);
