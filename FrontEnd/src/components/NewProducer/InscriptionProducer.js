import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import DetailsInscriptionProducerForm from './DetailsInscriptionProducerForm';
import AvailableProductsForm from './AvailableProductsForm';


function getSteps() {
  return ['Détails', 'Produits disponibles', 'Description des produits', 'Confirmation'];
}

export class UserForm extends Component {
  state = {
    step: 0,
    salePointName: '',
    address: {
      road: '',
      city: '',
      zip: '',
      countryState: '',
      country: ''
    },
    phoneNumber: '',
    schedule: '',
    website: '',
    description: ''
  };

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

  handleChangeAddress = input => (e) => {
    this.setState({ address: e.target.value });
  }

  pageContext = () => {
    const { step } = this.state;
    const {
      salePointName, phoneNumber, address, schedule, website, description
    } = this.state;
    const values = {
      salePointName, phoneNumber, address, schedule, website, description
    };
    switch (step) {
      case 0:
        return (
          <DetailsInscriptionProducerForm
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 1:
        return (
          <AvailableProductsForm
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 2:
        return (
          <DetailsInscriptionProducerForm
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 3:
        return <DetailsInscriptionProducerForm />;
      default:
        return <div>Error</div>;
    }
  }

  render() {
    const { step } = this.state;
    const steps = getSteps();
    return (
        <div>
          <Stepper activeStep={step} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Grid container justify="center" style={{padding:20}}>

            {this.pageContext()}
          </Grid>

        </div>
    );
  }
}

export default UserForm;
