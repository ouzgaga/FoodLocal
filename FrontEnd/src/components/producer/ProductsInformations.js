import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import InfiniteScroll from 'react-infinite-scroller';
import { Grid, List, ListItem } from '@material-ui/core';
import Loading from '../Loading';

const styles = {
  media: {
    height: 70,
    width: 70,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
};

function ProductsInformations(props) {
  const {
    classes, entries, loading, onLoadMore
  } = props;

  if (!entries && loading) return <Loading />;
  const products = entries.products.edges || [];
  return (
    <>
      {products.length > 0
        ? (
          <List>
            <InfiniteScroll
              loadMore={onLoadMore}
              hasMore={entries.products.pageInfo.hasNextPage}
            >

              {products.map(({ node }) => (
                <ListItem key={node.productType.id}>
                  <Grid container spacing={24}>
                    <Grid item xs={4}>
                      <CardMedia className={classes.media} image={node.productType.image} title={node.productType.name} />
                      <Typography>
                        {node.productType.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>
                        {node.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </InfiniteScroll>
          </List>
        )
        : (
          <Typography>
            {'Aucun produit renseigné'}
          </Typography>
        )}

      {loading && <Loading />}
    </>
  );
}

ProductsInformations.propTypes = {
  classes: PropTypes.shape().isRequired,
  entries: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default withStyles(styles)(ProductsInformations);
