import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfiniteScroll from 'react-infinite-scroller';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import MyMap from './MyMap';

import './PageMap.css';
import ErrorLoading from '../ErrorLoading';
import Loading from '../Loading';
import Search from './Search';
import FilterProducts from './FilterProducts';
import { List, ListItem, Typography } from '@material-ui/core';
import ListItemProducer from './ListItemProducer';

const drawerWidth = 400;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'calc(100vh - 64px)',
    width: '100vw',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  navIconHide: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 2000,
    rotate: 90,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    backgroundColor: '#66CCCC'
  },
  expandMoreIcon: {
    transform: 'rotate(90deg)',
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  drawerPaper2: {
    width: 300,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    height: '400',
  },
  drawer: {
    overflowY: 'scroll',
    backgroundColor: '#FFFFFF',
  },
});


class MainMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      iconDrag: '',
    };
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleHover = (hover) => {
    this.setState({ iconDrag: hover });
  }

  resetHover = () => {
    this.setState({ iconDrag: '' });
  }

  render() {
    const {
      classes, theme, products, addProduct, removeProduct, location, maxDistance, changeMaxDistance, entries, onLoadMore, loading
    } = this.props;

    const drawer = (


      entries.edges.length
        ? (
          <>
            <List className={classes.list}>

              <InfiniteScroll
                pageStart={0}
                loadMore={() => onLoadMore()}
                hasMore={entries.pageInfo.hasNextPage}
              >

                {entries.edges.map(({ node }) => (

                  <ListItem key={node.id} className={classes.listItem}>

                    <ListItemProducer producer={node} handleHover={this.handleHover} resetHover={this.resetHover} />

                  </ListItem>
                ))
                }
              </InfiniteScroll>

            </List>

            <Button onClick={onLoadMore} variant="contained">Voir plus de producteurs</Button>
          </>
        )
        : (
          <Typography>Aucun producteur ne correspond à votre recherche</Typography>
        )

    );

    return (
      <div className={classes.root}>
        <main className={classes.content}>
          <Button
            color="inherit"
            aria-label="Add"
            className={classes.navIconHide}
            onClick={this.handleDrawerToggle}
          >
            <ExpandMoreIcon className={classes.expandMoreIcon} />
          </Button>

          <FilterProducts
            products={products}
            addProduct={addProduct}
            removeProduct={removeProduct}
            maxDistance={maxDistance}
            changeMaxDistance={changeMaxDistance}
          />

          <MyMap
            producers={entries.edges}
            location={location}
            iconDrag={this.state.iconDrag}
            products={products}
            addProduct={addProduct}
            removeProduct={removeProduct}
            maxDistance={maxDistance}
            changeMaxDistance={changeMaxDistance}
          />

        </main>

        <div className={classes.drawer}>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={theme.direction = 'right'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper2,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden smDown>
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </div>
      </div>
    );
  }
}

MainMap.propTypes = {
  classes: PropTypes.shape().isRequired,
  theme: PropTypes.shape().isRequired,
};

export default withStyles(styles, { withTheme: true })(MainMap);
