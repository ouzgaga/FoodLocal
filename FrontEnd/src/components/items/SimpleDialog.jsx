import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

class SimpleDialog extends React.Component {
  render() {
    const { classes, open, onClose, children, fullScreen } = this.props;

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={onClose}
        >  
          {children}     
        </Dialog>
      </div>
    );
  }
}

SimpleDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};


export default withMobileDialog()(SimpleDialog);
