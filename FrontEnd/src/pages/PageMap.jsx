import React from 'react';
import MapFetchContainer from '../components/mapPageProducer/MapFetchContainer';

class PageMap extends React.Component {
  constructor(props) {
    super(props);
    document.title = 'Carte';

  }

  render() {

    return (

      <MapFetchContainer />

    );
  }
}

export default PageMap;
