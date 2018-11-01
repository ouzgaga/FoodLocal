import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Header from './components/Header';
import Theme from './components/Theme';
import ProducerVue from './components/ProducerVue';

import {
  PageAbout,
  PageMap,
  PageNewAccount,
  PageError404,
} from './pages/Pages';


const drawerWidth = 400;

const styles = theme => ({
  root: {
    paddingTop: 64,
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

class App extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <div>
          <Router>
            <MuiThemeProvider theme={Theme}>
              <Header />
              <div className={classes.page} center="xs">
                <Switch>
                  <Route default path="/about" exact component={PageAbout} classes={classes} />
                  <Route path="/newAccount" exct component={PageNewAccount} classes={classes} />
                  <Route path="/" exact component={PageMap} classes={classes} />
                  <Route path="/producer/:producerId" component={ProducerVue} />
                  <Route path="*" component={PageError404} classes={classes} />
                </Switch>
              </div>
            </MuiThemeProvider>
          </Router>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);


/*
class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={Theme}>
        <div className="App" >
          <Header theme={Theme} />
          <div className="container">
            <div className="map">
              <MyMap listProducers={tileData} />
            </div>
            <div className="listProducer">
              <Search />
            </div>
          </div>
        <Footer/>
        </div>
      </MuiThemeProvider>
    );
  }
}
export default App;
*/
