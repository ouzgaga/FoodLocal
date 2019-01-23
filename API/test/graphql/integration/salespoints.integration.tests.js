const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const snapshot = require('snap-shot-it');
const { resolvers, schema: typeDefs, connectionDirective } = require('../../../src/graphql/graphqlConfig');
const { populateDB, getTabProducers, getTabSalespoints } = require('../../populateDatabase');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    connection: connectionDirective
  }
});

let tabProducers;
let tabSalespoints;

const clearAndPopulateDB = async() => {
  // ------------------------------------------------------------- on ajoute le contenu de départ -------------------------------------------------------------
  await populateDB();
};

describe('Testing graphql request salespoints', () => {
  describe('QUERY salespoint', () => {
    beforeEach(() => clearAndPopulateDB());

    // -------------------------producers()------------------------------------- //
    describe('Testing salespoints()', () => {
      const { query } = {
        query: `
          query {
            salespoints {
              pageInfo{
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges{
                node{
                  id
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
                cursor
              }
              totalCount
            }
          }`
      };
      it('should get all salespoints', async() => {
        const result = await graphql(schema, query, null, {}, null);

        snapshot(result);
      });
    });

    // ----------------------producer(producerId: ID!)-------------------------------------- //
    describe('Testing salespoint(salespointId: ID!)', () => {
      const { query } = {
        query: `
          query($id: ID!) {
            salespoint(salespointId: $id) {
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
          }`
      };

      it('should get a salespoint by id ', async() => {
        tabSalespoints = await getTabSalespoints();

        const variables = { id: tabSalespoints[0].id };
        const result = await graphql(schema, query, null, {}, variables);

        expect(result.data.salespoint).to.be.not.null;
        snapshot(result);
      });

      it('should fail getting a salespoint because unknown id received', async() => {
        const variables = { id: 'abcdefabcdefabcdefbacdef' };
        const result = await graphql(schema, query, null, {}, variables);

        expect(result.data.salespoint).to.be.null;
        snapshot(result);
      });

      it('should fail getting a salespoint because invalid id received (too short)', async() => {
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, query, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdef" at path "_id" for model "salespoints"');
        expect(result.data.salespoint).to.be.null;
        snapshot(result);
      });

      it('should fail getting a salespoint because invalid id received (too long)', async() => {
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "salespoints"');
        expect(result.data.salespoint).to.be.null;
        snapshot(result);
      });
    });
  });

  describe('MUTATION producers', () => {
    beforeEach(() => clearAndPopulateDB());

    // --------------------addSalespointToProducer(producerId: ID!, salespoint: SalespointInput!)------------------------------------------ //
    describe('Testing addSalespointToProducer(producerId: ID!, salespoint: SalespointInput!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();

        tabProducers = await getTabProducers();
        context = { id: tabProducers[3].id, email: tabProducers[3].email, isAdmin: tabProducers[3].isAdmin, kind: tabProducers[3].kind };
      });

      const { mutation } = {
        mutation: `
mutation($producerId: ID!, $salespoint: SalespointInput!) {
  addSalespointToProducer(producerId: $producerId, salespoint: $salespoint) {
    firstname
    lastname
    email
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
  }
}`
      };

      it('should add a salespoint to a producer', async() => {
        const variables = {
          producerId: tabProducers[3].id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.addSalespointToProducer).to.be.not.null;
        snapshot(result);
      });

      it('should fail adding a salespoint to a producer because he already has one.', async() => {
        context = { id: tabProducers[1].id, email: tabProducers[1].email, isAdmin: tabProducers[1].isAdmin, kind: tabProducers[1].kind };

        const variables = {
          producerId: tabProducers[1].id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message)
          .to.be.equal('This producer has already a salespoint but a producer can\'t have more than one salespoint. Try to update the current salespoint.');
        expect(result.data).to.be.null;
        snapshot(result);
      });

      it('should fail adding a salespoint to a producer because missing mendatory information (producerId).', async() => {
        context = { id: tabProducers[1].id, email: tabProducers[1].email, isAdmin: tabProducers[1].isAdmin, kind: tabProducers[1].kind };
        const variables = {
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('Variable "$producerId" of required type "ID!" was not provided.');
        snapshot(result);
      });

      it('should fail adding a salespoint to a producer because missing mendatory information (salespoint).', async() => {
        const variables = {
          producerId: tabProducers[3].id
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('Variable "$salespoint" of required type "SalespointInput!" was not provided.');
      });

      it('should fail adding a salespoint to a producer because missing mendatory information (salespoint.name).', async() => {
        const variables = {
          producerId: tabProducers[3].id,
          salespoint: {
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('Field value.name of required type String! was not provided.');
      });

      it('should fail adding a salespoint to a producer because not authenticated', async() => {
        const variables = {
          producerId: tabProducers[3].id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };

        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail adding a salespoint to a producer because you can\'t modify someone else than yourself', async() => {
        const variables = {
          producerId: tabProducers[1].id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('You can\'t modify information of another user than yourself!');
        snapshot(result);
      });

      it('should fail adding a salespoint to a producer because invalid producerId received (too short)', async() => {
        context.id = 'abcdef';
        const variables = {
          producerId: context.id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdef" at path "_id" for model "producers"');
        snapshot(result);
      });

      it('should fail adding a salespoint to a producer because invalid producerId received (too long)', async() => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = {
          producerId: context.id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "producers"');
        snapshot(result);
      });

      it('should fail adding a salespoint to a producer because unknown producerId received', async() => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = {
          producerId: context.id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('The received producerId is not in the database!');
        snapshot(result);
      });
    });

    // --------------------updateSalespoint(producerId: ID!, salespoint: SalespointInput!)------------------------------------------ //
    describe('Testing updateSalespoint(producerId: ID!, salespoint: SalespointInput!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();

        tabProducers = await getTabProducers();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: tabProducers[0].isAdmin, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `
          mutation($producerId: ID!, $salespoint: SalespointInput!) {
            updateSalespoint(producerId:$producerId, salespoint:$salespoint) {
              firstname
              lastname
              email
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
            }
          }`
      };

      it('should update the salespoint of a producer', async() => {
        const variables = {
          producerId: tabProducers[0].id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
              tuesday: [
                {
                  openingHour: '09:00',
                  closingHour: '12:00'
                },
                {
                  openingHour: '14:00',
                  closingHour: '18:00'
                }
              ],
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
              sunday: [
                {
                  openingHour: '07:00',
                  closingHour: '10:00'
                },
                {
                  openingHour: '15:00',
                  closingHour: '18:00'
                }
              ]
            }
          }
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateSalespoint).to.be.not.null;
        expect(result.data.updateSalespoint.salespoint.name).to.be.equal(variables.salespoint.name);
        snapshot(result);
      });

      it('should fail updating the salespoint of a producer because missing mendatory information (salespoint.name).', async() => {
        const variables = {
          producerId: tabProducers[0].id,
          salespoint: {
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('Field value.name of required type String! was not provided.');
      });

      it('should fail updating the salespoint of a producer because not authenticated', async() => {
        const variables = {
          producerId: tabProducers[0].id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };

        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail updating the salespoint of a producer because you can\'t modify someone else than yourself', async() => {
        const variables = {
          producerId: tabProducers[1].id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('You can\'t modify information of another user than yourself!');
        snapshot(result);
      });

      it('should fail updating the salespoint of a producer because invalid producerId received (too short)', async() => {
        context.id = 'abcdef';
        const variables = {
          producerId: context.id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('Received producerId is invalid!');
        snapshot(result);
      });

      it('should fail updating the salespoint of a producer because invalid producerId received (too long)', async() => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = {
          producerId: context.id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('Received producerId is invalid!');
        snapshot(result);
      });

      it('should fail updating the salespoint of a producer because unknown producerId received', async() => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = {
          producerId: context.id,
          salespoint: {
            name: 'Ma maison',
            address: {
              number: 6,
              street: 'Chemin monChezMoi',
              city: 'Yverdon',
              postalCode: '1400',
              state: 'Vaud',
              country: 'Suisse',
              longitude: 6.6572137,
              latitude: 46.7792474
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
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('Received producerId is not in the database!');
        snapshot(result);
      });
    });

    // --------------------deleteSalespointToProducer(producerId: ID!)------------------------------------------ //
    describe('Testing deleteSalespointToProducer(producerId: ID!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();

        tabProducers = await getTabProducers();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: tabProducers[0].isAdmin, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `
          mutation($producerId: ID!) {
            deleteSalespointToProducer(producerId: $producerId) {
              firstname
              lastname
              email
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
            }
          }`
      };

      it('should remove the salespoint of a producer', async() => {
        const variables = {
          producerId: tabProducers[0].id
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.deleteSalespointToProducer).to.be.not.null;
        snapshot(result);
      });

      it('should fail removing the salespoint of a producer because not authenticated', async() => {
        const variables = {
          producerId: tabProducers[0].id
        };

        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail removing the salespoint of a producer because you can\'t modify someone else than yourself', async() => {
        const variables = {
          producerId: tabProducers[1].id
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.contains('You can\'t modify information of another user than yourself!');
        snapshot(result);
      });

      it('should fail removing the salespoint of a producer because invalid producerId received (too short)', async() => {
        context.id = 'abcdef';
        const variables = {
          producerId: context.id
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdef" at path "_id" for model "producers"');
        snapshot(result);
      });

      it('should fail removing the salespoint of a producer because invalid producerId received (too long)', async() => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = {
          producerId: context.id
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "producers"');
        snapshot(result);
      });

      it('should fail removing the salespoint of a producer because unknown producerId received', async() => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = {
          producerId: context.id
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors[0].message).to.be.equal('The received producerId is not in the database!');
        snapshot(result);
      });
    });
  });
});
