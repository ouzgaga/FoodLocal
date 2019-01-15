import React from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

// Pour décoder le token
let jwtDecode = require('jwt-decode');


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

const mutRelog = gql`
  mutation{
    renewToken{
      token
    }
  }
  `;

class AuthProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: null,
      userMail: null,
      userStatus: null,
      isAdmin: false,
      userEmailValidated: false,
      userToken: null,


      error: null,

      signIn: this.signIn,
      signOut: this.signOut,
      //renewToken: this.renewToken,
      resetError: this.setState({error: null}),
    };
  }


  componentDidMount() {
    const token = window.localStorage.getItem('token');
    console.log(token);
    if (token) {
      const { client } = this.props;
      client.mutate({ mutation: mutRelog })
        .then(
          (data) => {
            //this.addState(data.data.renewToken.token);
            const decoded = jwtDecode(token);
            this.setState({
              userID: decoded.id,
              userMail: decoded.email,
              userStatus: decoded.kind,
              isAdmin: decoded.isAdmin,
              userEmailValidated: decoded.emailValidated,
              userToken: token,
        
              error: null,
            });
            console.info(this.state.userID)
            console.info(this.state.userToken);
            window.localStorage.setItem('token', data.data.renewToken.token);
          }
        ).catch(
          (error) => {
            console.log("Error relog", error);
            this.signOut();
          }
        );
    }
  }

  // permet de mettre à jour le token
  renewToken = (token) => {
    window.localStorage.setItem('token', token);
    this.addState(token);
  }

  // Décode le token et l'insère dans le state
  addState = (token) => {
    const decoded = jwtDecode(token);
    console.info("token", token);
    this.setState({
      userID: decoded.id,
      userMail: decoded.email,
      userStatus: decoded.kind,
      isAdmin: decoded.isAdmin,
      userEmailValidated: decoded.emailValidated,
      userToken: token,

      error: null,
    });
    console.info(this.state.userID)
    console.info(this.state.userToken);
  }

  signIn = async ({ userMail, password }) => {
    const { client } = this.props;

    return client.mutate({ mutation: mutLogin, variables: { email: userMail, password: password } }).then(
      (data) => {
        console.log(data);
        this.addState(data.data.login.token);
        window.localStorage.setItem('token', data.data.login.token);
        return true;
      }
    ).catch((error) => {
      console.info(error);
      this.setState({ error: 'Email ou mot de passe faux' });
      return false;
    });
  }

  signOut = () => {
    localStorage.removeItem('token');
    window.location.reload();
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
