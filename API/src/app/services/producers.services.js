const mongoose = require('mongoose');
const httpStatus = require('http-status');
require('../models/producers.model');

const Producers = mongoose.model('Producers');

/**
 * Retourne tous les producteurs de la base de données.
 */
function getProducer ({tag = undefined, skip = 0, limit = 50} = {}) {
  return Producers.find({tag}).sort({id: -1}).skip(+skip).limit(+limit).exec();
}

/**
 * Crée un nouveau producteur dans la base de données. Doublons
 * autorisés!
 */
function addProducer (bodyContent) {
  const producer = new Producers(bodyContent);

  return producer.save();
}

/**
 * Retourne le producteur correspondant à l'id reçu.
 */
function getProducerById ({id}) {
  return Producers.findById(id).exec();
}

/**
 * Met à jour le producteur possédant l'id reçu.
 */
function updateProducer (producerInfos) {
  return Producers.findByIdAndUpdate(producerInfos); // retourne l'objet modifié
  // return Producers.updateOne(producerInfos); // retourne un OK mais pas l'objet modifié
}

/**
 * Supprime le producteur correspondant à l'id reçu.
 */
function deleteProducer (idProducerToDelete) {
  return Producers.findByIdAndRemove(idProducerToDelete);
}

module.exports = {
  getProducer,
  addProducer,
  getProducerById,
  updateProducer,
  deleteProducer
};
