import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

class PersonalInformation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lastName: '',
      firstName: '',
    };
  }

  handleChange = prop => (event) => {
    console.log(prop);
    this.setState({
      [prop]: event.target.value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }


  render() {
    const { classes, userId, status, token } = this.props;
    const { lastName, firstName } = this.state;

    return (
      <>

        <Query query={queryMe} variables={{ token: token }}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            return (
              <>

                <Mutation mutation={status === 'producers' ? mutUpdateProd : mutUpdateUser}>
                  {(updateTodo, { datas, loading, error }) => (
                    <form
                      id="form-name-firstname"
                      onSubmit={e => {
                        e.preventDefault();
                        console.info(userId);
                        let user = {
                          id: "5c392564f1b07a281d57d1e3",
                          firstname: data.me.firstname,
                          lastname: data.me.lastname
                        };
                        updateTodo({ variables: { user: user}});
                      }}
                    >
                      <BoxLeftRight
                        title="Nom"
                      >
                        <BorderedTextField
                          id="personal-information-name"
                          className={classes.textField}
                          onChange={this.handleChange('firstName')}
                          defaultValue={data.me.firstname}
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
                          onChange={this.handleChange('lastName')}
                          defaultValue={data.me.lastname}
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
                        {datas && <p>Changement fait</p>}
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
