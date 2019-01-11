const NotificationsModel = require('../../src/graphql/models/notifications.modelgql');
const PersonNotificationsModel = require('../../src/graphql/models/personNotifications.modelgql');
const PersonRatingProducersModel = require('../../src/graphql/models/personRatingProducers.modelgql');
const PersonsModel = require('../../src/graphql/models/persons.modelgql');
const PostsModel = require('../../src/graphql/models/posts.modelgql');
const ProducersModel = require('../../src/graphql/models/producers.modelgql');
const ProductsModel = require('../../src/graphql/models/products.modelgql');
const ProductTypeCategoriesModel = require('../../src/graphql/models/productTypeCategories.modelgql');
const ProductTypesModel = require('../../src/graphql/models/productTypes.modelgql');
const { SalespointsModel } = require('../../src/graphql/models/salespoints.modelgql');
const TokensValidationEmailModel = require('../../src/graphql/models/tokenValidationEmail.modelgql');
const UserModel = require('../../src/graphql/models/users.modelgql');

const clearDB = async() => {
  await NotificationsModel.deleteMany();
  await PersonNotificationsModel.deleteMany();
  await PersonRatingProducersModel.deleteMany();
  await PersonsModel.deleteMany();
  await PostsModel.deleteMany();
  await ProducersModel.deleteMany();
  await ProductsModel.deleteMany();
  await ProductTypeCategoriesModel.deleteMany();
  await ProductTypesModel.deleteMany();
  await SalespointsModel.deleteMany();
  await TokensValidationEmailModel.deleteMany();
  await UserModel.deleteMany();
};

module.exports = clearDB;
