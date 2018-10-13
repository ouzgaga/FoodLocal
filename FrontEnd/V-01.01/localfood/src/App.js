import React, { Component } from 'react';

import './App.css';
import Header from './components/Header'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'; 
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
  PageError404,
} from './pages/Pages.js'; 



class App extends Component {
  render() {
    return (
      <div className="App" >
      <Router>
        <MuiThemeProvider  theme={Theme}>
        <Header theme={Theme}/>
          <Switch>
           

            <Route default path="/" exact component={PageAbout} />
            <Route path="/map" exact component={PageMap} />
            <Route path="*" component={PageError404}/>  

          </Switch>
          
        </MuiThemeProvider>
      </Router>
      </div>
    );
  }
}

export default App;
