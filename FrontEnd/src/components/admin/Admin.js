import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import TableProducers from './TableProducers';
import Loading from '../Loading';
import ErrorLoading from '../ErrorLoading';

// TODO : implémenter la pagination

const GET_PRODUCERS_NUMBER = gql`
 query {
  producers {
    totalCount
  }
 }
 `;

const GET_ALL_PRODUCERS = gql`
  query($after : String) {
  producers(first : 20, after : $after) {
    totalCount
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
        salespoint {
          name
        }
        isValidated
      }
    }
  }
}
`;

const styles = {
  root: {
    padding: 20,
  },
};

class Admin extends Component {
  constructor(props) {
    super(props);
    document.title = 'Administrateur';
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h3">
          {'Administrateur'}
        </Typography>

        <Query
          query={GET_ALL_PRODUCERS}
        >
          {({
            data, loading, error, fetchMore
          }) => {
            if (error) return <ErrorLoading />;
            const producers = data.producers;

            return (
              <TableProducers
                loading={loading}
                entries={producers}
                onLoadMore={() => fetchMore({
                  variables: {
                    after: producers.pageInfo.endCursor
                  },
                  updateQuery: (prevResult, { fetchMoreResult }) => {
                    const newEdges = fetchMoreResult.producers.edges;
                    const pageInfo = fetchMoreResult.producers.pageInfo;
                    return newEdges.length
                      ? {
                        producers: {
                          __typename: prevResult.producers.__typename,
                          edges: [...prevResult.producers.edges, ...newEdges],
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

export default withStyles(styles)(Admin);
