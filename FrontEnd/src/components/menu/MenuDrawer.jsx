import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
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
import BuildIcone from '@material-ui/icons/Build';

import { AuthContext } from '../providers/AuthProvider';

// Pour éviter des lags pour les supports ne supportant pas 60fps
//https://material-ui.com/demos/drawers/
const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const styles = {
  MenuList: {
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

class MenuDrawer extends React.Component {
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
      
      <MenuList>
        <Link to="/" className={classes.LinkButton}>
          <MenuItem button>
            <ListItemIcon>
              <HomeIcone color="primary" />
            </ListItemIcon>
            <ListItemText primary="Acceuil" />
          </MenuItem>
        </Link>
        <Link to="/map" className={classes.LinkButton}>
          <MenuItem button>
            <ListItemIcon>
              <MapIcone color="primary" />
            </ListItemIcon>
            <ListItemText primary="Carte" />
          </MenuItem>
        </Link>

        <Link to="/about" className={classes.LinkButton}>
          <MenuItem button>
            <ListItemIcon>
              <DescriptionIcone color="primary" />
            </ListItemIcon>
            <ListItemText primary="A propos de nous" />
          </MenuItem>
        </Link>

      </MenuList>
    );

    const notLogMenu = (
      <MenuList>
        <MenuItem
          button
          onClick={onClick('newAccountOpen')}
        >
          <ListItemIcon>
            <RegisterIcone color="primary" />
          </ListItemIcon>
          <ListItemText primary="S'inscrire" />
        </MenuItem>
        <MenuItem
          button
          onClick={onClick('open')}
        >
          <ListItemIcon>
            <AccountIcone color="primary" />
          </ListItemIcon>
          <ListItemText primary="Se connecter" />
        </MenuItem>
      </MenuList>
    );

    const loggedMenu = (userStatus, isAdmin, signOut) => (
      <MenuList>
        <Link to="/myWall" className={classes.LinkButton}>
          <MenuItem button>
            <ListItemIcon>
              {/* TODO: icone */}
            </ListItemIcon>
            <ListItemText primary="Mon mur" />
          </MenuItem>
        </Link>
        <Link to="/myProducers" className={classes.LinkButton}>
          <MenuItem button>
            <ListItemIcon>
              {/* TODO: icone */}
            </ListItemIcon>
            <ListItemText primary="Mes producteurs" />
          </MenuItem>
        </Link>

        {userStatus &&
          (
            <Link to="/producerRegistration" className={classes.LinkButton}>
              <MenuItem button>
                { /* TODO: addicone
                <ListItemIcon>
                  <BuildIcone color="primary" />
                </ListItemIcon>
                */
                }
                <ListItemText primary="Mon point de vente" />
              </MenuItem>
            </Link>
          )
        }

        <Link to="/settings" className={classes.LinkButton}>
          <MenuItem button>
            <ListItemIcon>
              <SettingsIcone color="primary" />
            </ListItemIcon>
            <ListItemText primary="Paramètres" />
          </MenuItem>
        </Link>

        {isAdmin &&
          (
            <Link to="/adminSection" className={classes.LinkButton}>
              <MenuItem button>
                <ListItemIcon>
                  <BuildIcone color="primary" />
                </ListItemIcon>
                <ListItemText primary="Section administrateur" />
              </MenuItem>
            </Link>
          )
        }

        <MenuItem
          button
          onClick={
            () => {
              signOut();
              onClick('logOut');
            }
          }
        >
          <ListItemIcon>
            <RegisterIcone color="primary" />
          </ListItemIcon>
          <ListItemText primary="Se déconnecter" />
        </MenuItem>
      </MenuList>
    );

    const personalMenu = (
      
      <AuthContext>
        {({ userStatus, isAdmin, signOut }) => (
          userStatus ? (
            <>
            
              {loggedMenu(userStatus, isAdmin, signOut)}
            </>
          ) : (
            <>
              {notLogMenu}
            </>
          )
        )}
      </AuthContext>
      
    );

    /**
     * Contient le menu à afficher. Le menu est choisit en fonction si
     * l'utilisateur est connecté ou pas.
     */
    const mySideList = (
      <div className={classes.MenuList}>
        {staticMenu}
        <Divider />
        {personalMenu}
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

MenuDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export default withStyles(styles)(MenuDrawer);
