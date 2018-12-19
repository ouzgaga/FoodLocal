const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const producersService = require('../../../../src/graphql/services/producers.services');
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

let benoit = {};
let antoine = {};
let pomme = {};
let poire = {};

const beforeEachFunc = () => async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  // Création du type Fruit
  let productTypeCategory = {
    name: 'Fruits',
    image: 'ceci est une image de fruits encodée en base64!'
  };

  // on ajoute le productTypeCategory
  productTypeCategory = (await new ProductTypeCategoryModel(productTypeCategory).save()).toObject();

  // on ajoute 2 productType
  const productTypePomme = {
    name: 'Pomme',
    image: 'ceci est une image de pomme encodée en base64!',
    categoryId: productTypeCategory.id,
    producersIds: []
  };
  pomme = (await new ProductTypeModel(productTypePomme).save()).toObject();

  const productTypePoire = {
    name: 'Poire',
    image: 'ceci est une image de poire encodée en base64!',
    categoryId: productTypeCategory.id,
    producersIds: []
  };
  poire = (await ProductTypeModel(productTypePoire)
    .save()).toObject();

  // on ajoute le contenu de départ
  // on ajoute 2 producteur avec leur point de vente

  benoit = {
    firstname: 'Benoît',
    lastname: 'Schöpfli',
    email: 'benoit@paysan.ch',
    password: '1234abcd',
    image: 'Ceci est une image encodée en base64!',
    phoneNumber: '0761435196',
    description: 'Un chouet gaillard!',
    website: 'benoit-paysan.ch',
    salespoint: {
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
    },
    products: [
      {
        description: 'Une pomme moins bonne que celle d\'antoine!',
        productTypeId: pomme.id
      },
      {
        description: 'Une poire bof bof!',
        productTypeId: poire.id
      }
    ]
  };

  antoine = {
    firstname: 'Antoine',
    lastname: 'Rochaille',
    email: 'antoine@paysan.ch',
    password: '1234abcd',
    image: 'Ceci est l\'image d\'un tueur encodée en base64!',
    phoneNumber: '0761435196',
    description: 'Un vrai payouz!',
    salespoint: {
      name: 'Chez lui, perdu au milieu de rien',
      address: {
        number: 12,
        street: 'Chemin de par ici',
        city: 'Quelque part par là-bas',
        postalCode: '1234',
        state: 'Vaud',
        country: 'Suisse',
        longitude: 1.1234796,
        latitude: 1.123418029
      },
    },
    products: [
      {
        description: 'Une pomme meilleure que celle de Benoît!',
        productTypeId: pomme.id
      }
    ]
  };
  benoit = (await producersService.addProducer(benoit)).toObject();

  antoine = (await producersService.addProducer(antoine)).toObject();
};

describe('Testing graphql request producers', () => {
  describe('QUERY producers', () => {
    // -------------------------Producers()------------------------------------- //
    describe('Testing producers()', () => {
      beforeEach(beforeEachFunc());
      it('Getting all producers', async(done) => {
        const { query, variables, context } = queryObjAllProducers;
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(1);
        expect(result)
          .toMatchSnapshot();
        done();
      });
    });
    // ----------------------Producer(id)-------------------------------------- //
    describe('Testing producer(ProducerId)', () => {
      beforeEach(beforeEachFunc());
      it('Getting producer by id without schedule', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: antoine.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(1);
        expect(result)
          .toMatchSnapshot();
        done();
      });
      it('Getting producer by id with schedule', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: benoit.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(1);
        expect(result)
          .toMatchSnapshot();
        done();
      });
      it('Fail getting producer with wrong id', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(1);
        expect(result.data.producer)
          .toBeNull();
        done();
      });
      it('Fail getting producer with invalid id', async(done) => {
        const { query, context } = queryObjProducerById;
        const variables = { id: 'badid' };
        const result = await graphql(schema, query, null, context, variables);
        expect(result.errors[0].message)
          .toEqual('Received producer.id is invalid!');
        expect(result.data.producer)
          .toBeNull();
        done();
      });
    });
    // ----------------------ProducerWaitingForValidation()-------------------------------------- //
    describe('Testing producerWaitingForValidation()', () => {
      beforeEach(beforeEachFunc());
      it('Getting producers waiting for validation (1/2)', async(done) => {
        const { query, variables, context } = queryObjGetProducersWaitingForValidation;
        const result = await graphql(schema, query, null, context, variables);
        expect(result.data.producersWaitingForValidation.length)
          .toEqual(2);
        expect(result)
          .toMatchSnapshot();
        done();
      });
      it('Getting producers waiting for validation (1/2)', async(done) => {
        await producersService.validateAProducer(antoine.id, true);
        const { query, variables, context } = queryObjGetProducersWaitingForValidation;
        const result = await graphql(schema, query, null, context, variables);
        expect(result.data.producersWaitingForValidation.length)
          .toEqual(1);
        expect(result.data.producersWaitingForValidation[0].firstname)
          .toEqual('Benoît');
        expect(result)
          .toMatchSnapshot();
        done();
      });
    });

    // --------------------filterProducers(ProductType)------------------------------------------ //
    describe('Testing filterProducers(ProductType)', () => {
      beforeEach(beforeEachFunc());
      it('Getting producers selling apple', async(done) => {
        const { query, context } = queryObjGetFilterProducers;
        const variables = { id: [pomme.id] };
        const result = await graphql(schema, query, null, context, variables);
        expect(result.data.filterProducers.length)
          .toEqual(2);
        expect(result)
          .toMatchSnapshot();
        done();
      });
      it('Getting producers selling perry', async(done) => {
        const { query, context } = queryObjGetFilterProducers;
        const variables = { id: [poire.id] };
        const result = await graphql(schema, query, null, context, variables);
        expect(result.data.filterProducers.length)
          .toEqual(1);
        expect(result)
          .toMatchSnapshot();
        done();
      });
    });
  });
  describe('MUTATION producers', () => {
    beforeEach(beforeEachFunc());
    describe('Testing validateAProducer (Producer id)', () => {
      it('Changing validation producer', async(done) => {
        const { mutation, context } = mutationValidateProducer;
        const variables = { producerId: antoine.id , state: true };
        const result = await graphql(schema, mutation, null, context, variables);
        expect(result.data.validateAProducer.isValidated).toBeTruthy();
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });
});
