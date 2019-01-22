const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const snapshot = require('snap-shot-it');
const { resolvers, schema: typeDefs, connectionDirective } = require('../../../src/graphql/graphqlConfig');
const { populateDB, getTabProducers, getTabProductTypes, getTabProductTypeCategories } = require('../../populateDatabase');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    connection: connectionDirective
  }
});

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
      it('should get all productTypes', async() => {
        const { query } = {
          query: `query {
  productTypes {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        name
        image
        category {
          name
          image
        }
        producers {
         edges{
          node{
            firstname
            lastname
            email
          }
         }
        }
      }
      cursor
    }
  }
}
`
        };
        const result = await graphql(schema, query, null, null, null);

        snapshot(result);
      });
    });

    // ----------------------productType(productTypeId: ID!)-------------------------------------- //
    describe('Testing productType(productTypeId: ID!)', () => {
      const { query } = {
        query: `query($productTypeId: ID!) {
  productType(productTypeId: $productTypeId) {
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
`
      };

      it('should get a productType by id', async() => {
        const variables = { productTypeId: tabProductTypes[18].id };
        const result = await graphql(schema, query, null, null, variables);

        snapshot(result);
      });

      it('should fail getting a productType by id because invalid id received (too short)', async() => {
        const variables = { productTypeId: 'abcdef' };
        const result = await graphql(schema, query, null, null, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Cast to ObjectId failed for value "abcdef" at path "_id" for model "productType"');
      });

      it('should fail getting a productType by id because invalid id received (too long)', async() => {
        const variables = { productTypeId: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, null, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "productType"');
      });

      it('should fail getting a productType by id because unknown id received', async() => {
        const variables = { productTypeId: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, null, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });
    });

    // ----------------------productTypesOfCategory(productTypeCategoryId: ID!)-------------------------------------- //
    describe('Testing productTypesOfCategory(productTypeCategoryId: ID!)', () => {
      const { query } = {
        query:
`query ($productTypeCategoryId: ID!){
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

      it('should get all productType of the productTypeCategory "fruits"', async() => {
        // on récupère tous les produits de la catégorie "fruits"
        let variables = { productTypeCategoryId: tabProductTypeCategories[3].id };
        let result = await graphql(schema, query, null, null, variables);

        snapshot(result);

        // on récupère tous les produits de la catégorie "légumes"
        variables = { id: tabProductTypes[4].id };
        result = await graphql(schema, query, null, null, variables);
        snapshot(result);
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
        mutation:
`mutation($productType: ProductTypeInputAdd!) {
   addProductType(productType: $productType) {
     name
     image
   }
 }`
      };

      it('should add a new productType', async() => {
        const pomme = {
          name: 'pomme',
          image: 'ceci est une image de pomme encodée en base64! :D',
          categoryId: tabProductTypeCategories[3].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.addProductType).to.be.not.null;
        snapshot(result);
      });

      it('should fail adding a new productType because missing name', async() => {
        const pomme = {
          image: 'ceci est une image de pomme encodée en base64! :D',
          categoryId: tabProductTypeCategories[3].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.name of required type String! was not provided.');
      });

      it('should fail adding a new productType because missing categoryId', async() => {
        const pomme = {
          name: 'pomme',
          image: 'ceci est une image de pomme encodée en base64! :D'
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.categoryId of required type ID! was not provided.');
        snapshot(result);
      });

      it('should fail adding a new productType because given field "rienAVoir" is not defined in schema', async() => {
        const pomme = {
          name: 'pomme',
          image: 'ceci est une image de pomme encodée en base64! :D',
          categoryId: tabProductTypeCategories[3].id,
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field "rienAVoir" is not defined by type ProductTypeInputAdd.');
      });

      it('should fail adding a new productType because not authenticated', async() => {
        const pomme = {
          name: 'pomme',
          image: 'ceci est une image de pomme encodée en base64! :D',
          categoryId: tabProductTypeCategories[3].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail adding a new productType because not authenticated as administrator', async() => {
        context.isAdmin = false;

        const pomme = {
          name: 'pomme',
          image: 'ceci est une image de pomme encodée en base64! :D',
          categoryId: tabProductTypeCategories[3].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be an administrator to do that.');
        snapshot(result);
      });
    });

    // ----------------------updateProductType(productType: ProductTypeInputUpdate!)-------------------------------------- //
    describe('Testing updateProductType(productType: ProductTypeInputUpdate!)', () => {
      beforeEach(() => clearAndPopulateDB());

      const { mutation } = {
        mutation:
`mutation($productType: ProductTypeInputUpdate!) {
   updateProductType(productType: $productType) {
     name
     image
   }
 }`
      };

      it('should update a productType', async() => {
        const pomme = {
          id: tabProductTypes[18].id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: tabProductTypeCategories[4].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateProductType).to.be.not.null;
        snapshot(result);
      });

      it('should fail updating a productType because missing name', async() => {
        const poire = {
          id: tabProductTypes[18].id,
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: tabProductTypeCategories[4].id
        };

        const variables = { productType: poire };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.name of required type String! was not provided.');
      });

      it('should fail updating a productType because missing categoryId', async() => {
        const pomme = {
          id: tabProductTypes[18].id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D'
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.categoryId of required type ID! was not provided.');
      });

      it('should fail updating a productType because missing id', async() => {
        const pomme = {
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: tabProductTypeCategories[4].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.id of required type ID! was not provided.');
      });

      it('should fail updating a productType because given field "rienAVoir" is not defined in schema', async() => {
        const pomme = {
          id: tabProductTypes[18].id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: tabProductTypeCategories[4].id,
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field "rienAVoir" is not defined by type ProductTypeInputUpdate.');
      });

      it('should fail updating a productType because not authenticated', async() => {
        const pomme = {
          id: tabProductTypes[18].id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: tabProductTypeCategories[4].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail updating a productType because not authenticated as administrator', async() => {
        context.isAdmin = false;
        const pomme = {
          id: tabProductTypes[18].id,
          name: 'courgette',
          image: 'ceci est une image de courgette encodée en base64! :D',
          categoryId: tabProductTypeCategories[4].id
        };

        const variables = { productType: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be an administrator to do that.');
        snapshot(result);
      });
    });

    describe('Testing deleteProductType(productTypeId)', () => {
      beforeEach(() => clearAndPopulateDB());

      const { mutation } = {
        mutation:
`mutation($productTypeId: ID!) {
   deleteProductType(productTypeId: $productTypeId) {
     name
     image
   }
 }`
      };

      it('should delete a productType', async() => {
        const variables = { productTypeId: tabProductTypes[18].id };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.deleteProductType).to.be.not.null;
        snapshot(result);
      });

      it('should fail deleting a productType by id because invalid id received (too short)', async() => {
        const variables = { productTypeId: 'abcdef' };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail deleting a productType by id because invalid id received (too long)', async() => {
        const variables = { productTypeId: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail deleting a productType by id because unknown id received', async() => {
        const variables = { productTypeId: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail deleting a productType because not authenticated', async() => {
        const variables = { productTypeId: tabProductTypes[18].id };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail deleting a productType because not authenticated as administrator', async() => {
        context.isAdmin = false;
        const variables = { productTypeId: tabProductTypes[18].id };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be an administrator to do that.');
        snapshot(result);
      });
    });
  });
});
