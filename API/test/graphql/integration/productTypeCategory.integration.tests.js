const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const snapshot = require('snap-shot-it');
const { resolvers, schema: typeDefs, connectionDirective } = require('../../../src/graphql/graphqlConfig');
const { populateDB, getTabProducers, getTabProductTypeCategories } = require('../../populateDatabase');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    connection: connectionDirective
  }
});

let tabProducers;
let tabProductTypeCategories;

const clearAndPopulateDB = async() => {
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
      it('should get all productTypeCategory', async() => {
        const { query } = { query: 'query{ productTypeCategories{ pageInfo{hasNextPage hasPreviousPage startCursor endCursor}edges {node{name image }}}}' };
        const result = await graphql(schema, query, null, null, null);

        snapshot(result);
      });
    });

    // ----------------------productTypeCategory(id)-------------------------------------- //
    describe('Testing productTypeCategory(productTypeCategoryId)', () => {
      const { query } = { query: 'query($id:ID!){ productTypeCategory(productTypeCategoryId: $id){ name image } }' };

      it('should get a productTypeCategory by id', async() => {
        const variables = { id: tabProductTypeCategories[0].id };
        const result = await graphql(schema, query, null, null, variables);

        snapshot(result);
      });

      it('should fail getting a productTypeCategory by id because invalid id received (too short)', async() => {
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, query, null, null, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail getting a productTypeCategory by id because invalid id received (too long)', async() => {
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, null, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail getting a productTypeCategory by id because unknown id received', async() => {
        const variables = { id: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, null, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
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
        mutation:
`mutation($productTypeCategory: ProductTypeCategoryInputAdd!) {
  addProductTypeCategory(productTypeCategory: $productTypeCategory) {
    name
    image
  }
}`
      };

      it('should add a new productTypeCategory', async() => {
        const ble = {
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.addProductTypeCategoryById).to.be.not.null;
        snapshot(result);
      });

      it('should fail adding a new productTypeCategory because missing name', async() => {
        const ble = {
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail adding a new productTypeCategory because given field "rienAVoir" is not defined in schema', async() => {
        const ble = {
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D',
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail adding a new productTypeCategory because not authenticated', async() => {
        const ble = {
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail adding a new productTypeCategory because not authenticated as administrator', async() => {
        context.isAdmin = false;

        const ble = {
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be an administrator to do that.');
        snapshot(result);
      });
    });

    describe('Testing updateProductTypeCategory(productTypeCategory)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: true, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation:
`mutation($productTypeCategory: ProductTypeCategoryInputUpdate!) {
  updateProductTypeCategory(productTypeCategory: $productTypeCategory) {
    name
    image
  }
}`
      };

      it('should update a productTypeCategory', async() => {
        const ble = {
          id: tabProductTypeCategories[0].id,
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateProductTypeCategory).to.be.not.null;
        snapshot(result);
      });

      it('should fail updating a productTypeCategory because missing name', async() => {
        const ble = {
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail updating a productTypeCategory because missing id', async() => {
        const ble = {
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail updating a productTypeCategory because given field "rienAVoir" is not defined in schema', async() => {
        const ble = {
          id: tabProductTypeCategories[0].id,
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D',
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
      });

      it('should fail updating a productTypeCategory because not authenticated', async() => {
        const ble = {
          id: tabProductTypeCategories[0].id,
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail updating a productTypeCategory because not authenticated as administrator', async() => {
        context.isAdmin = false;
        const ble = {
          id: tabProductTypeCategories[0].id,
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be an administrator to do that.');
        snapshot(result);
      });
    });

    describe('Testing deleteProductTypeCategory(productTypeCategoryId)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: true, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation:
`mutation($id: ID!) {
  deleteProductTypeCategory(productTypeCategoryId: $id) {
    name
    image
  }
}`
      };

      it('should delete a productTypeCategory', async() => {
        const variables = { id: tabProductTypeCategories[0].id };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.deleteProductTypeCategory).to.be.not.null;
        snapshot(result);
      });

      it('should fail deleting a productTypeCategory by id because invalid id received (too short)', async() => {
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail deleting a productTypeCategory by id because invalid id received (too long)', async() => {
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail deleting a productTypeCategory by id because unknown id received', async() => {
        const variables = { id: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail deleting a productTypeCategory because not authenticated', async() => {
        const variables = { id: tabProductTypeCategories[0].id };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail deleting a productTypeCategory because not authenticated as administrator', async() => {
        context.isAdmin = false;
        const variables = { id: tabProductTypeCategories[0].id };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be an administrator to do that.');
        snapshot(result);
      });
    });
  });
});
