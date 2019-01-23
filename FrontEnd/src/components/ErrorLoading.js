import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import CenteredPaper from './items/CenteredPaper';

const styles = {
  paper: {
    backgroundColor: 'rgba(255, 10, 0, 1)',
  },
};

// Permet d'afficher une erreur à l'utilisateur si les données n'ont pas été fetchées correctement
class ErrorLoading extends Component {
  render() {
    const { classes } = this.props;
    return (
      <CenteredPaper className={classes.paper}>
        <Typography align="center" variant="h3" color="secondary">Erreur de chargement des données</Typography>
        <Typography align="center" variant="h6" color="primary">Veuillez rafraichir la page ou nous contacter si le problème persiste</Typography>
      </CenteredPaper>
    );
  }
}

export default withStyles(styles)(ErrorLoading);
