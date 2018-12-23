const ProducersModel = require('../../src/graphql/models/producers.modelgql');
const PersonModel = require('../../src/graphql/models/persons.modelgql');
const PersonRatingProducerModel = require('../../src/graphql/models/personRatingProducer.modelgql');
const UserModel = require('../../src/graphql/models/users.modelgql');
const SalespointsModel = require('../../src/graphql/models/salespoints.modelgql');
const TokensValidationEmailModel = require('../../src/graphql/models/tokensValidationEmail.modelgql');
const ProductsModel = require('../../src/graphql/models/products.modelgql');
const ProductTypesModel = require('../../src/graphql/models/productTypes.modelgql');
const ProductTypeCategoriesModel = require('../../src/graphql/models/productTypeCategories.modelgql');

const clearDB = async() => {
  await ProducersModel.deleteMany();
  await ProductsModel.deleteMany();
  await ProductTypesModel.deleteMany();
  await ProductTypeCategoriesModel.deleteMany();
  await PersonModel.deleteMany();
  await PersonRatingProducerModel.deleteMany();
  await UserModel.deleteMany();
  await SalespointsModel.deleteMany();
  await TokensValidationEmailModel.deleteMany();
};

module.exports = clearDB;
