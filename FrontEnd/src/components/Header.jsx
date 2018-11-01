import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import compose from 'recompose/compose';

import logo from '../img/LogoCarrote.png';
import UserContext from './UserContext';
import MenuDrawer from './MenuDrawer';
import LoginDialog from './LoginDialog';

const styles = {
  root      : {
    flexGrow: 1,
    position: 'fixed',
    weight  : '100%',
    height  : '64px',
    top     : 0,
    shadow  : 'none'
  },
  grow      : {
    flexGrow: 1
  },
  menuButton: {
    marginLeft : -7,
    marginRight: 20,
    paddingTop : 4,
    height     : '60px',
    outline    : 'none'
  },
  LinkButton: {
    textDecoration: 'none',
    color         : 'secondary'
  }
};

class MenuAppBar extends React.Component {
  state = {
    sConnected: null,
    open      : false
  };

  handleClickLogin = () => {
    this.setState({
      open: true
    });
  };

  handleCloseLogin = (value) => {
    this.setState({ open: false });
  };

  render () {
    const { classes, width } = this.props;

    const menuLarge = (
      <div>
        <Link to="/" className={classes.LinkButton} readOnly tabIndex="-1"><Button>Carte</Button></Link>
        <Link to="/about" className={classes.LinkButton} readOnly tabIndex="-1"><Button>A propos</Button></Link>


        {UserContext.Provider.name == null
          ? <>
            <Link to="/newAccount" className={classes.LinkButton} readOnly tabIndex="-1"><Button>S'inscrire</Button></Link>
            <Button color="inherit" onClick={this.handleClickLogin}>
             Se connecter
            </Button>
         </>
          : (
            <Button color="inherit">
              {UserContext.Provider.name}
            </Button>
          )
        }
      </div>
    );
    return (
      <div>
        <AppBar position="static" className={classes.root}>
          <Toolbar>
            <Link to="/" readOnly tabIndex="-1"><img src={logo} className={classes.menuButton} alt="logo" readOnly tabIndex="-1" /></Link>

            <div className={classes.grow} />
            {isWidthUp('sm', width) ? menuLarge : <MenuDrawer />}
          </Toolbar>

          <LoginDialog
            classes={this.props}
            open={this.state.open}
            onClose={this.handleCloseLogin.bind(this)}
            // onClose={this.handleCloseLogin}
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
  withStyles(styles)
)(MenuAppBar);
