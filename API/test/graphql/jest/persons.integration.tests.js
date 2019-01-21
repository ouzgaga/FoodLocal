const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { resolvers, schema: typeDefs, connectionDirective } = require('../../../src/graphql/graphqlConfig');
const { populateDB, getTabProducers, getTabUsers } = require('../../populateDatabase');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    connection: connectionDirective
  }
});

let tabProducers;
let tabUsers;

const clearAndPopulateDB = async() => {
  // ------------------------------------------------------------- on ajoute le contenu de départ -------------------------------------------------------------
  await populateDB();

  tabProducers = await getTabProducers();
  tabUsers = await getTabUsers();
};

describe('Testing graphql request persons', () => {
  describe('QUERY persons', () => {
    beforeEach(() => clearAndPopulateDB());

    // ----------------------checkIfEmailIsAvailable(email: String!)-------------------------------------- //
    describe('Testing checkIfEmailIsAvailable(email: String!)', () => {
      const { query } = {
        query: `query($email: String!) {
                  checkIfEmailIsAvailable(email:$email)
                }`
      };

      it('should return true because email is available', async(done) => {
        const result = await graphql(schema, query, null, {}, { email: 'newMail@mail.com' });
        expect.assertions(1);
        expect(result.data.checkIfEmailIsAvailable).toBeTruthy();
        done();
      });

      it('should return false because email is already used', async(done) => {
        const result = await graphql(schema, query, null, {}, { email: tabProducers[0].email });
        expect.assertions(1);
        expect(result.data.checkIfEmailIsAvailable).toBeFalsy();
        done();
      });
    });
  });

  describe('MUTATION persons', () => {
    beforeEach(() => clearAndPopulateDB());

    // ----------------------addFollowerToProducer(producerId: ID!, followerId: ID!)-------------------------------------- //
    describe('Testing addFollowerToProducer(producerId: ID!, followerId: ID!)', () => {
      beforeEach(() => clearAndPopulateDB());

      const { mutation } = {
        mutation: `
          mutation($producerId: ID!, $followerId: ID!) {
            addFollowerToProducer(producerId: $producerId, followerId: $followerId) {
              firstname
              lastname
              email
              image
              followingProducers {
                pageInfo{
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
                edges{
                  cursor
                  node{
                    firstname
                    lastname
                    email
                  }
                }
                totalCount
              }
              emailValidated
              isAdmin
              __typename
            }
          }`
      };

      const { queryGetProducerById } = {
        queryGetProducerById: `
          query($producerId: ID!) {
            producer(producerId: $producerId) {
              firstname
              lastname
              email
              image
              followingProducers {
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
                edges {
                  cursor
                  node {
                    firstname
                    lastname
                    email
                  }
                }
                totalCount
              }
              emailValidated
              isAdmin
              followers {
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
                edges {
                  cursor
                  node {
                    firstname
                    lastname
                    email
                  }
                }
                totalCount
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
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
                edges {
                  node {
                    id
                    description
                    productType {
                      id
                      name
                      image
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

      it('should add a new follower to a producer', async(done) => {
        const variables = { producerId: tabProducers[2].id, followerId: tabProducers[3].id };
        let result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(3);
        expect(result.data.addFollowerToProducer.followingProducers.totalCount).toBe(1);
        expect(result).toMatchSnapshot();

        // on check que le follower ait aussi été ajouté dans le producteur
        result = await graphql(schema, queryGetProducerById, null, null, { producerId: tabProducers[2].id });
        expect(result.data.producer.followers.totalCount).toBe(1);
        done();
      });

      it('should not add twice the same follower to the same producer', async(done) => {
        const variables = { producerId: tabProducers[2].id, followerId: tabProducers[3].id };
        let result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(6);
        expect(result.data.addFollowerToProducer.followingProducers.totalCount).toBe(1);
        expect(result).toMatchSnapshot();

        // on check que le follower ait aussi été ajouté dans le producteur
        result = await graphql(schema, queryGetProducerById, null, null, { producerId: tabProducers[2].id });
        expect(result.data.producer.followers.totalCount).toBe(1);

        result = await graphql(schema, mutation, null, null, variables);
        // le nombre de producteurs suivis doit toujours être de 1
        expect(result.data.addFollowerToProducer.followingProducers.totalCount).toBe(1);
        expect(result).toMatchSnapshot();

        // le nombre de followers du producteur doit toujours être de 1
        result = await graphql(schema, queryGetProducerById, null, null, { producerId: tabProducers[2].id });
        expect(result.data.producer.followers.totalCount).toBe(1);

        done();
      });

      it('should fail adding a new follower to a producer because invalid producerId received (too short)', async(done) => {
        const variables = { producerId: 'abcdef', followerId: tabUsers[0].id };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new follower to a producer because invalid producerId received (too long)', async(done) => {
        const variables = { producerId: 'abcdefabcdefabcdefabcdefabcdef', followerId: tabUsers[0].id };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new follower to a producer because unknown producerId received', async(done) => {
        const variables = { producerId: 'abcdefabcdefabcdefabcdef', followerId: tabUsers[0].id };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('There is no producer with this id in database!'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new follower to a producer because invalid followerId received (too short)', async(done) => {
        const variables = { producerId: tabProducers[0].id, followerId: 'abcdef' };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new follower to a producer because invalid followerId received (too long)', async(done) => {
        const variables = { producerId: tabProducers[0].id, followerId: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new follower to a producer because unknown followerId received', async(done) => {
        const variables = { producerId: tabProducers[0].id, followerId: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('There is no person with this id in database!'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------removeFollowerToProducer(producerId: ID!, followerId: ID!)-------------------------------------- //
    describe('Testing removeFollowerToProducer(producerId: ID!, followerId: ID!)', () => {
      beforeEach(() => clearAndPopulateDB());

      const { mutation } = {
        mutation: `
          mutation($producerId: ID!, $followerId: ID!) {
            removeFollowerToProducer(producerId: $producerId, followerId: $followerId) {
              firstname
              lastname
              email
              image
              followingProducers {
                pageInfo{
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
                edges{
                  cursor
                  node{
                    firstname
                    lastname
                    email
                  }
                }
                totalCount
              }
              emailValidated
              isAdmin
              __typename
            }
          }`
      };

      const { queryGetProducerById } = {
        queryGetProducerById: `
query($producerId: ID!) {
  producer(producerId: $producerId) {
    firstname
    lastname
    email
    image
    followingProducers {
      pageInfo{
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges{
        cursor
        node{
          firstname
          lastname
          email
        }
      }
      totalCount
    }
    emailValidated
    isAdmin
    followers {
      pageInfo{
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges{
        cursor
        node{
          firstname
          lastname
          email
        }
      }
      totalCount
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
      grade
    }
  }
}`
      };

      it('should remove a follower from a producer', async(done) => {
        // on enlève un follower au producteur
        let variables = { producerId: tabProducers[0].id, followerId: tabUsers[0].id };
        let result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(7);
        expect(result.data.removeFollowerToProducer.followingProducers.totalCount).toBe(0);

        // on check que le follower ait aussi été enlevé dans le producteur
        result = await graphql(schema, queryGetProducerById, null, null, { producerId: tabProducers[0].id });
        expect(result.data.producer.followers.totalCount).toBe(2);

        // on enlève un autre follower au producteur
        variables = { producerId: tabProducers[0].id, followerId: tabUsers[1].id };
        result = await graphql(schema, mutation, null, null, variables);
        expect(result.data.removeFollowerToProducer.followingProducers.totalCount).toBe(0);

        // on check que le follower ait aussi été enlevé dans le producteur
        result = await graphql(schema, queryGetProducerById, null, null, { producerId: tabProducers[0].id });
        expect(result.data.producer.followers.totalCount).toBe(1);

        // on enlève le dernier follower du producteur
        variables = { producerId: tabProducers[0].id, followerId: tabProducers[1].id };
        result = await graphql(schema, mutation, null, null, variables);
        expect(result.data.removeFollowerToProducer.followingProducers.totalCount).toBe(1);

        // on check que le follower ait aussi été enlevé dans le producteur
        result = await graphql(schema, queryGetProducerById, null, null, { producerId: tabProducers[0].id });
        expect(result.data.producer.followers.totalCount).toBe(0);

        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail removing a follower from a producer because invalid producerId received (too short)', async(done) => {
        const variables = { producerId: 'abcdef', followerId: tabUsers[0].id };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail removing a follower from a producer because invalid producerId received (too long)', async(done) => {
        const variables = { producerId: 'abcdefabcdefabcdefabcdefabcdef', followerId: tabUsers[0].id };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail removing a follower from a producer because unknown producerId received', async(done) => {
        const variables = { producerId: 'abcdefabcdefabcdefabcdef', followerId: tabUsers[0].id };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('There is no producer with this id in database!'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail removing a new follower to a producer because invalid followerId received (too short)', async(done) => {
        const variables = { producerId: tabProducers[0].id, followerId: 'abcdef' };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail removing a new follower to a producer because invalid followerId received (too long)', async(done) => {
        const variables = { producerId: tabProducers[0].id, followerId: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail removing a new follower to a producer because unknown followerId received', async(done) => {
        const variables = { producerId: tabProducers[0].id, followerId: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, null, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('There is no person with this id in database!'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------changePassword(newPassword: String!, oldPassword: String!, personId: ID!)-------------------------------------- //
    describe('Testing changePassword(newPassword: String!, oldPassword: String!, personId: ID!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: tabProducers[0].isAdmin, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `
        mutation($newPwd: String!, $oldPwd: String!, $personId: ID!) {
          changePassword(newPassword: $newPwd, oldPassword: $oldPwd, personId:$personId)
        }`
      };

      it('should change the password of the producer', async(done) => {
        let variables = {
          newPwd: 'abcd1234',
          oldPwd: '1234abcd',
          personId: tabProducers[0].id
        };
        let result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.data.changePassword).toBeTruthy();
        expect(result).toMatchSnapshot();

        // on change le password pour revenir au password de départ
        variables = {
          oldPwd: 'abcd1234',
          newPwd: '1234abcd',
          personId: tabProducers[0].id
        };
        result = await graphql(schema, mutation, null, context, variables);
        expect(result.data.changePassword).toBeTruthy();
        expect(result).toMatchSnapshot();

        done();
      });

      it('should not change the password of the user because user is not logged in', async(done) => {
        const variables = {
          newPwd: 'abcd1234',
          oldPwd: '1234abcd',
          // on tente de modifier un autre membre que nous! -> Doit lever une erreur
          personId: tabUsers[0].id
        };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });


      it('should not change the password of the user because user try to modify another member', async(done) => {
        context = { id: tabUsers[0].id, email: tabUsers[0].email, isAdmin: tabUsers[0].isAdmin, kind: tabUsers[0].kind };
        const variables = {
          newPwd: 'abcd1234',
          oldPwd: '1234abcd',
          // on tente de modifier un autre membre que nous! -> Doit lever une erreur
          personId: tabProducers[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not change the password of the person because wrong old password', async(done) => {
        const variables = {
          newPwd: 'abcd1234',
          oldPwd: 'wrongOldPassword',
          personId: tabProducers[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('The received oldPassword is not correct!'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not change the password of the person because empty old password', async(done) => {
        const variables = {
          newPwd: 'abcd1234',
          oldPwd: '',
          personId: tabProducers[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('The received oldPassword is not correct!'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not change the password of the person because empty new password', async(done) => {
        const variables = {
          newPwd: '',
          oldPwd: '1234abcd',
          personId: tabProducers[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('New password must be at least 6 characters long.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not change the password of the person because new password is too short', async(done) => {
        const variables = {
          newPwd: '12ab',
          oldPwd: '1234abcd',
          personId: tabProducers[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('New password must be at least 6 characters long.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not change the password of the person because empty new password is too long', async(done) => {
        const variables = {
          newPwd: '12345123451234512345abcdeabcdea',
          oldPwd: '1234abcd',
          personId: tabProducers[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('New password must be less than 30 characters long.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not change the password of the person because new password must contain at least one number', async(done) => {
        const variables = {
          newPwd: 'abcdefgh',
          oldPwd: '1234abcd',
          personId: tabProducers[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('New password must contain at least 1 number.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not change the password of the person because new password must contain at least one letter', async(done) => {
        const variables = {
          newPwd: '1234561234',
          oldPwd: '1234abcd',
          personId: tabProducers[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors[0].message).toEqual(expect.stringContaining('New password must contain at least 1 letter.'));
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });
});
