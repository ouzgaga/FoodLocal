
import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';

import MyLogin from './MyLogin';


class LoginDialog extends React.Component {
  handleClose = () => { 
    this.props.onClose();
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



