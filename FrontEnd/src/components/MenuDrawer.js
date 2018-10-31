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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MapIcone from '@material-ui/icons/Map';
import DescriptionIcone from '@material-ui/icons/DescriptionRounded';

import UserContext from './UserContext';

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
    marginRight: 36,
  },
  LinkButton:{
    textDecoration: 'none',
    color: 'inherit'
  },
  
};

class SwipeableTemporaryDrawer extends React.Component {
  state = {
    isOpen: false,
  };

  toggleDrawer = (open) => () => {
    this.setState({
      isOpen: open,
    });
  };

  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    );

    const mySideList = (
      <div className={classes.list}>
      <List>
        <Link to="/" className={classes.LinkButton}>
          <ListItem button>
            <ListItemIcon>
              <MapIcone color="primary"/>
            </ListItemIcon>
            <ListItemText primary="Map" />
          </ListItem>
        </Link>
        
        <Link to="/about" className={classes.LinkButton}>
          <ListItem button>
            <ListItemIcon>
              <DescriptionIcone color="primary"/>
            </ListItemIcon>
            <ListItemText primary="A propos de nouss" />
          </ListItem>
        </Link>
  
      </List>
  
      <Divider />
      {UserContext.Provider.name == null ?
          <List>
            <Link to="/newAccount" className={classes.LinkButton}>
              <ListItem button>
                <ListItemIcon>
                  <MapIcone color="primary"/>
                </ListItemIcon>
                <ListItemText primary="New account" />
              </ListItem>
            </Link>
          </List> 
        :
          <List> 
            <ListItem button >
              <ListItemIcon > <DescriptionIcone color="primary"/> </ListItemIcon>
              <ListItemText primary={"hi" + UserContext.Provider.name} />
            </ListItem>
          </List>
        }
      
  
    </div>
    );

    const mySideList2 = (
      <div className={classes.list}>
        <List>
          <Link to="/" className={classes.LinkButton}>
            <ListItem button >
              <ListItemIcon> <MapIcone color="primary"/> </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItem>
          </Link> 
          <Link to="/about" className={classes.LinkButton}>
            <ListItem button >
              <ListItemIcon > <DescriptionIcone color="primary"/> </ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
          </Link> 
        </List>

        <Divider />
 
        {UserContext.Provider.name == null ?
          <List>
            <Link to="/newAccount" className={classes.LinkButton}>
              <ListItem button >
                <ListItemIcon > <DescriptionIcone color="primary"/> </ListItemIcon>
                <ListItemText primary="New account" />
              </ListItem>
            </Link> 
            <Link to="/newAccount" className={classes.LinkButton}>
              <ListItem button >
                <ListItemIcon > <DescriptionIcone color="primary"/> </ListItemIcon>
                <ListItemText primary="New account" />
              </ListItem>
            </Link> 
          </List> 
        :
          <List> 
            <ListItem button >
              <ListItemIcon > <DescriptionIcone color="primary"/> </ListItemIcon>
              <ListItemText primary={"hi" + UserContext.Provider.name} />
            </ListItem>
          </List>
        }

      </div>
    );

    return (
      <div>
        <IconButton
              color="inherit"
              aria-label="Open menu"
              onClick={this.handleDrawerOpen}
              className={classes.menuButton}
              onClick={this.toggleDrawer(true)}
              
            >
              <MenuIcon />
        </IconButton>
        <SwipeableDrawer
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          open={this.state.isOpen}
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
};

export default withStyles(styles)(SwipeableTemporaryDrawer);