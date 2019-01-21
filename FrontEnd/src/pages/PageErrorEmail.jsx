import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import CenteredPaper from '../components/items/CenteredPaper';
import NewValidationEmail from '../components/NewValidationEmail';  

const styles = {
  paper: {
    
    backgroundColor: 'rgba(255, 10, 0, 1)',
  },
};

class PageErrorEmail extends Component {
  constructor(props) {
    super(props);
    document.title = 'EmailConfirmation';
  }

  render() {
    const { classes } = this.props;
    return (
      <CenteredPaper className={classes.paper}>
        <Typography variant="h3" color="secondary">{`Erreur validation d'email.`}</Typography>
        <Typography variant="h6" color="primary">
          {`Veuillez valider votre email à l'aide du message que vous avez reçu avant de pourvoir continer.`} 
        </Typography>
        <br/>
        <NewValidationEmail />
      </CenteredPaper>
    );
  }
}

export default withStyles(styles)(PageErrorEmail);
