import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { Link } from 'react-router-dom';

import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';

import { withStyles } from '@material-ui/core';
import UserContext from './UserContext';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    //marginLeft: theme.spacing.unit * 3,
    //marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  LinkButton: {
    textDecoration: 'none',
    color: 'inherit'
  },
});

class MyLogin extends React.Component {


  handleLogin = () => {
    console.info("OK men")
    UserContext.Provider.name = "UserIsLog"
  }

  render() {

    //this.setState(this.state.a + 1);

    const { classes, onClose, onClick2, ...other } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon cplor="secondary" />
            </Avatar>
            <Typography component="h1" variant="h5">
              Connexion
            </Typography>
            <form className={classes.form}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Adresse mail</InputLabel>
                <Input id="email" name="email" autoComplete="email" autoFocus />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Mot de passe</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    value="remember"
                  />
                }
                label="remember"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.handleLogin}
              >
                Se connecter
              </Button>



              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onClick2}
              >
                Creat new accoun
              </Button>


            </form>
          </Paper>
        </main>
      </React.Fragment>
    );
  }


}

MyLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onClick2: PropTypes.func,
};

export default withStyles(styles)(MyLogin);