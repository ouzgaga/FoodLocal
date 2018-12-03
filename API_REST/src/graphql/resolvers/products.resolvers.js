const producersServices = require('../services/producers.services');
const productsServices = require('../services/products.services');
const productTypeServices = require('../services/productType.services');
const productTypeCategoryServices = require('../services/productTypeCategory.services');
const usersServices = require('../services/users.services');
const salesPointsServices = require('../services/salespoints.services');
const Producers = require('../models/producers.modelgql');
const SalesPoint = require('../models/salespoints.modelgql');


const productResolvers = {
  Query: {
    products: () => productsServices.getProducts(),

    product: (parent, args, context) => productsServices.getProductById(args.product),

    productTypes: () => productTypeServices.getProductTypes(),

    productType: (parent, args, contet) => productTypeServices.getProductTypeById(args.productType),

    productTypeCategories: () => productTypeCategoryServices.getProductsCategories(),

    productTypeCategory: (parent, args, contet) => productTypeCategoryServices.getProductTypeCategoryById(args.productTypeCategory)

  },

  Mutation: {
    addProduct: (parent, args, context) => productsServices.addProduct(args.product),

    updateProduct: (parent, args, contet) => productsServices.updateProduct(args.product),

    deleteProduct: async(parent, args, context) => productsServices.deleteProduct(args.product),

    addProductType: (parent, args, context) => productTypeServices.addProductType(args.productType),
    updateProductType: (parent, args, context) => productTypeServices.updateProductType(args.productType),
    deleteProductType: (parent, args, context) => productTypeServices.deleteProductType(args.productType),

    addProductTypeCategory: (parent, args, context) => productTypeCategoryServices.addProductTypeCategory(args.productTypeCategory),
    updateProductTypeCategory: (parent, args, context) => productTypeCategoryServices.updateProductTypeCategory(args.productTypeCategory),
    deleteProductTypeCategory: (parent, args, context) => productTypeCategoryServices.deleteProductTypeCategory(args.productTypeCategory)
  },

  Product: {
    productType: (parent, args, context) => productTypeServices.getProductTypeById(parent.productType)
  },

  ProductType: {
    category: (parent, args, context) => productTypeCategoryServices.getProductTypeCategoryById(parent.category)
  }
};
module.exports = productResolvers;
