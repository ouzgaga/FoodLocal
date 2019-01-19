import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MyMap from './MyMap';
import './PageMap.css';
import FilterProducts from './FilterProducts';

const styles = ({
  root: {
    flexGrow: 1,
    height: 'calc(100vh - 64px)',
    width: '100vw',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '400',
  },
});

function MainMap(props) {
  const {
    classes, products, addProduct, removeProduct, userLocation, maxDistance, changeMaxDistance, entries, onLoadMore,
  } = props;

  return (
    <div className={classes.root}>
      <main className={classes.content}>

        <FilterProducts
          products={products}
          addProduct={addProduct}
          removeProduct={removeProduct}
          maxDistance={maxDistance}
          changeMaxDistance={changeMaxDistance}
        />

        <MyMap
          producers={entries.edges}
          location={userLocation}
          onLoadMore={onLoadMore}
        />
      </main>
    </div>
  );
}

MainMap.propTypes = {
  classes: PropTypes.shape().isRequired,
  products: PropTypes.shape().isRequired,
  addProduct: PropTypes.func.isRequired,
  removeProduct: PropTypes.func.isRequired,
  userLocation: PropTypes.shape().isRequired,
  maxDistance: PropTypes.number.isRequired,
  changeMaxDistance: PropTypes.func.isRequired,
  entries: PropTypes.shape().isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default withStyles(styles)(MainMap);
