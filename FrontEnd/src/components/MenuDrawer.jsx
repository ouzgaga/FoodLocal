import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MapIcone from '@material-ui/icons/Map';
import HomeIcone from '@material-ui/icons/Home';
import DescriptionIcone from '@material-ui/icons/DescriptionRounded';
import AccountIcone from '@material-ui/icons/AccountBox';
import RegisterIcone from '@material-ui/icons/HowToReg';
import SettingsIcone from '@material-ui/icons/Settings';

import UserContext from '../UserContext';

import { AuthContext } from './providers/AuthProvider';

// Pour éviter des lags pour les supports ne supportant pas 60fps
//https://material-ui.com/demos/drawers/
const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 12,
  },
  LinkButton: {
    textDecoration: 'none',
    color: 'inherit'
  },

};

class SwipeableTemporaryDrawer extends React.Component {
  state = {
    isOpen: false,
  };

  toggleDrawer = open => () => {
    this.setState({
      isOpen: open,
    });
  };

  render() {
    const { classes, onClick } = this.props;
    const { isOpen } = this.state;

    const staticMenu = (
      <List>
        <Link to="/" className={classes.LinkButton}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcone color="primary" />
            </ListItemIcon>
            <ListItemText primary="Acceuil" />
          </ListItem>
        </Link>
        <Link to="/map" className={classes.LinkButton}>
          <ListItem button>
            <ListItemIcon>
              <MapIcone color="primary" />
            </ListItemIcon>
            <ListItemText primary="Carte" />
          </ListItem>
        </Link>

        <Link to="/about" className={classes.LinkButton}>
          <ListItem button>
            <ListItemIcon>
              <DescriptionIcone color="primary" />
            </ListItemIcon>
            <ListItemText primary="A propos de nous" />
          </ListItem>
        </Link>

      </List>
    );

    const notLogMenu = (
      <List>
        <ListItem
          button
          onClick={onClick('newAccountOpen')}
        >
          <ListItemIcon>
            <RegisterIcone color="primary" />
          </ListItemIcon>
          <ListItemText primary="S'inscrire" />
        </ListItem>
        <ListItem
          button
          onClick={onClick('open')}
        >
          <ListItemIcon>
            <AccountIcone color="primary" />
          </ListItemIcon>
          <ListItemText primary="Se connecter" />
        </ListItem>
      </List>
    );

    const loggedMenu = (
      <List>
        <Link to="/myWall" className={classes.LinkButton}>
          <ListItem button>
            <ListItemIcon>
              {/* TODO: icone */}
            </ListItemIcon>
            <ListItemText primary="Mon mur" />
          </ListItem>
        </Link>
        <Link to="/myProducers" className={classes.LinkButton}>
          <ListItem button>
            <ListItemIcon>
              {/* TODO: icone */}
            </ListItemIcon>
            <ListItemText primary="Mes producteurs" />
          </ListItem>
        </Link>
        <Link to="/settings" className={classes.LinkButton}>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcone color="primary" />
            </ListItemIcon>
            <ListItemText primary="Paramètres" />
          </ListItem>
        </Link>
        <ListItem
          button
          onClick={onClick('logOut')}
        >
          <ListItemIcon>
            <RegisterIcone color="primary" />
          </ListItemIcon>
          <ListItemText primary="Se déconnecter" />
        </ListItem>
      </List>
    )

    const personalMenu = (
      <AuthContext>
        {({ userStatus }) => {
          switch (userStatus) {
            case 'USER':
              return ({});
              break;

            case 'PRODUCER':
              return ({});
              break;

            default:
              return ({ notLogMenu });
              break;
          }
        }}
      </AuthContext>
    );

    const mySideList = (
      <div className={classes.list}>

        {staticMenu}

        <Divider />
        {UserContext.Provider.name == null
          ? (
            <List>
              <ListItem
                button
                onClick={onClick('newAccountOpen')}
              >
                <ListItemIcon>
                  <RegisterIcone color="primary" />
                </ListItemIcon>
                <ListItemText primary="S'inscrire" />
              </ListItem>
              <ListItem
                button
                onClick={onClick('open')}
              >
                <ListItemIcon>
                  <AccountIcone color="primary" />
                </ListItemIcon>
                <ListItemText primary="Se connecter" />
              </ListItem>
            </List>
          ) : (
            <List>
              <ListItem button>
                <ListItemIcon>
                  <DescriptionIcone color="primary" />
                </ListItemIcon>
                <ListItemText primary={"hi" + UserContext.Provider.name} />
              </ListItem>
            </List>
          )
        }
      </div>
    );

    return (
      <div>
        <IconButton
          color="inherit"
          aria-label="Open menu"
          className={classes.menuButton}
          onClick={this.toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <SwipeableDrawer
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          open={isOpen}
          onClose={this.toggleDrawer(false)}
          onOpen={this.toggleDrawer(true)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
          >
            {mySideList}
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

SwipeableTemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export default withStyles(styles)(SwipeableTemporaryDrawer);
