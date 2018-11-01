import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import YouTube from 'react-youtube';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';

import team from '../img/teamAntoine.jpg';
import logo from '../img/LogoCarrote.png';

const styles = theme => ({
  about: {
    display: 'flex',
    
    width: '100%',
    marginLeft: '50%',
    transform: 'translateX(-50%)',
    //display: 'flex',
    //height: '70%',
    padding: 0,
    marginRight:0,
    backgroundColor: 'rgba(255, 255, 240, 0.9)',
  },
  video: {
    
   // marginTop: 10,
   // marginBottom: 10,

    height: '100%',
    width: '100%',

    maxWidth: 640,
    maxHeight: 360,
 
    /*


    display: 'flex',
    alignItems: 'middle',

    marginLeft: '50%',
    transform: 'translateX(-50%)',
    */
    display: 'flex',

    justifyContent: 'center',
    paddingBottom: 20,
    
  },
  vid:{
    height:360,
    width: 640,
  },
  content:{
    flex: 1,
    display: 'flex',
    margin: 'auto',
    maxWidth: 900,
    width: '100%', 
     
    
    paddingTop: 10,
    paddingBot: 5,
    paddingLeft: '1%',
    paddingRight: '1%',
    


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
  tx: {
    alignItems: 'left',
    marginLeft: 20,
    marginBottom: 10,
    paddingBot: 15,
    paddingLeft: 15,
  },
  card: {
    maxWidth: 400,
    justifyContent: 'center',
  },
  image: {
    width: "20%",
    display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: 200, height: '..',


  },
  imgRonde: {
    marginLeft: 'auto',
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
    borderColor: '#fffff',
  },
  paper: {

    margin: 'none',
    marginTop: 100,
    marginBottom: 50,
    padding: 40,

  },
  paperTitle: {
    paddingBot: 15,
    paddingLeft: 15,
  },
});

class PageAbout extends Component {
  
  render() {

    const { classes } = this.props;

    return (
    <div>
      <div className={classes.about}>
        <div className={classes.content}>
          <div className={classes.image}>
            <img className={classes.img} alt="complex" src={logo}/> 
          </div>
          <div className = {classes.text}>
            <Typography variant="h3" color="Secondary" className={classes.tx}>Qu'est-ce FoodLocal?</Typography>
            <Typography variant="h7" color="none">
              FoodLocal est une application web servant à referancer de petits producteurs locaux. Cela vous permet de retrouver facilement des produitsde la région et de contribuer à l'économie local.
            </Typography>
          </div>
          </div>
      </div>
      
      <Grid
          container={'column'}
          justify={'center'}
          alignItems={'center'}
          
        >
          <Grid xl={1}>
            <Paper elevation={10} className={classes.paper}>
              <Typography variant="h3" color="Secondary" className={classes.paperTitle}>Pourquoi local? </Typography>
              <Typography variant="h6" color="none">Les produits sont de meilleur calité et frais. Ils n'ont pas attendu dans un rayon de magasin pour être mangé.</Typography>
              <Typography variant="h6" color="none">On soutient l’économie locale !</Typography>
              <Typography variant="h6" color="none">C'est souvent moins cher.</Typography>
              <Typography variant="h6" color="none">Etre éco-responsable en farvorisant l'achat de poroduits de la saison avec un minimum de temps passé dans un camion.</Typography>
            </Paper>
          </Grid>

          <Grid xl={1}>
            <YouTube 
              className={classes.video}
              videoId="EE7eXkFQf6A"
            />
          </Grid> 
 
        
 
      
      
      </Grid>
  
{/*       <div className={classes.video}>
        <YouTube 
          
          videoId="EE7eXkFQf6A"
        />
      </div>
 */}
       

     
    

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
        
        

      </div>
    
    

    
      
      
    );
  }
}

PageAbout.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(PageAbout);