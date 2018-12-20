const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const productsServices = require('../../../../src/graphql/services/products.services');
const salespointsServices = require('../../../../src/graphql/services/salespoints.services');
const producersServices = require('../../../../src/graphql/services/producers.services');
const { resolvers, schema: typeDefs } = require('../../../../src/graphql/graphqlConfig');
const clearDB = require('../../clearDB'); const { Products: ProductModel, ProductType: ProductTypeModel, ProductTypeCategory: ProductTypeCategoryModel } = require(
  '../../../../src/graphql/models/products.modelgql'
);
const {
  queryObjAllProducers,
  queryObjProducerById,
  queryObjGetProducersWaitingForValidation,
  queryObjGetFilterProducers,
  mutationValidateProducer,
  mutationAddProducer,
  mutationUpdateProducer,
  mutationDeleteProducer
} = require('./Objects/QueryObjsProducers');

const schema = makeExecutableSchema({ typeDefs, resolvers });


let productTypeCategory = {
  name: 'Fruits',
  image: 'ceci est une image de fruits encodée en base64!'
};

let productTypePomme = {
  name: 'Pomme',
  image: 'ceci est une image de pomme encodée en base64!'
};

let productTypePoire = {
  name: 'Poire',
  image: 'ceci est une image de poire encodée en base64!'
};

const productPomme = {
  description: 'Une pomme monnnnstre bonne!'
};

const productPoire = {
  description: 'Une poire de folie!'
};

let salespointBenoit = {
  name: 'Chez moi',
  address: {
    number: 6,
    street: 'Chemin de par ici',
    city: 'Yverdon',
    postalCode: '1400',
    state: 'Vaud',
    country: 'Suisse',
    longitude: 1.1234567,
    latitude: 1.123456789
  },
  schedule:
    {
      monday: [
        {
          openingHour: '08:00',
          closingHour: '12:00'
        },
        {
          openingHour: '13:00',
          closingHour: '18:00'
        }
      ],
      tuesday: [],
      wednesday: [
        {
          openingHour: '08:00',
          closingHour: '12:00'
        }
      ],
      thursday: [],
      friday: [
        {
          openingHour: '08:00',
          closingHour: '12:00'
        }
      ],
      saturday: [],
      sunday: []
    }
};

const benoitInit = {
  firstname: 'Benoît',
  lastname: 'Schöpfli',
  email: 'benoit@paysan.ch',
  password: '1234abcd',
  image: 'Ceci est une image encodée en base64!',
  phoneNumber: '0761435196',
  description: 'Un chouet gaillard!',
  website: 'benoitpaysan.ch'
};

const antoineInit = {
  firstname: 'Antoine',
  lastname: 'Rochaille',
  email: 'antoine@paysan.ch',
  password: '1234abcd',
  image: 'Ceci est l\'image d\'un tueur encodée en base64!',
  phoneNumber: '0761435196',
  description: 'Un vrai payouz!'
};

let tabProductsBenoit = [];
let tabProductsAntoine = [];

let antoine = antoineInit;
let benoit = benoitInit;

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  // on ajoute 1 productTypeCategory
  productTypeCategory = (await ProductTypeCategoryModel.create(productTypeCategory)).toObject();

  // on ajoute 2 productType
  productTypePomme.categoryId = productTypeCategory.id;
  productTypePomme = (await ProductTypeModel.create(productTypePomme)).toObject();
  productTypePoire.categoryId = productTypeCategory.id;
  productTypePoire = (await ProductTypeModel.create(productTypePoire)).toObject();

  // on set le productTypeId avec les id de productType qu'on vient d'ajouter
  productPomme.productTypeId = productTypePomme.id;
  productPoire.productTypeId = productTypePoire.id;

  // on ajoute 1 producteur contenant le salespoint 'salespointBenoit' ainsi que 2 produits ('productPomme' et 'productPoire')
  salespointBenoit = (await salespointsServices.addSalesPoint(salespointBenoit)).toObject();
  benoit.salespoint = salespointBenoit.id;
  benoit = (await producersServices.addProducer(benoit)).toObject();
  tabProductsBenoit = await productsServices.addAllProductsInArray([productPomme, productPoire], benoit.id);
  tabProductsBenoit = tabProductsBenoit.map(product => product.toObject());

  // on ajoute 1 producteur ne contenant pas de salespoint ainsi que 1 produit ('productPomme')
  antoine = (await producersServices.addProducer(antoine)).toObject();
  tabProductsAntoine = await productsServices.addAllProductsInArray([productPomme], antoine.id);
  tabProductsAntoine = tabProductsAntoine.map(product => product.toObject());
};

describe('Testing graphql request producers', () => {
  describe('QUERY producers', () => {
    // -------------------------Producers()------------------------------------- //
    describe('Testing producers()', () => {
      beforeEach(() => clearAndPopulateDB());
      it('should get all producers', async(done) => {
        const { query, variables, context } = queryObjAllProducers;
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.data.producers.length).toEqual(2);
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------Producer(id)-------------------------------------- //
    describe('Testing producer(ProducerId)', () => {
      beforeEach(() => clearAndPopulateDB());
      // TODO: Be more precise
      it('should get a producer by id (without schedule)', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: antoine.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.data.producer).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
      // TODO: Be more precise
      it('should get a producer by id (with schedule)', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: benoit.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.data.producer).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a producer because unknown id received', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: 'abcdefabcdefabcdefbacdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.data.producer).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a producer beaucse invalid id received', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: 'badid' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(3);
        expect(result.errors[0].message).toEqual('Received producer.id is invalid!');
        expect(result.data.producer).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------ProducerWaitingForValidation()-------------------------------------- //
    describe('Testing producerWaitingForValidation()', () => {
      beforeEach(() => clearAndPopulateDB());
      it('should get all producers waiting for validation', async(done) => {
        const { query, variables, context } = queryObjGetProducersWaitingForValidation;
        let result = await graphql(schema, query, null, context, variables);
        expect.assertions(4);
        expect(result.data.producersWaitingForValidation.length).toEqual(2);

        // on valide un producteur
        await producersServices.validateAProducer(antoine.id, true);

        // il ne doit rester plus qu'un producteur en attente de validation
        result = await graphql(schema, query, null, context, variables);
        expect(result.data.producersWaitingForValidation.length).toEqual(1);
        expect(result.data.producersWaitingForValidation[0].firstname).toEqual('Benoît');
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // --------------------filterProducers(ProductType)------------------------------------------ //
    describe('Testing filterProducers(ProductType)', () => {
      beforeEach(() => clearAndPopulateDB());
      it('Getting producers selling apple', async(done) => {
        const { query, context } = queryObjGetFilterProducers;
        const variables = { id: [productTypePomme.id] };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.data.filterProducers.length).toEqual(2);
        expect(result).toMatchSnapshot();
        done();
      });

      it('Getting producers selling perry', async(done) => {
        const { query, context } = queryObjGetFilterProducers;
        const variables = { id: [productTypePoire.id] };
        expect.assertions(2);
        const result = await graphql(schema, query, null, context, variables);
        expect(result.data.filterProducers.length).toEqual(1);
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });
  // ---------------- Mutation producers -------------------------------- //
  describe('MUTATION producers', () => {
    // --------------validateAProducer ---------------------------------- //
    describe('Testing validateAProducer (Producer id)', () => {
      beforeEach(() => clearAndPopulateDB());
      it('Changing validation producer to true', async(done) => {
        const { mutation, context } = mutationValidateProducer;
        const variables = { producerId: antoine.id, state: true };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.validateAProducer.isValidated).toBeTruthy();
        expect(result).toMatchSnapshot();
        done();
      });
      it('Changing validation producer to false', async (done) => {
        await producersServices.validateAProducer(antoine.id, true);
        const { mutation, context } = mutationValidateProducer;
        const variables = { producerId: antoine.id, state: false };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.validateAProducer.isValidated).toBeFalsy();
        expect(result).toMatchSnapshot();
        done();
      });
    });
    // --------------------------- Add Producer ------------------------ //
    describe('Testing addProducer', () => {
      beforeEach(() => clearDB());
      it('Adding producer correctly', async (done) => {
        const { mutation, context } = mutationAddProducer;
        const variables = { producer: antoineInit };
        const resultAddProducer = await graphql(schema, mutation, null, context, variables);
        const producers = await producersServices.getProducers();
        // expect.assertions(4);
        expect(producers.length).toEqual(1);
        expect(producers[0].firstname).toEqual(antoineInit.firstname);
        expect(producers[0].isValidated).toBeFalsy();
        expect(resultAddProducer).toMatchSnapshot();
        done();
      });
      it('Adding empty producer', async (done) => {
        const { mutation, context } = mutationAddProducer;
        const variables = { producer: {} };
        const resultAddProducer = await graphql(schema, mutation, null, context, variables);
        const producers = await producersServices.getProducers();
        // expect.assertions(4);
        expect(producers.length).toEqual(0);
        expect(resultAddProducer.errors).not.toBeNull();
        expect(resultAddProducer).toMatchSnapshot();
        done();
      });
      it('Adding producer with null firstname', async (done) => {
        const { mutation, context } = mutationAddProducer;
        const producerToAdd = { ...antoineInit, firstname: null };
        const variables = { producer: producerToAdd };
        const resultAddProducer = await graphql(schema, mutation, null, context, variables);
        const producers = await producersServices.getProducers();
        // expect.assertions(4);
        expect(producers.length).toEqual(0);
        expect(resultAddProducer.errors).not.toBeNull();
        expect(resultAddProducer).toMatchSnapshot();
        done();
      });
      it('Adding producer with null lastname', async (done) => {
        const { mutation, context } = mutationAddProducer;
        const producerToAdd = { ...antoineInit, lastname: null };
        const variables = { producer: producerToAdd };
        const resultAddProducer = await graphql(schema, mutation, null, context, variables);
        const producers = await producersServices.getProducers();
        // expect.assertions(4);
        expect(producers.length).toEqual(0);
        expect(resultAddProducer.errors).not.toBeNull();
        expect(resultAddProducer).toMatchSnapshot();
        done();
      });
      it('Adding producer with null email', async (done) => {
        const { mutation, context } = mutationAddProducer;
        const producerToAdd = { ...antoineInit, email: null };
        const variables = { producer: producerToAdd };
        const resultAddProducer = await graphql(schema, mutation, null, context, variables);
        const producers = await producersServices.getProducers();
        // expect.assertions(4);
        expect(producers.length).toEqual(0);
        expect(resultAddProducer.errors).not.toBeNull();
        expect(resultAddProducer).toMatchSnapshot();
        done();
      });
      it('Adding producer with null password', async (done) => {
        const { mutation, context } = mutationAddProducer;
        const producerToAdd = { ...antoineInit, password: null };
        const variables = { producer: producerToAdd };
        const resultAddProducer = await graphql(schema, mutation, null, context, variables);
        const producers = await producersServices.getProducers();
        // expect.assertions(4);
        expect(producers.length).toEqual(0);
        expect(resultAddProducer.errors).not.toBeNull();
        expect(resultAddProducer).toMatchSnapshot();
        done();
      });
      it('Adding producer with empty firstname', async (done) => {
        const { mutation, context } = mutationAddProducer;
        const producerToAdd = { ...antoineInit, firstname: '' };
        const variables = { producer: producerToAdd };
        const resultAddProducer = await graphql(schema, mutation, null, context, variables);
        const producers = await producersServices.getProducers();
        // expect.assertions(4);
        expect(producers.length).toEqual(0);
        expect(resultAddProducer.errors).not.toBeNull();
        expect(resultAddProducer).toMatchSnapshot();
        done();
      });
      it('Adding producer with empty lastname', async (done) => {
        const { mutation, context } = mutationAddProducer;
        const producerToAdd = { ...antoineInit, lastname: '' };
        const variables = { producer: producerToAdd };
        const resultAddProducer = await graphql(schema, mutation, null, context, variables);
        const producers = await producersServices.getProducers();
        // expect.assertions(4);
        expect(producers.length).toEqual(0);
        expect(resultAddProducer.errors).not.toBeNull();
        expect(resultAddProducer).toMatchSnapshot();
        done();
      });
      it('Adding producer with empty email', async (done) => {
        const { mutation, context } = mutationAddProducer;
        const producerToAdd = { ...antoineInit, email: '' };
        const variables = { producer: producerToAdd };
        const resultAddProducer = await graphql(schema, mutation, null, context, variables);
        const producers = await producersServices.getProducers();
        // expect.assertions(4);
        expect(producers.length).toEqual(0);
        expect(resultAddProducer.errors).not.toBeNull();
        expect(resultAddProducer).toMatchSnapshot();
        done();
      });
      it('Adding producer with empty password', async (done) => {
        const { mutation, context } = mutationAddProducer;
        const producerToAdd = { ...antoineInit, password: '' };
        const variables = { producer: producerToAdd };
        const resultAddProducer = await graphql(schema, mutation, null, context, variables);
        const producers = await producersServices.getProducers();
        expect.assertions(3);
        expect(producers.length).toEqual(0);
        expect(resultAddProducer.errors).not.toBeNull();
        expect(resultAddProducer).toMatchSnapshot();
        done();
      });
    });
    // TODO: Change updateProducer in the api ! Doesn't work !
    // --------------------- Update Producer ----------------------------- //
    describe('updateProducer', () => {
      beforeEach(() => clearAndPopulateDB());
      it('updateProducer firstname correctly', async (done) => {
        const producerToUpdate = {
          id: antoine.id,
          firstname: 'bob',
          lastname: antoine.lastname,
          email: antoine.email,
          image: antoine.image,
          phoneNumber: antoine.phoneNumber,
          description: antoine.description,
          website: antoine.website,
        };
        const { mutation, context } = mutationUpdateProducer;
        const variables = { producer: producerToUpdate };
        const resultUpdatedProducer = await graphql(schema, mutation, null, context, variables);
        const producer = await producersServices.getProducerById(antoine.id);
        // Producer return by graphql
        expect(resultUpdatedProducer.data.updateProducer.firstname).toEqual('bob'); // Check if graphql return correct firstname
        // TODO: can be complete
        // Change in the db
        expect(producer.firstname).toEqual('bob'); // Check if the firstname change in the database
        expect(producer.lastname).toEqual(antoine.lastname);
        expect(producer.email).toEqual(antoine.email);
        expect(producer.image).toEqual(antoine.image);
        expect(producer.phoneNumber).toEqual(antoine.phoneNumber);
        expect(producer.description).toEqual(antoine.description);
        expect(producer.website).toBeNull(); // Is undefind in antoine object but null in db
        expect(producer.password).toEqual(antoine.password); // Is a problème in api to debug
        expect(producer.salespoint.length).toEqual(antoine.salespoint.length);
        expect(producer.followersIds.length).toEqual(antoine.followersIds.length);
        expect(producer.rating).toEqual(antoine.rating);
        // Compare with snapshot
        expect(resultUpdatedProducer).toMatchSnapshot();
        done();
      });
      it('updateProducer firstname correctly without giving all object', async (done) => {
        const producerToUpdate = {
          id: antoine.id,
          firstname: 'bob',
          lastname: antoine.firstname,
          email: antoine.email,
        };
        const { mutation, context } = mutationUpdateProducer;
        const variables = { producer: producerToUpdate };
        const resultUpdatedProducer = await graphql(schema, mutation, null, context, variables);
        const producer = await producersServices.getProducerById(antoine.id);
        expect(resultUpdatedProducer.data.updateProducer.firstname).toEqual('bob'); // Check if graphql return correct firstname
        expect(producer.firstname).toEqual('bob'); // Check if the firstname change in the database
        expect(producer.image).not.toBeNull();
        expect(producer.followersIds).not.toBeNull();
        expect(producer.phoneNumber).not.toBeNull();
        expect(producer.website).not.toBeNull();
        expect(producer.salespoint).not.toBeNull();
        expect(resultUpdatedProducer).toMatchSnapshot();
        done();
      });
      it('updateProducer lastname correctly', async (done) => {
        const producerToUpdate = {
          id: antoine.id,
          firstname: antoine.firstname,
          lastname: 'test',
          email: antoine.email,
          image: antoine.image,
          phoneNumber: antoine.phoneNumber,
          description: antoine.description,
          website: antoine.website,
        };
        const { mutation, context } = mutationUpdateProducer;
        const variables = { producer: producerToUpdate };
        const resultUpdatedProducer = await graphql(schema, mutation, null, context, variables);
        const producer = await producersServices.getProducerById(antoine.id);
        expect(resultUpdatedProducer.data.updateProducer.lastname).toEqual('test'); // Check if graphql return correct firstname
        expect(producer.lastname).toEqual('test'); // Check if the lastname change in the database
        expect(resultUpdatedProducer).toMatchSnapshot();
        done();
      });
      it('updateProducer email correctly', async (done) => {
        const producerToUpdate = {
          id: antoine.id,
          firstname: antoine.firstname,
          lastname: antoine.lastname,
          email: 'test@test.ch',
          image: antoine.image,
          phoneNumber: antoine.phoneNumber,
          description: antoine.description,
          website: antoine.website,
        };
        const { mutation, context } = mutationUpdateProducer;
        const variables = { producer: producerToUpdate };
        const resultUpdatedProducer = await graphql(schema, mutation, null, context, variables);
        const producer = await producersServices.getProducerById(antoine.id);
        expect(resultUpdatedProducer.data.updateProducer.email).toEqual('test@test.ch'); // Check if graphql return correct firstname
        expect(producer.email).toEqual('test@test.ch'); // Check if the email change in the database
        expect(resultUpdatedProducer).toMatchSnapshot();
        done();
      });
      it('updateProducer email with a string not a email', async (done) => {
        const producerToUpdate = {
          id: antoine.id,
          firstname: antoine.firstname,
          lastname: antoine.lastname,
          email: 'test',
          image: antoine.image,
          phoneNumber: antoine.phoneNumber,
          description: antoine.description,
          website: antoine.website,
        };
        const { mutation, context } = mutationUpdateProducer;
        const variables = { producer: producerToUpdate };
        const resultUpdatedProducer = await graphql(schema, mutation, null, context, variables);
        const producer = await producersServices.getProducerById(antoine.id);
        expect(resultUpdatedProducer.errors).not.toBeNull(); // Check if graphql return correct firstname
        expect(producer.email).not.toEqual(producerToUpdate.email); // Check if the email change in the database
        expect(resultUpdatedProducer).toMatchSnapshot();
        done();
      });
      it('updateProducer image correctly', async (done) => {
        const producerToUpdate = {
          id: antoine.id,
          firstname: antoine.firstname,
          lastname: antoine.lastname,
          email: antoine.email,
          image: 'test',
          phoneNumber: antoine.phoneNumber,
          description: antoine.description,
          website: antoine.website,
        };
        const { mutation, context } = mutationUpdateProducer;
        const variables = { producer: producerToUpdate };
        const resultUpdatedProducer = await graphql(schema, mutation, null, context, variables);
        const producer = await producersServices.getProducerById(antoine.id);
        expect(resultUpdatedProducer.data.updateProducer.image).toEqual('test'); // Check if graphql return correct firstname
        expect(producer.image).toEqual('test'); // Check if the image change in the database
        expect(resultUpdatedProducer).toMatchSnapshot();
        done();
      });
      it('updateProducer phoneNumber correctly', async (done) => {
        const producerToUpdate = {
          id: antoine.id,
          firstname: antoine.firstname,
          lastname: antoine.lastname,
          email: antoine.email,
          image: antoine.image,
          phoneNumber: '7357',
          description: antoine.description,
          website: antoine.website,
        };
        const { mutation, context } = mutationUpdateProducer;
        const variables = { producer: producerToUpdate };
        const resultUpdatedProducer = await graphql(schema, mutation, null, context, variables);
        const producer = await producersServices.getProducerById(antoine.id);
        expect(resultUpdatedProducer.data.updateProducer.phoneNumber).toEqual('7357'); // Check if graphql return correct firstname
        expect(producer.phoneNumber).toEqual('7357'); // Check if the phonenumber change in the database
        expect(resultUpdatedProducer).toMatchSnapshot();
        done();
      });
      it('updateProducer description correctly', async (done) => {
        const producerToUpdate = {
          id: antoine.id,
          firstname: antoine.firstname,
          lastname: antoine.lastname,
          email: antoine.email,
          image: antoine.image,
          phoneNumber: antoine.phoneNumber,
          description: 'testDesc',
          website: antoine.website,
        };
        const { mutation, context } = mutationUpdateProducer;
        const variables = { producer: producerToUpdate };
        const resultUpdatedProducer = await graphql(schema, mutation, null, context, variables);
        const producer = await producersServices.getProducerById(antoine.id);
        expect(resultUpdatedProducer.data.updateProducer.description).toEqual('testDesc'); // Check if graphql return correct firstname
        expect(producer.description).toEqual('testDesc'); // Check if the description change in the database
        expect(resultUpdatedProducer).toMatchSnapshot();
        done();
      });
      it('updateProducer website correctly', async (done) => {
        const producerToUpdate = {
          id: antoine.id,
          firstname: antoine.firstname,
          lastname: antoine.lastname,
          email: antoine.email,
          image: antoine.image,
          phoneNumber: antoine.phoneNumber,
          description: antoine.description,
          website: 'www.test.ch',
        };
        const { mutation, context } = mutationUpdateProducer;
        const variables = { producer: producerToUpdate };
        const resultUpdatedProducer = await graphql(schema, mutation, null, context, variables);
        const producer = await producersServices.getProducerById(antoine.id);
        expect(resultUpdatedProducer.data.updateProducer.website).toEqual('www.test.ch'); // Check if graphql return correct firstname
        expect(producer.website).toEqual('www.test.ch'); // Check if the description change in the database
        expect(resultUpdatedProducer).toMatchSnapshot();
        done();
      });
    });
    // -------------------------- deleteProducer ----------------------------- //
    describe('deleteProducer', () => {
      beforeEach(() => clearAndPopulateDB());
      it('Delete correctly producer', async (done) => {
        const { mutation, context } = mutationDeleteProducer;
        const variables = { id: antoine.id };
        const resultDeletedProducer = await graphql(schema, mutation, null, context, variables);
        const producers = await producersServices.getProducers();
        // Data return by graphql
        expect(resultDeletedProducer.data.deleteProducer.email).toEqual(antoine.email);
        // Changement into the db
        expect(producers.length).toEqual(1);
        expect(producers.map(producer => producer.id)).not.toContainEqual(antoine.id);
        expect(resultDeletedProducer).toMatchSnapshot();
        done();
      });
      it('Delete unknow user (wrong id)', async (done) => {
        const { mutation, context } = mutationDeleteProducer;
        const variables = { id: 'abcdefabcdefabcdefbacdef' };
        const resultDeletedProducer = await graphql(schema, mutation, null, context, variables);
        const producers = await producersServices.getProducers();
        // Data return by graphql
        console.log(resultDeletedProducer);
        expect(resultDeletedProducer.data.deleteProducer).toBeNull();
        // Changement into the db
        expect(producers.length).toEqual(2);
        expect(resultDeletedProducer).toMatchSnapshot();
        done();
      });
      // TODO: Delete admin
    });
  });
});

// TODO: test updateProducer with incorrect phone number
