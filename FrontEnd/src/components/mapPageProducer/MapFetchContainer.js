import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import './PageMap.css';
import ErrorLoading from '../ErrorLoading';
import Loading from '../Loading';
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

// Retourne les producteurs selon les filtres donnés
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
            latitude
            longitude
          }
        }
      }
    }
  }
}
`;

// fonction pour concaténer 2 arrays en éliminant les doublons
function arrayUnique(array) {
  const a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i].node.id === a[j].node.id) {
        a.splice(j--, 1);
      }
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
    const { products, userLocation, maxDistance } = this.state;
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
            if (loading) return <Loading />;

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
                    locationClient: { latitude, longitude, maxDistance: (maxDistance === 100 ? null : maxDistance * 1000) },
                    byProductTypeIds: products,
                  },
                  updateQuery: (prevResult, { fetchMoreResult }) => {
                    const newEdges = fetchMoreResult.geoFilterProducers.edges;
                    const { pageInfo } = fetchMoreResult.geoFilterProducers;
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
};

export default withStyles(styles)(MapFetchContainer);
