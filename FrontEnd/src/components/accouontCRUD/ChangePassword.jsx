import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DoneOutline from '@material-ui/icons/DoneOutline';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import BorderedPasswordField from '../items/fields/BorderedPasswordField';
import BoxLeftRight from './BoxLeftRight';

const mutUpdatePassword = gql`
  mutation ($newPassword: String!, $oldPassword: String!, $id: ID!){
    changePassword(newPassword: $newPassword, oldPassword: $oldPassword, personId: $id)
  }
  `;

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
    backgroundColor: 'rgba(255, 255, 240, 0.8)',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  centerBox: {
    justifyContent: 'flex-start',
  },
  rightBox: {
    justifyContent: 'flex-start',
  },
  leftBox: {
    justifyContent: 'flex-end',
  },
  button: {
    margin: theme.spacing.unit,
  },
});

/**
 * Permet qu'un utilisateur puisse changer son mot de passe
 */
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorPassword: null,
    };
  }


// Permet de contrôler la validité du nouveau mot de passe
checkPassword = (newPassword, oldPassword, confPassword) => {
  if (newPassword !== confPassword) {
    this.setState({
      errorPassword: 'Le nouveau mot de passe et celui de confirmation doivent être identiques.'
    });
    return false;
  }
  if (newPassword === oldPassword) {
    this.setState({
      errorPassword: 'Nouveau et ancien mot de passe identique',
    });
    return false;
  }

  this.setState({
    errorPassword: null,
  });
  return true;
}

render() {
  const { classes, userId } = this.props;
  const { errorPassword } = this.state;

  return (
    <>
      <Mutation
        mutation={mutUpdatePassword}
      >
        {(updateTodo, { data, loading, error }) => (
          <form
            id="form-change-password"
            onSubmit={(e) => {
              e.preventDefault();
              let newPassword = document.getElementById('BorderedPasswordField-personal-information-newPassword').value;
              let oldPassword = document.getElementById('BorderedPasswordField-personal-information-oldPassword').value;
              let confPassword = document.getElementById('BorderedPasswordField-personal-information-confPassword').value;

              if (this.checkPassword(newPassword, oldPassword, confPassword)) {
                updateTodo({
                  variables: { newPassword: newPassword, oldPassword: oldPassword, id: userId }
                });
              }
            }}
          >
            <BoxLeftRight
              title="Ancien mot de passe"
            >
              <BorderedPasswordField
                required
                id="personal-information-oldPassword"
                className={classes.textField}
                fullWidth
              />
            </BoxLeftRight>
            <BoxLeftRight
              title="Nouveau mot de passe"
            >
              <BorderedPasswordField
                required
                id="personal-information-newPassword"
                className={classes.textField}
                fullWidth
              />
            </BoxLeftRight>
            <BoxLeftRight
              title="Confirmation du mot de passe"
            >
              <BorderedPasswordField
                required
                id="personal-information-confPassword"
                className={classes.textField}
                fullWidth
              />
            </BoxLeftRight>
            <BoxLeftRight
              title=""
            >
              <>
                <Button
                  variant="contained"
                  className={classes.button}
                  color="primary"
                  type="submit"
                  id="change-password-button"
                >
                  {`Valider`}
                </Button>
                {loading && <p>Chargement...</p>}
                {error && (
                  <>
                    <Typography color="error">
                      Mot de passe incorrecte.
                      </Typography>
                  </>
                )}
                {data && <DoneOutline color="secondary" />}
                    <Typography color="error">
                      {errorPassword}
                    </Typography>

              </>
            </BoxLeftRight>
          </form>

        )}
      </Mutation>
    </>
  );
}
}

ChangePassword.propTypes = {
  classes: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
};

export default withStyles(styles)(ChangePassword);
