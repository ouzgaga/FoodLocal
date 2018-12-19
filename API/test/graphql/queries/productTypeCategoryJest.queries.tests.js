const { makeExecutableSchema } = require('graphql-tools');
const { graphql } = require('graphql');
const { resolvers, schema: typeDefs } = require('../../../src/graphql/graphqlConfig');
const producersServices = require('../../../src/graphql/services/producers.services');
const clearDB = require('../clearDB');
const { ProductTypeCategory: ProductTypeCategoryModel } = require('../../../src/graphql/models/products.modelgql');

const { queryObjAllProducers, queryObjProducerWithCorrectId } = require('./Objects/QueryObjsProducers');

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
let tabProductTypeCategory = [];

const beforeEachFunc = () => async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------

  fruits = (await ProductTypeCategoryModel.create(fruits)).toObject();
  legumes = (await ProductTypeCategoryModel.create(legumes)).toObject();
  viande = (await ProductTypeCategoryModel.create(viande)).toObject();
  pain = (await ProductTypeCategoryModel.create(pain)).toObject();

  tabProductTypeCategory = [fruits, legumes, viande, pain];
};

// make the actual schema and resolvers executable
const schema = makeExecutableSchema({ typeDefs, resolvers });

describe('Integration tests for productTypeCategory', () => {
  beforeEach(beforeEachFunc());

  describe('tests of Queries', () => {
    // pas besoin de repopuler la DB entre les queries puisqu'on ne modifie pas la DB!
    describe('tests productTypeCategories', () => {
      it('should get all productTypeCategories', async() => {
        const query = 'query{ productTypeCategories{ id name image } }';
        const expected = {
          data: {
            productTypeCategories: [
              {
                id: fruits.id,
                name: 'Fruits',
                image: 'ceci est une image de fruits encodée en base64!'
              },
              {
                id: legumes.id,
                name: 'Légumes',
                image: 'ceci est une image de légumes encodée en base64!'
              },
              {
                id: viande.id,
                name: 'Viande',
                image: 'ceci est une image de viande encodée en base64!'
              },
              {
                id: pain.id,
                name: 'Pain',
                image: 'ceci est une image de pain encodée en base64!'
              }
            ]
          }
        };
        const result = await graphql(schema, query, null, context, null);
        expect(result).toBe(expected);
      });
    });

    describe('tests productTypeCategory', () => {
      it('should get the productTypeCategory corresponding to the received id', async() => {
        const query = 'query($id:ID!){ productTypeCategory(productTypeCategoryId: $id){ id name image } }';
        const expected = {
          data: {
            productTypeCategory: {
              id: fruits.id,
              name: 'Fruits',
              image: 'ceci est une image de fruits encodée en base64!'
            }
          }
        };
        const result = await graphql(schema, query, null, context, { id: fruits.id });
        return result.should.be.eql(expected);
      });

      it('should fail getting a productTypeCategory because received id is invalid (too short)', async() => {
        const query = 'query($id:ID!){ productTypeCategory(productTypeCategoryId: $id){ id name image } }';
        const expected = {
          data: {
            productTypeCategory: null
          },
          errors: [
            {
              locations: [
                {
                  column: 17,
                  line: 1
                }
              ],
              message: 'Received productTypeCategory.id is invalid!',
              path: [
                'productTypeCategory'
              ]
            }
          ]
        };
        const result = await graphql(schema, query, null, context, { id: 'abcdef' });
        return result.should.be.eql(expected);
      });

      it('should fail getting a productTypeCategory because received id is invalid (too long)', async() => {
        const query = 'query($id:ID!){ productTypeCategory(productTypeCategoryId: $id){ id name image } }';
        const expected = {
          data: {
            productTypeCategory: null
          },
          errors: [
            {
              locations: [
                {
                  column: 17,
                  line: 1
                }
              ],
              message: 'Received productTypeCategory.id is invalid!',
              path: [
                'productTypeCategory'
              ]
            }
          ]
        };
        const result = await graphql(schema, query, null, context, { id: 'abcdef' });
        return result.should.be.eql(expected);
      });

      it('should fail getting a productTypeCategory because received id is unknown', async() => {
        const query = 'query($id:ID!){ productTypeCategory(productTypeCategoryId: $id){ id name image } }';
        const expected = {
          data: {
            productTypeCategory: null
          }
        };
        const result = await graphql(schema, query, null, context, { id: 'abcdefabcdefabcdefabcdef' });
        return result.should.be.eql(expected);
      });
    });
  });

  describe('tests of Mutations', () => {
    beforeEach(beforeEachFunc());

    describe('tests addProductTypeCategory', () => {
      it('should add a new productTypeCategory', async() => {
        const query = 'query{ productTypeCategories{ id name image } }';
        const expected = {
          data: {
            productTypeCategories: [
              {
                id: fruits.id,
                name: 'Fruits',
                image: 'ceci est une image de fruits encodée en base64!'
              },
              {
                id: legumes.id,
                name: 'Légumes',
                image: 'ceci est une image de légumes encodée en base64!'
              },
              {
                id: viande.id,
                name: 'Viande',
                image: 'ceci est une image de viande encodée en base64!'
              },
              {
                id: pain.id,
                name: 'Pain',
                image: 'ceci est une image de pain encodée en base64!'
              }
            ]
          }
        };
        const result = await graphql(schema, query, null, context, null);
        return result.should.be.eql(expected);
      });
    });

    describe('tests updateProductTypeCategory', () => {
      it('should get the productTypeCategory corresponding to the received id', async() => {
        const query = 'query($id:ID!){ productTypeCategory(productTypeCategoryId: $id){ id name image } }';
        const expected = {
          data: {
            productTypeCategory: {
              id: fruits.id,
              name: 'Fruits',
              image: 'ceci est une image de fruits encodée en base64!'
            }
          }
        };
        const result = await graphql(schema, query, null, context, { id: fruits.id });
        return result.should.be.eql(expected);
      });

      it('should fail getting a productTypeCategory because received id is invalid (too short)', async() => {
        const query = 'query($id:ID!){ productTypeCategory(productTypeCategoryId: $id){ id name image } }';
        const expected = {
          data: {
            productTypeCategory: null
          },
          errors: [
            {
              locations: [
                {
                  column: 17,
                  line: 1
                }
              ],
              message: 'Received productTypeCategory.id is invalid!',
              path: [
                'productTypeCategory'
              ]
            }
          ]
        };
        const result = await graphql(schema, query, null, context, { id: 'abcdef' });
        return result.should.be.eql(expected);
      });

      it('should fail getting a productTypeCategory because received id is invalid (too long)', async() => {
        const query = 'query($id:ID!){ productTypeCategory(productTypeCategoryId: $id){ id name image } }';
        const expected = {
          data: {
            productTypeCategory: null
          },
          errors: [
            {
              locations: [
                {
                  column: 17,
                  line: 1
                }
              ],
              message: 'Received productTypeCategory.id is invalid!',
              path: [
                'productTypeCategory'
              ]
            }
          ]
        };
        const result = await graphql(schema, query, null, context, { id: 'abcdef' });
        return result.should.be.eql(expected);
      });

      it('should fail getting a productTypeCategory because received id is unknown', async() => {
        const query = 'query($id:ID!){ productTypeCategory(productTypeCategoryId: $id){ id name image } }';
        const expected = {
          data: {
            productTypeCategory: null
          }
        };
        const result = await graphql(schema, query, null, context, { id: 'abcdefabcdefabcdefabcdef' });
        return result.should.be.eql(expected);
      });
    });
  });


});
