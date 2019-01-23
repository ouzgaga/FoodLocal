module.exports = {
  getAllRatingsAboutProducerWithId,
  getRatingAboutProducerIdMadeByPersonId,
  getAllRatingsMadeByPersonWithId,
  countNbRatingsMadeByPersonWithId,
  countNbRatingsAboutProducerWithId,
  addOrUpdatePersonRatingProducer,
  deletePersonRatingProducer
};

const PersonRatingProducersModel = require('../models/personRatingProducers.modelgql');

/**
 * Retourne tous les votes concernant le producteur correspondant à l'id producerId.
 * @param producerId, l'id du producteur dont on souhaite récupérer tous les votes le concernant.
 * @returns {*}
 */
function getAllRatingsAboutProducerWithId(producerId) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return PersonRatingProducersModel.find({ producerId })
    .sort({ _id: 1 });
}

/**
 * Retourne tous les ratings du producteur correspondant à l'id reçu.
 *
 * @param personId, l'id de la personne dont on souhaite récupérer le rating.
 * @param producerId, l'id du producteur concerné par le rating qu'on souhaite récupérer.
 * @returns {*}
 */
function getRatingAboutProducerIdMadeByPersonId(producerId, personId) {
  return PersonRatingProducersModel.findOne({ producerId, personId });
}

/**
 * Retourne tous les ratings fait par la personne correspondant à l'id reçu.
 *
 * @param {Integer} personId, L'id de la personne dont on souhaite récupérer tous les ratings qu'il a fait.
 */
function getAllRatingsMadeByPersonWithId(personId) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return PersonRatingProducersModel.find({ personId })
    .sort({ _id: 1 });
}

function countNbRatingsMadeByPersonWithId(personId) {
  return PersonRatingProducersModel.countDocuments({ personId });
}

function countNbRatingsAboutProducerWithId(producerId) {
  return PersonRatingProducersModel.countDocuments({ producerId });
}

/**
 * Ajoute un nouveau rating dans la base de données.
 * Doublons autorisés!
 *
 * @param personRatingProducer, Les informations du rating à ajouter.
 */
function addOrUpdatePersonRatingProducer({ personId, producerId, rating }) {
  // les tests d'existence de personId et producerId sont fait directement dans le schéma mongoose

  // on met à jour le rating fait par personId et concernant producerId. On le crée s'il n'existe pas.
  return PersonRatingProducersModel.findOneAndUpdate({ personId, producerId }, { rating }, { new: true, runValidators: true, upsert: true }); // retourne l'objet modifié
  // la mise à jour du rating du producteur est faite automatiquement dans le schéma mongoose
}

/**
 * Supprime le rating correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du rating à supprimer.
 */
function deletePersonRatingProducer(id) {
  return PersonRatingProducersModel.findByIdAndRemove(id);
}
