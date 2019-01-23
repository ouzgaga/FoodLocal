import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Loading from '../components/Loading';
import ErrorLoading from '../components/ErrorLoading';
import { AuthContext } from '../components/providers/AuthProvider';
import MyProducers from '../components/accueil/MyProducers';

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
  description: {
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

const GET_MY_PRODUCERS = gql`
query($token: String!) {
  me(token: $token) {
    followingProducers(first: 10) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
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
}
`;

class PageMyProducers extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>

        <AuthContext>
          {({ userToken }) => (

            <Query
              query={GET_MY_PRODUCERS}
              variables={{ token: userToken }}
            >
              {({
                data, loading, error, fetchMore
              }) => {
                if (error) return <ErrorLoading />;
                if (loading) return <Loading />;
                return (
                  <MyProducers
                    loading={loading}
                    entries={data.me}
                    onLoadMore={() => fetchMore({
                      variables: {
                        token: userToken,
                        cursor: data.me.followingProducers.pageInfo.endCursor
                      },
                      updateQuery: (prevResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.me.followingProducers.edges;
                        const { pageInfo } = fetchMoreResult.me.followingProducers;
                        return newEdges.length
                          ? {
                            me: {
                              __typename: prevResult.me.__typename,
                              followingProducers: {
                                __typename: prevResult.me.followingProducers.__typename,
                                edges: [...prevResult.me.followingProducers.edges, ...newEdges],
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
        </AuthContext>

      </div>
    );
  }
}

export default withStyles(styles)(PageMyProducers);
