
import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { List, ListItem } from '@material-ui/core';
import ProducerPost from './ProducerPost';
import Loading from '../Loading';


function ProducerMur(props) {
  const { entries, loading, onLoadMore } = props;

  if (!entries && loading) return <Loading />;
  const repos = entries.edges || [];
  return (
    <>
      <List>
        <InfiniteScroll
          pageStart={0}
          loadMore={onLoadMore}
          hasMore={entries.pageInfo.hasNextPage}
        >
          {repos.map(({ node }) => (
            <ListItem key={node.id}>
              <ProducerPost
                name={node.producer.salespoint.name}
                date={node.publicationDate}
                image={node.producer.image}
                address={node.address}
                post={node.text}
              />
            </ListItem>
          ))
          }

        </InfiniteScroll>
      </List>

      {loading && <Loading />}
    </>

  );
}

ProducerMur.propTypes = {
  entries: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default ProducerMur;
