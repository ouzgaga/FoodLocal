import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import MainMap from '../components/mapPageProducer/MainMap';
import Loading from '../components/Loading';
import ErrorLoading from '../components/ErrorLoading';
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
