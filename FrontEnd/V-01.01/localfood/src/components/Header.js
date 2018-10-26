import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
import compose from 'recompose/compose';

import logo from '../img/LogoCarrote.png';
import UserContext from './UserContext';
  
 
import MenuDrawer from './MenuDrawer.js';
import LoginDialog from './LoginDialog.js';

const styles = {
  root: {
    flexGrow: 1,
    position: 'fixed',
    weight: '100%',
<<<<<<< HEAD
    top: 0,
=======
    height: 64,
    top: 0,
    shadow: 'none',
>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2
    
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
    color: 'inherit'
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

    const menuLarge = (
      <div>
        <Link to="/" className={classes.LinkButton}  readOnly tabIndex="-1"> <Button ><Typography variant="h6" color="inherit" >Home </Typography></Button> </Link>
        <Link to="/about" className={classes.LinkButton}  readOnly tabIndex="-1"><Button >About</Button></Link>
        <Link to="/map" className={classes.LinkButton}  readOnly tabIndex="-1"><Button >Map</Button></Link>     

        {UserContext.Provider.name == null ?
        <> 
          <Link to="/newAccount" className={classes.LinkButton} readOnly tabIndex="-1"><Button >New account</Button></Link>
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
       
      </div>   
    );
    
    return (
      
      <div >
        <AppBar position="static" className={classes.root}>
          <Toolbar>
          
          <img src={logo} className={classes.menuButton} alt="logo" />
          <div className={classes.grow}></div>
            {isWidthUp('sm', this.props.width) ? menuLarge : <MenuDrawer/>}
          </Toolbar>

          <LoginDialog
            classes = {this.props}
            open={this.state.open}
            onClose={this.handleCloseLogin.bind(this)}
            //onClose={this.handleCloseLogin}
          />
          <Typography variant="h6" color="inherit" className={classes.grow}>
            {this.state.connectEmail}
          </Typography>
        </AppBar>
      </div>
    );
  }
}

export default compose(
  withWidth(),
  withStyles(styles),
<<<<<<< HEAD
  
)(MenuAppBar);
  
=======
)(MenuAppBar);
  
>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2

