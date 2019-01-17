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
  geoFilterProducers(locationClient: $locationClient, byProductTypeIds: $byProductTypeIds, first:10, after: $cursor ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges{
      cursor
      node {
        id
        image
        salespoint {
          name
          address {
            city
            latitude
            longitude
            distance
          }
        }
        products {
          edges {
            node {
              productType {
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

class MapFetchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      location: {
        // par défaut, position de Lausanne
        latitude: 46.5333,
        longitude: 6.6667,
      },
      maxDistance: 100,
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        location: {
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

  render() {
    const { classes } = this.props;
    const { products, location, maxDistance } = this.state;
    const { latitude, longitude } = location;
    return (
      <div className={classes.root}>

        <Query
          query={GET_PRODUCERS_BY_LOCATION}
          variables={{ locationClient: { latitude, longitude, maxDistance: (maxDistance === 100 ? null : maxDistance * 1000) }, byProductTypeIds: products }} // TODO
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
                location={location}
                maxDistance={maxDistance}
                addProduct={this.addProduct}
                removeProduct={this.removeProduct}
                changeMaxDistance={this.changeMaxDistance}
                loading={loading}
                entries={geoFilterProducers}
                onLoadMore={() => fetchMore({
                  variables: {
                    locationClient: { latitude, longitude, maxDistance: (maxDistance === 100 ? null : maxDistance * 1000) },
                    byProductTypeIds: products,
                    cursor: geoFilterProducers.pageInfo.endCursor
                  },
                  updateQuery: (prevResult, { fetchMoreResult }) => {
                    const newEdges = fetchMoreResult.geoFilterProducers.edges;
                    const pageInfo = fetchMoreResult.geoFilterProducers.pageInfo;
                    return newEdges.length
                      ? {
                        geoFilterProducers: {
                          __typename: prevResult.geoFilterProducers.__typename,
                          edges: [...prevResult.geoFilterProducers.edges, ...newEdges],
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
