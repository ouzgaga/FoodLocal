const getAllProductTypeCategories = {
  query: 'query{ productTypeCategories{ name image } }',
  variables: {},
  context: {}
};

const getProductTypeCategoryById = {
  query: 'query($id:ID!){ productTypeCategory(productTypeCategoryId: $id){ name image } }',
  variables: {},
  context: {}
};

const addProductTypeCategoryById = {
  mutation: 'mutation($productTypeCategory: ProductTypeCategoryInputAdd!) {'
            + '  addProductTypeCategory(productTypeCategory: $productTypeCategory) {'
            + '    name'
            + '    image'
            + '  }'
            + '}',
  variables: {},
  context: {}
};

const updateProductTypeCategory = {
  mutation: 'mutation($productTypeCategory: ProductTypeCategoryInputUpdate!) {'
            + '  updateProductTypeCategory(productTypeCategory: $productTypeCategory) {'
            + '    name'
            + '    image'
            + '  }'
            + '}',
  variables: {},
  context: {}
};

const deleteProductTypeCategory = {
  mutation: 'mutation($id: ID!) {'
            + '  deleteProductTypeCategory(productTypeCategoryId: $id) {'
            + '    name'
            + '    image'
            + '  }'
            + '}'
            + '',
  variables: {},
  context: {}
};

module.exports = {
  getAllProductTypeCategories,
  getProductTypeCategoryById,
  addProductTypeCategoryById,
  updateProductTypeCategory,
  deleteProductTypeCategory
};
