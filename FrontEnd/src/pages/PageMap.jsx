import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Search from '../components/Search';
import MyMap from '../components/Map/MyMap';
import './PageMap.css';

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
    top: 25,
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
  drawerPaper2: {
    width: 300,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
  drawer: {
    overflowY: 'scroll',
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
        <Search />
      </div>
    );

    return (
      <div className={classes.root}>
        <main className={classes.content}>
          <Button
            variant="fab"
            color="inherit"
            aria-label="Add"
            className={classes.navIconHide}
            onClick={this.handleDrawerToggle}
          >
            <ExpandMoreIcon className={classes.expandMoreIcon} />
          </Button>

          <MyMap />

        </main>

        <div className={classes.drawer}>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor="right"
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

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
