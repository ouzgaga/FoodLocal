import React from 'react';
import PropTypes from 'prop-types';
import { Typography, LinearProgress, Card, CardActionArea } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../Loading';
import ProducerPost from '../producer/ProducerPost';

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
      <InfiniteScroll
        pageStart={0}
        loadMore={() => onLoadMore()}
        hasMore={entries.pageInfo.hasNextPage}
      >
        {posts.map(({ node }) => (
          <>

            <Card>
              <CardActionArea href={`/producer/${node.notification.producer.id}`} target="_blank">
                {node.notification.type === 'NEW_POST' && (
                  <ProducerPost
                    name={node.notification.producer.salespoint.name}
                    date={node.notification.date}
                    image={node.notification.producer.image}
                    post={node.notification.post.text}
                    address={node.notification.post.address}
                  />
                )}

                {node.notification.type === 'PRODUCER_UPDATE_INFO' && (
                  <Typography>Le producteur a mis à jour ses informations</Typography>
                )}

                {node.notification.type === 'PRODUCER_UPDATE_PRODUCTS_LIST' && (
                  <Typography>Le producteur a mis à jour la liste de ses produits</Typography>
                )}

                {node.notification.type === 'PRODUCER_UPDATE_SALESPOINT_INFO' && (
                  <Typography>Le producteur a mis à jour les informations de son point de vente</Typography>
                )}
              </CardActionArea>
            </Card>
          </>
        ))
        }

      </InfiniteScroll>

      {loading && <LinearProgress />}

    </>
  );
}


MurNotifications.propTypes = {
  classes: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default withStyles(styles)(MurNotifications);
