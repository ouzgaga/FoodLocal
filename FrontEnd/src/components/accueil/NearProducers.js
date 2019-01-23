import React from 'react';
import PropTypes from 'prop-types';
import { Typography, LinearProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroller';
import ProducerItem from './ProducerItem';
import Loading from '../Loading';

const styles = ({
  title: {
    marginLeft:'2%',
  }
});


function NearProducers(props) {
  const {
    classes, userLocation, loading, entries, onLoadMore
  } = props;

  if (!entries && loading) return <Loading />;
  const producers = entries.edges || [];

  return (
    <>
      <Typography className={classes.title} variant="h6" color="primary" gutterBottom>Producteurs à proximité</Typography>

      <InfiniteScroll
        pageStart={0}
        loadMore={() => onLoadMore()}
        hasMore={entries.pageInfo.hasNextPage}
        loader={<LinearProgress />}
      >
        {producers.map(({ node }) => (
          <ProducerItem producer={node} userLocation={userLocation} />
        ))
        }

      </InfiniteScroll>

      {loading && <div>Chargement...</div>}

    </>
  );
}


NearProducers.propTypes = {
  classes: PropTypes.shape().isRequired,
  userLocation: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default withStyles(styles)(NearProducers);
