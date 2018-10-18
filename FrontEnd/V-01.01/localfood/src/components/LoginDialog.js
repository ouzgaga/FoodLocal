
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';

import Login from './Login.js';
import MyLogin from './MyLogin.js';


class LoginDialog extends React.Component {
  handleClose = () => { 
    
  };

    handleListItemClick = value => {
      this.props.onClose(value);
      
    };

  render() {
    const { classes, onClose,  ...other } = this.props;
          console.log('Dialog: ');
      console.log(this.props);
    
    return (

      <Dialog
        onClose={this.handleClose}
        aria-labelledby="Login"
        {...other}
      >
        <MyLogin
          classes= {this.classes}

          onClose = {onClose}
        />
          
      </Dialog>
    );
  }
}

LoginDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

export default (LoginDialog);
