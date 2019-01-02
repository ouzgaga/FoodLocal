const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { resolvers, schema: typeDefs } = require('../../../src/graphql/graphqlConfig');
const clearDB = require('../clearDB');
const { populateDB, getTabUsers } = require('../../populateDatabase');

// Making schema graphql
const schema = makeExecutableSchema({ typeDefs, resolvers });

let tabUsers;

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  await populateDB();

  tabUsers = getTabUsers();
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
      firstname
      lastname
      email
      image
      followingProducers {
        firstname
        lastname
        email
        image
        emailValidated
        phoneNumber
        rating {
          nbRatings
          rating
        }
      }
      emailValidated
      isAdmin
    }
  }`
      };

      it('should get all users', async(done) => {
        const result = await graphql(schema, query, null, context, null);
        expect.assertions(2);
        expect(result.data.users.length).toEqual(tabUsers.length);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not get all users because not authenticated', async(done) => {
        const result = await graphql(schema, query, null, {}, null);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get all users because not authenticated as administrator', async(done) => {
        context.isAdmin = false;
        const result = await graphql(schema, query, null, context, null);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be an administrator to do that.'));
        expect(result).toMatchSnapshot();
        done();
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
    query ($id: ID!){
      user(userId: $id) {
        firstname
        lastname
        email
        image
        followingProducers {
          firstname
          lastname
          email
          image
          emailValidated
          phoneNumber
          rating {
            nbRatings
            rating
          }
        }
        emailValidated
        isAdmin
      }
    }`
      };

      it('should get a user by id', async(done) => {
        const variables = { id: tabUsers[0].id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.data.user).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not get a user because not authenticated', async(done) => {
        const variables = { id: tabUsers[0].id };
        const result = await graphql(schema, query, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should get a user because not authenticated as administrator', async(done) => {
        context.isAdmin = false;
        const variables = { id: tabUsers[0].id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be an administrator to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });


      it('should fail getting a user by id because unknown id received', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = { id: context.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.data.user).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a user by id because invalid id received (too short)', async(done) => {
        context.id = 'abcdef';
        const variables = { id: context.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Received user.id is invalid!');
        expect(result.data.user).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a user by id because invalid id received (too long)', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = { id: context.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Received user.id is invalid!');
        expect(result.data.user).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------updateUser(user: UserInputUpdate!)-------------------------------------- //
    describe('Testing updateUser(user: UserInputUpdate!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabUsers[0].id, email: tabUsers[0].email, isAdmin: true, kind: tabUsers[0].kind };
      });

      const { mutation } = {
        mutation: `
    mutation ($user: UserInputUpdate!){
  updateUser(user: $user){
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
  }
}`
      };

      it('should update a user', async(done) => {
        const variables = {
          user: {
            id: tabUsers[0].id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.updateUser).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not update a user because missing mendatory information (id)', async(done) => {
        const variables = {
          user: {
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.id of required type ID! was not provided.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not update a user because missing mendatory information (firstname)', async(done) => {
        const variables = {
          user: {
            id: tabUsers[0].id,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.firstname of required type String! was not provided.'));
        done();
      });

      it('should not update a user because missing mendatory information (lastname)', async(done) => {
        const variables = {
          user: {
            id: tabUsers[0].id,
            firstname: tabUsers[1].firstname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.lastname of required type String! was not provided.'));
        done();
      });

      it('should not update the user image because image not received (undefined)', async(done) => {
        const variables = {
          user: {
            id: tabUsers[0].id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.data.updateUser).not.toBeNull();
        expect(result.data.updateUser.image).toEqual(tabUsers[0].image);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should update the user image to null because null image received', async(done) => {
        const variables = {
          user: {
            id: tabUsers[0].id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname,
            image: null
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.data.updateUser).not.toBeNull();
        expect(result.data.updateUser.image).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not update a user because not authenticated', async(done) => {
        const variables = {
          user: {
            id: tabUsers[0].id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not update a user because not authenticated as yourself', async(done) => {
        const variables = {
          user: {
            id: tabUsers[1].id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a user because unknown id received', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = {
          user: {
            id: context.id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.updateUser).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a user because invalid id received (too short)', async(done) => {
        context.id = 'abcdef';
        const variables = {
          user: {
            id: context.id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Received user.id is invalid!');
        expect(result.data.updateUser).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a user because invalid id received (too long)', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = {
          user: {
            id: context.id,
            firstname: tabUsers[1].firstname,
            lastname: tabUsers[1].lastname
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Received user.id is invalid!');
        expect(result.data.updateUser).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------deleteUser(userId: ID!)-------------------------------------- //
    describe('Testing deleteUser(userId: ID!)', () => {
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
    followingProducers{
      firstname
      lastname
      email
    }
    emailValidated
    isAdmin
  }
}`
      };

      it('should delete a user', async(done) => {
        const variables = {
          id: tabUsers[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.updateUser).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not delete a user because not authenticated', async(done) => {
        const variables = {
          id: tabUsers[0].id
        };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not delete a user because not authenticated as yourself', async(done) => {
        const variables = {
          id: tabUsers[1].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a user because unknown id received', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = { id: context.id };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.deleteUser).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a user because invalid id received (too short)', async(done) => {
        context.id = 'abcdef';
        const variables = { id: context.id };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Received user.id is invalid!');
        expect(result.data.deleteUser).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a user because invalid id received (too long)', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = { id: context.id };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Received user.id is invalid!');
        expect(result.data.deleteUser).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });
});
