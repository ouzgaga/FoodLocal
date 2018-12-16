const ProducersModel = require('../../src/graphql/models/producers.modelgql');
const PersonModel = require('../../src/graphql/models/persons.modelgql');
const PersonRatingProducerModel = require('../../src/graphql/models/personRatingProducer.modelgql');
const UserModel = require('../../src/graphql/models/users.modelgql');
const SalespointsModel = require('../../src/graphql/models/salespoints.modelgql');
const TokensValidationEmailModel = require('../../src/graphql/models/tokensValidationEmail.modelgql');
const { Products: ProductModel, ProductType: ProductTypeModel, ProductTypeCategory: ProductTypeCategoryModel } = require(
  '../../src/graphql/models/products.modelgql'
);

const clearDB = async() => {
  await ProducersModel.deleteMany();
  await ProductModel.deleteMany();
  await ProductTypeModel.deleteMany();
  await ProductTypeCategoryModel.deleteMany();
  await PersonModel.deleteMany();
  await PersonRatingProducerModel.deleteMany();
  await UserModel.deleteMany();
  await SalespointsModel.deleteMany();
  await TokensValidationEmailModel.deleteMany();
};

module.exports = clearDB;
