const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const productsServices = require('../../../src/graphql/services/products.services');
const salespointsServices = require('../../../src/graphql/services/salespoints.services');
const producersServices = require('../../../src/graphql/services/producers.services');
const { resolvers, schema: typeDefs } = require('../../../src/graphql/graphqlConfig');
const clearDB = require('../clearDB');
const ProductTypesModel = require('../../../src/graphql/models/productTypes.modelgql');
const ProductTypeCategoriesModel = require('../../../src/graphql/models/productTypeCategories.modelgql');

const {
  queryObjAllProducers,
  queryObjProducerById,
  queryObjGetProducersWaitingForValidation,
  queryObjGetFilterProducers,
  mutationValidateProducer
} = require('./queries/QueryObjsProducers');

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

let productPomme = {
  description: 'Une pomme monnnnstre bonne!'
};

let productPoire = {
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

let benoit = {
  firstname: 'Benoît',
  lastname: 'Schöpfli',
  email: 'benoit@paysan.ch',
  password: '1234abcd',
  image: 'Ceci est une image encodée en base64!',
  phoneNumber: '0761435196',
  description: 'Un chouet gaillard!',
  website: 'benoitpaysan.ch'
};

let antoine = {
  firstname: 'Antoine',
  lastname: 'Rochaille',
  email: 'antoine@paysan.ch',
  password: '1234abcd',
  image: 'Ceci est l\'image d\'un tueur encodée en base64!',
  phoneNumber: '0761435196',
  description: 'Un vrai payouz!'
};

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  // on ajoute 1 productTypeCategory
  productTypeCategory = (await ProductTypeCategoriesModel.create(productTypeCategory)).toObject();

  // on ajoute 2 productType
  productTypePomme.categoryId = productTypeCategory.id;
  productTypePomme = (await ProductTypesModel.create(productTypePomme)).toObject();
  productTypePoire.categoryId = productTypeCategory.id;
  productTypePoire = (await ProductTypesModel.create(productTypePoire)).toObject();

  // on set le productTypeId avec les id de productType qu'on vient d'ajouter
  productPomme.productTypeId = productTypePomme.id;
  productPoire.productTypeId = productTypePoire.id;

  // on ajoute 1 producteur contenant le salespoint 'salespointBenoit' ainsi que 2 produits ('productPomme' et 'productPoire')
  benoit = (await producersServices.addProducer(benoit)).toObject();
  await producersServices.addSalespointToProducer(benoit.id, salespointBenoit);
  await productsServices.addAllProductsInArray([productPomme, productPoire], benoit.id);
  benoit = (await producersServices.getProducerById(benoit.id)).toObject();

  // on ajoute 1 producteur ne contenant pas de salespoint ainsi que 1 produit ('productPomme')
  antoine = (await producersServices.addProducer(antoine)).toObject();
  await productsServices.addAllProductsInArray([productPomme], antoine.id);
  antoine = (await producersServices.getProducerById(antoine.id)).toObject();
};

describe('Testing graphql request producers', () => {

  describe('QUERY producers', () => {
    beforeEach(() => clearAndPopulateDB());

    // -------------------------Producers()------------------------------------- //
    describe('Testing producers()', () => {
      it('should get all producers', async(done) => {
        const { query, variables, context } = queryObjAllProducers;
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------Producer(id)-------------------------------------- //
    describe('Testing producer(ProducerId)', () => {
      it('should get a producer by id (without salespoint)', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: antoine.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get a producer by id (with salespoint)', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: benoit.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(1);
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

      it('should fail getting a producer because invalid id received (too short)', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Received producer.id is invalid!');
        expect(result.data.producer).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a producer because invalid id received (too long)', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Received producer.id is invalid!');
        expect(result.data.producer).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------ProducerWaitingForValidation()-------------------------------------- //
    describe('Testing producerWaitingForValidation()', () => {
      it('should get all producers waiting for validation', async(done) => {
        const { query, variables, context } = queryObjGetProducersWaitingForValidation;
        let result = await graphql(schema, query, null, context, variables);
        expect.assertions(4);
        // on check qu'il y a bien 2 producteurs en attente de validation
        expect(result.data.producersWaitingForValidation.length).toEqual(2);

        // on valide un producteur
        await producersServices.validateAProducer(antoine.id, true);

        // on check qu'il ne reste plus qu'un producteur en attente de validation
        result = await graphql(schema, query, null, context, variables);
        expect(result.data.producersWaitingForValidation.length).toEqual(1);
        expect(result.data.producersWaitingForValidation[0].firstname).toEqual('Benoît');
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // --------------------filterProducers(ProductType)------------------------------------------ //
    describe('Testing filterProducers(ProductType)', () => {
      it('should get all producers producing one or more products of productType "apple"', async(done) => {
        const { query, context } = queryObjGetFilterProducers;
        const variables = { id: [productTypePomme.id] };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        // on check qu'il y a bien 2 producteurs produisant un ou plusieurs produits du type "Pomme"
        expect(result.data.filterProducers.length).toEqual(2);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all producers producing one or more products of productTypeCategory "perry"', async(done) => {
        const { query, context } = queryObjGetFilterProducers;
        const variables = { id: [productTypePoire.id] };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        // on check qu'il y a bien 2 producteurs produisant un ou plusieurs produits du type "Pomme"
        expect(result.data.filterProducers.length).toEqual(1);
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });

  describe('MUTATION producers', () => {
    beforeEach(() => clearAndPopulateDB());

    describe('Testing validateAProducer(Producer id)', () => {
      it('should change the validation state of a producer to true', async(done) => {
        const { mutation, context } = mutationValidateProducer;
        const variables = { producerId: antoine.id, state: true };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.validateAProducer.isValidated).toBeTruthy();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should change the validation state of a producer to false', async (done) => {
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
  });
});
