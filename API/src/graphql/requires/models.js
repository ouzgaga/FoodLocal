const { PersonRatingProducersModel } = require('../models/personRatingProducers.modelgql');
const { PersonsModel } = require('../models/persons.modelgql');
const { ProducersModel } = require('../models/producers.modelgql');
const { ProductsModel } = require('../models/products.modelgql');
const { ProductTypesModel } = require('../models/productTypes.modelgql');
const { ProductTypeCategoriesModel } = require('../models/productTypeCategories.modelgql');
const { SalespointsModel } = require('../models/salespoints.modelgql');
const { TokenValidationEmailModel } = require('../models/tokenValidationEmail.modelgql');
const { UsersModel } = require('../models/users.modelgql');

/*
module.exports.PersonRatingProducersModel = PersonRatingProducersModel;
module.exports.PersonsModel = PersonsModel;
module.exports.ProducersModel = ProducersModel;
module.exports.ProductsModel = ProductsModel;
module.exports.ProductTypesModel = ProductTypesModel;
module.exports.ProductTypeCategoriesModel = ProductTypeCategoriesModel;
module.exports.SalespointsModel = SalespointsModel;
module.exports.TokenValidationEmailModel = TokenValidationEmailModel;
module.exports.UsersModel = UsersModel;
*/

module.exports = {
  PersonRatingProducersModel,
  PersonsModel,
  ProducersModel,
  ProductsModel,
  ProductTypesModel,
  ProductTypeCategoriesModel,
  SalespointsModel,
  TokenValidationEmailModel,
  UsersModel
};
