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
  mutationValidateProducer
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
  productPomme = await productsServices.addProduct(productPomme, benoit.id);
  productPoire = await productsServices.addProduct(productPoire, benoit.id);

  // on ajoute 1 producteur ne contenant pas de salespoint ainsi que 1 produit ('productPomme')
  antoine = (await producersServices.addProducer(antoine)).toObject();
  const productAntoine = await productsServices.addProduct(productPomme, antoine.id);
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
      it('should get a producer by id (without schedule)', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: antoine.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get a producer by id (with schedule)', async(done) => {
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
        expect.assertions(1);
        expect(result.data.producer).toBeNull();
        done();
      });

      it('should fail getting a producer beaucse invalid id received', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: 'badid' };
        const result = await graphql(schema, query, null, context, variables);
        expect(result.errors[0].message).toEqual('Received producer.id is invalid!');
        expect(result.data.producer).toBeNull();
        done();
      });
    });

    // ----------------------ProducerWaitingForValidation()-------------------------------------- //
    describe('Testing producerWaitingForValidation()', () => {
      it('should get all producers waiting for validation', async(done) => {
        const { query, variables, context } = queryObjGetProducersWaitingForValidation;
        let result = await graphql(schema, query, null, context, variables);
        expect(result.data.producersWaitingForValidation.length).toEqual(2);
        expect(result).toMatchSnapshot();

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
      it('Getting producers selling apple', async(done) => {
        const { query, context } = queryObjGetFilterProducers;
        const variables = { id: [productPomme.id] };
        const result = await graphql(schema, query, null, context, variables);
        expect(result.data.filterProducers.length).toEqual(2);
        expect(result).toMatchSnapshot();
        done();
      });

      it('Getting producers selling perry', async(done) => {
        const { query, context } = queryObjGetFilterProducers;
        const variables = { id: [productPoire.id] };
        const result = await graphql(schema, query, null, context, variables);
        expect(result.data.filterProducers.length).toEqual(1);
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });

  describe('MUTATION producers', () => {
    beforeEach(() => clearAndPopulateDB());

    describe('Testing validateAProducer (Producer id)', () => {
      it('Changing validation producer', async(done) => {
        const { mutation, context } = mutationValidateProducer;
        const variables = { producerId: antoine.id, state: true };
        const result = await graphql(schema, mutation, null, context, variables);
        expect(result.data.validateAProducer.isValidated).toBeTruthy();
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });
});
