import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroller';
import { List, ListItem, Card, CardActionArea } from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

/**
 * Classe pour la table contenant les différente issues
 */
class TableProducers extends React.Component {
  render() {
    if (!this.props.entries && this.props.loading) return <p>Loading....</p>;
    const producers = this.props.entries.edges || [];
    console.log(this.props);
    return (
      <List>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => this.props.onLoadMore()}
          hasMore={this.props.entries.pageInfo.hasNextPage}
        >
          {producers.map(({ node }) => (
            node.salespoint && (
              <Card>
                <CardActionArea>
                  <ListItem key={node.id}>
                    <div>{node.isValidated ? 'salut' : 'non'}</div>
                  </ListItem>
                </CardActionArea>
              </Card>
            )
          ))
          }

        </InfiniteScroll>

        {this.props.loading && <h2>Loading...</h2>}
      </List>
    );
  }
}

TableProducers.propTypes = {
  classes: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
};

export default withStyles(styles)(TableProducers);
