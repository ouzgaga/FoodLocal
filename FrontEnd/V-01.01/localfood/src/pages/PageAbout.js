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
    
    width: '50%',
    marginLeft: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    height: 'auto',
    
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
    flex: 2,
    
    marginRight: '50%',
    transform: 'translateY(-50%)',
    
  
    width: 128,
    height: 128,

    border: 1,
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

/*
<div className={classes.about}>    
        <Grid container className={classes.root} spacing={16}>
        <div>
          <Grid container className={classes.box}>
              <Grid item xs="6" >
                <img className={classes.img} alt="complex" src={logo}/>
              </Grid>
              <Grid item xs="6">
              <Typography gutterBottom variant="title">
                Qu'est-ce food local?
              </Typography>
              <Typography gutterBottom>C'est un application web qui a pour but de référencer de petits producteurs locaux. Elle leur fournit un </Typography>            
              </Grid>
          </Grid>
          </div>
      </Grid>
    </div>
    */

class PageAbout extends Component {
  
  render() {

    const { classes } = this.props;

    return (
   
   
    

    <div className={classes.about}>
      <div className={classes.imgage}>
        <img className={classes.img} alt="complex" src={logo}/> 
      </div>

      <div>
        <h5>
          Qu'est-ce localFood?
        </h5>
        
        at Module.load (module.js:566:32)
        at tryModuleLoad (module.js:506:12)
        at Function.Module._load (module.js:498:3)
        at Function.Module.runMain (module.js:694:10)
        at startup (bootstrap_node.js:204:16)
        at bootstrap_node.js:625:3

        
      </div>
    </div>
      
      
    );
  }
}

PageAbout.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(PageAbout);