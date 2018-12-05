import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = {
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
};

function fillaray(){
  var array=[];
  for(let i = 0; i < 60; i++){
    array[i] = <div>{i} <br/></div>;
  }
  return array;
}

class ProducerMur extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  


  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    

    return (
      <Paper className={classes.root}>
        
        <Typography onClick>
          charger plus de contenu
        </Typography>
      </Paper>
    );
  }
}

ProducerMur.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProducerMur);