import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card'; 
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import About from '../components/About.js';
import PropTypes from 'prop-types';
import LoginDialog from '../components/LoginDialog.js';

import logo from '../img/LogoCarrote.png';

const styles = theme => ({
  about: {
    
    flex: 1,
    
  },
  content:{
    justifyContent: 'center', 
    alignItems: 'center' ,
    justify: 'center',
  },
  card: {
    maxWidth: 400,
       
  },
  image: {
    width: 128,
    height: 128,
  },
  
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },

  root: {
    backgroundColor: 'aliceblue',
    direction: 'column',
  },
  box: {
    alignItems: 'center',
  },
});


class PageAbout extends Component {
  
  render() {

    const { classes } = this.props;

    return (
    <div className={classes.about}>    
        <Grid container className={classes.root} spacing={16}>
        
          <Grid container >
              
              <Grid item xs="12">
              <div className={classes.image}>
                <img className={classes.img} alt="complex" src={logo}/>
              </div>
              <Typography gutterBottom variant="title">
                Qu'est-ce food local?
              </Typography>
              <Typography gutterBottom>C'est un application web qui a pour but de référencer de petits producteurs locaux. Elle leur fournit un </Typography>            
              </Grid>
              

          </Grid>
          
          
        
      </Grid>
    </div>
      
      
    );
  }
}

PageAbout.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(PageAbout);