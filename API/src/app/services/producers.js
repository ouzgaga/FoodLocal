const httpStatus = require('http-status');
const producersModel = require('../models/producers');


/**
 * Retourne tous les producteurs de la base de données.
 */
function getProducer(req, res, next) {
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
   * @param {Integer} req .limit Nombre maximum de producteurs à retourner.
   * @param {Integer} req .page Numéro de la page à retourner. Permet par exemple de récupérer la 3ème page de 20 producteurs, soit les producteurs 41 à 60.
   */
  const requestOptions = {
                      };

                       return producersModel.getProducer(requestOptions )
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
 * Crée un nouveau producteur dans la base de données. Doublons 
 * autorisés!
 */
function addProducer(req, res, next) {
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

                       return producersModel.addProducer(requestOptions )
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
 * Retourne le producteur correspondant à l'id reçu.
 */
function getProducerById(req, res, next) {
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
   * @param {Integer} req .id L&#x27;id du producteur à récupérer.
   */
  const requestOptions = {
                      };

                       return producersModel.getProducerById(requestOptions )
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
 * Met à jour le producteur possédant l'id reçu.
 */
function updateProducer(req, res, next) {
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
   * @param {Integer} req .id l&#x27;id du producteur à mettre à jour.
   */
  const requestOptions = {
                      };

                       return producersModel.updateProducer(requestOptions )
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
 * Supprime le producteur correspondant à l'id reçu.
 */
function deleteProducer(req, res, next) {
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
   * @param {Integer} req .id L&#x27;id du producteur à supprimer.
   */
  const requestOptions = {
                      };

                       return producersModel.deleteProducer(requestOptions )
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
  getProducer,
  addProducer,
  getProducerById,
  updateProducer,
  deleteProducer,
        };
