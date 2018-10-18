import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Search from '../components/Search';
import MyMap from '../components/MyMap';

const drawerWidth = 400;

const tileData = [
  {

    id: 1,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.783,
      lng: 6.7,
    },

  },
  {

    id: 2,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.781,
      lng: 6.53,
    },

  },
  {

    id: 3,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.77,
      lng: 6.58,
    },

  },
  {

    id: 4,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.789,
      lng: 6.69,
    },

  },
  {
    id: 5,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.795,
      lng: 6.63,
    },
  },
  {
    id: 6,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.70,
      lng: 6.47,
    },
  },
  {
    id: 7,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.74,
      lng: 6.77,
    },
  },
];

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    width: '100vw',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },

  navIconHide: {
    position: 'absolute',
    top: 75,
    right: 16,
    zIndex: 2000,
    rotate: 90,

    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
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
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
});

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Search />
      </div>
    );

    return (
      <div className={classes.root}>

        <main className={classes.content}>
          <div className={classes.toolbar} />

          <Button
            variant="fab"
            color="inherit"
            aria-label="Add"
            className={classes.navIconHide}
            onClick={this.handleDrawerToggle}
          >
            <ExpandMoreIcon className={classes.expandMoreIcon} />
          </Button>

          <MyMap listProducers={tileData} />

        </main>

        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction = 'right'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
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
    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
