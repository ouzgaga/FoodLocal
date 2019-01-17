import React from 'react';
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


  showTitle(title){
    if(title === null){
      return ;
    } else{
      return (
        <DialogTitle id="dialog-simple-info">
          { title }
        </DialogTitle>
      );
    }
  }

  render() {
    const { open, handleClose, title, text } = this.props;

    

    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >

          { this.showTitle(title) }
          
          <DialogContent>
            <DialogContentText>
              {text}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              { 'Fermer' }
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

SimpleInfoDialog.defaultProps = {
  title: null,
};


export default SimpleInfoDialog;
