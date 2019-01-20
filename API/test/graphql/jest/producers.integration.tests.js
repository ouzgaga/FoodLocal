const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { resolvers, schema: typeDefs } = require('../../../src/graphql/graphqlConfig');
const producersServices = require('../../../src/graphql/services/producers.services');
const { populateDB, getTabProducers, getTabProductTypes } = require('../../populateDatabase');

const schema = makeExecutableSchema({ typeDefs, resolvers });

let tabProducers;
let tabProductTypes;

const clearAndPopulateDB = async() => {
  // ------------------------------------------------------------- on ajoute le contenu de départ -------------------------------------------------------------
  await populateDB();

  // FIXME: appeler les fonction getTab directement dans les tests (pour n'appeler que celles que j'utilise réellement!)
  tabProducers = await getTabProducers();
  tabProductTypes = await getTabProductTypes();
};

describe('Testing graphql request producers', () => {
  describe('QUERY producers', () => {
    beforeEach(() => clearAndPopulateDB());

    // -------------------------producers()------------------------------------- //
    describe('Testing producers()', () => {
      const { query } = {
        query: `
query {
  producers {
    edges {
      node {
        id
        firstname
        lastname
        email
        image
        followingProducers {
          edges {
            node {
              id
              firstname
              lastname
            }
          }
        }
        emailValidated
        isAdmin
        followers {
          edges {
            node {
              id
              lastname
              firstname
            }
          }
        }
        phoneNumber
        description
        website
        salespoint {
          name
          address {
            number
            street
            city
            postalCode
            state
            country
            longitude
            latitude
          }
          schedule {
            monday {
              openingHour
              closingHour
            }
            tuesday {
              openingHour
              closingHour
            }
            wednesday {
              openingHour
              closingHour
            }
            thursday {
              openingHour
              closingHour
            }
            friday {
              openingHour
              closingHour
            }
            saturday {
              openingHour
              closingHour
            }
            sunday {
              openingHour
              closingHour
            }
          }
        }
        isValidated
        products {
          edges {
            node {
              id
              description
              productType {
                id
                name
                image
                category {
                  id
                  name
                }
              }
            }
          }
        }
        rating {
          nbRatings
          rating
        }
      }
    }
  }
}`
      };
      it('should get all producers', async(done) => {
        const result = await graphql(schema, query, null, {}, {});
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------producer(producerId: ID!)-------------------------------------- //
    describe('Testing producer(producerId: ID!)', () => {
      const { query } = {
        query: `
query($id: ID!){
  producer(producerId: $id){
    firstname
    lastname
    email
    image
    followingProducers{
      edges {
        node {
          id
          firstname
          lastname
          email
          image
        }
      }
    }
    emailValidated
    isAdmin
    followers{
      edges{
        node{
          id
          firstname
          lastname
          email
          image
        }
      }
    }
    phoneNumber
    description
    website
    salespoint{
      name
      address{
        number
        street
        city
        postalCode
        state
        country
        longitude
        latitude
      }
      schedule{
        monday{
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
    isValidated
    products{
      edges{
        node{
          id
          description
          productType{
            id
            name
            image
          }
        }
      }
    }
    rating{
      nbRatings
      rating
    }
  }
}`
      };

      it('should get a producer by id (without salespoint)', async(done) => {
        const variables = { id: tabProducers[3].id };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        expect(result.data.producer).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get a producer by id (with salespoint)', async(done) => {
        const variables = { id: tabProducers[0].id };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        expect(result.data.producer).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a producer because unknown id received', async(done) => {
        const variables = { id: 'abcdefabcdefabcdefbacdef' };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        expect(result.data.producer).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a producer because invalid id received (too short)', async(done) => {
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Received producer.id is invalid!');
        expect(result.data.producer).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a producer because invalid id received (too long)', async(done) => {
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Received producer.id is invalid!');
        expect(result.data.producer).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------producerWaitingForValidation()-------------------------------------- //
    describe('Testing producerWaitingForValidation()', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: true, kind: tabProducers[0].kind };
      });

      const { query } = {
        query: `
query {
  producersWaitingForValidation {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        firstname
        lastname
        email
        image
        followingProducers {
          edges {
            node {
              id
              firstname
              lastname
              email
              image
            }
          }
        }
        emailValidated
        isAdmin
        followers {
          edges {
            node {
              id
              firstname
              lastname
              email
              image
            }
          }
        }
        phoneNumber
        description
        website
        salespoint {
          name
          address {
            number
            street
            city
            postalCode
            state
            country
            longitude
            latitude
            distance
          }
          schedule {
            monday {
              openingHour
              closingHour
            }
            tuesday {
              openingHour
              closingHour
            }
            wednesday {
              openingHour
              closingHour
            }
            thursday {
              openingHour
              closingHour
            }
            friday {
              openingHour
              closingHour
            }
            saturday {
              openingHour
              closingHour
            }
            sunday {
              openingHour
              closingHour
            }
          }
        }
        isValidated
        products {
          edges {
            node {
              id
              description
              productType {
                id
                name
                image
                category {
                  id
                  name
                  image
                }
              }
            }
          }
        }
        rating {
          nbRatings
          rating
        }
      }
    }
  }
}
`,
        variables: {},
        context: {}
      };

      it('should get all producers (2) waiting for validation', async(done) => {
        const result = await graphql(schema, query, null, context, null);
        expect.assertions(2);
        // on check qu'il y a bien 2 producteurs en attente de validation
        expect(result.data.producersWaitingForValidation.length).toEqual(2);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all producers (1) waiting for validation', async(done) => {
        await producersServices.validateAProducer(tabProducers[2].id, true);
        // on check qu'il ne reste plus qu'un producteur en attente de validation
        const result = await graphql(schema, query, null, context, null);
        expect.assertions(3);
        expect(result.data.producersWaitingForValidation.length).toEqual(1);
        expect(result.data.producersWaitingForValidation[0].firstname).toEqual('Jérémie');
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not get all producers waiting for validation because you need to be logged in', async(done) => {
        await producersServices.validateAProducer(tabProducers[2].id, true);
        // on check qu'il ne reste plus qu'un producteur en attente de validation
        const result = await graphql(schema, query, null, {}, null);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not get all producers waiting for validation because you need to be logged in as an administrator', async(done) => {
        context.isAdmin = false;
        await producersServices.validateAProducer(tabProducers[2].id, true);
        // on check qu'il ne reste plus qu'un producteur en attente de validation
        const result = await graphql(schema, query, null, context, null);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be an administrator to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // --------------------filterProducers(byProductTypeIds: [ID!]!)------------------------------------------ //
    // TODO: geoFilterProducer
    /*describe('Testing filterProducers(byProductTypeIds: [ID!]!)', () => {
      const { query } = {
        query: `
    query($id: [ID!]){
      filterProducers(byProductTypeIds: $id){
        firstname
        lastname
        email
        image
        followingProducers{
          firstname
          lastname
          email
        }
        emailValidated
        isAdmin
        followers{
          firstname
          lastname
          email
        }
        phoneNumber
        description
        website
        salespoint{
          name
          address{
            number
            street
            city
            postalCode
            state
            country
            longitude
            latitude
          }
          schedule{
            monday{
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
            producers{
              firstname
              lastname
              email
            }
          }
        }
        rating{
          nbRatings
          rating
        }
      }
    }`
      };

      it('should get all producers producing one or more products of productType "Fromages / Produits Laitiers"', async(done) => {
        const variables = { id: [tabProductTypes[1]._id] };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        // on check qu'il y a bien 3 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers"
        expect(result.data.filterProducers.length).toEqual(3);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all producers producing one or more products of productTypeCategory "Fromages / Produits Laitiers" AND one or more products of'
         + ' productTypeCategory "Jus de fruits"', async(done) => {
        const variables = { id: [tabProductTypes[10]._id, tabProductTypes[1]._id] };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        // on check qu'il y a bien 2 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers" et un ou plusieurs produits
        // de type "Jus de fruits"
        expect(result.data.filterProducers.length).toEqual(2);
        expect(result).toMatchSnapshot();
        done();
      });


      it('should get all producers producing one or more products of productTypeCategory "Fromages / Produits Laitiers" AND one or more products of'
         + ' productTypeCategory "Jus de fruits" AND one or more products of productTypeCategory "Pâtes"', async(done) => {
        const variables = { id: [tabProductTypes[1]._id, tabProductTypes[10]._id, tabProductTypes[17]._id] };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        // on check qu'il y a bien qu'un producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers", un ou plusieurs produits
        // de type "Jus de fruits" et un ou plusieurs produits de type "pâtes"
        expect(result.data.filterProducers.length).toEqual(1);
        expect(result).toMatchSnapshot();
        done();
      });
    });*/
  });

  describe('MUTATION producers', () => {
    beforeEach(() => clearAndPopulateDB());

    // --------------------validateAProducer(producerId: ID!, validationState: Boolean!)------------------------------------------ //
    describe('Testing validateAProducer(producerId: ID!, validationState: Boolean!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: true, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `
mutation($producerId: ID!, $state: Boolean!) {
  validateAProducer(producerId: $producerId, validationState: $state) {
    firstname
    lastname
    email
    image
    followingProducers {
      edges {
        node {
          firstname
          lastname
          email
        }
      }
    }
    emailValidated
    isAdmin
    followers {
      edges {
        node {
          firstname
          lastname
          email
        }
      }
    }
    phoneNumber
    description
    website
    salespoint {
      name
      address {
        number
        street
        city
        postalCode
        state
        country
        longitude
        latitude
      }
      schedule {
        monday {
          openingHour
          closingHour
        }
        tuesday {
          openingHour
          closingHour
        }
        wednesday {
          openingHour
          closingHour
        }
        thursday {
          openingHour
          closingHour
        }
        friday {
          openingHour
          closingHour
        }
        saturday {
          openingHour
          closingHour
        }
        sunday {
          openingHour
          closingHour
        }
      }
    }
    isValidated
    products {
      edges {
        node {
          description
          productType {
            name
            image
            category {
              name
              image
            }
            producers {
              edges {
                node {
                  firstname
                  lastname
                  email
                }
              }
            }
          }
        }
      }
    }
    rating {
      nbRatings
      rating
    }
  }
}
`
      };

      it('should change the validation state of a producer to true', async(done) => {
        const variables = { producerId: tabProducers[2].id, state: true };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.validateAProducer.isValidated).toBeTruthy();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should change the validation state of a producer to false', async(done) => {
        const variables = { producerId: tabProducers[0].id, state: false };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.validateAProducer.isValidated).toBeFalsy();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not change the validation state of a producer because you need to be logged in', async(done) => {
        const variables = { producerId: tabProducers[0].id, state: false };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not change the validation state of a producer because you need to be logged in as an administrator', async(done) => {
        context.isAdmin = false;
        const variables = { producerId: tabProducers[0].id, state: false };
        const result = await graphql(schema, mutation, null, context, variables);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be an administrator to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    /*
    // --------------------addProducer(producer: ProducerInputAdd!)------------------------------------------ //
    describe('Testing addProducer(producer: ProducerInputAdd!)', () => {
      beforeEach(() => clearAndPopulateDB());

      const { mutation } = {
        mutation: `mutation($producer: ProducerInputAdd!) {
  addProducer(producer: $producer) {
    firstname
    lastname
    email
    image
    followingProducers {
      firstname
      lastname
      email
    }
    emailValidated
    isAdmin
    followers {
      firstname
      lastname
      email
    }
    phoneNumber
    description
    website
    salespoint {
      name
      address {
        number
        street
        city
        postalCode
        state
        country
        longitude
        latitude
      }
      schedule {
        monday {
          openingHour
          closingHour
        }
        tuesday {
          openingHour
          closingHour
        }
        wednesday {
          openingHour
          closingHour
        }
        thursday {
          openingHour
          closingHour
        }
        friday {
          openingHour
          closingHour
        }
        saturday {
          openingHour
          closingHour
        }
        sunday {
          openingHour
          closingHour
        }
      }
    }
    isValidated
    products {
      description
      productType {
        name
        image
        category {
          name
          image
        }
        producers {
          firstname
          lastname
          email
        }
      }
    }
    rating {
      nbRatings
      rating
    }
  }
}
`
      };

      it('should add a new producer', async(done) => {
        const variables = {
          producer: {
            firstname: 'benoit',
            lastname: 'Schöpfli',
            email: 'benoit@schöpfli.ch',
            password: '1234abcd',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.data.addProducer).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new producer because of missing mendatory information', async(done) => {
        const variables = {
          producer: {
            lastname: 'Schöpfli',
            email: 'benoit@schöpfli.ch',
            password: '1234abcd',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new producer because of missing mendatory information', async(done) => {
        const variables = {
          producer: {
            firstname: 'benoit',
            email: 'benoit@schöpfli.ch',
            password: '1234abcd',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new producer because of missing mendatory information', async(done) => {
        const variables = {
          producer: {
            firstname: 'benoit',
            lastname: 'Schöpfli',
            password: '1234abcd',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new producer because of missing mendatory information', async(done) => {
        const variables = {
          producer: {
            firstname: 'benoit',
            lastname: 'Schöpfli',
            email: 'benoit@schöpfli.ch',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new producer because email already used', async(done) => {
        const variables = {
          producer: {
            firstname: 'benoit',
            lastname: 'Schöpfli',
            email: 'benoit@schöpfli.ch',
            password: '1234abcd',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        // on ajoute le producteur une 1ère fois
        let result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(4);
        expect(result.data.addProducer).not.toBeNull();

        // on tente d'ajouter le producteur une 2ème fois -> plante car email déjà utilisé
        result = await graphql(schema, mutation, null, null, variables);
        expect(result.data).toBeNull();
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });
    */

    // --------------------updateProducer(producer: ProducerInputUpdate!)------------------------------------------ //
    describe('Testing updateProducer(producer: ProducerInputUpdate!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: tabProducers[0].isAdmin, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `
mutation($producer: ProducerInputUpdate!) {
  updateProducer(producer: $producer) {
    firstname
    lastname
    email
    image
    followingProducers {
      edges {
        node {
          firstname
          lastname
          email
        }
      }
    }
    emailValidated
    isAdmin
    followers {
      edges {
        node {
          firstname
          lastname
          email
        }
      }
    }
    phoneNumber
    description
    website
    salespoint {
      name
      address {
        number
        street
        city
        postalCode
        state
        country
        longitude
        latitude
      }
      schedule {
        monday {
          openingHour
          closingHour
        }
        tuesday {
          openingHour
          closingHour
        }
        wednesday {
          openingHour
          closingHour
        }
        thursday {
          openingHour
          closingHour
        }
        friday {
          openingHour
          closingHour
        }
        saturday {
          openingHour
          closingHour
        }
        sunday {
          openingHour
          closingHour
        }
      }
    }
    isValidated
    products {
      edges {
        node {
          description
          productType {
            name
            image
            category {
              name
              image
            }
            producers {
              edges {
                node {
                  firstname
                  lastname
                  email
                }
              }
            }
          }
        }
      }
    }
    rating {
      nbRatings
      rating
    }
  }
}
`
      };

      it('should update a producer', async(done) => {
        const producerToAdd = {
          producer: {
            id: tabProducers[0].id,
            firstname: 'ben',
            lastname: 'Schöpfli',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        let result = await graphql(schema, mutation, null, context, producerToAdd);
        expect.assertions(6);
        expect(result.data.updateProducer).not.toBeNull();
        expect(result).toMatchSnapshot();

        const variables = { producerId: tabProducers[0].id };
        const { queryGetProducerById } = {
          queryGetProducerById: `
query($producerId: ID!) {
  producer(producerId: $producerId) {
    firstname
    lastname
    email
    image
    followingProducers {
      edges {
        node {
          firstname
          lastname
          email
        }
      }
    }
    emailValidated
    isAdmin
    followers {
      edges {
        node {
          firstname
          lastname
          email
        }
      }
    }
    phoneNumber
    description
    website
    salespoint {
      name
      address {
        number
        street
        city
        postalCode
        state
        country
        longitude
        latitude
      }
      schedule {
        monday {
          openingHour
          closingHour
        }
        tuesday {
          openingHour
          closingHour
        }
        wednesday {
          openingHour
          closingHour
        }
        thursday {
          openingHour
          closingHour
        }
        friday {
          openingHour
          closingHour
        }
        saturday {
          openingHour
          closingHour
        }
        sunday {
          openingHour
          closingHour
        }
      }
    }
    isValidated
    products {
      edges {
        node {
          description
          productType {
            name
            image
            category {
              name
              image
            }
            producers {
              edges {
                node {
                  firstname
                  lastname
                  email
                }
              }
            }
          }
        }
      }
    }
    rating {
      nbRatings
      rating
    }
  }
}

`
        };
        result = await graphql(schema, queryGetProducerById, null, null, variables);
        expect(result.data.producer).not.toBeNull();
        expect(result.data.producer.firstname).toEqual(producerToAdd.producer.firstname);
        expect(result.data.producer.lastname).toEqual(producerToAdd.producer.lastname);
        expect(result.data.producer.email).toEqual(tabProducers[0].email);

        done();
      });

      it('should fail updating a producer because of missing mendatory information (firstname)', async(done) => {
        const variables = {
          producer: {
            id: tabProducers[0].id,
            lastname: 'Schöpfli',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.firstname of required type String! was not provided.'));
        done();
      });

      it('should fail updating a producer because of missing mendatory information (lastname)', async(done) => {
        const variables = {
          producer: {
            id: tabProducers[0].id,
            firstname: 'ben',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.lastname of required type String! was not provided.'));
        done();
      });

      it('should fail updating a producer because invalid id received (too short)', async(done) => {
        context.id = 'abcdef';
        const producerToAdd = {
          producer: {
            id: context.id,
            firstname: 'ben',
            lastname: 'Schöpfli',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        const result = await graphql(schema, mutation, null, context, producerToAdd);
        expect.assertions(4);
        expect(result.data.updateProducer).toBeNull();
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('Received producer.id is invalid!');
        expect(result).toMatchSnapshot();

        done();
      });

      it('should fail updating a producer because invalid id received (too long)', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const producerToAdd = {
          producer: {
            id: context.id,
            firstname: 'ben',
            lastname: 'Schöpfli',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        const result = await graphql(schema, mutation, null, context, producerToAdd);
        expect(result.data.updateProducer).toBeNull();
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('Received producer.id is invalid!');
        expect(result).toMatchSnapshot();

        done();
      });

      it('should fail updating a producer because unknown id received', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const producerToAdd = {
          producer: {
            id: context.id,
            firstname: 'ben',
            lastname: 'Schöpfli',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        const result = await graphql(schema, mutation, null, context, producerToAdd);
        expect(result.data.updateProducer).toBeNull();
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('The received id is not in the database!');
        expect(result).toMatchSnapshot();

        done();
      });

      it('should delete information of a producer that became null', async(done) => {
        const producerToAdd = {
          producer: {
            id: tabProducers[0].id,
            firstname: 'ben',
            lastname: 'Schöpfli',
            image: null,
            phoneNumber: null,
            description: null,
            website: null
          }
        };
        let result = await graphql(schema, mutation, null, context, producerToAdd);
        expect.assertions(10);
        expect(result.data.updateProducer).not.toBeNull();
        expect(result).toMatchSnapshot();

        const variables = { producerId: tabProducers[0].id };
        const { queryGetProducerById } = {
          queryGetProducerById: `
query($producerId: ID!) {
  producer(producerId: $producerId) {
    firstname
    lastname
    email
    image
    followingProducers {
      edges {
        node {
          firstname
          lastname
          email
        }
      }
    }
    emailValidated
    isAdmin
    followers {
      edges {
        node {
          firstname
          lastname
          email
        }
      }
    }
    phoneNumber
    description
    website
    salespoint {
      name
      address {
        number
        street
        city
        postalCode
        state
        country
        longitude
        latitude
      }
      schedule {
        monday {
          openingHour
          closingHour
        }
        tuesday {
          openingHour
          closingHour
        }
        wednesday {
          openingHour
          closingHour
        }
        thursday {
          openingHour
          closingHour
        }
        friday {
          openingHour
          closingHour
        }
        saturday {
          openingHour
          closingHour
        }
        sunday {
          openingHour
          closingHour
        }
      }
    }
    isValidated
    products {
      edges {
        node {
          description
          productType {
            name
            image
            category {
              name
              image
            }
            producers {
              edges {
                node {
                  firstname
                  lastname
                  email
                }
              }
            }
          }
        }
      }
    }
    rating {
      nbRatings
      rating
    }
  }
}`
        };
        result = await graphql(schema, queryGetProducerById, null, null, variables);
        expect(result.data.producer).not.toBeNull();
        expect(result.data.producer.firstname).toEqual(producerToAdd.producer.firstname);
        expect(result.data.producer.lastname).toEqual(producerToAdd.producer.lastname);
        expect(result.data.producer.email).toEqual(tabProducers[0].email);
        expect(result.data.producer.image).toBeNull();
        expect(result.data.producer.phoneNumber).toBeNull();
        expect(result.data.producer.description).toBeNull();
        expect(result.data.producer.website).toBeNull();

        done();
      });

      it('should not delete information of a producer that are undefined', async(done) => {
        const producerToAdd = {
          producer: {
            id: tabProducers[0].id,
            firstname: 'ben',
            lastname: 'Schöpfli'
          }
        };
        let result = await graphql(schema, mutation, null, context, producerToAdd);
        expect.assertions(10);
        expect(result.data.updateProducer).not.toBeNull();
        expect(result).toMatchSnapshot();

        const variables = { producerId: tabProducers[0].id };
        const { queryGetProducerById } = {
          queryGetProducerById: `
query($producerId: ID!) {
  producer(producerId: $producerId) {
    firstname
    lastname
    email
    image
    followingProducers {
      edges {
        node {
          firstname
          lastname
          email
        }
      }
    }
    emailValidated
    isAdmin
    followers {
      edges {
        node {
          firstname
          lastname
          email
        }
      }
    }
    phoneNumber
    description
    website
    salespoint {
      name
      address {
        number
        street
        city
        postalCode
        state
        country
        longitude
        latitude
      }
      schedule {
        monday {
          openingHour
          closingHour
        }
        tuesday {
          openingHour
          closingHour
        }
        wednesday {
          openingHour
          closingHour
        }
        thursday {
          openingHour
          closingHour
        }
        friday {
          openingHour
          closingHour
        }
        saturday {
          openingHour
          closingHour
        }
        sunday {
          openingHour
          closingHour
        }
      }
    }
    isValidated
    products {
      edges {
        node {
          description
          productType {
            name
            image
            category {
              name
              image
            }
            producers {
              edges {
                node {
                  firstname
                  lastname
                  email
                }
              }
            }
          }
        }
      }
    }
    rating {
      nbRatings
      rating
    }
  }
}
`
        };
        result = await graphql(schema, queryGetProducerById, null, null, variables);
        expect(result.data.producer).not.toBeNull();
        expect(result.data.producer.firstname).toEqual(producerToAdd.producer.firstname);
        expect(result.data.producer.lastname).toEqual(producerToAdd.producer.lastname);
        expect(result.data.producer.email).toEqual(tabProducers[0].email);
        expect(result.data.producer.image).toEqual(tabProducers[0].image);
        expect(result.data.producer.phoneNumber).toEqual(tabProducers[0].phoneNumber);
        expect(result.data.producer.description).toEqual(tabProducers[0].description);
        expect(result.data.producer.website).toEqual(tabProducers[0].website);

        done();
      });

      it('should fail updating a producer because you can\'t modify someone else than yourself', async(done) => {
        const producerToAdd = {
          producer: {
            id: tabProducers[1].id,
            firstname: 'ben',
            lastname: 'Schöpfli',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        const result = await graphql(schema, mutation, null, context, producerToAdd);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a producer because not authenticated', async(done) => {
        const producerToAdd = {
          producer: {
            id: tabProducers[0].id,
            firstname: 'ben',
            lastname: 'Schöpfli',
            image: 'ceci est une image encodée en base 64',
            phoneNumber: '0781234561212',
            description: 'un chouette gaillard!',
            website: 'benoitschöpfli.ch'
          }
        };
        const result = await graphql(schema, mutation, null, {}, producerToAdd);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // --------------------deleteProducer(producerId: ID!)------------------------------------------ //
    /*describe('Testing deleteProducer(producerId: ID!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: tabProducers[0].isAdmin, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: ` 
        mutation($producerId: ID!) {
  deleteProducer(producerId: $producerId) {
    firstname
    lastname
    email
    image
    followingProducers {
      firstname
      lastname
      email
    }
    emailValidated
    isAdmin
    followers {
      firstname
      lastname
      email
    }
    phoneNumber
    description
    website
    salespoint {
      name
      address {
        number
        street
        city
        postalCode
        state
        country
        longitude
        latitude
      }
      schedule {
        monday {
          openingHour
          closingHour
        }
        tuesday {
          openingHour
          closingHour
        }
        wednesday {
          openingHour
          closingHour
        }
        thursday {
          openingHour
          closingHour
        }
        friday {
          openingHour
          closingHour
        }
        saturday {
          openingHour
          closingHour
        }
        sunday {
          openingHour
          closingHour
        }
      }
    }
    isValidated
    products {
      description
      productType {
        name
        image
        category {
          name
          image
        }
        producers {
          firstname
          lastname
          email
        }
      }
    }
    rating {
      nbRatings
      rating
    }
  }
      }
`
      };

      it('should delete an existing producer', async(done) => {
        const variable = {
          producerId: tabProducers[0].id
        };
        // on supprime un producteur
        let result = await graphql(schema, mutation, null, context, variable);
        expect.assertions(3);
        expect(result.data.updateProducer).not.toBeNull();
        expect(result).toMatchSnapshot();

        // on tente de le récupérer dans la base de données -> doit retourner null vu que le producteur n'existe plus
        const variables = { producerId: tabProducers[0].id };
        const { queryGetProducerById } = {
          queryGetProducerById: `
    query($producerId: ID!){
      producer(producerId: $producerId){
        firstname
        lastname
        email
        image
        followingProducers{
          firstname
          lastname
          email
        }
        emailValidated
        isAdmin
        followers{
          firstname
          lastname
          email
        }
        phoneNumber
        description
        website
        salespoint{
          name
          address{
            number
            street
            city
            postalCode
            state
            country
            longitude
            latitude
          }
          schedule{
            monday{
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
            producers{
              firstname
              lastname
              email
            }
          }
        }
        rating{
          nbRatings
          rating
        }
      }
    }`
        };
        result = await graphql(schema, queryGetProducerById, null, context, variables);
        expect(result.data.producer).toBeNull();

        done();
      });

      it('should not delete an existing producer because it\'s not yourself', async(done) => {
        const variable = {
          producerId: tabProducers[1].id
        };
        // on supprime un producteur
        let result = await graphql(schema, mutation, null, context, variable);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();

        // on tente de le récupérer dans la base de données -> ne doit pas retourner null car il n'a pas pu être supprimé
        const variables = { producerId: tabProducers[1].id };
        const { queryGetProducerById } = {
          queryGetProducerById: `
    query($producerId: ID!){
      producer(producerId: $producerId){
        firstname
        lastname
        email
        image
        followingProducers{
          firstname
          lastname
          email
        }
        emailValidated
        isAdmin
        followers{
          firstname
          lastname
          email
        }
        phoneNumber
        description
        website
        salespoint{
          name
          address{
            number
            street
            city
            postalCode
            state
            country
            longitude
            latitude
          }
          schedule{
            monday{
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
            producers{
              firstname
              lastname
              email
            }
          }
        }
        rating{
          nbRatings
          rating
        }
      }
    }`
        };
        result = await graphql(schema, queryGetProducerById, null, context, variables);
        expect(result.data.producer).not.toBeNull();
        done();
      });

      it('should not delete an existing producer because not authenticated', async(done) => {
        const variable = {
          producerId: tabProducers[1].id
        };
        // on supprime un producteur
        let result = await graphql(schema, mutation, null, {}, variable);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();

        // on tente de le récupérer dans la base de données -> ne doit pas retourner null car il n'a pas pu être supprimé
        const variables = { producerId: tabProducers[1].id };
        const { queryGetProducerById } = {
          queryGetProducerById: `
    query($producerId: ID!){
      producer(producerId: $producerId){
        firstname
        lastname
        email
        image
        followingProducers{
          firstname
          lastname
          email
        }
        emailValidated
        isAdmin
        followers{
          firstname
          lastname
          email
        }
        phoneNumber
        description
        website
        salespoint{
          name
          address{
            number
            street
            city
            postalCode
            state
            country
            longitude
            latitude
          }
          schedule{
            monday{
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
            producers{
              firstname
              lastname
              email
            }
          }
        }
        rating{
          nbRatings
          rating
        }
      }
    }`
        };
        result = await graphql(schema, queryGetProducerById, null, context, variables);
        expect(result.data.producer).not.toBeNull();
        done();
      });
    });*/
  });
});
