const httpStatus = require('http-status');
const productsModel = require('../models/products');


/**
 * Retourne tous les produits de la base de données.
 */
function getProducts(req, res, next) {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new Error({
  //   status: httpStatus.INTERNAL_SERVER_ERROR, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  /**
   * @param {Object} req
   * @param {Array} req .tags Tags à utiliser pour filtrer les résultats.
   * @param {Integer} req .limit Nombre maximum de produits à retourner.
   * @param {Integer} req .page Numéro de la page à retourner. Permet par exemple de récupérer la 3ème page de 20 produits, soit les produits 41 à 60.
   */
  const requestOptions = {
                      };

                       return productsModel.getProducts(requestOptions )
                      .then((result) => {
                          res.status(result.status || httpStatus.OK).send(result.data);
                          })
                       .catch(err =>
                                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                                                                                    status: httpStatus.INTERNAL_SERVER_ERROR,
                                                                                    title: 'Server error',
                                                                                    error: err.message
                                                                                  }));

}


/**
 * Ajoute un nouveau produit dans la base de données. Doublons 
 * autorisés!
 */
function addProduct(req, res, next) {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new Error({
  //   status: httpStatus.INTERNAL_SERVER_ERROR, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  /**
   * @param {Object} req
   */
  const requestOptions = {
                      };

                       return productsModel.addProduct(requestOptions )
                      .then((result) => {
                          res.status(result.status || httpStatus.OK).send(result.data);
                          })
                       .catch(err =>
                                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                                                                                    status: httpStatus.INTERNAL_SERVER_ERROR,
                                                                                    title: 'Server error',
                                                                                    error: err.message
                                                                                  }));

}


/**
 * Retourne le produit correspondant à l'id reçu.
 */
function getProductById(req, res, next) {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new Error({
  //   status: httpStatus.INTERNAL_SERVER_ERROR, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  /**
   * @param {Object} req
   * @param {Integer} req .id l&#x27;id du produit à récupérer
   */
  const requestOptions = {
                      };

                       return productsModel.getProductById(requestOptions )
                      .then((result) => {
                          res.status(result.status || httpStatus.OK).send(result.data);
                          })
                       .catch(err =>
                                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                                                                                    status: httpStatus.INTERNAL_SERVER_ERROR,
                                                                                    title: 'Server error',
                                                                                    error: err.message
                                                                                  }));

}


/**
 * Met à jour le produit possédant l'id reçu.
 */
function updateProduct(req, res, next) {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new Error({
  //   status: httpStatus.INTERNAL_SERVER_ERROR, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  /**
   * @param {Object} req
   * @param {Integer} req .id l&#x27;id du produit à mettre à jour.
   */
  const requestOptions = {
                      };

                       return productsModel.updateProduct(requestOptions )
                      .then((result) => {
                          res.status(result.status || httpStatus.OK).send(result.data);
                          })
                       .catch(err =>
                                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                                                                                    status: httpStatus.INTERNAL_SERVER_ERROR,
                                                                                    title: 'Server error',
                                                                                    error: err.message
                                                                                  }));

}


/**
 * Supprime le produit correspondant à l'id reçu.
 */
function deleteProduct(req, res, next) {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new Error({
  //   status: httpStatus.INTERNAL_SERVER_ERROR, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  /**
   * @param {Object} req
   * @param {Integer} req .id l&#x27;id du produit à supprimer
   */
  const requestOptions = {
                      };

                       return productsModel.deleteProduct(requestOptions )
                      .then((result) => {
                          res.status(result.status || httpStatus.OK).send(result.data);
                          })
                       .catch(err =>
                                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                                                                                    status: httpStatus.INTERNAL_SERVER_ERROR,
                                                                                    title: 'Server error',
                                                                                    error: err.message
                                                                                  }));

}


  module.exports = {
  getProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
        };
