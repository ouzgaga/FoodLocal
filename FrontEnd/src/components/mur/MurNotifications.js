import React from 'react';
import PropTypes from 'prop-types';
import { Typography, LinearProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../Loading';

const styles = ({

});


function MurNotifications(props) {
  const {
    classes, loading, entries, onLoadMore
  } = props;

  if (!entries && loading) return <Loading />;
  const posts = entries.edges || [];
  return (
    <>
      <Typography className={classes.title} variant="h6" color="primary" gutterBottom>Actualités</Typography>
{console.log(posts)}
      <InfiniteScroll
        pageStart={0}
        loadMore={() => onLoadMore()}
        hasMore={entries.pageInfo.hasNextPage}
        loader={<LinearProgress />}
      >
        {posts.map(({ node }) => (
          <Typography>{node.id}</Typography>
        ))
        }

      </InfiniteScroll>

      {loading && <div>Chargement...</div>}

    </>
  );
}


MurNotifications.propTypes = {
  classes: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default withStyles(styles)(MurNotifications);
