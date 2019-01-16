import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import InfiniteScroll from 'react-infinite-scroller';

import { Grid, List, ListItem } from '@material-ui/core';
import Loading from '../Loading';

const styles = {
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    widht: 1000,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  media: {
    height: 70,
    width: 70,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
};


class ProductsInformations extends Component {

  render() {
    const { classes } = this.props;

    if (!this.props.entries && this.props.loading) return <Loading />;
    const products = this.props.entries.products.edges || [];
    return (

      <>
        {products.length > 0
          ? (
            <List>
              <InfiniteScroll
                loadMore={this.props.onLoadMore}
                hasMore={this.props.entries.products.pageInfo.hasNextPage}
                loader={<p>Loading...</p>}
              >

                {products.map(({ node }) => (
                  <ListItem key={node.productType.name}>
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

        {this.props.loading && <Loading />}

      </>
    );
  }
}


ProductsInformations.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductsInformations);
