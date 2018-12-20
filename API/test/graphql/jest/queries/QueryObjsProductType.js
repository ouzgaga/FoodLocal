const getAllProductTypes = {
  query: 'query{'
         + '  productTypes{'
         + '    name'
         + '    image'
         + '    category{'
         + '      name'
         + '      image'
         + '    }'
         + '    producers{'
         + '      firstname'
         + '      lastname'
         + '      email'
         + '    }'
         + '  }'
         + '}',
  variables: {},
  context: {}
};

const getProductTypeById = {
  query: 'query ($id: ID!){'
         + '  productType(productTypeId: $id){'
         + '    name'
         + '    image'
         + '    category{'
         + '      name'
         + '      image'
         + '    }'
         + '    producers{'
         + '      firstname'
         + '      lastname'
         + '      email'
         + '    }'
         + '  }'
         + '}',
  variables: {},
  context: {}
};

const getAllProductTypeOfProductTypeCategoryId = {
  query: 'query ($id: ID!){'
         + '  productTypesOfCategory(productTypeCategoryId: $id) {'
         + '    name'
         + '    image'
         + '    category {'
         + '      name'
         + '      image'
         + '    }'
         + '    producers{'
         + '      firstname'
         + '      lastname'
         + '      email'
         + '    }'
         + '  }'
         + '}',
  variables: {},
  context: {}
};

const addProductType = {
  mutation: 'mutation($productType: ProductTypeInputAdd!) {'
            + '  addProductType(productType: $productType) {'
            + '    name'
            + '    image'
            + '  }'
            + '}',
  variables: {},
  context: {}
};

const updateProductType = {
  mutation: 'mutation($productType: ProductTypeInputUpdate!) {'
            + '  updateProductType(productType: $productType) {'
            + '    name'
            + '    image'
            + '  }'
            + '}',
  variables: {},
  context: {}
};

const deleteProductType = {
  mutation: 'mutation($id: ID!) {'
            + '  deleteProductType(productTypeId: $id) {'
            + '    name'
            + '    image'
            + '  }'
            + '}'
            + '',
  variables: {},
  context: {}
};

module.exports = {
  getAllProductTypes,
  getProductTypeById,
  getAllProductTypeOfProductTypeCategoryId,
  addProductType,
  updateProductType,
  deleteProductType
};
