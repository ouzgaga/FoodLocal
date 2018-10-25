import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import Header from './components/Header';
import Theme from './components/Theme';


import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

import {
  PageAbout,
  PageMap,
  PageNewAccount,
  PageError404,
} from './pages/Pages.js'; 


const styles = theme =>({
  page:{
    paddingTop: 64,
  },
});

class App extends Component {

  render() {
    const classes = this.props.classes;

    return (
      
      <div className="App" >
        <Router>
          <MuiThemeProvider  theme={Theme}>
            <Header/>
            
            <div  className={classes.page} center="xs">
              <Switch>
                <Route default path="/about"  component={PageAbout} classes={classes}/>
                <Route path="/newAccount" component={PageNewAccount} classes={classes}/>
                <Route path="/" exact component={PageMap} classes={classes}/>
                <Route path="*" component={PageError404} classes={classes}/> 
                <Route component={PageError404}/>
              </Switch> 
            </div>
              
            
          </MuiThemeProvider>
        </Router>
      </div>
    );
  }
}

export default withStyles(styles)(App);

