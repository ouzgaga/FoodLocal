import React from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { withApollo, Subscription } from 'react-apollo';

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

const subNotif = gql`
subscription {
  newNotificationReceived {
    person {
      firstname
    }
  }
}
`;

const queryNotif = gql`
  query{
    numberOfUnSeenNotificationsOfPerson
  }
`;

const mutClearNotifs = gql`
  mutation{
    setAllNotificationsAsSeen
  }
`;

class AuthProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: null,
      userMail: null,
      userStatus: null,
      isAdmin: false,
      userEmailValidated: false,
      userToken: null,

      notificationsCount: 0,

      error: null,

      signIn: this.signIn,
      signOut: this.signOut,
      //fetchNotifTotalCount: this.fetchNotifTotalCount, Test ultim pour les notifs
      clearNotifs: this.clearNotifs,
      clearError: this.clearError,
    };
  }

  clearError = () => {
    this.setState({ error: null });
  }


  clearNotifs = () => {
    const token = window.localStorage.getItem('token');
    if (token) {
      const { client } = this.props;
      client.mutate({ mutation: mutClearNotifs })
        .then(
          (data) => {
            this.setState({notificationsCount: 0});           
          }
        ).catch(
          (error) => {
            console.log("Error relog", error);
          }
        );
      }
  }

  fetchNotifTotalCount = () => {
    const token = window.localStorage.getItem('token');
    if (token) {
      const { client } = this.props;
      client.query({ query: queryNotif })
        .then(
          (data) => {
            this.setState({
              notificationsCount: data.data.numberOfUnSeenNotificationsOfPerson
            });
          }
        ).catch(
          (error) => {
            console.log("Error relog", error);
            this.signOut();
          }
        );
    }
  }

  componentWillMount() {
    const token = window.localStorage.getItem('token');
    if (token) this.addState(token);
    if (token) {
      const { client } = this.props;
      client.mutate({ mutation: mutRelog })
        .then(
          (data) => {
            this.addState(data.data.renewToken.token);
            window.localStorage.setItem('token', data.data.renewToken.token);           
          }
        ).catch(
          (error) => {
            console.log("Error relog", error);
            this.signOut();
          }
        );
    }
    this.fetchNotifTotalCount();
  }

  
  /*
    componentDidMount() {
      const { client } = this.props;
      const token = window.localStorage.getItem('token');
      if (token) {
        client.query({ query: queryNotif})
          .then(
            (data) => { 
              this.setState({
                notificationsCount: data.data.numberOfUnSeenNotificationsOfPerson
              })
            }
          ).catch(
            (error) => {
              console.log("Error relog", error);
              this.signOut();
            }
          );
  
        client.subscribe({query: subNotif}).then(
          (data) => { 
            this.setState(prevState => ({
              notificationsCount: ++prevState.notificationsCount
            }));
          }
        ).catch(
          (error) => {
            console.log("Error subscribe", error);
          }
        );
        
        }
      }
    }
  */

  // Permet de mettre à jour le token
  renewToken = (token) => {
    window.localStorage.setItem('token', token);
    this.addState(token);
  }

  // Décode le token et l'insère dans le state
  addState = (token) => {
    const decoded = jwtDecode(token);
    this.setState({
      notificationsCount: 0,
      userId: decoded.id,
      userMail: decoded.email,
      userStatus: decoded.kind,
      isAdmin: decoded.isAdmin,
      userEmailValidated: decoded.emailValidated,
      userToken: token,

      error: null,
    });
  }
/*
  subscribe = () => {
    // call the "subscribe" method on Apollo Client
    this.subscriptionObserver = this.props.client.subscribe({
      query: subNotif,
    }).subscribe({
      next(data) {
        this.setState(prevState => ({
          notificationsCount: ++prevState.notificationsCount
        }));
      },
      error(err) { console.error('err', err); },
    });
  }
*/

  signIn = async ({ userMail, password }) => {
    const { client } = this.props;
    return client.mutate({ mutation: mutLogin, variables: { email: userMail, password: password } }).then(
      (data) => {
        this.addState(data.data.login.token);
        window.localStorage.setItem('token', data.data.login.token);
        //this.subscribe();
        return true;
      }
    ).catch((error) => {
      console.info(error);
      this.setState({ error: 'Email ou mot de passe faux' });
      return false;
    });
    this.fetchNotifTotalCount();
  }

  signOut = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };


  render() {
    const { children } = this.props;
    return (
      <>
        <AuthContextProvider value={this.state}>
          {/*
            <Subscription
              subscription={subNotif}
              
            >
              {({ data: { person }, loading }) => (<> {!loading && this.setState(prevState => ({
                  notificationsCount: ++prevState.notificationsCount
              }))}</>)};
              
            </Subscription>
            */}
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
