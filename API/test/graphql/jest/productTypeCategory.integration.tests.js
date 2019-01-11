const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { resolvers, schema: typeDefs } = require('../../../src/graphql/graphqlConfig');
const clearDB = require('../clearDB');
const { populateDB, getTabProducers, getTabProductTypeCategories } = require('../../populateDatabase');

const schema = makeExecutableSchema({ typeDefs, resolvers });

let tabProducers;
let tabProductTypeCategories;

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  await populateDB();

  tabProducers = await getTabProducers();
  tabProductTypeCategories = await getTabProductTypeCategories();
};

describe('Testing graphql request productTypeCategory', () => {
  describe('QUERY productTypeCategory', () => {
    beforeEach(() => clearAndPopulateDB());

    // -------------------------productTypeCategories()------------------------------------- //
    describe('Testing productTypeCategories()', () => {
      it('should get all productTypeCategory', async(done) => {
        const { query } = { query: 'query{ productTypeCategories{ name image } }' };
        const result = await graphql(schema, query, null, null, null);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------productTypeCategory(id)-------------------------------------- //
    describe('Testing productTypeCategory(productTypeCategoryId)', () => {
      const { query } = { query: 'query($id:ID!){ productTypeCategory(productTypeCategoryId: $id){ name image } }' };

      it('should get a productTypeCategory by id', async(done) => {
        const variables = { id: tabProductTypeCategories[0].id };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a productTypeCategory by id because invalid id received (too short)', async(done) => {
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a productTypeCategory by id because invalid id received (too long)', async(done) => {
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a productTypeCategory by id because unknown id received', async(done) => {
        const variables = { id: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });

  describe('MUTATION productTypeCategory', () => {
    beforeEach(() => clearAndPopulateDB());

    describe('Testing addProductTypeCategory(productTypeCategory)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: true, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `mutation($productTypeCategory: ProductTypeCategoryInputAdd!) {
                    addProductTypeCategory(productTypeCategory: $productTypeCategory) {
                      name
                      image
                    }
                  }`
      };

      it('should add a new productTypeCategory', async(done) => {
        const ble = {
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.addProductTypeCategoryById).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new productTypeCategory because missing name', async(done) => {
        const ble = {
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new productTypeCategory because given field "rienAVoir" is not defined in schema', async(done) => {
        const ble = {
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D',
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new productTypeCategory because not authenticated', async(done) => {
        const ble = {
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new productTypeCategory because not authenticated as administrator', async(done) => {
        context.isAdmin = false;

        const ble = {
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be an administrator to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    describe('Testing updateProductTypeCategory(productTypeCategory)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: true, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `mutation($productTypeCategory: ProductTypeCategoryInputUpdate!) {
                      updateProductTypeCategory(productTypeCategory: $productTypeCategory) {
                        name
                        image
                      }
                    }`
      };

      it('should update a productTypeCategory', async(done) => {
        const ble = {
          id: tabProductTypeCategories[0].id,
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.updateProductTypeCategory).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a productTypeCategory because missing name', async(done) => {
        const ble = {
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a productTypeCategory because missing id', async(done) => {
        const ble = {
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a productTypeCategory because given field "rienAVoir" is not defined in schema', async(done) => {
        const ble = {
          id: tabProductTypeCategories[0].id,
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D',
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(1);
        expect(result.errors).not.toBeNull();
        done();
      });

      it('should fail updating a productTypeCategory because not authenticated', async(done) => {
        const ble = {
          id: tabProductTypeCategories[0].id,
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a productTypeCategory because not authenticated as administrator', async(done) => {
        context.isAdmin = false;
        const ble = {
          id: tabProductTypeCategories[0].id,
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be an administrator to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    describe('Testing deleteProductTypeCategory(productTypeCategoryId)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: true, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `mutation($id: ID!) {
                    deleteProductTypeCategory(productTypeCategoryId: $id) {
                      name
                      image
                    }
                  }`
      };

      it('should delete a productTypeCategory', async(done) => {
        const variables = { id: tabProductTypeCategories[0].id };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.deleteProductTypeCategory).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productTypeCategory by id because invalid id received (too short)', async(done) => {
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productTypeCategory by id because invalid id received (too long)', async(done) => {
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productTypeCategory by id because unknown id received', async(done) => {
        const variables = { id: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productTypeCategory because not authenticated', async(done) => {
        const variables = { id: tabProductTypeCategories[0].id };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productTypeCategory because not authenticated as administrator', async(done) => {
        context.isAdmin = false;
        const variables = { id: tabProductTypeCategories[0].id };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be an administrator to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });
});
