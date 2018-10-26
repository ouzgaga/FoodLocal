import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card'; 
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import YouTube from 'react-youtube';
import blueGrey from '@material-ui/core/colors/blueGrey'

import About from '../components/About.js';
import PropTypes from 'prop-types';
import LoginDialog from '../components/LoginDialog.js';

import team from '../img/teamAntoine.jpg';
import leefDecoration from '../img/leefDecoration.jpg';
import logo from '../img/LogoCarrote.png';

const styles = theme => ({
  about: {
    display: 'flex',
<<<<<<< HEAD
    width: '90%',
=======
    
    width: '100%',
>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2
    marginLeft: '50%',
    transform: 'translateX(-50%)',
    //display: 'flex',
    //height: '70%',
<<<<<<< HEAD
    justifyContent: 'center',
    
=======
    padding: 0,
    marginRight:0,
    backgroundColor: 'rgba(255, 255, 240, 0.9)',
    
    

>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2
  },
  video: {
    /*
    marginTop: 10,
    marginBottom: 10,

    height: '100%',
    width: '100%',
    maxHeight: '340px',
    maxWidth: 640,
    maxHeight: 360,


    display: 'flex',
    alignItems: 'middle',

    marginLeft: '50%',
    transform: 'translateX(-50%)',
*/
    display: 'flex',
    width: '90%',
    marginLeft: '50%',
    transform: 'translateX(-50%)',
<<<<<<< HEAD
    //display: 'flex',
    //height: '70%',
    justifyContent: 'center',
=======
    justifyContent: 'center',
    
>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2
    //display: 'flex',
    //height: '70%',
    
  },
  vid:{
<<<<<<< HEAD
    height:640,
    width: 360,
=======

    maxHeight: 720,
    height:360,
    width: "100%",
>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2
  },
  content:{
    flex: 1,
    display: 'flex',
<<<<<<< HEAD
    backgroundColor: "#FFFFF0",
=======
    //backgroundColor: "#FFFFF0",

    

    margin: 'auto',
    maxWidth: 900,
    width: '100%', 
     
    
    paddingTop: 10,
    paddingBot: 5,
    paddingLeft: '1%',
    paddingRight: '1%',
    


>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2
    //justifyContent: 'center',
  },
  text:{
    display: 'flex',
    //flex: 2,
    justifyContent: 'center',
    textAlign:'justify',
    flexDirection: 'column',
    marginLeft: '2%',

    width: "80%",

  },
  tx:{
    alignItems: 'left',
    marginLeft: 20,
    marginBottom: 0,
  },
  card: {
    maxWidth: 400,
    justifyContent: 'center',
  },
  image: {
    width: "20%",
    //justifyContent: 'center',
<<<<<<< HEAD
    display: 'flex', justifyContent: 'center', alignItems: 'center', width: 200, height: '..',
=======
    display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: 200, height: '..',
>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2
    
    //marginTop: '50%',
    //transform: 'translateY(-50%)',
    
    //height: 200,
    //width: 200,
    


  },
  imgRonde: {
<<<<<<< HEAD
    marginLeft: 15,
=======
    marginLeft: 'auto',
>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',

    borderRadius: "50%",
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    borderColor: '#fffff'
<<<<<<< HEAD
    
=======
>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2
  },
});

class PageAbout extends Component {
  
  render() {

    const { classes } = this.props;

    return (
<<<<<<< HEAD
      <div>
=======
    <div>
>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2
      <div className={classes.about}>
        <div className={classes.content}>
          <div className={classes.image}>
            <img className={classes.img} alt="complex" src={logo}/> 
          </div>
          <div className = {classes.text} >
            <h3  className = {classes.tx}>
              Qu'est-ce localFood?
            </h3 >
            <p >
            LocalFood est une application web servant à referancer de petits producteurs locaux. Cela vous permet de retrouver facilement des produitsde la région et de contribuer à l'économie local.
            </p> 
          </div>
          </div>
      </div>
      
<<<<<<< HEAD
     
=======
 
>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2
      <div className={classes.video}>
        <YouTube 
          className={classes.vid}
          videoId="EE7eXkFQf6A"
        />
      </div>
<<<<<<< HEAD
        
=======
  
>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2

      

     
    

      <div className={classes.about}>
        <div className={classes.content}>
          
          <div className = {classes.text} >
            <h3  className = {classes.tx}>
              La team
            </h3 >
            <p >
            LocalFood est une application web servant à referancer de petits producteurs locaux. Cela vous permet de retrouver facilement des produitsde la région et de contribuer à l'économie local.
            </p> 
          </div>
          <div className={classes.image}>
            <img className={classes.imgRonde} alt="complex" src={team}/> 
          </div>
          </div>
        </div>
<<<<<<< HEAD
=======

        <div className={classes.about}>
        <div className={classes.content}>
          
          <div className = {classes.text} >
            <h3  className = {classes.tx}>
              Local Local, mais pourquoi local?
            </h3 >
            <p >
            de noius
            </p> 
          </div>
          <div className={classes.image}>
            <img className={classes.imgRonde} alt="complex" src={team}/> 
          </div>
          </div>
        </div>
        
>>>>>>> 12-site-web-creation-des-pages-principales-infos-projet-2
      </div>
    
    

    
      
      
    );
  }
}

PageAbout.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(PageAbout);