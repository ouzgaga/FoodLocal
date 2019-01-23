import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import DefaultUserLogo from '../../img/DefaultUserLogo.jpg';

const styles = theme => ({

  img: {
    margin: 'auto',
    display: 'block',
    maxHeight: 255,
    maxWidth: 255,
  },
  image: {

  },
});

class SimpleImageDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, image } = this.props;
    let displayImage = image;
    if (!image) displayImage = DefaultUserLogo;
    return (
      <div>
        <Button onClick={this.handleClickOpen}><img className={classes.img} alt="complex" src={displayImage} /></Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent className={classes.image}>
            <img alt="complex" className={classes.img} src={displayImage} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}


export default withStyles(styles)(SimpleImageDialog);
