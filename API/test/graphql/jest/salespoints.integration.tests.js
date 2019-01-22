const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
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
      it('should get all salespoints', async(done) => {
        const result = await graphql(schema, query, null, {}, null);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
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

      it('should get a salespoint by id ', async(done) => {
        tabSalespoints = await getTabSalespoints();

        const variables = { id: tabSalespoints[0].id };
        const result = await graphql(schema, query, null, {}, variables);
        expect.assertions(2);
        expect(result.data.salespoint).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a salespoint because unknown id received', async(done) => {
        const variables = { id: 'abcdefabcdefabcdefbacdef' };
        const result = await graphql(schema, query, null, {}, variables);
        expect.assertions(2);
        expect(result.data.salespoint).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a salespoint because invalid id received (too short)', async(done) => {
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, query, null, {}, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Cast to ObjectId failed for value "abcdef" at path "_id" for model "salespoints"');
        expect(result.data.salespoint).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a salespoint because invalid id received (too long)', async(done) => {
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, {}, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "salespoints"');
        expect(result.data.salespoint).toBeNull();
        expect(result).toMatchSnapshot();
        done();
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

      it('should add a salespoint to a producer', async(done) => {
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
        expect.assertions(2);
        expect(result.data.addSalespointToProducer).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a salespoint to a producer because he already has one.', async(done) => {
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
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message)
          .toEqual('This producer has already a salespoint but a producer can\'t have more than one salespoint. Try to update the current salespoint.');
        expect(result.data).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a salespoint to a producer because missing mendatory information (producerId).', async(done) => {
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
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('Variable "$producerId" of required type "ID!" was not provided.');
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a salespoint to a producer because missing mendatory information (salespoint).', async(done) => {
        const variables = {
          producerId: tabProducers[3].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('Variable "$salespoint" of required type "SalespointInput!" was not provided.');
        done();
      });

      it('should fail adding a salespoint to a producer because missing mendatory information (salespoint.name).', async(done) => {
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
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.name of required type String! was not provided.'));
        done();
      });

      it('should fail adding a salespoint to a producer because not authenticated', async(done) => {
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
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a salespoint to a producer because you can\'t modify someone else than yourself', async(done) => {
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
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a salespoint to a producer because invalid producerId received (too short)', async(done) => {
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
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('Cast to ObjectId failed for value "abcdef" at path "_id" for model "producers"');
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a salespoint to a producer because invalid producerId received (too long)', async(done) => {
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
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "producers"');
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a salespoint to a producer because unknown producerId received', async(done) => {
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
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('The received producerId is not in the database!');
        expect(result).toMatchSnapshot();
        done();
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

      it('should update the salespoint of a producer', async(done) => {
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
        expect.assertions(3);
        expect(result.data.updateSalespoint).not.toBeNull();
        expect(result.data.updateSalespoint.salespoint.name).toEqual(variables.salespoint.name);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating the salespoint of a producer because missing mendatory information (salespoint.name).', async(done) => {
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
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.name of required type String! was not provided.'));
        done();
      });

      it('should fail updating the salespoint of a producer because not authenticated', async(done) => {
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
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating the salespoint of a producer because you can\'t modify someone else than yourself', async(done) => {
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
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating the salespoint of a producer because invalid producerId received (too short)', async(done) => {
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
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('Received producerId is invalid!');
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating the salespoint of a producer because invalid producerId received (too long)', async(done) => {
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
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('Received producerId is invalid!');
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating the salespoint of a producer because unknown producerId received', async(done) => {
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
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('Received producerId is not in the database!');
        expect(result).toMatchSnapshot();
        done();
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

      it('should remove the salespoint of a producer', async(done) => {
        const variables = {
          producerId: tabProducers[0].id
        };

        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.deleteSalespointToProducer).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail removing the salespoint of a producer because not authenticated', async(done) => {
        const variables = {
          producerId: tabProducers[0].id
        };

        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail removing the salespoint of a producer because you can\'t modify someone else than yourself', async(done) => {
        const variables = {
          producerId: tabProducers[1].id
        };

        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail removing the salespoint of a producer because invalid producerId received (too short)', async(done) => {
        context.id = 'abcdef';
        const variables = {
          producerId: context.id
        };

        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('Cast to ObjectId failed for value "abcdef" at path "_id" for model "producers"');
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail removing the salespoint of a producer because invalid producerId received (too long)', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = {
          producerId: context.id
        };

        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "producers"');
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail removing the salespoint of a producer because unknown producerId received', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = {
          producerId: context.id
        };

        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual('The received producerId is not in the database!');
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });
});
