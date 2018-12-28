const { personRatingProducersServices } = require('../services/personRatingProducers.services');
const { personsServices } = require('../services/persons.services');
const { producersServices } = require('../services/producers.services');
const { productsServices } = require('../services/products.services');
const { productTypesServices } = require('../services/productTypes.services');
const { productTypeCategoriesServices } = require('../services/productTypeCategories.services');
const { salespointsServices } = require('../services/salespoints.services');
const { tokenValidationEmailServices } = require('../services/tokenValidationEmail.services');
const { usersServices } = require('../services/users.services');

/*
module.exports.personRatingProducersServices = personRatingProducersServices;
module.exports.personsServices = personsServices;
module.exports.producersServices = producersServices;
module.exports.productsServices = productsServices;
module.exports.productTypesServices = productTypesServices;
module.exports.productTypeCategoriesServices = productTypeCategoriesServices;
module.exports.salespointsServices = salespointsServices;
module.exports.tokenValidationEmailServices = tokenValidationEmailServices;
module.exports.usersServices = usersServices;
 */
module.exports = {
  personRatingProducersServices,
  personsServices,
  producersServices,
  productsServices,
  productTypesServices,
  productTypeCategoriesServices,
  salespointsServices,
  tokenValidationEmailServices,
  usersServices
};
