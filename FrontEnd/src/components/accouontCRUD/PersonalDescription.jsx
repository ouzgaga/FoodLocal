import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Typography from '@material-ui/core/Typography';
import DoneOutline from '@material-ui/icons/DoneOutline';

import BorderedCountField from '../items/fields/BorderedCountField';
import BoxLeftRight from './BoxLeftRight';

// récupère les informations personnels de l'utilisateur
const queryMe = gql`
  query($token: String!) {
    me(token: $token) {
      ... on Producer {
        description
      }
    }
  }
  `;

// mutation permettant la mise à jour de la description de l'utilisateur (nom, prénom sont des champs obligatoirs)
const mutUpdateProd = gql`
  mutation ($user: ProducerInputUpdate!){
    updateProducer(producer: $user){
      id,
      description
    }
  }
  `;

const styles = theme => ({
  root: {
    flexGrow: 1,
    width:'100%',
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
 * Permet aux producteurs de mettre à jour leur description
 */
class PersonalDescription extends Component {

  render() {
    const { classes, userId, token } = this.props;

    return (
      <>
        <Query
          query={queryMe}
          variables={{ token: token }}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Chargement...</p>;
            if (error) return <p>Error :(</p>;
            // Le retour d'une mutation s'appelle aussi data
            const datas = data;
            return (
              <>
                <Mutation
                  mutation={mutUpdateProd}
                >
                  {(updateTodo, { data, loading, error }) => (
                    <form
                      id="form-description"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const user = {
                          id: userId,
                          description: document.getElementById('BorderedTextField-personal-description').value,
                        };
                        updateTodo({
                          variables: { user: user }
                        });
                      }}
                    >
                      <BorderedCountField
                        id="personal-description"
                        maxLenght={1024}
                        fullWidth
                        defaultValue={!datas.me.description ? '' : datas.me.description}
                        onChange={e => (e)}
                      />
                      <BoxLeftRight
                        title=""
                      >
                        <>
                          <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            id="change-description-button"
                          >
                            {`Valider`}
                          </Button>
                          {loading && <p>Chargement...</p>}
                          {error && (
                            <>
                              {console.info(error)}
                              <Typography color="error">Un probème est survenu, veuillez essayer plus tard.</Typography>
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

PersonalDescription.propTypes = {
  classes: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default withStyles(styles)(PersonalDescription);
