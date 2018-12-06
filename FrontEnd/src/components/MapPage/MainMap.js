import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Search from './Search';
import MyMap from './MyMap';
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
    top: 60,
    right: 16,
    zIndex: 2000,
    rotate: 90,
    backgroundColor: '#66CCCC',
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
    backgroundColor: '#66CCCC',
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

  handleHover = hover => () => {
    this.setState({ iconDrag: hover });
  }

  resetHover = () => {
    this.setState({ iconDrag: '' });
  }

  render() {
    const { classes, theme, data } = this.props;

    const drawer = (
      <div>
        <Search data={data} handleHover={this.handleHover} resetHover={this.resetHover} />
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

          <MyMap data={data} iconDrag={this.state.iconDrag} />

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
