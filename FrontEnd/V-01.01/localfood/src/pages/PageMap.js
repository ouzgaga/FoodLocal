import React, { Component } from 'react';
import MyMap from '../components/MyMap';

const tileData = [
  {

    "id": 1,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.783,
      "lng": 6.7
    }

  },
  {

    "id": 2,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.781,
      "lng": 6.53
    }

  },
  {

    "id": 3,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.77,
      "lng": 6.58
    }

  },
  {

    "id": 4,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.789,
      "lng": 6.69
    }

  },
  {
    "id": 5,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.795,
      "lng": 6.63
    }
  },
  {
    "id": 6,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.70,
      "lng": 6.47
    }
  },
  {
    "id": 7,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.74,
      "lng": 6.77
    }
  }
];

class PageMap extends Component {
  render() {
    return (
      <MyMap listProducers={tileData} />
    );
  }
}

export default PageMap;