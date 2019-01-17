import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import MyMap from './MyMap';

import './PageMap.css';
import ErrorLoading from '../ErrorLoading';
import Loading from '../Loading';
import Search from './Search';
import MainMap from './MainMap';

const styles = ({
  root: {
    flexGrow: 1,
    height: 'calc(100vh - 64px)',
    width: '100vw',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
});

const GET_PRODUCERS_BY_LOCATION = gql`
query($locationClient : ClientLocation!, $byProductTypeIds : [ID!], $cursor: String) {
  geoFilterProducers(locationClient: $locationClient, byProductTypeIds: $byProductTypeIds, first:100, after: $cursor ) {
    edges{
      cursor
      node {
        id
        image
        salespoint {
          address {
            city
            latitude
            longitude
          }
        }
        products {
          edges {
            node {
              productType {
                id
                name
                image
              }
            }
          }
        }
      }
    }
  }
}
`;

function arrayUnique(array) {
  console.log(array)
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i].node.id === a[j].node.id)
              a.splice(j--, 1);
      }
  }

  return a;
}

class MapFetchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      userLocation: {
        // par défaut, position de Lausanne
        latitude: 46.5333,
        longitude: 6.6667,
      },
      mapLocation: {},
      maxDistance: 100,
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        mapLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
    });
  }

  addProduct = newProducts => () => {
    const { products } = this.state;
    this.setState({
      products: [...products, newProducts]
    });
  }

  // supprime un produit du tableau des produits
  removeProduct = productsToDelete => () => {
    const { products } = this.state;
    const newProducts = products.filter(item => item !== productsToDelete);

    this.setState({
      products: [...newProducts]
    });
  }

  changeMaxDistance = value => () => {
    this.setState({
      maxDistance: value
    });
  };

  changeMapLocation = (newLocation) => {
    console.log(newLocation)
    this.setState({
      mapLocation: {
        latitude: newLocation.center[0],
        longitude: newLocation.center[1],
      }
    });
  }

  render() {
    const { classes } = this.props;
    const { products, userLocation, mapLocation, maxDistance } = this.state;
    return (
      <div className={classes.root}>

        <Query
          query={GET_PRODUCERS_BY_LOCATION}
          variables={{ locationClient: { latitude: userLocation.latitude, longitude: userLocation.longitude, maxDistance: (maxDistance === 100 ? null : maxDistance * 1000) }, byProductTypeIds: products }} // TODO
        >
          {({
            data, loading, error, fetchMore
          }) => {
            if (error) return <ErrorLoading />;
            if (loading && !data.geoFilterProducers) return <Loading />;

            const { geoFilterProducers } = data;
            return (
              <MainMap
                products={products}
                userLocation={userLocation}
                maxDistance={maxDistance}
                addProduct={this.addProduct}
                removeProduct={this.removeProduct}
                changeMaxDistance={this.changeMaxDistance}
                changeMapLocation={this.changeMapLocation}
                loading={loading}
                entries={geoFilterProducers}
                onLoadMore={(latitude, longitude) => fetchMore({
                  variables: {
                    locationClient: { latitude:latitude, longitude:longitude, maxDistance: (maxDistance === 100 ? null : maxDistance * 1000) },
                    byProductTypeIds: products,
                  },
                  updateQuery: (prevResult, { fetchMoreResult }) => {
                    const newEdges = fetchMoreResult.geoFilterProducers.edges;
                    const pageInfo = fetchMoreResult.geoFilterProducers.pageInfo;
                    console.log(newEdges)
                    return newEdges.length
                      ? {
                        geoFilterProducers: {
                          __typename: prevResult.geoFilterProducers.__typename,
                          edges: arrayUnique(prevResult.geoFilterProducers.edges.concat(newEdges)),
                          pageInfo
                        }
                      }
                      : prevResult;
                  }
                })
                }
              />
            );
          }}
        </Query>
      </div>
    );
  }
}

MapFetchContainer.propTypes = {
  classes: PropTypes.shape().isRequired,
  theme: PropTypes.shape().isRequired,
};

export default withStyles(styles)(MapFetchContainer);
