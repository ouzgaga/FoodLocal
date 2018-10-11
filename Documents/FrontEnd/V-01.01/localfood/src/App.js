import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'; 
import Theme from './components/Theme';
import Login from './components/Login.js';
import { Grid, Paper } from '@material-ui/core';
import MyMap from './components/MyMap'

const tileData = [
  {

    "id": 1,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.783,
      "lng": 6.65
    }

  },
  {

    "id": 2,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.783,
      "lng": 6.65
    }

  },
  {

    "id": 3,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.77,
      "lng": 6.65
    }

  },
  {

    "id": 4,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.789,
      "lng": 6.65
    }

  },
  {
    "id": 5,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.795,
      "lng": 6.65
    }
  },
  {
    "id": 6,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.70,
      "lng": 6.65
    }
  },
  {
    "id": 7,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.74,
      "lng": 6.65
    }
  }
];

class App extends Component {
  render() {
    return (
      <MuiThemeProvider  theme={Theme}>
        <div className="App" >
        
          <Header theme={Theme } />
          <div className="container"></div>
          <div className="map">
            <MyMap listProducers={tileData} />
          </div>
          <div className="listProducer">
           
          </div>

        </div>
        <div className="footer">
        </div>
        
      </MuiThemeProvider>
    );
  }
}

export default App;
