const PersonRatingProducerModel = require('../../src/graphql/models/personRatingProducers.modelgql');
const PersonModel = require('../../src/graphql/models/persons.modelgql');
const ProducersModel = require('../../src/graphql/models/producers.modelgql');
const ProductsModel = require('../../src/graphql/models/products.modelgql');
const ProductTypeCategoriesModel = require('../../src/graphql/models/productTypeCategories.modelgql');
const ProductTypesModel = require('../../src/graphql/models/productTypes.modelgql');
const SalespointsModel = require('../../src/graphql/models/salespoints.modelgql');
const TokensValidationEmailModel = require('../../src/graphql/models/tokenValidationEmail.modelgql');
const UserModel = require('../../src/graphql/models/users.modelgql');

const clearDB = async() => {
  await PersonRatingProducerModel.deleteMany();
  await PersonModel.deleteMany();
  await ProducersModel.deleteMany();
  await ProductsModel.deleteMany();
  await ProductTypeCategoriesModel.deleteMany();
  await ProductTypesModel.deleteMany();
  await SalespointsModel.deleteMany();
  await TokensValidationEmailModel.deleteMany();
  await UserModel.deleteMany();
};

module.exports = clearDB;
