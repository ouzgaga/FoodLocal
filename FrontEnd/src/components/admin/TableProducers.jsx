import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { List, LinearProgress } from '@material-ui/core';
import TableProducerItem from './TableProducerItem';
import Loading from '../Loading';

/**
 * Classe pour la table contenant les différents producteurs
 */
function TableProducers(props) {
  const {
    entries, loading, onLoadMore
  } = props;

  if (!entries && loading) return <Loading />;
  const producers = entries.edges || [];
  return (
    <List>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => onLoadMore()}
        hasMore={entries.pageInfo.hasNextPage}
      >
        {producers.map(({ node }) => (
          node.salespoint && (
            <TableProducerItem producer={node} />
          )
        ))
        }

      </InfiniteScroll>

      {loading && <LinearProgress color="primary" />
      }
    </List>
  );
}

TableProducers.propTypes = {
  entries: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default TableProducers;
