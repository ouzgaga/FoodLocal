import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroller';

import ListItemProducer from './ListItemProducer';
import Loading from '../Loading';
import ErrorLoading from '../ErrorLoading';

const styles = ({
  list: {
    backgroundColor: 'transparent',
  },
  listItem: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 0,
  },
});

class Search extends React.Component {

  render() {
    const { classes, handleHover, resetHover, latitude, longitude, maxDistance, entries, onLoadMore } = this.props;

    console.log(onLoadMore)
    return (
      <div style={{ minHeight: `100vh - 64px` }}>

          <List className={classes.list}>

            <InfiniteScroll
              loadMore={onLoadMore}
              hasMore={this.props.entries.pageInfo.hasNextPage}
              loader={<p>Loading...</p>}
            >

              {entries.edges.map(({ node }) => (

                <ListItem className={classes.listItem} key={node.id}>

                  <ListItemProducer producer={node} handleHover={handleHover} resetHover={resetHover} />

                </ListItem>
              ))
              }
            </InfiniteScroll>

          </List>
      </div>
    );
  }
}

export default withStyles(styles)(Search);
