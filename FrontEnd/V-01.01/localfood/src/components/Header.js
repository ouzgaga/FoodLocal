import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


import logo from '../img/LogoCarrote.png';

import LoginDialog from './LoginDialog';

const styles = {
  root: {
    flexGrow: 1,
    
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    height: 60, 
  },
};

class MenuAppBar extends React.Component  {

  state = {
    sConnected: null,
    connectEmail: '',
    open: false,
  };


  handleClickLogin = () => {
    this.setState({
      open: true,
    });
  };

  handleCloseLogin = value => {
    this.setState({ connectEmail: value, open: false });
  };



  render() {
    const { classes } = this.props;
    const connected = Boolean(this,this.state.sConnected);
    const connectEmail = String(this.state.connectEmail);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
          
          <img src={logo} className={classes.menuButton} alt="logo" />
            <Typography variant="h6" color="inherit" className={classes.grow}>
              News
            </Typography>
            <Button color="inherit">Inscription</Button>
            
            <Button 
            color="inherit"
            onClick={this.handleClickLogin}>
              Login
            </Button>

            <LoginDialog
              classes = {this.props}
              selectedValue={this.state.connectEmail}
              open={this.state.open}
              onClose={this.handleCloseLogin}
            />
          </Toolbar>

          <Typography variant="h6" color="inherit" className={classes.grow}>
            {this.state.connectEmail}
          </Typography>
        </AppBar>
      </div>
    );
  }
}
  
  
  export default withStyles(styles)(MenuAppBar);
