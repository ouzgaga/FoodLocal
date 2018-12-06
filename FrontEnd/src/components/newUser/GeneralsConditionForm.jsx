import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core';

import GridList from '@material-ui/core/GridList';


const styles = theme => ({
  text: {
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    height: 300,
  },

  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
});

const GENERALS_CONDITIONS = (
  <div>
    Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
              facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
              at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus
              sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum
              nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur
              et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras
              mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
              egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
              lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
              sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
              Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis
              consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
              egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
              lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
              sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
              Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis
              consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
              egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
              lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
              sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
              Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis
              consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
              egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
              lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
              sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
              Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis
              consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
              egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
              lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
              sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
              Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.
            
  </div>
)

class GeneralsConditionForm extends React.Component {

  constructor(props) {
    super(props);

    document.title = 'Nouveau Compte - Conditions Générales'; // changement du titre de la page

    this.state = {
      value: false,
    };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.checked });
    this.props.onChange('GC');
  };

  render() {
    const { classes, value, onChange} = this.props;
    const {  } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        
 

        <FormGroup row>
          <FormLabel component="legend">Conditions générales d'utilisation</FormLabel>
          <div className={classes.text}>
            <GridList className={classes.gridList} cols={1}>
              <Typography align="justify">
                {GENERALS_CONDITIONS}
              </Typography>
            </GridList>
          </div>
          <FormControlLabel
            onClick={onChange('GC')}
            label="J'ai lu et j'accépte les conditions générales"
            control={
              <Checkbox
                checked={value}
                
                value="checked"
              />
            }
          />
        </FormGroup>
      </React.Fragment>
    );
  }


}

GeneralsConditionForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.bool,

};

export default withStyles(styles)(GeneralsConditionForm);