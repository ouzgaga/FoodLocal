const productsServices = require('../services/products.services');
const producerServices = require('../services/producers.services');
const productTypeServices = require('../services/productType.services');
const productTypeCategoryServices = require('../services/productTypeCategory.services');


const productResolvers = {
  Query: {
    products: (parent, args, context) => productsServices.getProducts(),

    product: (parent, args, context) => productsServices.getProductById(args.productId),

    productTypes: (parent, args, context) => productTypeServices.getProductTypes(),

    productType: (parent, args, context) => productTypeServices.getProductTypeById(args.productTypeId),

    productTypesOfCategory: (parent, args, context) => productTypeServices.getProductTypeByCategory(args.productTypeCategoryId),

    productTypeCategories: (parent, args, context) => productTypeCategoryServices.getProductTypeCategories(),

    productTypeCategory: (parent, args, contet) => productTypeCategoryServices.getProductTypeCategoryById(args.productTypeCategoryId)

  },

  Mutation: {
    addProduct: (parent, args, context) => productsServices.addProduct(args.product),

    updateProduct: (parent, args, contet) => productsServices.updateProduct(args.product),

    deleteProduct: async(parent, args, context) => productsServices.deleteProduct(args.productId),

    addProductType: (parent, args, context) => productTypeServices.addProductType(args.productType),
    addProducerProducingThisProductType: (parent, args, context) => productTypeServices.addProducerProducingThisProductType(args.productTypeId, args.producerId),
    updateProductType: (parent, args, context) => productTypeServices.updateProductType(args.productType),
    deleteProductType: (parent, args, context) => productTypeServices.deleteProductType(args.productTypeId),

    addProductTypeCategory: (parent, args, context) => productTypeCategoryServices.addProductTypeCategory(args.productTypeCategory),
    updateProductTypeCategory: (parent, args, context) => productTypeCategoryServices.updateProductTypeCategory(args.productTypeCategory),
    deleteProductTypeCategory: (parent, args, context) => productTypeCategoryServices.deleteProductTypeCategory(args.productTypeCategoryId)
  },

  Product: {
    productType: (parent, args, context) => productTypeServices.getProductTypeById(parent.productTypeId)
  },

  ProductType: {
    category: (parent, args, context) => productTypeCategoryServices.getProductTypeCategoryById(parent.categoryId),
    producers: (parent, args, context) => producerServices.getAllProducersInReceivedIdList(parent.producersIds)
  }
};
module.exports = productResolvers;
