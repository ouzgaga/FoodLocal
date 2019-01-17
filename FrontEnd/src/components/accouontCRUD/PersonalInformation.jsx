import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DoneOutline from '@material-ui/icons/DoneOutline';

import BorderedTextField from '../items/fields/BorderedTextField';
import BoxLeftRight from './BoxLeftRight';

const queryMe = gql`
  query($token: String!) {
    me(token: $token) {
      firstname,
      lastname
    }
  }
  `;

const mutUpdateUser = gql`
  mutation ($user: UserInputUpdate!){
    updateProducer(user: $user){
      id,
      firstname,
      lastname
    }
  }
  `;

const mutUpdateProd = gql`
  mutation ($user: ProducerInputUpdate!){
    updateProducer(producer: $user){
      id,
      firstname,
      lastname
    }
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
  button: {
    margin: theme.spacing.unit,
  },
});


/**
 * Permet à l'utilisateur de modifier ses informations personnels
 * -> nom + prénom
 */
class PersonalInformation extends Component {
  render() {
    const { classes, userId, status, token } = this.props;
    return (
      <>
        {console.info(status)}
        <Query
          query={queryMe}
          variables={{ token: token }}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Chargement...</p>;
            if (error) return <p>Erreur serveur</p>;
            let datas = data;
            return (
              <>
                <Mutation
                  mutation={status === 'producers' ? mutUpdateProd : mutUpdateUser}
                >
                  {(updateTodo, { data, loading, error }) => (
                    <form
                      id="form-name-firstname"
                      onSubmit={ (e) => {
                        e.preventDefault();
                        const user = {
                          id: userId,
                          firstname: document.getElementById('BorderedTextField-personal-information-name').value,
                          lastname: document.getElementById('BorderedTextField-personal-information-lastName').value
                        };
                        console.info( "user");
                        updateTodo({
                          variables: { user: user }
                        })
                      }}
                    >
                      <BoxLeftRight
                        title="Nom"
                      >
                        <BorderedTextField
                          id="personal-information-name"
                          className={classes.textField}
                          defaultValue={datas.me.firstname}
                          fullWidth
                          required
             
                        />
                      </BoxLeftRight>
                      <BoxLeftRight
                        title="Prénom"
                      >
                        <BorderedTextField
                          id="personal-information-lastName"
                          className={classes.textField}
                          
                          defaultValue={datas.me.lastname}
                          fullWidth
                          required
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
                            id="change-personal-informations-button"
                          >
                            {`Valider`}
                          </Button>
                          {loading && <p>Chargement...</p>}
                          {error && (
                            <>
                              {console.info(error)}
                              <Typography color="error">
                                Un probème est survenu, veuillez essayer plus tard.
                              </Typography>
                            </>
                          )}
                          {data && <DoneOutline color="secondary" />}
                        </>
                      </BoxLeftRight>


                    </form>

                  )}
                </Mutation>
              </>
            );
          }}
        </Query>
      </>
    );
  }
}

PersonalInformation.propTypes = {
  classes: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default withStyles(styles)(PersonalInformation);
