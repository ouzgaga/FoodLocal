import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Typography, FormControl, Grid, TextField, InputLabel, Select, MenuItem
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import TableProducers from './TableProducers';
import Loading from '../Loading';
import ErrorLoading from '../ErrorLoading';
import TableProducerItem from './TableProducerItem';

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

const GET_PRODUCERS_WAITING_FOR_VALIDATION = gql`
query($after : String) {
  producersWaitingForValidation(first : 20, after : $after) {
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

const GET_PRODUCER_BY_ID = gql`
query($producerId: ID!) {
  producer(producerId: $producerId) {
    id
    salespoint {
      name
    }
    isValidated   
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
    this.state = {
      recherche: 0,
      idProducer: null,
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { recherche, idProducer } = this.state;
    return (
      <div className={classes.root}>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <Typography variant="h6">
              {'Recherche'}
            </Typography>
          </Grid>
          <Grid>
            <form className={classes.root} autoComplete="off">
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Age</InputLabel>
                <Select
                  value={recherche}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'recherche',
                    id: 'age-simple',
                  }}
                >
                  <MenuItem value={0}>Validés</MenuItem>
                  <MenuItem value={1}>Non Validés</MenuItem>
                  <MenuItem value={2}>Par ID</MenuItem>
                </Select>
              </FormControl>
            </form>
          </Grid>
        </Grid>

        {recherche === 0
          && (
            <Query
              query={GET_ALL_PRODUCERS}
            >
              {({
                data, loading, error, fetchMore
              }) => {
                if (error) return <ErrorLoading />;
                const { producers } = data;

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
                        const { pageInfo } = fetchMoreResult.producers;
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
          )}

        {recherche === 1
          && (

            <Query
              query={GET_PRODUCERS_WAITING_FOR_VALIDATION}
            >
              {({
                data, loading, error, fetchMore
              }) => {
                if (error) return <ErrorLoading />;
                const { producers } = data;

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
                        const { pageInfo } = fetchMoreResult.producers;
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
          )}

        {recherche === 2
          && (
            <>
              <TextField
                id="idProducer"
                label="ID producteur"
                className={classes.textField}
                value={idProducer}
                onChange={this.handleChange}
                margin="normal"
                inputProps={{
                  name: 'idProducer',
                  id: 'age-simple',
                }}
              />
              {idProducer
                && (
                  <Query
                    query={GET_PRODUCER_BY_ID}
                    variables={{ producerId: idProducer }}
                  >
                    {({
                      data, loading, error
                    }) => {
                      if (error) return <ErrorLoading />;
                      if (loading) return <Loading />;
                      const { producer } = data;

                      return (
                        <>
                          {producer
                            ? (<TableProducerItem producer={producer} />
                            )
                            : (
                              <Typography>
                                {'L\'ID entré ne correspond à aucun producteur'}
                              </Typography>
                            )}

                        </>
                      );
                    }}
                  </Query>
                )
              }

            </>
          )}
      </div>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(styles)(Admin);
