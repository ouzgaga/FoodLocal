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
import MenuDrawer from './menu/MenuDrawer';
import LoginDialog from './LoginDialog';
import SimpleDialog from './items/SimpleDialog';
import InscriptionContainer from './newUser/InscriptionContainer';

import { AuthContext } from './providers/AuthProvider';

const styles = {
  root: {
    flexGrow: 1,
    position: 'fixed',
    weight: '100%',
    height: '64px',
    top: 0,
    shadow: 'none',
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -7,
    marginRight: 20,
    paddingTop: 4,
    height: '60px',
    outline: 'none',
  },
  LinkButton: {
    textDecoration: 'none',
    color: 'secondary',
  }
};

class MenuAppBar extends React.Component {
  state = {
    sConnected: null,
    open: false,
    newAccountOpen: false,
  };

  handleClickDrawer = prop => () => {
    this.setState(state => ({
      [prop]: !state[prop]
    }));
  };

  handleOpenAndClose = () => {
    this.setState({
      open: false,
      newAccountOpen: true,
    });
  }

  render() {
    const { classes, width } = this.props;

    const menuLarge = (
      <div>
        <Link to="/" className={classes.LinkButton} readOnly tabIndex="-1"><Button id="accueilButton">Accueil</Button></Link>
        <Link to="/map" className={classes.LinkButton} readOnly tabIndex="-1"><Button id="mapButton">Carte</Button></Link>
        <Link to="/about" className={classes.LinkButton} readOnly tabIndex="-1"><Button id="aboutButton">A propos</Button></Link>

        <AuthContext>
          {({ userStatus }) => (
            userStatus ? (
              <>
                {/* TODO: Menu logged */}
                hello
              </>

            ) : (
              <>
                <Button color="inherit" id="registerButton" onClick={this.handleClickDrawer('newAccountOpen')}>
                  {'S\'inscrire'}
                </Button>
                <Button color="inherit" id="connectionButton" onClick={this.handleClickDrawer('open')}>
                  {'Se connecter'}
                </Button>
            </>
            )
          )}
        </AuthContext>
      </div>
    );

    return (
      <div>
        <AppBar position="static" className={classes.root}>
          <Toolbar>
            <Link to="/" readOnly tabIndex="-1"><img src={logo} className={classes.menuButton} alt="logo" readOnly tabIndex="-1" /></Link>
            <div className={classes.grow} />

            {isWidthUp('sm', width) ? menuLarge : <MenuDrawer onClick={this.handleClickDrawer} />}
          </Toolbar>
          <SimpleDialog
            open={this.state.newAccountOpen}
            onClose={this.handleClickDrawer('newAccountOpen')}
          >
            <InscriptionContainer
              onClose={this.handleClickDrawer('newAccountOpen')}
              onValidate={this.handleClickDrawer('newAccountOpen')}
            />
          </SimpleDialog>
          <LoginDialog
            classes={this.props}
            open={this.state.open}
            onClose={this.handleClickDrawer('open')}
            onClick2={this.handleOpenAndClose}
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
