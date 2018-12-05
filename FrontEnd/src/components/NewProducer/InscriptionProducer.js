import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import DetailsInscriptionProducerForm from './DetailsInscriptionProducerForm';
import AvailableProductsForm from './AvailableProductsForm';
import ProductsDescriptionForm from './ProductsDescriptionForm';
import ConfirmationForm from './ConfirmationForm';

function getSteps() {
  return ['Détails', 'Produits disponibles', 'Description des produits'];
}

export const IncriptionProducerContext = React.createContext({});

class InscriptionProducer extends Component {
  state = {
    step: 0,
    name: '',
    number: '',
    street: '',
    city: '',
    postalCode: '',
    state: '',
    country: '',
    longitude: '',
    latitude: '',

    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],

    phoneNumber: '',
    website: '',
    description: '',

    showCompleteAddress: false,
    scheduleActive: false,
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

  // Change une propriété du point de vente
  handleChangeProperty = (name, newValue) => {
    this.setState({ [name]: newValue });
  };

  addNewSchedule = dayName => () => {
    const openingsHour = {
      openingHour: '08:00',
      closingHour: '12:00'
    };

    const { state } = this;
    const dayTab = [...state[dayName], openingsHour];

    this.setState({
      [dayName]: dayTab
    });
  }

  deleteLastSchedule = dayName => () => {
    const { state } = this;
    const dayTab = state[dayName];

    dayTab.pop();

    this.setState({
      [dayName]: dayTab
    });
  }

  handleChangeSchedule = (dayName, index, type) => (event) => {
    const { state } = this;
    const dayTab = state[dayName];

    dayTab[index][type] = event.target.value;

    this.setState({
      [dayName]: dayTab
    });
  }

  // ajoute un nouveau produit dans notre tableau de produits
  addItem = newItem => () => {
    const { items } = this.state;
    const newItemToAdd = { item: newItem, description: '' };
    this.setState({
      items: [...items, newItemToAdd]
    });
  }

  // supprime un produit du tableau des produits
  removeItem = itemToDelete => () => {
    const { items } = this.state;
    const newItems = items.filter(item => item.item !== itemToDelete);

    this.setState({
      items: [...newItems]
    });
  }

  // change la descrpiton d'un produit
  handleChangeDescription = input => (e) => {
    const { state } = this;
    const newItems = [...state.items];
    newItems.forEach((product) => {
      if (product.item === input) {
        product.description = e.target.value;
      }
    });

    this.setState({ items: newItems });
  };

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
      default:
        return <ConfirmationForm />;
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
          handleChangeProperty: this.handleChangeProperty,

          addNewSchedule: this.addNewSchedule,
          deleteLastSchedule: this.deleteLastSchedule,
          handleChangeSchedule: this.handleChangeSchedule,

          addItem: this.addItem,
          removeItem: this.removeItem,
          handleChangeDescription: this.handleChangeDescription,
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
