import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';

import PapillonImg from '../img/papillon.png';
import SearchIconButton from '../components/items/SearchIconButton';

const styles = theme => ({
  paper: {
    maxWidth: '50%',
    marginLeft: '15%',
    marginRight: '35%',
    //margin: 'auto',
    marginTop: 70,
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    backgroundColor: 'rgba(240, 240, 220, 0.9)',
  },
  linkButton: {
    textDecoration: 'none',
    color         : theme.palette.secondary.main,
  },
  resarch: {
    width: '100%',
    whiteSpace: 'nowrap',
  },
  input: {
    width: '90%',
    margin: theme.spacing.unit,
  },
});

class PageAcceuil extends Component {
  render() {
    const { classes, location } = this.props;
    return (
      <div>
        <Paper className={classes.paper} elevation={10}>
          <Typography variant="h3" color="Secondary">Bienvenue sur foodlocal.ch </Typography>
          <br/>
          <Typography variant="subtitle1">
            Cette plateforme vous permet de rechercher des producteurs locaux ou des produits.
            <br/>
            Vous pouvez aussi directement accéder à 
            <Link to="/map" className={classes.linkButton} readOnly tabIndex="-1">
              {' la carte '}
            </Link>
             depuis le lien.
            <br/>
            <br/>
          </Typography>
          
          <div className={classes.resarch}>
            <Typography variant="h6" color="Primary">Rechercher un lieu</Typography>
            <Input
              defaultValue="Hello world"
              className={classes.input}
              inputProps={{
                'aria-label': 'Description',
              }}
              
            />
            <SearchIconButton />
          </div>

          <div className={classes.resarch}>
            <Typography variant="h6" color="Primary">Rechercher un producteur</Typography>
            <Input
              className={classes.input}
              inputProps={{
                'aria-label': 'Description',
              }}
            />
            <SearchIconButton />
          </div>

          <div className={classes.resarch}>
            <Typography variant="h6" color="Primary">Rechercher un produit</Typography>
            <Input
              className={classes.input}
              inputProps={{
                'aria-label': 'Description',
              }}
            />
            <SearchIconButton />
          </div>

        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(PageAcceuil);
