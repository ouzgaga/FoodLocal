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
  query($first : Int) {
  producers(first : $first) {
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
          query={GET_PRODUCERS_NUMBER}
        >
          {({ data : dataNumber, loading : loading2, error : error2 }) => {
            if (error2) return <ErrorLoading />;
            if (loading2) return <Loading />;
            return (
              <Query
                query={GET_ALL_PRODUCERS}
                variables={{ first: dataNumber.producers.totalCount }} // TODO
              >
                {({ data, loading, error }) => {
                  if (error) return <ErrorLoading />;
                  if (loading) return <Loading />;
                  const { producers } = data;
                  console.log(producers)
                  return (
                    <TableProducers entries={producers} />
                  );
                }}
              </Query>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default withStyles(styles)(Admin);
