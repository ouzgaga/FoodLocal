import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import ProducerInformations from './ProducerInformations';
import ProductsInformations from './ProductsInformations';
import ProducerMur from './ProducerMur';
import Loading from '../Loading';
import ErrorLoading from '../ErrorLoading';
import InfiniteScroll from 'react-infinite-scroller';

const styles = {
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    widht: 1000,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  contentTabs: {
    marginTop: 20,
  }
};

const GET_PRODUCER_INFORMATIONS = gql`
query($producer: ID!) {
  producer(producerId: $producer) {
    email
    phoneNumber
    website
    salespoint {
      name
      address {
        number
        street
        city
        postalCode
        state
        country
        longitude
        latitude
      }
      schedule {
        monday {
          openingHour
          closingHour
        }
        tuesday {
          openingHour
          closingHour
        }
        wednesday {
          openingHour
          closingHour
        }
        thursday {
          openingHour
          closingHour
        }
        friday {
          openingHour
          closingHour
        }
        saturday {
          openingHour
          closingHour
        }
        sunday {
          openingHour
          closingHour
        }
      }
    }
  }
}
`;

// TODO : Changer le 5 en 10
const GET_PRODUCER_PRODUCTS = gql`
query($producerId: ID!, $cursor:String) {
  producer(producerId: $producerId) {
    products(first: 3, after:$cursor) {
      pageInfo{
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          description
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
`;

// TODO : Changer le 2 en 10
const GET_POSTS_OF_PRODUCER = gql`
  query($producerId: ID!, $cursor:String){
  postsOfProducer(producerId: $producerId, first: 4, after:$cursor){
    pageInfo{
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    edges{
      cursor
      node{
        id
        producer{
          firstname
          lastname
          image
        }
        text
        publicationDate
        address{
          number
          street
          city
          postalCode
          state
          country
          longitude
          latitude
        }
      }
    }
  }
}
`;

class ProducerContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, producerId } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Informations" />
          <Tab label="Produits" />
          <Tab label="Actualités" />
        </Tabs>
        <div className={classes.contentTabs}>
          {value === 0
            && (
              <Query
                query={GET_PRODUCER_INFORMATIONS}
                variables={{ producer: producerId }}
              >
                {({ data, loading, error }) => {
                  if (error) return <ErrorLoading />;
                  if (loading) return <Loading />;
                  return (
                    <ProducerInformations data={data} />
                  );
                }}
              </Query>
            )
          }
          {value === 1 && (

            <Query
              query={GET_PRODUCER_PRODUCTS}
              variables={{ producerId }}
            >
              {({
                data, loading, error, fetchMore
              }) => {
                if (error) return <ErrorLoading />;

                console.log('a', data)
                return (
                  <ProductsInformations
                    loading={loading}
                    entries={data.producer}
                    onLoadMore={() => fetchMore({
                      variables: {
                        producerId,
                        cursor: data.producer.products.pageInfo.endCursor
                      },
                      updateQuery: (prevResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.producer.products.edges;
                        const pageInfo = fetchMoreResult.producer.products.pageInfo;
                        return newEdges.length
                          ? {
                            producer: {
                              __typename: prevResult.producer.__typename,
                              products: {
                                __typename: prevResult.producer.products.__typename,
                                edges: [...prevResult.producer.products.edges, ...newEdges],
                                pageInfo
                              }
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
          )}
          {value === 2 && (
            <Query
              query={GET_POSTS_OF_PRODUCER}
              variables={{ producerId }}
            >
              {({
                data, loading, error, fetchMore
              }) => {
                if (error) return <ErrorLoading />;
                const postsOfProducer = data.postsOfProducer;

                return (
                  <ProducerMur
                    loading={loading}
                    entries={postsOfProducer}
                    onLoadMore={() => fetchMore({
                      variables: {
                        producerId,
                        cursor: postsOfProducer.pageInfo.endCursor
                      },
                      updateQuery: (prevResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.postsOfProducer.edges;
                        const pageInfo = fetchMoreResult.postsOfProducer.pageInfo;
                        return newEdges.length
                          ? {
                            postsOfProducer: {
                              __typename: prevResult.postsOfProducer.__typename,
                              edges: [...prevResult.postsOfProducer.edges, ...newEdges],
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
          )}
        </div>
      </div>
    );
  }
}

ProducerContent.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(styles)(ProducerContent);
