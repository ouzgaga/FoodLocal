import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';

const Products = require('../../Datas/Products.json');

export default class AvailableProductsForm extends Component {
  state = {
    value: undefined,
  }

  continue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };


  handleChange = event => {
    console.log(event);
    this.setState({ value: event });
  };

  render() {
    const { values } = this.props;
    const { item } = this.state;
    return (
      <Grid container spacing={24}>

        {Products.products.map((product) => {
          return (
            <Grid item xs={4} sm={2} key={product.name}>
              <Button key={product.name} color="primary" value={product.name} onClick={() => { this.setState({ value: product.items }); }}>
                {product.name}
              </Button>
            </Grid>
          );
        })}

        {console.log(this.state.value)}
        
        {this.state.value !== undefined && this.state.value.map(product => (
          <Grid item xs={4} sm={2}>
           <div>{product}</div>
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