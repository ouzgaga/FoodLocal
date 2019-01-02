import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import BorderedCountField from '../items/fields/BorderedCountField';
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

class PersonalDescription extends Component {

  constructor(props) {
    super(props);

    this.state = {
      description: '',
    };
  }

  handleChange = prop => (event) => {
    this.setState({
      [prop]: event.target.value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }


  render() {
    const { classes } = this.props;
    const { description } = this.state;

    return (
      <>
        <form id="personal-description" onSubmit={this.handleSubmit}>
          <BorderedCountField
            id="personal-description"
            maxLenght={1024}
            fullWidth
            defaultValue={description}
            onChange={this.handleChange('description')}
          />
          <BoxLeftRight
            title=""
          >
            <Button
              variant="contained"
              className={classes.button}
              color="primary"
              type="submit"
              id="change-description-button"
            >
              { 'Valider' }
            </Button>
          </BoxLeftRight>
        </form>
      </>

    );
  }
}

export default withStyles(styles)(PersonalDescription);
