const { makeExecutableSchema } = require('graphql-tools');
const { graphql } = require('graphql');
const { resolvers, schema: typeDefs } = require('../../../src/graphql/graphqlConfig');
const producersService = require('../../../src/graphql/services/producers.services');
const ProducersModel = require('../../../src/graphql/models/producers.modelgql');
const userModel = require('../../../src/graphql/models/user.modelgql');
const salespointsModel = require('../../../src/graphql/models/salespoints.modelgql');
const tokensValidationEmailModel = require('../../../src/graphql/models/tokensValidationEmail.modelgql');
const { Products: ProductModel, ProductType: ProductTypeModel, ProductTypeCategory: ProductTypeCategoryModel } = require(
  '../../../src/graphql/models/products.modelgql'
);

let benoit = {};
let antoine = {};

const cases = [

  {
    id: 'Getting producer by id - firstname and lastname',
    query: `
      query($id: ID!){
        producer(producerId: $id){
          firstname
          lastname
        }
      }
    `,
    variables:
      {
        id: antoine.id
      },
    context: {},
    expected: {
      data: {
        producers: [
          {
            firstname: 'Antoine',
            lastname: 'Rochat'
          },

        ]
      }
    }
  }
];

describe('Testing query producer Graphql', () => {
  // make the actual schema and resolvers executable
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // running the test for each case in the cases array
  beforeEach(async() => {
    // on supprime tout le contenu de la DB
    await ProducersModel.deleteMany();
    await ProductModel.deleteMany();
    await ProductTypeModel.deleteMany();
    await ProductTypeCategoryModel.deleteMany();
    await userModel.deleteMany();
    await salespointsModel.deleteMany();
    await tokensValidationEmailModel.deleteMany();

    // Création du type Fruit
    let productTypeCategory = {
      name: 'Fruits',
      image: 'ceci est une image de fruits encodée en base64!'
    };

    // on ajoute le contenu de départ
    // on ajoute le productTypeCategory
    productTypeCategory = await ProductTypeCategoryModel.create(productTypeCategory);


    // on ajoute 2 productType
    let productTypePomme = {
      name: 'Pomme',
      image: 'ceci est une image de pomme encodée en base64!',
      categoryId: productTypeCategory.id,
      producersIds: []
    };
    const addedProductTypePomme = await ProductTypeModel.create(productTypePomme);
    productTypePomme = {
      id: addedProductTypePomme.id,
      name: addedProductTypePomme.name,
      image: addedProductTypePomme.image,
      categoryId: productTypeCategory.id,
      producersIds: addedProductTypePomme.producersIds
    };

    let productTypePoire = {
      name: 'Poire',
      image: 'ceci est une image de poire encodée en base64!',
      categoryId: productTypeCategory.id,
      producersIds: []
    };
    const addedProductTypePoire = await ProductTypeModel.create(productTypePoire);
    productTypePoire = {
      id: addedProductTypePoire.id,
      name: addedProductTypePoire.name,
      image: addedProductTypePoire.image,
      categoryId: productTypeCategory.id,
      producersIds: addedProductTypePoire.producersIds
    };

    // on ajoute le contenu de départ
    // on ajoute 2 producteur avec leur point de vente


    benoit = {
      firstname: 'Benoît',
      lastname: 'Schopfer',
      email: 'benoit.schopfer5@heig-vd.ch',
      password: '1234abcd',
      image: 'Ceci est une image encodée en base64!',
      phoneNumber: '0761435196',
      description: 'Un chouet gaillard!',
      website: 'benoitschopfer.ch',
      salesPoint: {
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
          description: 'Une pomme monnnnstre bonne!',
          productTypeId: addedProductTypePomme.id
        },
        {
          description: 'Une poire de folie!',
          productTypeId: addedProductTypePoire.id
        }
      ]
    };

    antoine = {
      firstname: 'Antoine',
      lastname: 'Rochat',
      email: 'antoine.rochat5@heig-vd.ch',
      password: '1234abcd',
      image: 'Ceci est l\'image d\'un tueur encodée en base64!',
      phoneNumber: '0761435196',
      description: 'Un vrai payouz!',
      salesPoint: {
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
          description: 'Une pomme monnnnstre bonne!',
          productTypeId: addedProductTypePomme.id
        }
      ]
    };
    benoit = await producersService.addProducer(benoit);

    antoine = await producersService.addProducer(antoine);
  });

  afterEach(() => {
    // on supprime tout le contenu de la DB
    // mongoose.connection.db.dropDatabase();
  });

  it('query: Getting producers - firstname and lastname', async () => {
    const queryObj = {
      query: `
      query{
        producers{
          firstname
          lastname
        }
      }
    `,
      variables: {},
      context: {},
      expected: {
        data: {
          producers: [
            {
              firstname: 'Benoît',
              lastname: 'Schopfer'
            },
            {
              firstname: 'Antoine',
              lastname: 'Rochat'
            },

          ]
        }
      }
    };
    const { query, variables, context, expected } = queryObj;
    const result = await graphql(schema, query, null, context, variables);
    return result.should.be.eql(expected);
  });

  it('query: Getting producer by id - firstname and lastname', async () => {
    const queryObj = {
      query: `
      query($id: ID!){
        producer(producerId: $id){
          firstname
          lastname
        }
      }
    `,
      variables:
        {
          id: antoine.id
        },
      context: {},
      expected: {
        data: {
          producer:
            {
              firstname: 'Antoine',
              lastname: 'Rochat'
            },
        }
      }
    };
    const { query, variables, context, expected } = queryObj;
    const result = await graphql(schema, query, null, context, variables);
    return result.should.be.eql(expected);
  });

  it('query: Getting producer by id - firstname and lastname', async () => {
    const queryObj = {
      query: `
      query($id: ID!){
        producer(producerId: $id){
          firstname
          lastname
        }
      }
    `,
      variables:
        {
          id: antoine.id
        },
      context: {},
      expected: {
        data: {
          producer:
            {
              firstname: 'Antoine',
              lastname: 'Rochat'
            },
        }
      }
    };
    const { query, variables, context, expected } = queryObj;
    const result = await graphql(schema, query, null, context, variables);
    return result.should.be.eql(expected);
  });
});
