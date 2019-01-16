const { isAuthenticatedAsProducerAndIsYourself, isAuthenticatedAsAdmin } = require('./authorization.resolvers');
const productsServices = require('../services/products.services');
const producersServices = require('../services/producers.services');
const productTypesServices = require('../services/productTypes.services');
const productTypeCategoriesServices = require('../services/productTypeCategories.services');

const productResolvers = {
  Query: {
    // --------------------------------------------------------- Products ---------------------------------------------------------
    products: (parent, args, context) => productsServices.getProducts(),

    product: (parent, args, context) => productsServices.getProductById(args.productId),

    // --------------------------------------------------------- ProductType ---------------------------------------------------------
    productTypes: (parent, args, context) => productTypesServices.getProductTypes(),

    productType: (parent, args, context) => productTypesServices.getProductTypeById(args.productTypeId),

    // --------------------------------------------------------- ProductTypeCategory ---------------------------------------------------------
    productTypesOfCategory: (parent, args, context) => productTypesServices.getProductTypeByCategory(args.productTypeCategoryId),

    productTypeCategories: (parent, args, context) => productTypeCategoriesServices.getProductTypeCategories(),

    productTypeCategory: (parent, args, contet) => productTypeCategoriesServices.getProductTypeCategoryById(args.productTypeCategoryId)

  },

  Mutation: {
    // --------------------------------------------------------- Products ---------------------------------------------------------
    addMultipleProducts: async(parent, args, context) => {
      await isAuthenticatedAsProducerAndIsYourself(context.id, args.producerId, context.kind);
      return productsServices.addAllProductsInArray(args.products, args.producerId);
    },
    addProduct: async(parent, args, context) => {
      await isAuthenticatedAsProducerAndIsYourself(context.id, args.producerId, context.kind);
      return productsServices.addProduct(args.product, args.producerId);
    },
    updateProduct: async(parent, args, context) => {
      await isAuthenticatedAsProducerAndIsYourself(context.id, args.producerId, context.kind);
      return productsServices.updateProduct(args.product);
    },
    deleteProduct: async(parent, args, context) => {
      await isAuthenticatedAsProducerAndIsYourself(context.id, args.producerId, context.kind);
      return productsServices.deleteProduct(args.productId, context.id);
    },

    // --------------------------------------------------------- ProductTypes ---------------------------------------------------------
    addProductType: async(parent, args, context) => {
      await isAuthenticatedAsAdmin(context.id, context.isAdmin);
      return productTypesServices.addProductType(args.productType);
    },
    updateProductType: async(parent, args, context) => {
      await isAuthenticatedAsAdmin(context.id, context.isAdmin);
      return productTypesServices.updateProductType(args.productType);
    },
    deleteProductType: async(parent, args, context) => {
      await isAuthenticatedAsAdmin(context.id, context.isAdmin);
      return productTypesServices.deleteProductType(args.productTypeId);
    },

    // --------------------------------------------------------- ProductTypeCategory ---------------------------------------------------------
    addProductTypeCategory: async(parent, args, context) => {
      await isAuthenticatedAsAdmin(context.id, context.isAdmin);
      return productTypeCategoriesServices.addProductTypeCategory(args.productTypeCategory);
    },
    updateProductTypeCategory: async(parent, args, context) => {
      await isAuthenticatedAsAdmin(context.id, context.isAdmin);
      return productTypeCategoriesServices.updateProductTypeCategory(args.productTypeCategory);
    },
    deleteProductTypeCategory: async(parent, args, context) => {
      await isAuthenticatedAsAdmin(context.id, context.isAdmin);
      return productTypeCategoriesServices.deleteProductTypeCategory(args.productTypeCategoryId);
    }
  },

  Product: {
    id: (parent, args, context) => parent._id.toString(),

    productType: (parent, args, context) => productTypesServices.getProductTypeById(parent.productTypeId)
  },

  ProductType: {
    category: (parent, args, context) => productTypeCategoriesServices.getProductTypeCategoryById(parent.categoryId),
    producers: (parent, args, context) => producersServices.getAllProducersInReceivedIdList(parent.producersIds)
  },

  ProductTypeConnection: {
    totalCount: (parent, args, context) => productTypesServices.countNbProductTypesInDB()
  },

  ProductTypeOfCategoryConnection: {
    totalCount: (parent, args, context) => productTypesServices.countNbProductTypesInDB({ categoryId: parent.edges[0].node.categoryId })
  },

  ProductTypeCategoryConnection: {
    totalCount: (parent, args, context) => productTypeCategoriesServices.countNbProductTypeCategoriesInDB()
  }
};
module.exports = productResolvers;
