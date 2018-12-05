
import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';

import MyLogin from './MyLogin';


class LoginDialog extends React.Component {

  render() {
    const { classes, onClose, onClick2 } = this.props;
    return (

      <Dialog
        aria-labelledby="Login"
        onClose={onClose}
      >
        <MyLogin
          classes={this.classes}
          onClick2={onClick2}
          onClose={onClose}
        />
          
      </Dialog>
    );
  }
}

LoginDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onClick2: PropTypes.func,
};

export default (LoginDialog);



