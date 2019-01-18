import React from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

// Pour décoder le token
let jwtDecode = require('jwt-decode');


const {
  Provider: NotifContextProvider,
  Consumer: NotifContext,
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

class NotificationProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationCount: 0,
      resetCount: this.resetCount,
    };
  }

  componentDidMount() {
  }

  // Réinitalise le nombre de notifications à 0
  resetCount = () =>{
    this.setState({
      notificationCount: 0,
    });
  }

  render() {
    const { children } = this.props;
    return (
      <>
        <NotifContextProvider value={this.state}>
          {children}
        </NotifContextProvider>
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


export { NotifContext };
export default withApollo(NotificationProvider);
