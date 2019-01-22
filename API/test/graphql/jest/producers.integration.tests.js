const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { resolvers, schema: typeDefs, connectionDirective } = require('../../../src/graphql/graphqlConfig');
const producersServices = require('../../../src/graphql/services/producers.services');
const { populateDB, getTabProducers, getTabProductTypes } = require('../../populateDatabase');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    connection: connectionDirective
  }
});

let tabProducers;
let tabProductTypes;

const clearAndPopulateDB = async() => {
  // ------------------------------------------------------------- on ajoute le contenu de départ -------------------------------------------------------------
  await populateDB();
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
              totalCount
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                node {
                  firstname
                  lastname
                  email
                  image
                  followingProducers {
                    totalCount
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
                    totalCount
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
                            totalCount
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
                    grade
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
          query($id: ID!) {
            producer(producerId: $id) {
              firstname
              lastname
              email
              image
              followingProducers {
                totalCount
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
                totalCount
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
                        totalCount
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
                grade
              }
            }
          }` };

      it('should get a producer by id (without salespoint)', async(done) => {
        tabProducers = await getTabProducers();

        const variables = { id: tabProducers[3].id };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        expect(result.data.producer).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get a producer by id (with salespoint)', async(done) => {
        tabProducers = await getTabProducers();

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
        expect(result.data.producer).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a producer because invalid id received (too long)', async(done) => {
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
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
        tabProducers = await getTabProducers();

        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: true, kind: tabProducers[0].kind };
      });

      const { query } = {
        query: `
          query {
            producersWaitingForValidation {
              totalCount
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                node {
                  firstname
                  lastname
                  email
                  image
                  followingProducers {
                    totalCount
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
                    totalCount
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
                            totalCount
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
                    grade
                  }
                }
              }
            }
          }`
      };

      it('should get all producers (1) waiting for validation', async(done) => {
        const result = await graphql(schema, query, null, context, null);
        expect.assertions(2);
        // on check qu'il y a bien 2 producteurs en attente de validation
        expect(result.data.producersWaitingForValidation.edges.length).toEqual(1);
        expect(result.data.producersWaitingForValidation.edges[0].node.firstname).toEqual('Monsieur');
        expect(result.data.producersWaitingForValidation.edges[0].node.lastname).toEqual('UnValidated');
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all producers (0) waiting for validation', async(done) => {

        let result = await graphql(schema, query, null, context, null);

        await producersServices.validateAProducer(result.data.producersWaitingForValidation.edges[0].id, true);
        // on check qu'il ne reste plus qu'un producteur en attente de validation
        result = await graphql(schema, query, null, context, null);
        expect.assertions(3);
        expect(result.data.producersWaitingForValidation.edges.length).toEqual(0);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not get all producers waiting for validation because you need to be logged in', async(done) => {
        tabProducers = await getTabProducers();

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
        tabProducers = await getTabProducers();

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
    describe('Testing filterProducers(byProductTypeIds: [ID!]!)', () => {
      const { query } = {
        query: `
    query($clientLocation: ClientLocation!, $byProductTypeIds: [ID!]!, $ratingMin: Int){
      geoFilterProducers(locationClient: $clientLocation, byProductTypeIds: $byProductTypeIds, ratingMin: $ratingMin){
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            firstname
            lastname
            email
            image
            followingProducers {
              totalCount
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
              totalCount
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
                      totalCount
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
              grade
            }
          }
        }
      }
    }`
      };

      it('should get all producers at max 3000km of me"', async(done) => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77,
            maxDistance: 3000
          },
          byProductTypeIds: []
        };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        // on check qu'il y a bien 3 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers"
        expect(result.data.geoFilterProducers.totalCount).toEqual(3);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all producers at max 1000km of me"', async(done) => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77,
            maxDistance: 1000
          },
          byProductTypeIds: []
        };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        // on check qu'il y a bien 3 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers"
        expect(result.data.geoFilterProducers.totalCount).toEqual(1);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all producers at max 3000km of me and with at least 3 stars"', async(done) => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77,
            maxDistance: 3000
          },
          byProductTypeIds: [],
          ratingMin: 3
        };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        // on check qu'il y a bien 3 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers"
        expect(result.data.geoFilterProducers.totalCount).toEqual(2);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all producers producing one or more products of productType "Fromages / Produits Laitiers at max 3000km of me"', async(done) => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77,
            maxDistance: 3000
          },
          byProductTypeIds: [tabProductTypes[1].id]
        };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        // on check qu'il y a bien 3 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers"
        expect(result.data.geoFilterProducers.totalCount).toEqual(3);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all producers producing one or more products of productType "Fromages / Produits Laitiers at max 1000km of me"', async(done) => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77,
            maxDistance: 1000
          },
          byProductTypeIds: [tabProductTypes[1].id]
        };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        // on check qu'il y a bien 3 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers"
        expect(result.data.geoFilterProducers.totalCount).toEqual(1);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all producers producing one or more products of productType "Fromages / Produits Laitiers at max 3000km of me and with at least 3'
         + ' stars"', async(done) => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77,
            maxDistance: 1000
          },
          byProductTypeIds: [tabProductTypes[1].id],
          ratingMin: 3
        };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        // on check qu'il y a bien 3 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers"
        expect(result.data.geoFilterProducers.totalCount).toEqual(1);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all producers producing one or more products of productTypeCategory "Fromages / Produits Laitiers" AND one or more products of'
         + ' productTypeCategory "Jus de fruits"', async(done) => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.0,
            latitude: 46.0
          },
          byProductTypeIds: [tabProductTypes[10].id, tabProductTypes[1].id]
        };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        // on check qu'il y a bien 2 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers" et un ou plusieurs produits
        // de type "Jus de fruits"
        expect(result.data.geoFilterProducers.totalCount).toEqual(2);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all producers producing one or more products of productTypeCategory "Fromages / Produits Laitiers" AND one or more products of'
         + ' productTypeCategory "Jus de fruits" atmax 3km of me and with at least 3 stars.', async(done) => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.0,
            latitude: 46.0
          },
          byProductTypeIds: [tabProductTypes[10].id, tabProductTypes[1].id],
          ratingMin: 3
        };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        // on check qu'il y a bien 2 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers" et un ou plusieurs produits
        // de type "Jus de fruits"
        expect(result.data.geoFilterProducers.totalCount).toEqual(1);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all producers producing one or more products of productTypeCategory "Fromages / Produits Laitiers" AND one or more products of'
         + ' productTypeCategory "Jus de fruits" AND one or more products of productTypeCategory "Pâtes"', async(done) => {
        tabProductTypes = await getTabProductTypes();


        const variables = {
          clientLocation: {
            longitude: 6.0,
            latitude: 46.0,
            maxDistance: 5000
          },
          byProductTypeIds: [tabProductTypes[1].id, tabProductTypes[10].id, tabProductTypes[17].id]
        };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        // on check qu'il y a bien qu'un producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers", un ou plusieurs produits
        // de type "Jus de fruits" et un ou plusieurs produits de type "pâtes"
        expect(result.data.geoFilterProducers.totalCount).toEqual(1);
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });

  describe('MUTATION producers', () => {
    beforeEach(() => clearAndPopulateDB());

    // --------------------validateAProducer(producerId: ID!, validationState: Boolean!)------------------------------------------ //
    describe('Testing validateAProducer(producerId: ID!, validationState: Boolean!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        tabProducers = await getTabProducers();

        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: true, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `
    mutation($producerId: ID!, $state: Boolean!){
      validateAProducer(producerId: $producerId, validationState: $state){
        firstname
        lastname
        email
        image
        followingProducers {
          totalCount
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
          totalCount
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
                  totalCount
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
          grade
        }
      }
    }`
      };

      it('should change the validation state of a producer to true', async(done) => {
        tabProducers = await getTabProducers();

        const variables = { producerId: tabProducers[2].id, state: true };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.validateAProducer.isValidated).toBeTruthy();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should change the validation state of a producer to false', async(done) => {
        tabProducers = await getTabProducers();

        const variables = { producerId: tabProducers[0].id, state: false };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.validateAProducer.isValidated).toBeFalsy();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not change the validation state of a producer because you need to be logged in', async(done) => {
        tabProducers = await getTabProducers();

        const variables = { producerId: tabProducers[0].id, state: false };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not change the validation state of a producer because you need to be logged in as an administrator', async(done) => {
        tabProducers = await getTabProducers();

        context.isAdmin = false;
        const variables = { producerId: tabProducers[0].id, state: false };
        const result = await graphql(schema, mutation, null, context, variables);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be an administrator to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // --------------------updateProducer(producer: ProducerInputUpdate!)------------------------------------------ //
    describe('Testing updateProducer(producer: ProducerInputUpdate!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        tabProducers = await getTabProducers();

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
                totalCount
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
                totalCount
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
                        totalCount
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
                grade
              }
            }
          }`
      };

      it('should update a producer', async(done) => {
        tabProducers = await getTabProducers();

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
    query($producerId: ID!){
      producer(producerId: $producerId){
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            firstname
            lastname
            email
            image
            followingProducers {
              totalCount
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
              totalCount
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
                      totalCount
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
              grade
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
        tabProducers = await getTabProducers();

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
        tabProducers = await getTabProducers();

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
        tabProducers = await getTabProducers();

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
    query($producerId: ID!){
      producer(producerId: $producerId){
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            firstname
            lastname
            email
            image
            followingProducers {
              totalCount
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
              totalCount
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
                      totalCount
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
              grade
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
        tabProducers = await getTabProducers();

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
    query($producerId: ID!){
      producer(producerId: $producerId){
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            firstname
            lastname
            email
            image
            followingProducers {
              totalCount
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
              totalCount
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
                      totalCount
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
              grade
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
        tabProducers = await getTabProducers();

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
        tabProducers = await getTabProducers();

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
    describe('Testing deleteProducer(producerId: ID!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        tabProducers = await getTabProducers();

        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: tabProducers[0].isAdmin, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `
          mutation($producerId: ID!) {
            deleteProducer(producerId: $producerId) {
              totalCount
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                node {
                  firstname
                  lastname
                  email
                  image
                  followingProducers {
                    totalCount
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
                    totalCount
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
                            totalCount
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
                    grade
                  }
                }
              }
            }
          }`
      };

      it('should delete an existing producer', async(done) => {
        tabProducers = await getTabProducers();

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
                totalCount
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
                edges {
                  node {
                    firstname
                    lastname
                    email
                    image
                    followingProducers {
                      totalCount
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
                      totalCount
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
                              totalCount
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
                      grade
                    }
                  }
                }
              }
            }`
        };
        result = await graphql(schema, queryGetProducerById, null, context, variables);
        expect(result.data.producer).toBeNull();

        done();
      });

      it('should not delete an existing producer because it\'s not yourself', async(done) => {
        tabProducers = await getTabProducers();

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
                totalCount
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
                edges {
                  node {
                    firstname
                    lastname
                    email
                    image
                    followingProducers {
                      totalCount
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
                      totalCount
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
                              totalCount
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
                      grade
                    }
                  }
                }
              }
            }`
        };
        result = await graphql(schema, queryGetProducerById, null, context, variables);
        expect(result.data.producer).not.toBeNull();
        done();
      });

      it('should not delete an existing producer because not authenticated', async(done) => {
        tabProducers = await getTabProducers();

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
                totalCount
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
                edges {
                  node {
                    firstname
                    lastname
                    email
                    image
                    followingProducers {
                      totalCount
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
                      totalCount
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
                              totalCount
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
                      grade
                    }
                  }
                }
              }
            }`
        };
        result = await graphql(schema, queryGetProducerById, null, context, variables);
        expect(result.data.producer).not.toBeNull();
        done();
      });
    });
  });
});
