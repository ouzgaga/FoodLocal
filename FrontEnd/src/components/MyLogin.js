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
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core';

import InputPassword from './items/InputPassword';
import { AuthContext } from './providers/AuthProvider';

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

class Execute extends React.Component {

  componentDidMount() {
    const { clearError } = this.props;
    console.info({clearError})
    clearError();
  }

  render() {
    return null;
  }
}

class MyLogin extends React.Component {

  constructor(props) {
    super(props);
    document.title = 'Connexion'; // changement du titre de la page

    this.state = {
      userMail: '',
      password: '',
    };
  }

  handleChange = prop => (event) => {
    this.setState({ [prop]: event.target.value });
  }

  render() {
    const { classes, onClose, onClick2 } = this.props;
    const { password } = this.state;
    return (
      <AuthContext>
        {({ error, signIn, clearError }) => {
          const onSubmit = (event) => {
            event.preventDefault();
            const { userMail, password } = this.state;
            
            signIn({ userMail, password })
            .then(data => {     // Résultat du login pour fermer la pop-up
              if(data)
                onClose();
            }).catch((error) => {
              console.info(error);
            });
          };


          return (
            <>
              <Execute clearError={clearError} />
              <CssBaseline />
              <main className={classes.layout}>
                <Paper className={classes.paper}>
                  <Avatar className={classes.avatar}>
                    <LockIcon cplor="secondary" />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    {'Connexion'}
                  </Typography>
                  <form className={classes.form} onSubmit={onSubmit}>
                    <FormControl
                      margin="normal"
                      required
                      fullWidth
                      onChange={this.handleChange('userMail')}
                    >
                      <InputLabel htmlFor="email">Adresse mail</InputLabel>
                      <Input id="email" name="email" autoComplete="email" autoFocus />
                    </FormControl>
                    <InputPassword
                      label={'Mot de passe'}
                      required

                      onChange={this.handleChange}
                      id="password"
                      value={password}
                     />

                    {error === ''
                      ? (
                        <br />
                      ) : (
                        <Typography color="error">
                          {error}
                        </Typography>
                      )
                    }


                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      {'Se connecter'}
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={onClick2}
                    >
                      {'Créer un nouveau compte'}
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={onClose}
                    >
                      {'Fermer'}
                    </Button>
                  </form>
                </Paper>
              </main>
            </>
          )
        }}
      </AuthContext>
    );
  }
}

MyLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onClick2: PropTypes.func,
};

export default withStyles(styles)(MyLogin);