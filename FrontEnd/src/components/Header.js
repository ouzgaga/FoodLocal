import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import logo from '../img/LogoCarrote.png';
import UserContext from './UserContext';
  
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';
 

import LoginDialog from './LoginDialog';

const styles = {
  root: {
    flexGrow: 1,
    position: 'fixed',
    weight: '100%',
    top: 0,
    zIndex:1900,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    height: 60, 
  },
  LinkButton:{
    textDecoration: 'none',
    color: 'secondary'
  },
};

class MenuAppBar extends React.Component  {

  state = {
    sConnected: null,
    open: false,
    a: 1,
  };


  handleClickLogin = () => {
    
    this.setState({
      open: true,
    }); 
  };

  handleCloseLogin = value => {
    let b = this.state.a +1;
    this.setState({open: false, a: b});

    console.info('Close' + this.state.a);
  };



  render() {
    const { classes } = this.props;
    const connected = Boolean(this.state.sConnected);

    return (
      <div >
      
        <AppBar position="static" className={classes.root}>
          <Toolbar>
          
          <img src={logo} className={classes.menuButton} alt="logo" />
            
              
            <div className={classes.grow}></div>
            <Link to="/" className={classes.LinkButton} readOnly tabIndex="-1"> <Button ><Typography variant="h6" color="inherit" >Home </Typography></Button> </Link>
            <Link to="/about" className={classes.LinkButton} readOnly tabIndex="-1"><Button >About</Button></Link>
            <Link to="/map" className={classes.LinkButton} readOnly tabIndex="-1"><Button >Map</Button></Link>
            
            
            



          {UserContext.Provider.name == null ?
          <> 
            <Link to="/newAccount" className={classes.LinkButton} readOnly tabIndex="-1" ><Button >New account</Button></Link>
            <Button 
            color="inherit"
            onClick={this.handleClickLogin}>
              Login
            </Button>
          </>
            :
            <Button 
            color="inherit"
            //onClick={this.handleClickLogin}
            >
              {UserContext.Provider.name}
            </Button>
          }
          <LoginDialog
            classes = {this.props}
            open={this.state.open}
            //onClose={this.handleCloseLogin.bind(this)}
            onClose={this.handleCloseLogin} />
            
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
