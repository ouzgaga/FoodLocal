import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';

import defaultImg from '../img/tractorIcon.svg';
import team from '../img/teamAntoine.jpg';
import logo from '../img/LogoCarrote.png';

const styles = Theme => ({
  about: {
    display: 'flex',
    
    width: '100%',
    marginLeft: '50%',
    transform: 'translateX(-50%)',
    //display: 'flex',
    //height: '70%',
    padding: 0,
    marginRight:0,
    backgroundColor: 'rgba(255, 255, 240, 0.1)',
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
    justifyContent: 'center',
    
    //display: 'flex',
    //height: '70%',
    
  },
  vid:{

    maxHeight: 720,
    height:360,
    width: "100%",
  },
  content:{
    flex: 1,
    display: 'flex',
    //backgroundColor: "#FFFFF0",

    

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

    width: '80%',

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
    display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: 200, height: '..',
    
    //marginTop: '50%',
    //transform: 'translateY(-50%)',
    
    //height: 200,
    //width: 200,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    borderColor: '#fffff',
  },
});

class ProducerVue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.match.params.producerId,
      userPiture: defaultImg,
      userName: 'No name',
      userDescription: 'Place pour une description',
    };
  }

  render() {
    const { classes } = this.props;
    const {
      userPiture, userDescription, userName, userId,
    } = this.state;
    return (
      <div>
        <div className={classes.about}>
          <div className={classes.content}>
            <div className={classes.image}>
              <img className={classes.img} alt="complex" src={userPiture} />
            </div>
            <div className={classes.text}>
              <Typography variant="h3">
                {userName} with id {userId}
              </Typography>
              <p>
                <Typography>
                  {userDescription}
                </Typography>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

ProducerVue.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(ProducerVue);