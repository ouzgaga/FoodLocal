import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import DetailsInscriptionProducerForm from './DetailsInscriptionProducerForm';
import AvailableProductsForm from './AvailableProductsForm';
import ProductsDescriptionForm from './ProductsDescriptionForm';


function getSteps() {
  return ['Détails', 'Produits disponibles', 'Description des produits', 'Confirmation'];
}

export const IncriptionProducerContext = React.createContext({

});


export class InscriptionProducer extends Component {
  state = {
    step: 0,
    salePointName: '',
    addressRoad: '',
    addressCity: '',
    addressZip: '',
    AddressCountryState: '',
    AddressCountry: '',
    phoneNumber: '',
    scheduleActive: false,
    website: '',
    description: '',
    timeMondayEnable: false,
    timeMonday1Start: '08:00',
    timeMonday1End: '18:00',
    timeMonday2Start: '14:00',
    timeMonday2End: '18:00',
    items: [],
  }
  // Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  // Go back to prev step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  // Handle fields change
  handleChange = input => (e) => {
    this.setState({ [input]: e.target.value });
  };

  // change the checkbox value
  handleChangeCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  addItem = newItem => () => {
    this.setState({
      items: [...this.state.items, newItem]
    });
  }

  removeItem = itemToDelete => () => {
    const newItems = this.state.items.filter(item => {
      return item !== itemToDelete;
    });

    this.setState({
      items: [...newItems]
    });
  }

  pageContext = () => {
    const { step } = this.state;
    switch (step) {
      case 0:
        return (
          <DetailsInscriptionProducerForm />
        );
      case 1:
        return (
          <AvailableProductsForm />
        );
      case 2:
        return (
          <ProductsDescriptionForm />
        );
      case 3:
        return (
          <AvailableProductsForm
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={this.state}
          />
        );
      default:
        return <div>Error</div>;
    }
  }

  render() {
    const { step } = this.state;
    const steps = getSteps();
    return (
      <IncriptionProducerContext.Provider
        value={{
          nextStep: this.nextStep,
          prevStep: this.prevStep,
          handleChange: this.handleChange,
          handleChangeCheckbox: this.handleChangeCheckbox,
          addItem: this.addItem,
          removeItem: this.removeItem,
          values: this.state,
        }}
      >
        <Stepper activeStep={step} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Grid container justify="center" style={{ padding: 20 }}>

          {this.pageContext()}
        </Grid>

      </IncriptionProducerContext.Provider>
    );
  }
}

export default InscriptionProducer;
