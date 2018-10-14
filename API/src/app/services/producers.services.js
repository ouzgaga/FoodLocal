const mongoose = require('mongoose');
require('../models/producers.model');

const Producer = mongoose.model('Producer');

/**
 * Retourne tous les producteurs de la base de données.
 */
function getProducer({ tag = '', skip = 0, limit = 50 } = {}) {
  //return Producer.find({ tag }).sort({ id: -1 }).skip(+skip).limit(+limit).exec();
  return Producer.find().exec();
}

/**
 * Crée un nouveau producteur dans la base de données. Doublons
 * autorisés!
 */
function addProducer(bodyContent) {
  const producer = new Producer(bodyContent);

  return producer.save();
}

/**
 * Retourne le producteur correspondant à l'id reçu.
 */
function getProducerById({ id }) {
  return Producer.findById(id).exec();
}

/**
 * Met à jour le producteur possédant l'id reçu.
 */
function updateProducer(requestOptions) {
  return Producer.updateProducer(requestOptions);
}

/**
 * Supprime le producteur correspondant à l'id reçu.
 */
function deleteProducer(requestOptions) {
  return Producer.deleteProducer(requestOptions);
}

module.exports = {
  getProducer,
  addProducer,
  getProducerById,
  updateProducer,
  deleteProducer
};
