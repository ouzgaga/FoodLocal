import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';

import {
  PageError404,
} from '../pages/Pages.js';

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
      userId: props.match.params.producerId,
      userPiture: defaultImg,
      userName: 'No name',
      userDescription: 'Place pour une description',
      status: 0,
    };
  }

  
  componentDidMount(){
    this.fetchData();
  }



  fetchData() {
    const api = `http://api.foodlocal.ch/producers/${this.state.userId}`;
    console.log(api);
    fetch(api)
      .then(results => {
        this.setState({status: results.status})
        if(results.status === 200){
          this.setState({status: 200});
          return results.json();
        } else {
          throw new Error("No data match");
        }
      })
      .then(data => {
        this.setProducerData(data);
      })
      .catch(erreur => {
        console.log("Erreur: " + erreur);
        this.setState({status: 1000});
      });
  };

  setProducerData(data){
    console.log(data);
    this.setState({userName: data.name, userDescription: data.description});

  }



  render() {
    const { classes } = this.props;
    const {
      userPiture, userDescription, userName, userId, status
    } = this.state;

    const producerInfo = (
      <div className={classes.about}>
        <div className={classes.content}>
          <div className={classes.image}>
            <img className={classes.img} alt="complex" src={userPiture} />
          </div>
          <div className={classes.text}>
            <Typography variant="h3">
              {userName}
            </Typography>
            <p>
              <Typography variant="h5">
                {userDescription}
              </Typography>
            </p>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {status === 200 ? producerInfo : <PageError404 location={`/producers/${this.state.userId}`}></PageError404>}
      </div>
      
    );
  };
}

ProducerVue.propTypes = {
  classes: PropTypes.object.isRequired,
  producerId: PropTypes.object.isRequired,
};


export default withStyles(styles)(ProducerVue);