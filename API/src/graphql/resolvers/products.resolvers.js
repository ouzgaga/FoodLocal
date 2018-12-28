const productsServices = require('../services/products.services');
const producersServices = require('../services/producers.services');
const productTypesServices = require('../services/productTypes.services');
const productTypeCategoriesServices = require('../services/productTypeCategories.services');

const productResolvers = {
  Query: {
    products: (parent, args, context) => productsServices.getProducts(),

    product: (parent, args, context) => productsServices.getProductById(args.productId),

    productTypes: (parent, args, context) => productTypesServices.getProductTypes(),

    productType: (parent, args, context) => productTypesServices.getProductTypeById(args.productTypeId),

    productTypesOfCategory: (parent, args, context) => productTypesServices.getProductTypeByCategory(args.productTypeCategoryId),

    productTypeCategories: (parent, args, context) => productTypeCategoriesServices.getProductTypeCategories(),

    productTypeCategory: (parent, args, contet) => productTypeCategoriesServices.getProductTypeCategoryById(args.productTypeCategoryId)

  },

  Mutation: {
    addMultipleProducts: (parent, args, context) => productsServices.addAllProductsInArray(args.products, args.producerId),

    addProduct: (parent, args, context) => productsServices.addProduct(args.product, args.producerId),

    updateProduct: (parent, args, contet) => productsServices.updateProduct(args.product),

    deleteProduct: async(parent, args, context) => productsServices.deleteProduct(args.productId),

    addProductType: (parent, args, context) => productTypesServices.addProductType(args.productType),
    // addProducerProducingThisProductType: (parent, args, context) => productTypesServices.addProducerProducingThisProductType(args.productTypeId,
    // args.producerId),
    updateProductType: (parent, args, context) => productTypesServices.updateProductType(args.productType),
    deleteProductType: (parent, args, context) => productTypesServices.deleteProductType(args.productTypeId),

    addProductTypeCategory: (parent, args, context) => productTypeCategoriesServices.addProductTypeCategory(args.productTypeCategory),
    updateProductTypeCategory: (parent, args, context) => productTypeCategoriesServices.updateProductTypeCategory(args.productTypeCategory),
    deleteProductTypeCategory: (parent, args, context) => productTypeCategoriesServices.deleteProductTypeCategory(args.productTypeCategoryId)
  },

  Product: {
    productType: (parent, args, context) => productTypesServices.getProductTypeById(parent.productTypeId)
  },

  ProductType: {
    category: (parent, args, context) => productTypeCategoriesServices.getProductTypeCategoryById(parent.categoryId),
    producers: (parent, args, context) => producersServices.getAllProducersInReceivedIdList(parent.producersIds)
  }
};
module.exports = productResolvers;
