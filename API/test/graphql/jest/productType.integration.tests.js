const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { resolvers, schema: typeDefs } = require('../../../src/graphql/graphqlConfig');
const clearDB = require('../clearDB');
const ProductTypesModel = require('../../../src/graphql/models/productTypes.modelgql');
const ProductTypeCategoriesModel = require('../../../src/graphql/models/productTypeCategories.modelgql');
const {
  getAllProductTypes,
  getProductTypeById,
  getAllProductTypeOfProductTypeCategoryId,
  addProductType,
  updateProductType,
  deleteProductType
} = require('./queries/QueryObjsProductType');

const schema = makeExecutableSchema({ typeDefs, resolvers });


let categoryFruits = {
  name: 'Fruits',
  image: 'ceci est une image de fruits encodée en base64!'
};

let categoryVegetable = {
  name: 'Légumes',
  image: 'ceci est une image de légume encodée en base64!'
};

let productTypePomme = {
  name: 'Pomme',
  image: 'ceci est une image de pomme encodée en base64!'
};
let productTypePoire = {
  name: 'Poire',
  image: 'ceci est une image de poire encodée en base64!'
};
let productTypeRaisin = {
  name: 'Raisin',
  image: 'ceci est une image de raisin encodée en base64!'
};
let productTypeCourgette = {
  name: 'Courgette',
  image: 'ceci est une image de courgette encodée en base64!'
};

const clearAndPopulateDB = async() => {
  // on supprime tout le contenu de la DB
  await clearDB();

  // on ajoute le contenu de départ
  categoryFruits = (await ProductTypeCategoriesModel.create(categoryFruits)).toObject();
  categoryVegetable = (await ProductTypeCategoriesModel.create(categoryVegetable)).toObject();

  productTypePomme.categoryId = categoryFruits.id;
  productTypePomme = (await ProductTypesModel.create(productTypePomme)).toObject();

  productTypePoire.categoryId = categoryFruits.id;
  productTypePoire = (await ProductTypesModel.create(productTypePoire)).toObject();

  productTypeRaisin.categoryId = categoryFruits.id;
  productTypeRaisin = (await ProductTypesModel.create(productTypeRaisin)).toObject();

  productTypeCourgette.id = undefined;
  productTypeCourgette.categoryId = categoryVegetable.id;
  productTypeCourgette = (await ProductTypesModel.create(productTypeCourgette)).toObject();
};


describe('Testing graphql request productType', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('QUERY productType', () => {
    describe('Testing productTypes()', () => {
      it('should get all productTypes', async(done) => {
        const { query, variables, context } = getAllProductTypes;
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });
    });

    describe('Testing productTypes(productTypeId)', () => {
      it('should get a productType by id', async(done) => {
        const { query, context } = getProductTypeById;
        const variables = { id: productTypePomme.id };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a productType by id because invalid id received (too short)', async(done) => {
        const { query, context } = getProductTypeById;
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Received productType.id is invalid!'));
        done();
      });

      it('should fail getting a productType by id because invalid id received (too long)', async(done) => {
        const { query, context } = getProductTypeById;
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Received productType.id is invalid!'));
        done();
      });

      it('should fail getting a productType by id because unknown id received', async(done) => {
        const { query, context } = getProductTypeById;
        const variables = { id: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });

    describe('Testing productTypesOfCategory(productTypeCategoryId)', () => {
      it('should get all productType of the productTypeCategory corresponding to the received id', async(done) => {
        const { query, context } = getAllProductTypeOfProductTypeCategoryId;
        let variables = { id: categoryFruits.id };
        let result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result).toMatchSnapshot();

        variables = { id: categoryVegetable.id };
        result = await graphql(schema, query, null, context, variables);
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });

  describe('MUTATION productType', () => {
    beforeEach(() => clearAndPopulateDB());

    describe('Testing addProductType(productType)', () => {
      beforeEach(() => clearAndPopulateDB());
      it('should add a new productType', async(done) => {
        const pomme = {
          name: 'pomme',
          image: 'ceci est une image de pomme encodée en base64! :D',
          categoryId: categoryFruits.id
        };

        const { mutation, context } = addProductType;
        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.addProductType).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new productType because missing name', async(done) => {
        const pomme = {
          image: 'ceci est une image de pomme encodée en base64! :D',
          categoryId: categoryFruits.id
        };

        const { mutation, context } = addProductType;
        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.name of required type String! was not provided.'));
        done();
      });

      it('should fail adding a new productType because missing categoryId', async(done) => {
        const pomme = {
          name: 'pomme',
          image: 'ceci est une image de pomme encodée en base64! :D'
        };

        const { mutation, context } = addProductType;
        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.categoryId of required type ID! was not provided.'));
        done();
      });

      it('should fail adding a new productType because given field "rienAVoir" is not defined in schema', async(done) => {
        const pomme = {
          name: 'pomme',
          image: 'ceci est une image de pomme encodée en base64! :D',
          categoryId: categoryFruits.id,
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const { mutation, context } = addProductType;
        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field "rienAVoir" is not defined by type ProductTypeInputAdd.'));
        done();
      });
    });

    describe('Testing updateProductType(productType)', () => {
      beforeEach(() => clearAndPopulateDB());

      it('should update a productType', async(done) => {
        const pomme = {
          id: productTypePomme.id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: categoryVegetable.id
        };

        const { mutation, context } = updateProductType;
        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.updateProductType).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a productType because missing name', async(done) => {
        const poire = {
          id: productTypePomme.id,
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: categoryVegetable.id
        };

        const { mutation, context } = updateProductType;
        const variables = { productType: poire };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.name of required type String! was not provided.'));
        done();
      });

      it('should fail updating a productType because missing categoryId', async(done) => {
        const pomme = {
          id: productTypePomme.id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D'
        };

        const { mutation, context } = updateProductType;
        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.categoryId of required type ID! was not provided.'));
        done();
      });

      it('should fail updating a productType because missing id', async(done) => {
        const pomme = {
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: categoryVegetable.id
        };

        const { mutation, context } = updateProductType;
        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.id of required type ID! was not provided.'));
        done();
      });

      it('should fail updating a productType because given field "rienAVoir" is not defined in schema', async(done) => {
        const pomme = {
          id: productTypePomme.id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: categoryVegetable.id,
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const { mutation, context } = updateProductType;
        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field "rienAVoir" is not defined by type ProductTypeInputUpdate.'));
        done();
      });
    });

    describe('Testing deleteProductType(productTypeId)', () => {
      beforeEach(() => clearAndPopulateDB());

      it('should delete a productType', async(done) => {
        const { mutation, context } = deleteProductType;
        const variables = { id: productTypePomme.id };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.deleteProductType).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productType by id because invalid id received (too short)', async(done) => {
        const { query, context } = deleteProductType;
        const variables = { id: 'abcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productType by id because invalid id received (too long)', async(done) => {
        const { query, context } = deleteProductType;
        const variables = { id: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productType by id because unknown id received', async(done) => {
        const { query, context } = deleteProductType;
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
