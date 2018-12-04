import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';

import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

class SimpleInfoDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }


  render() {
    const { classes, open, handleClose, children} = this.props;

    

    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >          
          <DialogContent>
            {children}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

SimpleInfoDialog.defaultProps = {
};


export default SimpleInfoDialog;
