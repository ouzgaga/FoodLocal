import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import DetailsInscriptionProducerForm from './DetailsInscriptionProducerForm';
import AvailableProductsForm from './AvailableProductsForm';
import ProductsDescriptionForm from './ProductsDescriptionForm';
import ConfirmationForm from './ConfirmationForm';
import FirstStep from './FirstStep';
import Typography from '@material-ui/core/Typography';

import { withApollo, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import DoFunction from '../items/DoFunction';

function getSteps() {
  return ['Inital', 'Détails', 'Produits disponibles', 'Description des produits'];
}

export const IncriptionProducerContext = React.createContext({});

const queryMe = gql`
query($userId: ID!) {
  producer(producerId: $userId){
    website,
    phoneNumber,
    description,
    salespoint{
      name,
      address{
        number,
        street,
        city,
        postalCode,
        state,
        country,
        longitude,
        latitude
      },
      schedule{
        monday{
        	openingHour,
          closingHour
        },
        tuesday{
        	openingHour,
          closingHour
        },
        wednesday{
        	openingHour,
          closingHour
        },
        thursday{
        	openingHour,
          closingHour
        },
        friday{
        	openingHour,
          closingHour
        },
        saturday{
        	openingHour,
          closingHour
        },
        sunday{
        	openingHour,
          closingHour
        }
      }
    },
    products{
      edges{
        node{
          id,
          description,
          productType{
            id
          }
        }
      }
    }
  }
}
`;

const mutNewSalePoint = gql`
  mutation($userId: ID!, $salePoint: SalespointInput!){
    addSalespointToProducer(producerId: $userId, salespoint: $salePoint){
      id
    }
  }
  `;

const mutUpdateSalepoint = gql`
  mutation($userId: ID!, $salePoint: SalespointInput!){
    updateSalespoint(producerId: $userId, salespoint: $salePoint){
      id
    }
  }
  `;

const mutUpdateProd = gql`
  mutation($user: ProducerInputUpdate!){
    updateProducer(producer: $user){
      description,
      email,
      phoneNumber,
      website
    }
  }
  `;

const mutAddNewProductArray = gql`
  mutation($userId: ID!, $products: [ProductInputAdd!]! ){
    addMultipleProducts(producerId: $userId, products: $products){
      totalCount
    }
  }
  `;

class InscriptionProducer extends Component {
  state = {
    step: 0,
    isNewProd: true,
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

    newItems: [],    

    error: null,
  }


  componentWillMount() {
    this.execute();
  }


  execute = async () => {
    const { client, userId } = this.props;
    await client.query({ query: queryMe, variables: { userId } })
      .then(
        (data) => {
          console.info(data.data.producer);
          if (data.data.producer.salespoint) {
            this.setState({
              isNewProd: false,
              showCompleteAddress: true,
              phoneNumber: data.data.producer.phoneNumber ? data.data.producer.phoneNumber : '',
              website: data.data.producer.website ? data.data.producer.website : '',
              name: data.data.producer.salespoint.name,
              number: data.data.producer.salespoint.address.number,
              street: data.data.producer.salespoint.address.street,
              city: data.data.producer.salespoint.address.city,
              postalCode: data.data.producer.salespoint.address.postalCode,
              state: data.data.producer.salespoint.address.state,
              country: data.data.producer.salespoint.address.country,
              longitude: data.data.producer.salespoint.address.longitude,
              latitude: data.data.producer.salespoint.address.latitude,
              error: null,
            });
            if (data.data.producer.salespoint.schedule) {
              this.setState({
                scheduleActive: true,
                monday: this.getDaySheldulObject(data.data.producer.salespoint.schedule.monday),
                tuesday: this.getDaySheldulObject(data.data.producer.salespoint.schedule.tuesday),
                wednesday: this.getDaySheldulObject(data.data.producer.salespoint.schedule.wednesday),
                thursday: this.getDaySheldulObject(data.data.producer.salespoint.schedule.thursday),
                friday: this.getDaySheldulObject(data.data.producer.salespoint.schedule.friday),
                saturday: this.getDaySheldulObject(data.data.producer.salespoint.schedule.saturday),
                sunday: this.getDaySheldulObject(data.data.producer.salespoint.schedule.sunday),
              });
            }
            if (data.data.producer.products.edges) {
              console.info("dudeee", data.data.producer.products.edges);
              console.info("ArrayInput", this.getItemFromAppoloToArray(data.data.producer.products.edges));
              this.setState({
                
              });
            }
          }
          if (data.data.producer.description) {
            this.setState({
              description: data.data.producer.description ? data.data.producer.description : '',
              error: null,
            });
          }
        }
      ).catch(
        (error) => {
          console.log("Erreur", error);
          this.setState({ error: "Erreur, Veuillez essayer plus tard" })
        }
      );
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

  getItemArrayObject = (array) => {
    return (
      array.map(data => ({
        productTypeId: data.item.id,
        description: data.description,
      }))
    );
  }

  getItemFromAppoloToArray = (edge) => {
    const ret = [];
    console.info("edge", edge[0].node.productType.id);
    if (edge.length !== 0) {
      edge.map(node => ret.push({
        description: node.node.description,
        personalId: node.node.id,
        productTypeId: node.node.productType.id,
      }));
    }

    return ret;
  }

  getDaySheldulObject = (arr) => {
    const ret = [];
    if (arr.length !== 0) {
      arr.map(data => ret.push({
        openingHour: data.openingHour,
        closingHour: data.closingHour,
      }));
    }
    return ret;
  }

  getShedulPtObject = () => {

    if (!scheduleActive)
      return null;

    const {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      scheduleActive
    } = this.state;

    return {
      monday: monday,
      tuesday: tuesday,
      wednesday: wednesday,
      thursday: thursday,
      friday: friday,
      saturday: saturday,
      sunday: sunday,
    };
  };



  pageContext = () => {
    const { step } = this.state;
    const { userId } = this.props;
    switch (step) {
      case 0:
        return (
          <FirstStep />
        );
      case 1:
        return (
          <DetailsInscriptionProducerForm />
        );
      case 2:
        return (
          <AvailableProductsForm />
        );
      case 3:
        return (
          <ProductsDescriptionForm />
        );
      default:
        const {
          isNewProd,

          name,
          number,
          street,
          city,
          postalCode,
          state,
          country,
          longitude,
          latitude,

          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,

          phoneNumber,
          website,
          description,

          items,

          error,
        } = this.state;
        return (
          <>
            <Mutation
              mutation={(isNewProd ? mutNewSalePoint : mutUpdateSalepoint)}
              variables={{
                userId: userId,
                website: website,
                phoneNumber: phoneNumber,
                description: description,
                salePoint: {
                  name: name,
                  address: {
                    number: parseInt(number),
                    street: street,
                    city: city,
                    postalCode: postalCode,
                    state: state,
                    country: country,
                    longitude: parseFloat(longitude),
                    latitude: parseFloat(latitude),
                  },
                  schedule: this.getShedulPtObject(),

                }
              }}
            >
              {(updateTodo, { data, loading, error }) => (
                <>
                  <DoFunction func={updateTodo} />
                  {data && <Typography> Point de vente ok </Typography>}
                  {loading && <Typography> Chargement </Typography>}
                  {error && <Typography color="error"> Une erreur est survenue. Le point de vente n'est pas ok. </Typography>}
                </>
              )}
            </Mutation>
            <Mutation
              mutation={mutUpdateProd}
              variables={{
                user: {
                  id: userId,
                  website: website,
                  phoneNumber: phoneNumber,
                  description: description,
                }
              }}
            >
              {(updateTodo, { data, loading, error }) => (
                <>
                  <DoFunction func={updateTodo} />
                  {data && <Typography> Point de vente ok </Typography>}
                  {loading && <Typography> Chargement </Typography>}
                  {error && <Typography color="error"> Une erreur est survenue. Le point de vente n'est pas ok. </Typography>}
                </>
              )}
            </Mutation>
          {/* TODO isNewPord */}
            {items.length !== 0 && isNewProd && (
              <Mutation
                mutation={mutAddNewProductArray}
                variables={{
                  userId: userId,
                  products: this.getItemArrayObject(items),
                }}
              >
                {(updateTodo, { data, loading, error }) => (
                  <>
                    <DoFunction func={updateTodo} />
                    {data && <Typography> Point de vente ok </Typography>}
                    {loading && <Typography> Chargement </Typography>}
                    {error && <Typography color="error"> Une erreur est survenue. Les produits ne sont pas ok. </Typography>}
                  </>
                )}
              </Mutation>
            )}

            <ConfirmationForm> {console.info("hoyyy", items, this.getItemArrayObject(items) )} </ConfirmationForm>
          </>
        );
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

export default withApollo(InscriptionProducer);
