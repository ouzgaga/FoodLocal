import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import InputPassword from './items/InputPassword';


// Mutation pour ajouter un nouvel utilisateur
const mutvalidateAnEmailToken = gql`
  mutation ($email: String!, $password: String!) {
    askNewEmailToken(email:$email, password: $password){
      token
    }
  }
  `;

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
  },
  grow: {
    flexGrow: 1,
  },
  paper: {
    width: "100%",
    padding: 10,
    maxWidth: 300,
  }
});

class NewValidationEmail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  handleChange = prop => (event) => {
    this.setState({
      [prop]: event.target.value,
    });
  }

  render() {
    const { classes } = this.props;
    const { email, password } = this.state;
    return (
      <>
        <Mutation mutation={mutvalidateAnEmailToken}>
          {(updateTodo, { data, loading, error }) => (
            <Paper className={classes.paper}>
              <Typography>
                Envoyer un nouvel email de confirmation.
              </Typography>
              <CssBaseline />
              <form
                className={classes.form}
                onSubmit={e => {
                  e.preventDefault();
                  updateTodo({ variables: { email: email, password: password  } });
                }}
              >
              
                <FormControl margin="normal" required fullWidth >
                  <InputLabel htmlFor="email">Adresse mail</InputLabel>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={this.handleChange('email')}
                    value={email}
                  />
                  <InputPassword
                  label={'Mot de passe'}
                  required
                  onChange={this.handleChange}
                  id="password"
                  value={password}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    id="register-button-step"
                    className={classes.button}
                  >
                    Envoyer
                  </Button>
                </FormControl>
                
                <div>
                  {loading && <p>Chargement...</p>}
                  {error && (
                    <Typography color="error">
                      Email ou mot de passe faux
                    </Typography>
                  )}
                  {data && <p> Un nouvel email vous a été envoyé </p>}
                </div>
              </form>
            </Paper>
          )}
        </Mutation>
      </>
    );
  }
}

NewValidationEmail.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewValidationEmail);
