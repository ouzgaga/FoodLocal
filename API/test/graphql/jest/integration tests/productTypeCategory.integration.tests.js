const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { resolvers, schema: typeDefs } = require('../../../../src/graphql/graphqlConfig');
const clearDB = require('../../clearDB');
const { ProductTypeCategory: ProductTypeCategoryModel } = require('../../../../src/graphql/models/products.modelgql');
const {
  getAllProductTypeCategories,
  getProductTypeCategoryById,
  addProductTypeCategoryById,
  updateProductTypeCategory,
  deleteProductTypeCategory
} = require('./queries/QueryObjsProductTypeCategory');

const schema = makeExecutableSchema({ typeDefs, resolvers });

let fruits = {
  name: 'Fruits',
  image: 'ceci est une image de fruits encodée en base64!'
};
let legumes = {
  name: 'Légumes',
  image: 'ceci est une image de légumes encodée en base64!'
};
let viande = {
  name: 'Viande',
  image: 'ceci est une image de viande encodée en base64!'
};
let pain = {
  name: 'Pain',
  image: 'ceci est une image de pain encodée en base64!'
};

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  fruits = (await ProductTypeCategoryModel.create(fruits)).toObject();
  legumes = (await ProductTypeCategoryModel.create(legumes)).toObject();
  viande = (await ProductTypeCategoryModel.create(viande)).toObject();
  pain = (await ProductTypeCategoryModel.create(pain)).toObject();
};

describe('Testing graphql request productTypeCategory', () => {
  describe('QUERY productTypeCategory', () => {
    beforeEach(() => clearAndPopulateDB());

    // -------------------------productTypeCategories()------------------------------------- //
    describe('Testing productTypeCategories()', () => {
      it('should get all productTypeCategory', async(done) => {
        const { query, variables, context } = getAllProductTypeCategories;
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------productTypeCategory(id)-------------------------------------- //
    describe('Testing productTypeCategory(productTypeCategoryId)', () => {
      it('should get a productTypeCategory by id', async(done) => {
        const { query, context } = getProductTypeCategoryById;
        const variables = { id: fruits.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a productTypeCategory by id because invalid id received (too short)', async(done) => {
        const { query, context } = getProductTypeCategoryById;
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a productTypeCategory by id because invalid id received (too long)', async(done) => {
        const { query, context } = getProductTypeCategoryById;
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a productTypeCategory by id because unknown id received', async(done) => {
        const { query, context } = getProductTypeCategoryById;
        const variables = { id: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, context, variables);
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
      beforeEach(() => clearAndPopulateDB());
      it('should add a new productTypeCategory', async(done) => {
        const ble = {
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const { mutation, context } = addProductTypeCategoryById;
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

        const { mutation, context } = addProductTypeCategoryById;
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

        const { mutation, context } = addProductTypeCategoryById;
        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });

    describe('Testing updateProductTypeCategory(productTypeCategory)', () => {
      beforeEach(() => clearAndPopulateDB());

      it('should update a productTypeCategory', async(done) => {
        const ble = {
          id: fruits.id,
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D'
        };

        const { mutation, context } = updateProductTypeCategory;
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

        const { mutation, context } = updateProductTypeCategory;
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

        const { mutation, context } = updateProductTypeCategory;
        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a productTypeCategory because given field "rienAVoir" is not defined in schema', async(done) => {
        const ble = {
          id: fruits.id,
          name: 'blé',
          image: 'ceci est une image de blé encodée en base64! :D',
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const { mutation, context } = updateProductTypeCategory;
        const variables = { productTypeCategory: ble };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(1);
        expect(result.errors).not.toBeNull();
        done();
      });
    });

    describe('Testing deleteProductTypeCategory(productTypeCategoryId)', () => {
      beforeEach(() => clearAndPopulateDB());

      it('should delete a productTypeCategory', async(done) => {
        const { mutation, context } = deleteProductTypeCategory;
        const variables = { id: fruits.id };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.deleteProductTypeCategory).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productTypeCategory by id because invalid id received (too short)', async(done) => {
        const { query, context } = deleteProductTypeCategory;
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productTypeCategory by id because invalid id received (too long)', async(done) => {
        const { query, context } = deleteProductTypeCategory;
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productTypeCategory by id because unknown id received', async(done) => {
        const { query, context } = deleteProductTypeCategory;
        const variables = { id: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });
});
