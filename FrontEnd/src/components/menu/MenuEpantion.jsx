import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';


import { Link } from 'react-router-dom';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MapIcone from '@material-ui/icons/Map';
import HomeIcone from '@material-ui/icons/Home';
import DescriptionIcone from '@material-ui/icons/DescriptionRounded';
import AccountIcone from '@material-ui/icons/AccountBox';
import RegisterIcone from '@material-ui/icons/HowToReg';
import SettingsIcone from '@material-ui/icons/Settings';
import BuildIcone from '@material-ui/icons/Build';
import BadgeMax from '../items/BadgeMax';

import { withStyles } from '@material-ui/core/styles';

import MenuContent from './MenuContent';
import { AuthContext } from '../providers/AuthProvider';

const styles = {
  root: {
    flexGrow: 1,
    position: 'fixed',
    weight: '100%',
    height: '64px',
    top: 0,
    shadow: 'none',
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -7,
    marginRight: 20,
    paddingTop: 4,
    height: '60px',
    outline: 'none',
  },
  LinkButton: {
    textDecoration: 'none',
    color: 'secondary',
  }
};

class MenuEpantion extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClickMenu = prop => (event) => {
    console.log(prop);
    this.setState({ anchorEl: event.currentTarget });
    return this.props.onClick(prop);
  };


  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  
  render() {
    const { classes, onClick } = this.props;
    const { anchorEl } = this.state;

    const loggedMenu = (userStatus, isAdmin, signOut) => (
      <MenuList>
        <Link to="/myWall" className={classes.LinkButton}>
          <MenuItem button onClick={this.handleClose}>
            <ListItemIcon>
              <BadgeMax value={0} />
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
              onClick('logOut');
              signOut();
              //onClick('logOut');
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
  
    return (
      <>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          Open
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <AuthContext>
      {({ userStatus, isAdmin, signOut }) => (
  
            loggedMenu(userStatus, isAdmin, signOut)

      )}
    </AuthContext>
        </Menu>
      </>
    );
  }
}

export default withStyles(styles)(MenuEpantion);
