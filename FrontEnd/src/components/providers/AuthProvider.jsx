import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';


const {
  Provider: AuthContextProvider,
  Consumer: AuthContext,
} = React.createContext();

const mutLogin = gql`
  mutation ($email: String!, $password: String!){
    login(email:$email, password:$password){
      token
    }
  }
  `;

class AuthProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userMail: null,
      userStatus: null,
      isAdmin: false,
      userToken: null,


      error: null,

      signIn: this.signIn,
      signOut: this.signOut,
    };
  }

  componentDidMount() {
    const token = window.localStorage.getItem('token');
    if (token) {
      // Récupéréer client.query()
    }
  }

  executeLogin = (email, password) => {
    const { client } = this.props;

    return client.mutate({ mutation: mutLogin, variables: { email, password } }).then(
      (data) => {
        console.info(data.data.login.token);
        return data.login.token;
      }
    ).catch(error => {
      console.log(error);
      return null;
    });
  }

  signIn = async ({ userMail, password }) => {
    
    const tmpToken = await this.executeLogin(userMail, password);

    if (tmpToken === null) {
      this.setState({
        error: 'Email ou mot de passe invalide.',
      });
    } else {
      const payload = tmpToken.substring(
        tmpToken.indexOf('.') + 1,
        tmpToken.lastIndexOf('.')
      );
  
      const objJsonB64 = Buffer.from(payload).toString("base64");
      console.info(objJsonB64);

      this.setState({
        userMail: userMail,
        userStatus: 'admin',
        userToken: tmpToken,
        error: '',
      });

      window.localStorage.setItem('token', tmpToken);
    }
  }

  signOut = () => {
    
  }


  render() {
    const { children } = this.props;

    return (
      <>
        <AuthContextProvider value={this.state}>
          {children}
        </AuthContextProvider>
      </>
    );
  }
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};

AuthProvider.defaultProps = {
  children: null,
};

export { AuthContext };
export default withApollo(AuthProvider);



