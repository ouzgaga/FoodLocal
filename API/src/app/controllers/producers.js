const producersServices = require('../services/producers');


/**
 * Retourne tous les producteurs de la base de données.
 */
function getProducer(req, res, next) {
  producersServices.getProducer();
}


/**
 * Crée un nouveau producteur dans la base de données. Doublons 
 * autorisés!
 */
function addProducer(req, res, next) {
  producersServices.addProducer();
}


/**
 * Retourne le producteur correspondant à l'id reçu.
 */
function getProducerById(req, res, next) {
  producersServices.getProducerById();
}


/**
 * Met à jour le producteur possédant l'id reçu.
 */
function updateProducer(req, res, next) {
  producersServices.updateProducer();
}


/**
 * Supprime le producteur correspondant à l'id reçu.
 */
function deleteProducer(req, res, next) {
  producersServices.deleteProducer();
}

module.exports = {
  getProducer,
  addProducer,
  getProducerById,
  updateProducer,
  deleteProducer,
};
