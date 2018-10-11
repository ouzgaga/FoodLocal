import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'; 
import Theme from './components/Theme';
import Login from './components/Login.js';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider  theme={Theme}>
        <div className="App" >
          <Header   theme={Theme } />
        </div>
        
      </MuiThemeProvider>
    );
  }
}

export default App;
