const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const usersServices = require('../../../../src/graphql/services/users.services');
const { resolvers, schema: typeDefs } = require('../../../../src/graphql/graphqlConfig');
const clearDB = require('../../clearDB');
const { Products: ProductModel, ProductType: ProductTypeModel, ProductTypeCategory: ProductTypeCategoryModel } = require(
  '../../../../src/graphql/models/products.modelgql'
);
const {
  queryObjAllUsers,
  queryObjUserById
} = require('./Objects/QueryObjsUsers');

// Making schema graphql
const schema = makeExecutableSchema({ typeDefs, resolvers });

let benoit = {
  firstname: 'Benoît',
  lastname: 'Schöpfli',
  email: 'benoit@paysan.ch',
  password: '1234abcd',
  image: 'ceci est une image encodée en base64!',
  followingProducersIds: [],
  emailValidated: false
};

let antoine = {
  firstname: 'Antoine',
  lastname: 'Rochaille',
  email: 'antoine@paysan.ch',
  password: '1234abcd',
  image: 'ceci est l\'image d\'un tueur encodée en base64!',
  followingProducersIds: [],
  emailValidated: false
};

let tabUsers = [benoit, antoine];

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------

  // on ajoute 2 utilisateurs
  benoit = (await usersServices.addUser(benoit)).toObject();
  antoine = (await usersServices.addUser(antoine)).toObject();

  tabUsers = [benoit, antoine];
};

describe('Testing graphql resquest user', () => {
  describe('QUERY user', () => {
    describe('Testing user()', () => {
      beforeEach(() => clearAndPopulateDB());
      it('Should get the two user insert in the db', async (done) => {
        const { query, variables, context } = queryObjAllUsers;
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.data.users.length).toEqual(tabUsers.length);
        expect(result).toMatchSnapshot();
        done();
      });
    });
    describe('Testing user(userId)', () => {
      beforeEach(() => clearAndPopulateDB());
      it('Should get benoit by his id', async (done) => {
        const { query, context } = queryObjUserById;
        const variables = {id: antoine.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.data.user.email).toEqual(antoine.email);
        expect(result).toMatchSnapshot();
        done();
      });
      it('Should get an erro by using a bad id', async (done) => {
        const { query, context } = queryObjUserById;
        const variables = { id: 'abcdefabcdefabcdefbacdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });

});
