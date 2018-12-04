import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';
import AddressSuggest from './AddressSuggest';
import AddressInput from './AddressInput';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();

const styles = {
  popper : {
    zIndex: 2000,
  }
};

class AddressForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      open: false,
    };
  }

  handleClose = event => {
    this.setState({ open: false });
  };


  load = (event) => {
    this.setState({ open: 'true' });

    provider.search({ query: event.target.value }).then((results2) => {
      this.setState({
        results: results2,
      });
    });
  }

  render() {
    const {classes} = this.props;
    return (
      <div class="container">
        <Typography variant="subheading" gutterBottom> Addresse </Typography>
        <TextField
          id="road"
          margin="normal"
          variant="outlined"
          fullWidth
          onChange={this.load}
          defaultValue={'Route'}

        />

        {console.log(this.state.results)}

        <Popper open={this.state.open} className={classes.popper} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>

                  <MenuList>
                    {this.state.results.map(item => {
                      { console.log(item) }
                      return (
                        <MenuItem onClick={this.handleClose}>{item.label}</MenuItem>
                      )
                    })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

      </div>
    );
  }
}

export default withStyles(styles)(AddressForm);
