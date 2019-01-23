const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const snapshot = require('snap-shot-it');
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
      it('should get all products', async() => {
        const { query } = {
          query: `
            query {
              products {
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
                edges {
                  cursor
                  node {
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
              }
            }`
        };
        const result = await graphql(schema, query, null, {}, null);

        snapshot(result);
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

      it('should get a product by id', async() => {
        const variables = { productId: tabProducers[2].productsIds[0].toString() };
        const result = await graphql(schema, query, null, {}, variables);

        expect(result.data.product).to.be.not.null;
      });

      it('should fail getting a product by id because invalid id received (too short)', async() => {
        const variables = { productId: 'abcdef' };
        const result = await graphql(schema, query, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Cast to ObjectId failed for value "abcdef" at path "_id" for model "products"');
      });

      it('should fail getting a product by id because invalid id received (too long)', async() => {
        const variables = { productId: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message)
          .to.be.contains('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "products"');
      });

      it('should fail getting a product by id because unknown id received', async() => {
        const variables = { productId: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, {}, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
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
                cursor
              }
            }
          }`
      };

      it('should add multiple new products (with and without description)', async() => {
        const variables = { producerId: tabProducers[0].id, products };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.addMultipleProducts).to.be.not.null;
        snapshot(result);
      });

      it('should fail adding multiple new products because one is missing productTypeId', async() => {
        products[0] = {
          description: 'Une Pomme monnnnstre bonne!'
        };

        const variables = { producerId: tabProducers[0].id, products };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value[0].productTypeId of required type ID! was not provided.');
      });

      it('should fail adding multiple new products because one has a field "rienAVoir" that is not defined in schema', async() => {
        products[0] = {
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id,
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { producerId: tabProducers[0].id, products };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field "rienAVoir" is not defined by type ProductInputAdd at value[0].');
      });

      it('should fail adding a new product because not authenticated', async() => {
        const variables = { producerId: tabProducers[0].id, products };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail adding a new product because not authenticated as yourself', async() => {
        const variables = { producerId: tabProducers[1].id, products };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('You can\'t modify information of another user than yourself!');
        snapshot(result);
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

      it('should add a new product with a description', async() => {
        const pomme = {
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.addProduct).to.be.not.null;
        snapshot(result);
      });

      it('should add a new product without description', async() => {
        const pomme = {
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.addProduct).to.be.not.null;
        snapshot(result);
      });

      it('should fail adding a new product because missing productTypeId', async() => {
        const pomme = {
          description: 'Une Pomme monnnnstre bonne!'
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.productTypeId of required type ID! was not provided.');
      });

      it('should fail adding a new product because given field "rienAVoir" is not defined in schema', async() => {
        const pomme = {
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id,
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field "rienAVoir" is not defined by type ProductInputAdd.');
      });

      it('should fail adding a new product because not authenticated', async() => {
        const pomme = {
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail adding a new product because not authenticated as yourself', async() => {
        const pomme = {
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[1].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('You can\'t modify information of another user than yourself!');
        snapshot(result);
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

      it('should update a product', async() => {
        const pomme = {
          id: tabProducers[0].productsIds[0].toString(),
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.updateProduct).to.be.not.null;
        snapshot(result);
      });

      it('should fail updating a product because missing productTypeId', async() => {
        const pomme = {
          id: tabProducers[0].productsIds[0].toString(),
          description: 'Une Pomme monnnnstre bonne!'
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.productTypeId of required type ID! was not provided.');
      });

      it('should fail updating a product because given field "rienAVoir" is not defined in schema', async() => {
        const pomme = {
          id: tabProducers[0].productsIds[0].toString(),
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id,
          rienAVoir: 'ceci est un champ qui n\'a rien à faire ici!'
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field "rienAVoir" is not defined by type ProductInputUpdate.');
      });

      it('should fail updating a new product because not authenticated', async() => {
        const pomme = {
          id: tabProducers[0].productsIds[0].toString(),
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[0].id, product: pomme };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail updating a new product because not authenticated as yourself', async() => {
        const pomme = {
          id: tabProducers[0].productsIds[0].toString(),
          description: 'Une Pomme monnnnstre bonne!',
          productTypeId: tabProductTypes[18].id
        };

        const variables = { producerId: tabProducers[1].id, product: pomme };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('You can\'t modify information of another user than yourself!');
        snapshot(result);
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

      it('should delete a product', async() => {
        context = { id: tabProducers[2].id, email: tabProducers[2].email, isAdmin: tabProducers[2].isAdmin, kind: tabProducers[2].kind };
        const variables = { producerId: tabProducers[2].id, productId: tabProducers[2].productsIds[0].toString() };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.deleteProduct).to.be.not.null;
      });

      it('should fail deleting a product by id because invalid id received (too short)', async() => {
        context.id = 'abcdef';
        const variables = { producerId: tabProducers[0].id, productId: context.id };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail deleting a product by id because invalid id received (too long)', async() => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = { producerId: tabProducers[0].id, productId: context.id };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail deleting a product by id because unknown id received', async() => {
        const variables = { producerId: tabProducers[0].id, productId: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        snapshot(result);
      });

      it('should fail adding a new product because not authenticated', async() => {
        const variables = { producerId: tabProducers[0].id, productId: tabProducers[0].productsIds[0].toString() };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail adding a new product because not authenticated as yourself', async() => {
        const variables = { producerId: tabProducers[1].id, productId: tabProducers[1].productsIds[0].toString() };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('You can\'t modify information of another user than yourself!');
        snapshot(result);
      });
    });
  });
});
