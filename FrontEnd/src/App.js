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
  PageWall,
  PageMyProducers,
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


// Les fonctions si dessous sont nos redirection. Nous avons décidé de faire une fonction par type de redirection pour simplifier

const ProtectedProducerRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={params => (
      <AuthContext>
        {({ userStatus, userToken, userEmailValidated }) => {
          if (userToken && !userEmailValidated) { // Connecté mais pas d'email validé
            return (<Redirect to="/error/email" />);
          }
          if (userStatus === 'producers') { // Connecté mais pas d'email validé
            return <Component {...params} />;
          }
          // pas connecté
          return (<Redirect to="/error/notConnected" />);
        }}
      </AuthContext>
    )}
  />
);
const ProtectedAdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={params => (
      <AuthContext>
        {({ isAdmin }) => isAdmin
          ? <Component {...params} />
          : <Redirect to="/" />}
      </AuthContext>
    )}
  />
);
const ProtectedValidateEmail = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={params => (
      <AuthContext>
        {({ userToken, userEmailValidated }) => userToken && !userEmailValidated
          ? <Redirect to="/map" />
          : <Component {...params} />
        }
      </AuthContext>
    )}
  />
);

const ProtectedErrorConected = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={params => (
      <AuthContext>
        {({ userToken }) => userToken
          ? <Redirect to="/map" />
          : <Component {...params} />
        }
      </AuthContext>
    )}
  />
);

const ProtectedErrorEmail = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={params => (
      <AuthContext>
        {({ userEmailValidated }) => !userEmailValidated
          ? <Redirect to="/map" />
          : <Component {...params} />
        }
      </AuthContext>
    )
    }
  />
);

const ProtectedUserRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={params => (
      <AuthContext>
        {({ userEmailValidated, userToken }) => {
          if (userToken && !userEmailValidated) { // Connecté mais pas d'email validé
            return (<Redirect to="/error/email" />);
          }
          if (userToken && userEmailValidated) { // Connecté et email validé
            return <Component {...params} />;
          }
          return (<Redirect to="/error/notConnected" />);
        }}
      </AuthContext>
    )}
  />
);

class App extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes } = this.props;


    

    return (
      <div className={classes.root}>
        <Header />
        <div className={classes.page} center="xs">
          <Switch>
            <Route path="/" exact component={PageAccueil} classes={classes} />
            <Route default path="/about" exact component={PageAbout} classes={classes} />
            <Route path="/newAccount" exct component={PageNewAccount} classes={classes} />
            <Route path="/producerRegistration" exct component={PageProducerRegistration} classes={classes} />
            <ProtectedAdminRoute path="/adminSection" exct component={PageAdmin} classes={classes} />
            <Route path="/map" exact component={PageMap} classes={classes} />
            <ProtectedUserRoute default path="/myWall" exact component={PageWall} classes={classes} />
            <ProtectedUserRoute default path="/myProducers" exact component={PageMyProducers} classes={classes} />
            <Route path="/producer/:producerId" component={PageProducer} />
            <Route path="/validationEmail/:token" component={PageEmailValidation} />
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
