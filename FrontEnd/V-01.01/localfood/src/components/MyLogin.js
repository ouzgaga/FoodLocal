


import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';

import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';

import { withStyles } from '@material-ui/core';
import UserContext from './UserContext';

const styles = theme => ({
    layout: {
      width: 'auto',
      display: 'block', // Fix IE11 issue.
      //marginLeft: theme.spacing.unit * 3,
      //marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      //marginTop: theme.spacing.unit * 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
      margin: theme.spacing.unit,
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE11 issue.
      marginTop: theme.spacing.unit,
    },
    submit: {
      marginTop: theme.spacing.unit * 3,
    },
  });

class MyLogin extends React.Component {

    
  state = {

    a: 0,
  };



    handleLogin = () => {
        UserContext.Provider.name = "UserIsLog"
        this.props.onClose();
    }

    render(){

        //this.setState(this.state.a + 1);

 

        console.log('MyLogin:' + this.state.a);

        const {classes, onClose, selectedValue, ...other } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockIcon />
                        </Avatar>
                    </Paper>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick = {this.handleLogin}
                    >
                        Sign in
                    </Button>
                </main>
            </React.Fragment>
        );
    }


}

MyLogin.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
  };

export default withStyles(styles)(MyLogin);