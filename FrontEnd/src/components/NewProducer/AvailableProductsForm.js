import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

const Products = require('../../Datas/Products.json');

export default class AvailableProductsForm extends Component {
  state = {
    checkedB: true,
  }

  continue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  handleChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { values, handleChange } = this.props;
    return (
      <Grid container spacing={24}>

        {Products.products.map(product => (
          <Grid item xs={4} sm={1}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={this.state.checkedB}
                  onChange={this.handleChange('checkedB')}
                  value={product.name}
                  color="primary"

                />
              )}
              label={product.name}
            />
          </Grid>
        ))}

        <Grid item xs={12}>

          <Button
            variant="contained"
            onClick={this.back}
            color="inherit"
          >


            PRÉCÉDENT
                </Button>
          <Button
            variant="contained"
            onClick={this.continue}
            color="primary"
          >


            SUIVANT
                </Button>
        </Grid>
      </Grid>
    );
  }
}
