import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Typography, Grid } from '@material-ui/core';
import Loading from '../components/Loading';
import ErrorLoading from '../components/ErrorLoading';
import NearProducers from '../components/accueil/NearProducers';
import FilterBar from '../components/accueil/FilterBar';
import logo from '../img/LogoCarrote.png';

const styles = ({
  root: {
    minHeight: 'calc(100vh)',
    width: '100wh',
  },
  title: {
    paddingLeft: '10%',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  description:{
    marginTop: 400,
    backgroundColor: '#FFFFFF',
  },
  nearProducers: {
    backgroundColor: '#E8F6F4',
    padding: 10
  },
  logo: {
    height: 150
  }
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
            street
            number
            postalCode
            city
            state
            country
            latitude
            longitude
            distance
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
        rating {
          grade
          nbRatings
        }
      }
    }
  }
}
`;

class PageAccueil extends Component {
  constructor(props) {
    super(props);
    document.title = 'Accueil';
    this.state = {
      products: [],
      maxDistance: 100,
      userLocation: {
        // par défaut, position de Lausanne
        latitude: 46.5333,
        longitude: 6.6667,
      },
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
    const { userLocation, maxDistance, products } = this.state;
    const { latitude, longitude } = userLocation;

    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <Grid container spacing={24} direction="row" alignItems="center">
            <Grid item>

              <img src={logo} className={classes.logo} alt="logo" readOnly tabIndex="-1" />
            </Grid>
            <Grid item>

              <Typography variant="h3" gutterBottom color="primary">Bienvenue sur FoodLocal.ch</Typography>
            </Grid>
          </Grid>
        </div>


      <div className={classes.description}>


      </div>

        <div className={classes.nearProducers}>
          <FilterBar />

          <Query
            query={GET_PRODUCERS_BY_LOCATION}
            variables={{ locationClient: { latitude, longitude, maxDistance: (maxDistance === 100 ? null : maxDistance * 1000) }, byProductTypeIds: products }} // TODO
          >
            {({
              data, loading, error, fetchMore
            }) => {
              if (error) return <ErrorLoading />;
              if (loading) return <Loading />;

              const { geoFilterProducers } = data;
              return (
                <NearProducers
                  products={products}
                  userLocation={userLocation}
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
                      const { pageInfo } = fetchMoreResult.geoFilterProducers;
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
      </div>
    );
  }
}

PageAccueil.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(styles)(PageAccueil);
