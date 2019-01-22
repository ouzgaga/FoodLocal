const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const snapshot = require('snap-shot-it');
const { resolvers, schema: typeDefs, connectionDirective } = require('../../../src/graphql/graphqlConfig');
const { populateDB, getTabUsers } = require('../../populateDatabase');

// Making schema graphql
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    connection: connectionDirective
  }
});

let tabUsers;

const clearAndPopulateDB = async() => {
  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  await populateDB();

  tabUsers = await getTabUsers();
};

describe('Testing graphql resquest user', () => {
  describe('QUERY user', () => {
    // ----------------------users()-------------------------------------- //
    describe('Testing users()', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabUsers[0].id, email: tabUsers[0].email, isAdmin: true, kind: tabUsers[0].kind };
      });
      const { query } = {
        query: `
          query {
            users {
              pageInfo{
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                node{
                  firstname
                  lastname
                  email
                  image
                  emailValidated
                  isAdmin
                  followingProducers{
                    edges{
                      node{
                        firstname
                        lastname
                      }
                    }
                  }
                }
              }
              totalCount
            }
          }`
      };

      it('should get all users', async() => {
        const result = await graphql(schema, query, null, context, null);

        expect(result.data.users.totalCount).to.be.equal(tabUsers.length);
        snapshot(result);
      });

      it('should not get all users because not authenticated', async() => {
        const result = await graphql(schema, query, null, {}, null);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should get all users because not authenticated as administrator', async() => {
        context.isAdmin = false;
        const result = await graphql(schema, query, null, context, null);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be an administrator to do that.');
        snapshot(result);
      });
    });

    // ----------------------user(userId: ID!)-------------------------------------- //
    describe('Testing user(userId: ID!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabUsers[0].id, email: tabUsers[0].email, isAdmin: true, kind: tabUsers[0].kind };
      });

      const { query } = {
        query: `
          query($id: ID!) {
            user(userId: $id) {
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
                    image
                    phoneNumber
                    rating {
                      nbRatings
                      grade
                    }
                  }
                }
              }
              emailValidated
              isAdmin
            }
          }`
      };

      it('should get a user by id', async() => {
        const variables = { id: tabUsers[0].id };
        const result = await graphql(schema, query, null, context, variables);

        expect(result.data.user).to.be.not.null;
        snapshot(result);
      });

      it('should not get a user because not authenticated', async() => {
        const variables = { id: tabUsers[0].id };
        const result = await graphql(schema, query, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should get a user because not authenticated as administrator', async() => {
        context.isAdmin = false;
        const variables = { id: tabUsers[0].id };
        const result = await graphql(schema, query, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be an administrator to do that.');
        snapshot(result);
      });

      it('should fail getting a user by id because unknown id received', async() => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = { id: context.id };
        const result = await graphql(schema, query, null, context, variables);

        expect(result.data.user).to.be.null;
        snapshot(result);
      });

      it('should fail getting a user by id because invalid id received (too short)', async() => {
        context.id = 'abcdef';
        const variables = { id: context.id };
        const result = await graphql(schema, query, null, context, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdef" at path "_id" for model "users"');
        expect(result.data.user).to.be.null;
        snapshot(result);
      });

      it('should fail getting a user by id because invalid id received (too long)', async() => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = { id: context.id };
        const result = await graphql(schema, query, null, context, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "users"');
        expect(result.data.user).to.be.null;
        snapshot(result);
      });
    });
  });

  describe('MUTATION user', () => {
    // ----------------------updateUser(user: UserInputUpdate!)-------------------------------------- //
    describe('Testing updateUser(user: UserInputUpdate!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabUsers[0].id, email: tabUsers[0].email, isAdmin: true, kind: tabUsers[0].kind };
      });

      const { mutation } = {
        mutation: `
        mutation($user: UserInputUpdate!) {
          updateUser(user: $user) {
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
                  image
                  phoneNumber
                  rating {
                    nbRatings
                    grade
                  }
                }
              }
            }
            emailValidated
            isAdmin
          }
        }`
      };

      it('should update a user', async() => {
        const variables = {
          user: {
            id: tabUsers[0].id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateUser).to.be.not.null;
        snapshot(result);
      });

      it('should update a user without erasing the firstname', async() => {
        tabUsers = await getTabUsers();

        const variables = {
          user: {
            id: tabUsers[0].id,
            lastname: 'Schöpfli',
            image: 'ceci est une image encodée en base 64'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateUser).to.be.not.null;
        expect(result.data.updateUser.firstname).to.be.equal(tabUsers[0].firstname);
      });

      it('should update a user without erasing the lastname', async() => {
        tabUsers = await getTabUsers();

        const variables = {
          user: {
            id: tabUsers[0].id,
            firstname: 'ben',
            image: 'ceci est une image encodée en base 64'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateUser).to.be.not.null;
        expect(result.data.updateUser.lastname).to.be.equal(tabUsers[0].lastname);
      });

      it('should update only the user\'s firstname without erasing the other informations', async() => {
        tabUsers = await getTabUsers();

        const variables = {
          user: {
            id: tabUsers[0].id,
            firstname: 'ben'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateUser).to.be.not.null;
        expect(result.data.updateUser.lastname).to.be.equal(tabUsers[0].lastname);
        expect(result.data.updateUser.image).to.be.equal(tabUsers[0].image);
      });

      it('should not update the user image because image not received (undefined)', async() => {
        const variables = {
          user: {
            id: tabUsers[0].id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateUser).to.be.not.null;
        expect(result.data.updateUser.image).to.be.equal(tabUsers[0].image);
        snapshot(result);
      });

      it('should update the user image to null because null image received', async() => {
        const variables = {
          user: {
            id: tabUsers[0].id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname,
            image: null
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateUser).to.be.not.null;
        expect(result.data.updateUser.image).to.be.null;
        snapshot(result);
      });

      it('should not update a user because not authenticated', async() => {
        const variables = {
          user: {
            id: tabUsers[0].id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should not update a user because not authenticated as yourself', async() => {
        const variables = {
          user: {
            id: tabUsers[1].id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('You can\'t modify information of another user than yourself!');
        snapshot(result);
      });

      it('should fail updating a user because unknown id received', async() => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = {
          user: {
            id: context.id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateUser).to.be.null;
        snapshot(result);
      });

      it('should fail updating a user because invalid id received (too short)', async() => {
        context.id = 'abcdef';
        const variables = {
          user: {
            id: context.id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdef" at path "_id" for model "users"');
        expect(result.data.updateUser).to.be.null;
        snapshot(result);
      });

      it('should fail updating a user because invalid id received (too long)', async() => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = {
          user: {
            id: context.id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "users"');
        expect(result.data.updateUser).to.be.null;
        snapshot(result);
      });
    });

    // TODO: deletePersonAccount
    // ----------------------deleteUser(userId: ID!)-------------------------------------- //
    /* describe('Testing deleteUser(userId: ID!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabUsers[0].id, email: tabUsers[0].email, isAdmin: true, kind: tabUsers[0].kind };
      });

      const { mutation } = {
        mutation: `
    mutation ($id: ID!){
  deleteUser(userId:$id){
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
          phoneNumber
          rating {
            nbRatings
            rating
          }
        }
      }
    }
    emailValidated
    isAdmin
  }
}`
      };

      it('should delete a user', async() => {
        const variables = {
          id: tabUsers[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateUser).to.be.not.null;
        snapshot(result)

      });

      it('should not delete a user because not authenticated', async() => {
        const variables = {
          id: tabUsers[0].id
        };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.'));
        snapshot(result)

      });

      it('should not delete a user because not authenticated as yourself', async() => {
        const variables = {
          id: tabUsers[1].id
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('You can\'t modify information of another user than yourself!'));
        snapshot(result)

      });

      it('should fail deleting a user because unknown id received', async() => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = { id: context.id };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.deleteUser).to.be.null;
        snapshot(result)

      });

      it('should fail deleting a user because invalid id received (too short)', async() => {
        context.id = 'abcdef';
        const variables = { id: context.id };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Received user.id is invalid!');
        expect(result.data.deleteUser).to.be.null;
        snapshot(result)

      });

      it('should fail deleting a user because invalid id received (too long)', async() => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = { id: context.id };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Received user.id is invalid!');
        expect(result.data.deleteUser).to.be.null;
        snapshot(result)

      });
    }); */
  });
});
