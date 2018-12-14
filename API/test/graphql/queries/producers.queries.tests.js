const { makeExecutableSchema } = require('graphql-tools');
const { graphql } = require('graphql');
const { resolvers, schema: typeDefs } = require('../../../src/graphql/graphqlConfig');
const producersService = require('../../../src/graphql/services/producers.services');
const ProducersModel = require('../../../src/graphql/models/producers.modelgql');
const userModel = require('../../../src/graphql/models/users.modelgql');
const salespointsModel = require('../../../src/graphql/models/salespoints.modelgql');
const tokensValidationEmailModel = require('../../../src/graphql/models/tokensValidationEmail.modelgql');
const { Products: ProductModel, ProductType: ProductTypeModel, ProductTypeCategory: ProductTypeCategoryModel } = require(
  '../../../src/graphql/models/products.modelgql'
);


let benoit = {};
let antoine = {};
let pomme = {};
let poire = {};

const beforeEachFunc = () => async() => {
  // Création du type Fruit
  let productTypeCategory = {
    name: 'Fruits',
    image: 'ceci est une image de fruits encodée en base64!'
  };

  // on ajoute le contenu de départ
  // on ajoute le productTypeCategory
  productTypeCategory = await new ProductTypeCategoryModel(productTypeCategory).save();


  // on ajoute 2 productType
  const productTypePomme = {
    name: 'Pomme',
    image: 'ceci est une image de pomme encodée en base64!',
    categoryId: productTypeCategory.id,
    producersIds: []
  };
  pomme = await new ProductTypeModel(productTypePomme).save();

  const productTypePoire = {
    name: 'Poire',
    image: 'ceci est une image de poire encodée en base64!',
    categoryId: productTypeCategory.id,
    producersIds: []
  };
  poire = await ProductTypeModel(productTypePoire).save();

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
        productTypeId: pomme.id
      },
      {
        description: 'Une poire de folie!',
        productTypeId: poire.id
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
    },
    products: [
      {
        description: 'Une pomme monnnnstre bonne!',
        productTypeId: pomme.id
      }
    ]
  };
  benoit = await producersService.addProducer(benoit);

  antoine = await producersService.addProducer(antoine);
};

const afterEachFunc = () => async () => {
  // on supprime tout le contenu de la DB
  await ProducersModel.remove({});
  await ProductModel.remove({});
  await ProductTypeModel.remove({});
  await ProductTypeCategoryModel.remove({});
  await userModel.remove({});
  await salespointsModel.remove({});
  await tokensValidationEmailModel.remove({});
};

describe('Testing query producer Graphql', () => {
  // make the actual schema and resolvers executable
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  describe('Getting all producers', () => {
    beforeEach(beforeEachFunc());
    afterEach(afterEachFunc());
    it('sucess - query: getting firstname and lastname of all producers', async() => {
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
      const {
        query, variables, context, expected
      } = queryObj;
      const result = await graphql(schema, query, null, context, variables);
      return result.should.be.eql(expected);
    });

    it('sucess - getting producer with a correct id', async() => {
      const queryObj = {
        query: `
          query($id: ID!){
            producer(producerId: $id){
              id
              firstname
              lastname
              email
              password
              image
              emailValidated
              phoneNumber
              description
              website
              isValidated
              products{
                description
                productType{
                  name
                  image
                  category{
                    name
                    image
                  }
                }
              }
              salesPoint{
                name
                address{
                  number
                  street
                  city
                  postalCode
                  country
                  longitude
                  latitude
                }
                schedule {
                  monday {
                    openingHour
                    closingHour
                  }
                  tuesday{
                    openingHour
                    closingHour
                  }
                  wednesday{
                    openingHour
                    closingHour
                  }
                  thursday{
                    openingHour
                    closingHour
                  }
                  friday{
                    openingHour
                    closingHour
                  }
                  saturday{
                    openingHour
                    closingHour
                  }
                  sunday{
                    openingHour
                    closingHour
                  }
                }
              }
            }
          }`,
        variables:
          {
            id: benoit.id
          },
        context: {},
        expected: {
          data: {
            producer: {
              firstname: 'Benoît',
              lastname: 'Schopfer',
              email: 'benoit.schopfer5@heig-vd.ch',
              password: '1234abcd',
              image: 'Ceci est une image encodée en base64!',
              emailValidated: false,
              phoneNumber: '0761435196',
              description: 'Un chouet gaillard!',
              website: 'benoitschopfer.ch',
              isValidated: false,
              products: [
                {
                  description: 'Une pomme monnnnstre bonne!',
                  productType: {
                    name: 'Pomme',
                    image: 'ceci est une image de pomme encodée en base64!',
                    category: {
                      name: 'Fruits',
                      image: 'ceci est une image de fruits encodée en base64!'
                    }
                  }
                },
                {
                  description: 'Une poire de folie!',
                  productType: {
                    name: 'Poire',
                    image: 'ceci est une image de poire encodée en base64!',
                    category: {
                      name: 'Fruits',
                      image: 'ceci est une image de fruits encodée en base64!'
                    }
                  }
                }
              ],
              salesPoint: {
                name: 'Chez moi',
                address: {
                  number: 6,
                  street: 'Chemin de par ici',
                  city: 'Yverdon',
                  postalCode: '1400',
                  country: 'Suisse',
                  longitude: 1.1234567,
                  latitude: 1.123456789
                },
                schedule: {
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
              }
            }
          }
        }
      };
      const {
        query, variables, context, expected 
      } = queryObj;

      expected.data.producer.id = benoit.id;
      const result = await graphql(schema, query, null, context, variables);
      return result.should.be.eql(expected);
    });

    it('sucess - getting a producer without schedule on his sale point', async() => {
      const queryObj = {
        query: `
          query($id: ID!){
            producer(producerId: $id){
              id
              firstname
              lastname
              email
              password
              image
              emailValidated
              phoneNumber
              description
              website
              isValidated
              products{
                description
                productType{
                  name
                  image
                  category{
                    name
                    image
                  }
                }
              }
              salesPoint{
                name
                address{
                  number
                  street
                  city
                  postalCode
                  country
                  longitude
                  latitude
                }
                schedule {
                  monday {
                    openingHour
                    closingHour
                  }
                  tuesday{
                    openingHour
                    closingHour
                  }
                  wednesday{
                    openingHour
                    closingHour
                  }
                  thursday{
                    openingHour
                    closingHour
                  }
                  friday{
                    openingHour
                    closingHour
                  }
                  saturday{
                    openingHour
                    closingHour
                  }
                  sunday{
                    openingHour
                    closingHour
                  }
                }
              }
            }
          }`,
        variables:
          {
            id: antoine.id
          },
        context: {},
        expected: {
          data: {
            producer: {
              firstname: 'Antoine',
              lastname: 'Rochat',
              email: 'antoine.rochat5@heig-vd.ch',
              password: '1234abcd',
              image: "Ceci est l'image d'un tueur encodée en base64!",
              emailValidated: false,
              phoneNumber: '0761435196',
              description: 'Un vrai payouz!',
              website: null,
              isValidated: false,
              products: [
                {
                  description: 'Une pomme monnnnstre bonne!',
                  productType: {
                    name: 'Pomme',
                    image: 'ceci est une image de pomme encodée en base64!',
                    category: {
                      name: 'Fruits',
                      image: 'ceci est une image de fruits encodée en base64!'
                    }
                  }
                }
              ],
              salesPoint: {
                name: 'Chez lui, perdu au milieu de rien',
                address: {
                  number: 12,
                  street: 'Chemin de par ici',
                  city: 'Quelque part par là-bas',
                  postalCode: '1234',
                  country: 'Suisse',
                  longitude: 1.1234796,
                  latitude: 1.123418029
                },
                schedule: null
              }
            }
          }
        }
      };
      const {
        query, variables, context, expected
      } = queryObj;

      expected.data.producer.id = antoine.id;
      const result = await graphql(schema, query, null, context, variables);
      return result.should.be.eql(expected);
    });

    it('failed - getting firstname and lastname of an unexisted user', async() => {
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
            id: 'eeeeeeeeeeeeeeeeeeeeeeee' // incorrect id
          },
        context: {},
        expected: {
          data: {
            producer: null
          }
        }
      };
      const {
        query, variables, context, expected 
      } = queryObj;
      const result = await graphql(schema, query, null, context, variables);
      return result.should.be.eql(expected);
    });

    it('failed - getting firstname and lastname of an invalid id', async() => {
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
            id: 'badid' // incorrect id
          },
        context: {},
        expected: {
          // not usefull in this case, we want to see the error
        }
      };
      const {
        query, variables, context
      } = queryObj;
      const result = await graphql(schema, query, null, context, variables);
      return result.errors[0].message.should.be.equals('The received id (badid) is invalid!');
    });
  });
});
