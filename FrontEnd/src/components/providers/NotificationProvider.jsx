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


const subNotif = gql`
  subscription{
    newNotificationReceived{
      id
    }
  }
  `;


class NotificationProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationCount: 0,
      resetCount: this.resetCount,
      subscribe: this.subscribe,
    };
  }

  componentDidMount() {
    const repoName = this.props.entry.repository.full_name;
    const updateQueryFunction = this.props.updateCommentsQuery;
    this.subscribe(repoName, updateQueryFunction);
  }

  subscribe = () => {
    // call the "subscribe" method on Apollo Client
    this.subscriptionObserver = this.props.client.subscribe({
      query: subNotif,
    }).subscribe({
      next(data) {
        this.setState(prevState => ({
          notificationCount: ++prevState.notificationCount
        }));
      },
      error(err) { console.error('err', err); },
    });
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
