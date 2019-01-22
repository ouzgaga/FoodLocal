const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const snapshot = require('snap-shot-it');
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
      it('should get all producers', async() => {
        const result = await graphql(schema, query, null, {}, {});
        snapshot(result);
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
          }`
      };

      it('should get a producer by id (without salespoint)', async() => {
        tabProducers = await getTabProducers();

        const variables = { id: tabProducers[3].id };
        const result = await graphql(schema, query, null, null, variables);

        expect(result.data.producer).to.be.not.null;
        snapshot(result);
      });

      it('should get a producer by id (with salespoint)', async() => {
        tabProducers = await getTabProducers();

        const variables = { id: tabProducers[0].id };
        const result = await graphql(schema, query, null, null, variables);

        expect(result.data.producer).to.be.not.null;
        snapshot(result);
      });

      it('should fail getting a producer because unknown id received', async() => {
        const variables = { id: 'abcdefabcdefabcdefbacdef' };
        const result = await graphql(schema, query, null, null, variables);

        expect(result.data.producer).to.be.null;
        snapshot(result);
      });

      it('should fail getting a producer because invalid id received (too short)', async() => {
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, query, null, null, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.data.producer).to.be.null;
        snapshot(result);
      });

      it('should fail getting a producer because invalid id received (too long)', async() => {
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, null, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.data.producer).to.be.null;
        snapshot(result);
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

      it('should get all producers (1) waiting for validation', async() => {
        const result = await graphql(schema, query, null, context, null);

        // on check qu'il y a bien 2 producteurs en attente de validation
        expect(result.data.producersWaitingForValidation.edges.length).to.be.equal(1);
        expect(result.data.producersWaitingForValidation.edges[0].node.firstname).to.be.equal('Monsieur');
        expect(result.data.producersWaitingForValidation.edges[0].node.lastname).to.be.equal('UnValidated');
        snapshot(result);
      });

      it('should get all producers (0) waiting for validation', async() => {
        const { queryWithId } = {
          queryWithId: `
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
                  id
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
        let result = await graphql(schema, queryWithId, null, context, null);
        await producersServices.validateAProducer(result.data.producersWaitingForValidation.edges[0].node.id, true);
        // on check qu'il ne reste plus qu'un producteur en attente de validation
        result = await graphql(schema, query, null, context, null);

        expect(result.data.producersWaitingForValidation.edges.length).to.be.equal(0);
        snapshot(result);
      });

      it('should not get all producers waiting for validation because you need to be logged in', async() => {
        tabProducers = await getTabProducers();

        await producersServices.validateAProducer(tabProducers[2].id, true);
        // on check qu'il ne reste plus qu'un producteur en attente de validation
        const result = await graphql(schema, query, null, {}, null);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should not get all producers waiting for validation because you need to be logged in as an administrator', async() => {
        tabProducers = await getTabProducers();

        context.isAdmin = false;
        await producersServices.validateAProducer(tabProducers[2].id, true);
        // on check qu'il ne reste plus qu'un producteur en attente de validation
        const result = await graphql(schema, query, null, context, null);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be an administrator to do that.');
        snapshot(result);
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

      it('should get all producers at max 3km of me"', async() => {
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

        // on check qu'il y a bien 3 producteurs à au plus 3km de moi
        expect(result.data.geoFilterProducers.totalCount).to.be.equal(3);
        snapshot(result);
      });

      it('should get all producers at max 1km of me"', async() => {
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

        // on check qu'il y a bien 1 producteurs à au plus 1km de moi
        expect(result.data.geoFilterProducers.totalCount).to.be.equal(1);
        snapshot(result);
      });

      it('should get all producers at max 3km of me and with at least 3 stars"', async() => {
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

        // on check qu'il y a bien 2 producteurs à au plus 3km de moi et avec au moins 3 étoiles
        expect(result.data.geoFilterProducers.totalCount).to.be.equal(2);
        snapshot(result);
      });

      it('should get all producers at max 1km of me and with at least 2 stars"', async() => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77,
            maxDistance: 1000
          },
          byProductTypeIds: [],
          ratingMin: 2
        };
        const result = await graphql(schema, query, null, null, variables);

        // on check qu'il y a bien 1 producteur à au plus 1km de moi et avec au moins 2 étoiles
        expect(result.data.geoFilterProducers.totalCount).to.be.equal(1);
        snapshot(result);
      });

      it('should get all producers producing one or more products of productType "Fromages / Produits Laitiers at max 3km of me"', async() => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77,
            maxDistance: 3000
          },
          byProductTypeIds: [tabProductTypes[2].id]
        };
        const result = await graphql(schema, query, null, null, variables);

        // on check qu'il y a bien 3 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers" à au plus 3km de moi
        expect(result.data.geoFilterProducers.totalCount).to.be.equal(3);
        snapshot(result);
      });

      it('should get all producers producing one or more products of productType "Fromages / Produits Laitiers at max 1km of me"', async() => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77,
            maxDistance: 1000
          },
          byProductTypeIds: [tabProductTypes[2].id]
        };
        const result = await graphql(schema, query, null, null, variables);

        // on check qu'il y a bien 1 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers" à au plus 1km de moi
        expect(result.data.geoFilterProducers.totalCount).to.be.equal(1);
        snapshot(result);
      });

      it('should get all producers producing one or more products of productType "Fromages / Produits Laitiers at max 1km of me and with at least 3'
         + ' stars"', async() => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77,
            maxDistance: 1000
          },
          byProductTypeIds: [tabProductTypes[2].id],
          ratingMin: 4
        };
        const result = await graphql(schema, query, null, null, variables);

        // on check qu'il y a bien aucun producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers" à au plus 1km de moi et avec
        // au moins 3 étoiles
        expect(result.data.geoFilterProducers.totalCount).to.be.equal(0);
        snapshot(result);
      });

      it('should get all producers producing one or more products of productTypeCategory "Fromages / Produits Laitiers" AND one or more products of'
         + ' productTypeCategory "Jus de fruits"', async() => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77
          },
          byProductTypeIds: [tabProductTypes[11].id, tabProductTypes[2].id]
        };
        const result = await graphql(schema, query, null, null, variables);

        // on check qu'il y a bien 2 producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers" et un ou plusieurs produits
        // de type "Jus de fruits"
        expect(result.data.geoFilterProducers.totalCount).to.be.equal(2);
        snapshot(result);
      });

      it('should get all producers producing one or more products of productTypeCategory "Fromages / Produits Laitiers" AND one or more products of'
         + ' productTypeCategory "Jus de fruits" and with at least 4 stars.', async() => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77
          },
          byProductTypeIds: [tabProductTypes[11].id, tabProductTypes[2].id],
          ratingMin: 4
        };
        const result = await graphql(schema, query, null, null, variables);

        // on check qu'il y a bien 1 producteur produisant un ou plusieurs produits du type "Fromages / Produits Laitiers" et un ou plusieurs produits
        // de type "Jus de fruits" avec au moins 4 étoiles
        expect(result.data.geoFilterProducers.totalCount).to.be.equal(1);
        snapshot(result);
      });

      it('should get all producers producing one or more products of productTypeCategory "Fromages / Produits Laitiers" AND one or more products of'
         + ' productTypeCategory "Jus de fruits" at max 1km of me and with at least 4 stars.', async() => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77,
            maxDistance: 1000
          },
          byProductTypeIds: [tabProductTypes[11].id, tabProductTypes[2].id],
          ratingMin: 4
        };
        const result = await graphql(schema, query, null, null, variables);

        // on check qu'il y a bien aucun producteur produisant un ou plusieurs produits du type "Fromages / Produits Laitiers" et un ou plusieurs produits
        // de type "Jus de fruits" avec au moins 4 étoiles
        expect(result.data.geoFilterProducers.totalCount).to.be.equal(0);
        snapshot(result);
      });

      it('should get all producers producing one or more products of productTypeCategory "Fromages / Produits Laitiers" AND one or more products of'
         + ' productTypeCategory "Jus de fruits" AND one or more products of productTypeCategory "Pâtes"', async() => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77
          },
          byProductTypeIds: [tabProductTypes[2].id, tabProductTypes[11].id, tabProductTypes[18].id]
        };
        const result = await graphql(schema, query, null, null, variables);

        // on check qu'il y a bien qu'un producteurs produisant un ou plusieurs produits du type "Fromages / Produits Laitiers", un ou plusieurs produits
        // de type "Jus de fruits" et un ou plusieurs produits de type "pâtes"
        expect(result.data.geoFilterProducers.totalCount).to.be.equal(1);
        snapshot(result);
      });

      it('should get all producers producing one or more products of productTypeCategory "Fromages / Produits Laitiers" AND one or more products of'
         + ' productTypeCategory "Jus de fruits" AND one or more products of productTypeCategory "Pâtes" at max 300m of me', async() => {
        tabProductTypes = await getTabProductTypes();

        const variables = {
          clientLocation: {
            longitude: 6.65,
            latitude: 46.77,
            maxDistance: 300
          },
          byProductTypeIds: [tabProductTypes[2].id, tabProductTypes[11].id, tabProductTypes[18].id]
        };
        const result = await graphql(schema, query, null, null, variables);

        // on check qu'il y a bien aucun producteur produisant un ou plusieurs produits du type "Fromages / Produits Laitiers", un ou plusieurs produits
        // de type "Jus de fruits" et un ou plusieurs produits de type "pâtes" à au plus 300m de moi
        expect(result.data.geoFilterProducers.totalCount).to.be.equal(0);
        snapshot(result);
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

      it('should change the validation state of a producer to true', async() => {
        tabProducers = await getTabProducers();

        const variables = { producerId: tabProducers[2].id, state: true };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.validateAProducer.isValidated).to.be.true;
        snapshot(result);
      });

      it('should change the validation state of a producer to false', async() => {
        tabProducers = await getTabProducers();

        const variables = { producerId: tabProducers[0].id, state: false };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.validateAProducer.isValidated).to.be.false;
        snapshot(result);
      });

      it('should not change the validation state of a producer because you need to be logged in', async() => {
        tabProducers = await getTabProducers();

        const variables = { producerId: tabProducers[0].id, state: false };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should not change the validation state of a producer because you need to be logged in as an administrator', async() => {
        tabProducers = await getTabProducers();

        context.isAdmin = false;
        const variables = { producerId: tabProducers[0].id, state: false };
        const result = await graphql(schema, mutation, null, context, variables);
        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be an administrator to do that.');
        snapshot(result);
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

      it('should update a producer', async() => {
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

        expect(result.data.updateProducer).to.be.not.null;
        snapshot(result);

        const variables = { producerId: tabProducers[0].id };
        const { queryGetProducerById } = {
          queryGetProducerById: `
            query($producerId: ID!){
              producer(producerId: $producerId){
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
        result = await graphql(schema, queryGetProducerById, null, null, variables);
        expect(result.data.producer).to.be.not.null;
        expect(result.data.producer.firstname).to.be.equal(producerToAdd.producer.firstname);
        expect(result.data.producer.lastname).to.be.equal(producerToAdd.producer.lastname);
        expect(result.data.producer.email).to.be.equal(tabProducers[0].email);
      });

      it('should update a producer without erasing the firstname', async() => {
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

        expect(result.data.updateProducer).to.be.not.null;
        expect(result.data.updateProducer.firstname).to.be.equal(tabProducers[0].firstname);
      });

      it('should update a producer without erasing the lastname', async() => {
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

        expect(result.data.updateProducer).to.be.not.null;
        expect(result.data.updateProducer.lastname).to.be.equal(tabProducers[0].lastname);
      });

      it('should update only the producer\'s firstname without erasing the other informations', async() => {
        tabProducers = await getTabProducers();

        const variables = {
          producer: {
            id: tabProducers[0].id,
            firstname: 'ben'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateProducer).to.be.not.null;
        expect(result.data.updateProducer.lastname).to.be.equal(tabProducers[0].lastname);
        expect(result.data.updateProducer.image).to.be.equal(tabProducers[0].image);
        expect(result.data.updateProducer.phoneNumber).to.be.equal(tabProducers[0].phoneNumber);
        expect(result.data.updateProducer.description).to.be.equal(tabProducers[0].description);
        expect(result.data.updateProducer.website).to.be.equal(tabProducers[0].website);
      });

      it('should fail updating a producer because invalid id received (too short)', async() => {
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

        expect(result.data.updateProducer).to.be.null;
        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdef" at path "_id" for model "producers"');
        snapshot(result);
      });

      it('should fail updating a producer because invalid id received (too long)', async() => {
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
        expect(result.data.updateProducer).to.be.null;
        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "producers"');
        snapshot(result);
      });

      it('should fail updating a producer because unknown id received', async() => {
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
        expect(result.data.updateProducer).to.be.null;
        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('The received id is not in the database!');
        snapshot(result);
      });

      it('should delete information of a producer that became null', async() => {
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

        expect(result.data.updateProducer).to.be.not.null;
        snapshot(result);

        const variables = { producerId: tabProducers[0].id };
        const { queryGetProducerById } = {
          queryGetProducerById: `
            query($producerId: ID!){
              producer(producerId: $producerId){
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
        result = await graphql(schema, queryGetProducerById, null, null, variables);
        expect(result.data.producer).to.be.not.null;
        expect(result.data.producer.firstname).to.be.equal(producerToAdd.producer.firstname);
        expect(result.data.producer.lastname).to.be.equal(producerToAdd.producer.lastname);
        expect(result.data.producer.email).to.be.equal(tabProducers[0].email);
        expect(result.data.producer.image).to.be.null;
        expect(result.data.producer.phoneNumber).to.be.null;
        expect(result.data.producer.description).to.be.null;
        expect(result.data.producer.website).to.be.null;
      });

      it('should not delete information of a producer that are undefined', async() => {
        tabProducers = await getTabProducers();

        const producerToAdd = {
          producer: {
            id: tabProducers[0].id,
            firstname: 'ben',
            lastname: 'Schöpfli'
          }
        };
        let result = await graphql(schema, mutation, null, context, producerToAdd);

        expect(result.data.updateProducer).to.be.not.null;
        snapshot(result);

        const variables = { producerId: tabProducers[0].id };
        const { queryGetProducerById } = {
          queryGetProducerById: `
            query($producerId: ID!){
              producer(producerId: $producerId){
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
        result = await graphql(schema, queryGetProducerById, null, null, variables);
        expect(result.data).to.be.not.null;
        expect(result.data.producer).to.be.not.null;
        expect(result.data.producer.firstname).to.be.equal(producerToAdd.producer.firstname);
        expect(result.data.producer.lastname).to.be.equal(producerToAdd.producer.lastname);
        expect(result.data.producer.email).to.be.equal(tabProducers[0].email);
        expect(result.data.producer.image).to.be.equal(tabProducers[0].image);
        expect(result.data.producer.phoneNumber).to.be.equal(tabProducers[0].phoneNumber);
        expect(result.data.producer.description).to.be.equal(tabProducers[0].description);
        expect(result.data.producer.website).to.be.equal(tabProducers[0].website);
      });

      it('should fail updating a producer because you can\'t modify someone else than yourself', async() => {
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

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('You can\'t modify information of another user than yourself!');
        snapshot(result);
      });

      it('should fail updating a producer because not authenticated', async() => {
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

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });
    });
  });
});
