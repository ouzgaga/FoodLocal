import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import BorderedTextField from '../items/fields/BorderedTextField';
import BoxLeftRight from './BoxLeftRight';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width:'100%',
    height: '100%',
    
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
    backgroundColor: 'rgba(255, 255, 240, 0.8)',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class PersonalInformation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lastName: '',
      firstName: '',
    };
  }

  handleChange = prop => (event) => {
    console.log(prop);
    this.setState({
      [prop]: event.target.value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }


  render() {
    const { classes } = this.props;
    const { lastName, firstName } = this.state;

    return (
      <>
        <form id="form-name-firstname" onSubmit={this.handleSubmit}>
        
          <BoxLeftRight
            title="Nom"
          >
            <BorderedTextField
              id="personal-information-name"
              className={classes.textField}
              onChange={this.handleChange('firstName')}
              defaultValue={firstName}
              fullWidth
              required
            />  
          </BoxLeftRight>
          <BoxLeftRight
            title="Prénom"
          >
            <BorderedTextField
              id="personal-information-lastName"
              className={classes.textField}
              onChange={this.handleChange('lastName')}
              defaultValue={lastName}
              fullWidth
              required
            />
          </BoxLeftRight>
          <BoxLeftRight
            title=""
          >
            <Button
              variant="contained"
              className={classes.button}
              //onClick={this.handleClick}
              color="primary"
              type="submit"
              id="change-personal-informations-button"
            >
              { `Valider` }
            </Button>
            
          </BoxLeftRight>
        </form>     
      </>

    );
  }
}

export default withStyles(styles)(PersonalInformation);
