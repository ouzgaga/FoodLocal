import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { withSnackbar } from 'notistack';

import './App.css';

import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import Header from './components/Header';
import ProducerVue from './components/ProducerVue';

import { AuthContext } from './components/providers/AuthProvider';

import {
  PageAbout,
  PageMap,
  PageNewAccount,
  PageAccueil,
  PageProducer,
  PageEmailValidation,
  PageError404,
  PageProducerRegistration,
  PageAdmin,
  PagePersonalInformations,
  PageErrorLogin,
  PageErrorEmail,
} from './pages/Pages';


const drawerWidth = 400;

const styles = theme => ({
  root: {
    paddingTop: '64px',
  },
  appBar: {
    position: 'absolute',
    zIndex: 1900,
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    height: '100%',
  },
});


/*

const ProtectedUserRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(params) =>
      (
        <AuthContext>
          {({ userStatus, userToken }) => {
            //console.info("123", userEmailValidated);
            console.info("daym", userToken);
            if (userStatus === 'producers') { // Connecté mais pas d'email validé
              return <Component {...params} />;
            } 
            // pas connecté
            return (<Redirect to="/error/page404" />);
          }}
        </AuthContext>
      )}
  />
)
*/
const ProtectedProducerRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(params) =>
      (
        <AuthContext>
          {({ userStatus, userToken }) => {
            console.info("daym", userToken);
            if (userStatus === 'producers') { // Connecté mais pas d'email validé
              return <Component {...params} />;
            } 
            // pas connecté
            return (<Redirect to="/error/page404" />);
          }}
        </AuthContext>
      )}
  />
)

const ProtectedAdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(params) =>
      (
        <AuthContext>
          {({ isAdmin }) => isAdmin
            ? <Component {...params} />
            : <Redirect to="/" />}
        </AuthContext>
      )}
  />
)

const ProtectedValidateEmail = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(params) =>
      (
        <AuthContext>
          {({ userToken, userEmailValidated }) => userToken && !userEmailValidated
            ? <Redirect to="/error/email" />
            : <Component {...params} />
          }
        </AuthContext>
      )}
  />
)

const ProtectedErrorConected = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(params) =>
      (
        <AuthContext>
          {({ userToken }) => userToken
            ? <Redirect to="/map" />
            : <Component {...params} />
          }
        </AuthContext>
      )}
  />
)

const ProtectedErrorEmail = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(params) =>
      (
        <AuthContext>
          {({ userEmailValidated }) => !userEmailValidated
            ? <Redirect to="/map" />
            : <Component {...params} />
          }
        </AuthContext>
      )}
  />
)


class App extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes } = this.props;

    
 const ProtectedUserRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(params) =>
      (
        <AuthContext>
          {({ userEmailValidated, userToken }) => {
            if (userToken && !userEmailValidated) { // Connecté mais pas d'email validé
            
              return (<Redirect to="/error/email" />);
            } else if (userToken && userEmailValidated) { // Connecté et email validé
              return <Component {...params} />;
            }
            // pas connecté
            this.props.enqueueSnackbar('Connexion requise pour avoir accps', "info");
            return (<Redirect to="/error/notConnected" />);
          }}
        </AuthContext>
      )}
  />
)

    return (
      <div className={classes.root}>
        <Header />
        <div className={classes.page} center="xs">
          <Switch>
            <Route path="/" exact component={PageAccueil} classes={classes} />
            <ProtectedUserRoute default path="/about" exact component={PageAbout} classes={classes} />
            <Route path="/newAccount" exct component={PageNewAccount} classes={classes} />
            <Route path="/producerRegistration" exct component={PageProducerRegistration} classes={classes} />
            <ProtectedAdminRoute path="/admin" exct component={PageAdmin} classes={classes} />
            <Route path="/map" exact component={PageMap} classes={classes} />
            <Route path="/producer/:producerId" component={PageProducer} />
            <Route path="/validationEmail/:token" component={PageEmailValidation} />
            <Route path="/pageproducer" component={PageProducer} classes={classes} />
            <ProtectedUserRoute path="/settings" component={PagePersonalInformations} classes={classes} />
            <ProtectedErrorEmail path="/error/email" component={PageErrorEmail} />
            <ProtectedErrorConected path="/error/notConnected" component={PageErrorLogin} />
            <Route path="/error/page404" component={PageError404} classes={classes} />
            <Route path="*" component={PageError404} classes={classes} />
          </Switch>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(withSnackbar(App));
