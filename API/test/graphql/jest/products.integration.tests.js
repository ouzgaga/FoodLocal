const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { resolvers, schema: typeDefs, connectionDirective } = require('../../../src/graphql/graphqlConfig');
const { populateDB, getTabProducers, getTabProductTypes } = require('../../populateDatabase');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    connection: connectionDirective
  }
});

let tabProducers;
let tabProductTypes;

const clearAndPopulateDB = async() => {
  // ------------------------------------------------------------- on ajoute le contenu de départ -------------------------------------------------------------
  await populateDB();

  tabProducers = await getTabProducers();
  tabProductTypes = await getTabProductTypes();
};

describe('Testing graphql request products', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('QUERY products', () => {
    // ----------------------products()-------------------------------------- //
    describe('Testing products()', () => {
      it('should get all products', async(done) => {
        const { query } = {
          query:
`query{
  products{
    pageInfo{
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges{
      node{
        id
        description
        productType{
          id
          name
          image
          category{
            id
            name
            image
          }
          producers{
            edges{
              node{
                firstname
                lastname
                email
              }
            }
          }
        }
      }
      cursor
    }
  }
}`
        };
        const result = await graphql(schema, query, null, {}, null);
        console.log(result);
        expect.assertions(1);
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------product(productId: ID!)-------------------------------------- //
    describe('Testing product(productId: ID!)', () => {
      const { query } = {
        query:
`query($productId: ID!) {
  product(productId: $productId) {
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
`
      };

      it('should get a product by id', async(done) => {
        const variables = { productId: tabProducers[2].productsIds[0].toString() };
        const result = await graphql(schema, query, null, {}, variables);
        console.log(result);
        expect.assertions(2);
        expect(result.data.product).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting a product by id because invalid id received (too short)', async(done) => {
        const variables = { productId: 'abcdef' };
        const result = await graphql(schema, query, null, {}, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Received product.id is invalid!'));
        done();
      });

      it('should fail getting a product by id because invalid id received (too long)', async(done) => {
        const variables = { productId: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, {}, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Received product.id is invalid!'));
        done();
      });

      it('should fail getting a product by id because unknown id received', async(done) => {
        const variables = { productId: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, {}, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });

  describe('MUTATION product', () => {
    let context;
    beforeEach(async() => {
      await clearAndPopulateDB();
      context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: tabProducers[0].isAdmin, kind: tabProducers[0].kind };
    });

    // ----------------------addMultipleProducts(producerId: ID!, products: [ProductInputAdd!]!)-------------------------------------- //
    describe('Testing addMultipleProducts(producerId: ID!, products: [ProductInputAdd!]!)', () => {
      let products;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: tabProducers[0].isAdmin, kind: tabProducers[0].kind };

        const pomme = {
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };
        const poire = {
          description: 'Une Poire trop beeeeelle!',
          productTypeId: tabProductTypes[19].id
        };
        const fleur = {
          productTypeId: tabProductTypes[0].id
        };

        products = [pomme, poire, fleur];
      });

      const { mutation } = {
        mutation: `
mutation($producerId: ID!, $products: [ProductInputAdd!]!) {
  addMultipleProducts(producerId: $producerId, products: $products) {
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
          category {
            id
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
      cursor
    }
  }
}`
      };

      it('should add multiple new products (with and without description)', async(done) => {
        const variables = { producerId: tabProducers[0].id, products };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.addMultipleProducts).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding multiple new products because one is missing productTypeId', async(done) => {
        products[0] = {
          description: 'Une Pomme monnnnstre bonne!'
        };

        const variables = { producerId: tabProducers[0].id, products };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value[0].productTypeId of required type ID! was not provided.'));
        done();
      });

      it('should fail adding multiple new products because one has a field "rienAVoir" that is not defined in schema', async(done) => {
        products[0] = {
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id,
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { producerId: tabProducers[0].id, products };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field "rienAVoir" is not defined by type ProductInputAdd at value[0].'));
        done();
      });

      it('should fail adding a new product because not authenticated', async(done) => {
        const variables = { producerId: tabProducers[0].id, products };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(2);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new product because not authenticated as yourself', async(done) => {
        const variables = { producerId: tabProducers[1].id, products };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------addProduct(producerId: ID!, product: ProductInputAdd!)-------------------------------------- //
    describe('Testing addProduct(producerId: ID!, product: ProductInputAdd!)', () => {
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: tabProducers[0].isAdmin, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `
mutation($producerId: ID!, $product: ProductInputAdd!) {
  addProduct(producerId: $producerId, product: $product) {
    description
    productType {
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
  }
}`
      };

      it('should add a new product with a description', async(done) => {
        const pomme = {
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.addProduct).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should add a new product without description', async(done) => {
        const pomme = {
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.addProduct).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new product because missing productTypeId', async(done) => {
        const pomme = {
          description: 'Une Pomme monnnnstre bonne!'
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.productTypeId of required type ID! was not provided.'));
        done();
      });

      it('should fail adding a new product because given field "rienAVoir" is not defined in schema', async(done) => {
        const pomme = {
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id,
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field "rienAVoir" is not defined by type ProductInputAdd.'));
        done();
      });

      it('should fail adding a new product because not authenticated', async(done) => {
        const pomme = {
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new product because not authenticated as yourself', async(done) => {
        const pomme = {
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[1].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------updateProduct(product: ProductInputUpdate!)-------------------------------------- //
    describe('Testing updateProduct(product: ProductInputUpdate!)', () => {
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: tabProducers[0].isAdmin, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `
mutation($producerId: ID!, $product: ProductInputUpdate!) {
  updateProduct(producerId: $producerId, product: $product) {
    description
    productType {
      name
      category {
        name
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
  }
}`
      };

      it('should update a product', async(done) => {
        const pomme = {
          id: tabProducers[0].productsIds[0].toString(),
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.updateProduct).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a product because missing productTypeId', async(done) => {
        const pomme = {
          id: tabProducers[0].productsIds[0].toString(),
          description: 'Une Pomme monnnnstre bonne!'
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.productTypeId of required type ID! was not provided.'));
        done();
      });

      it('should fail updating a product because given field "rienAVoir" is not defined in schema', async(done) => {
        const pomme = {
          id: tabProducers[0].productsIds[0].toString(),
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id,
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field "rienAVoir" is not defined by type ProductInputUpdate.'));
        done();
      });

      it('should fail updating a new product because not authenticated', async(done) => {
        const pomme = {
          id: tabProducers[0].productsIds[0].toString(),
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail updating a new product because not authenticated as yourself', async(done) => {
        const pomme = {
          id: tabProducers[0].productsIds[0].toString(),
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[1].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });
    });

    // ----------------------deleteProduct(productId: ID!)-------------------------------------- //
    describe('Testing deleteProduct(productId: ID!)', () => {
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabProducers[0].id, email: tabProducers[0].email, isAdmin: tabProducers[0].isAdmin, kind: tabProducers[0].kind };
      });

      const { mutation } = {
        mutation: `
mutation($producerId: ID!, $productId: ID!) {
    deleteProduct(producerId: $producerId, productId: $productId) {
      description
      productType {
        name
        category {
          name
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
  }`
      };

      it('should delete a product', async(done) => {
        context = { id: tabProducers[2].id, email: tabProducers[2].email, isAdmin: tabProducers[2].isAdmin, kind: tabProducers[2].kind };
        const variables = { producerId: tabProducers[2].id, productId: tabProducers[2].productsIds[0].toString() };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.deleteProduct).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a product by id because invalid id received (too short)', async(done) => {
        context.id = 'abcdef';
        const variables = { producerId: tabProducers[0].id, productId: context.id };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a product by id because invalid id received (too long)', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = { producerId: tabProducers[0].id, productId: context.id };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a product by id because unknown id received', async(done) => {
        const variables = { producerId: tabProducers[0].id, productId: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.errors).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new product because not authenticated', async(done) => {
        const variables = { producerId: tabProducers[0].id, productId: tabProducers[0].productsIds[0].toString() };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new product because not authenticated as yourself', async(done) => {
        const variables = { producerId: tabProducers[1].id, productId: tabProducers[1].productsIds[0].toString() };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });
});
