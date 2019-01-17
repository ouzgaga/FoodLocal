const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { resolvers, schema: typeDefs } = require('../../../src/graphql/graphqlConfig');
const { populateDB, getTabProducers, getTabProductTypes, getTabProductTypeCategories } = require('../../populateDatabase');

const schema = makeExecutableSchema({ typeDefs, resolvers });

let tabProducers;
let tabProductTypes;
let tabProductTypeCategories;

const clearAndPopulateDB = async() => {
  // ------------------------------------------------------------- on ajoute le contenu de départ -------------------------------------------------------------
  await populateDB();

  tabProducers = await getTabProducers();
  tabProductTypes = await getTabProductTypes();
  tabProductTypeCategories = await getTabProductTypeCategories();
};

describe('Testing graphql request productType', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('QUERY productType', () => {
    // ----------------------productTypes()-------------------------------------- //
    describe('Testing productTypes()', () => {
      it('should get all productTypes', async(done) => {
        const { query } = {
          query: `query{
  productTypes{
    name
    image
    category{
      name
      image
    }
    producers{
      firstname
      lastname
      email
    }
  }
}`
        };
        const result = await graphql(schema, query, null, null, null);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------productType(productTypeId: ID!)-------------------------------------- //
    describe('Testing productType(productTypeId: ID!)', () => {
      const { query } = {
        query: `query ($productTypeId: ID!){
  productType(productTypeId: $productTypeId){
    name
    image
    category{
      name
      image
    }
    producers{
      firstname
      lastname
      email
    }
  }
}`
      };

      it('should get a productType by id', async(done) => {
        const variables = { productTypeId: tabProductTypes[18].id };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a productType by id because invalid id received (too short)', async(done) => {
        const variables = { productTypeId: 'abcdef' };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Received productType.id is invalid!'));
        done();
      });

      it('should fail getting a productType by id because invalid id received (too long)', async(done) => {
        const variables = { productTypeId: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Received productType.id is invalid!'));
        done();
      });

      it('should fail getting a productType by id because unknown id received', async(done) => {
        const variables = { productTypeId: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------productTypesOfCategory(productTypeCategoryId: ID!)-------------------------------------- //
    describe('Testing productTypesOfCategory(productTypeCategoryId: ID!)', () => {
      const { query } = {
        query: `query ($productTypeCategoryId: ID!){
  productTypesOfCategory(productTypeCategoryId: $productTypeCategoryId) {'
    name
    image
    category {
      name
      image
    }
    producers{
      firstname
      lastname
      email
    }
  }
}`
      };

      it('should get all productType of the productTypeCategory "fruits"', async(done) => {
        // on récupère tous les produits de la catégorie "fruits"
        let variables = { productTypeCategoryId: tabProductTypeCategories[3].id };
        let result = await graphql(schema, query, null, null, variables);
        expect.assertions(2);
        expect(result).toMatchSnapshot();

        // on récupère tous les produits de la catégorie "légumes"
        variables = { id: tabProductTypes[4].id };
        result = await graphql(schema, query, null, null, variables);
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });

  describe('MUTATION productType', () => {
    let context;
    beforeEach(async() => {
      await clearAndPopulateDB();
      context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: true, kind: tabProducers[0].kind };
    });

    // ----------------------addProductType(productType: ProductTypeInputAdd!)-------------------------------------- //
    describe('Testing addProductType(productType: ProductTypeInputAdd!)', () => {
      beforeEach(() => clearAndPopulateDB());

      const { mutation } = {
        mutation: `mutation($productType: ProductTypeInputAdd!) {
                     addProductType(productType: $productType) {
                       name
                       image
                     }
                   }`
      };

      it('should add a new productType', async(done) => {
        const pomme = {
          name: 'pomme',
          image: 'ceci est une image de pomme encodée en base64! :D',
          categoryId: tabProductTypeCategories[3].id
        };

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
          categoryId: tabProductTypeCategories[3].id
        };

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

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.categoryId of required type ID! was not provided.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new productType because given field "rienAVoir" is not defined in schema', async(done) => {
        const pomme = {
          name: 'pomme',
          image: 'ceci est une image de pomme encodée en base64! :D',
          categoryId: tabProductTypeCategories[3].id,
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field "rienAVoir" is not defined by type ProductTypeInputAdd.'));
        done();
      });

      it('should fail adding a new productType because not authenticated', async(done) => {
        const pomme = {
          name: 'pomme',
          image: 'ceci est une image de pomme encodée en base64! :D',
          categoryId: tabProductTypeCategories[3].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new productType because not authenticated as administrator', async(done) => {
        context.isAdmin = false;

        const pomme = {
          name: 'pomme',
          image: 'ceci est une image de pomme encodée en base64! :D',
          categoryId: tabProductTypeCategories[3].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be an administrator to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------updateProductType(productType: ProductTypeInputUpdate!)-------------------------------------- //
    describe('Testing updateProductType(productType: ProductTypeInputUpdate!)', () => {
      beforeEach(() => clearAndPopulateDB());

      const { mutation } = {
        mutation: `mutation($productType: ProductTypeInputUpdate!) {
     updateProductType(productType: $productType) {
       name
       image
     }
   }`
      };

      it('should update a productType', async(done) => {
        const pomme = {
          id: tabProductTypes[18].id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: tabProductTypeCategories[4].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.updateProductType).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a productType because missing name', async(done) => {
        const poire = {
          id: tabProductTypes[18].id,
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: tabProductTypeCategories[4].id
        };

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
          id: tabProductTypes[18].id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D'
        };

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
          categoryId: tabProductTypeCategories[4].id
        };

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
          id: tabProductTypes[18].id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: tabProductTypeCategories[4].id,
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field "rienAVoir" is not defined by type ProductTypeInputUpdate.'));
        done();
      });

      it('should fail updating a productType because not authenticated', async(done) => {
        const pomme = {
          id: tabProductTypes[18].id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: tabProductTypeCategories[4].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a productType because not authenticated as administrator', async(done) => {
        context.isAdmin = false;
        const pomme = {
          id: tabProductTypes[18].id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: tabProductTypeCategories[4].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be an administrator to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    describe('Testing deleteProductType(productTypeId)', () => {
      beforeEach(() => clearAndPopulateDB());

      const { mutation } = {
        mutation: `mutation($productTypeId: ID!) {
     deleteProductType(productTypeId: $productTypeId) {
       name
       image
     }
   }`
      };

      it('should delete a productType', async(done) => {
        const variables = { productTypeId: tabProductTypes[18].id };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.deleteProductType).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productType by id because invalid id received (too short)', async(done) => {
        const variables = { productTypeId: 'abcdef' };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productType by id because invalid id received (too long)', async(done) => {
        const variables = { productTypeId: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productType by id because unknown id received', async(done) => {
        const variables = { productTypeId: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productType because not authenticated', async(done) => {
        const variables = { productTypeId: tabProductTypes[18].id };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a productType because not authenticated as administrator', async(done) => {
        context.isAdmin = false;
        const variables = { productTypeId: tabProductTypes[18].id };
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
