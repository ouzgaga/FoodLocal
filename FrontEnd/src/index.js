import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Button from '@material-ui/core/Button';

import { SnackbarProvider } from 'notistack';

import {
  BrowserRouter as Router,
} from 'react-router-dom';

import Theme from './components/Theme';

import AuthProvider from './components/providers/AuthProvider';

import './index.css';

import 'leaflet/dist/leaflet.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

const httpLink = createHttpLink({
  uri: 'https://api.foodlocal.ch/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "x-token": token ? token : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <MuiThemeProvider theme={Theme}>
        <SnackbarProvider
          maxSnack={3}
          action={[
            <Button size="small">Close</Button>
          ]}
          onClickAction={() => alert('Clicked on my action button.')}
        >
          <AuthProvider>
            <App />
          </AuthProvider>
        </SnackbarProvider>
      </MuiThemeProvider>
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
