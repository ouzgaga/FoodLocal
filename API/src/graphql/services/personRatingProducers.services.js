const mongoose = require('mongoose');
const PersonRatingProducersModel = require('../models/personRatingProducers.modelgql');
const producersServices = require('./producers.services');

/**
 * Retourne tous les ratings concernant le producteur correspondant à l'id reçu.
 *
 * @param {Integer} producerId, L'id du producteur dont on souhaite récupérer tous les ratings le concernant.
 */
function getAllRatingsAboutProducerWithId(producerId, { limit = 30, page = 0 } = {}) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    throw new Error('Received personRatingProducer.producerId is invalid!');
  }

  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return PersonRatingProducersModel.find({ producerId })
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

/**
 * Retourne tous les ratings du producteur correspondant à l'id reçu.
 *
 * @param personId, l'id de la personne dont on souhaite récupérer le rating.
 * @param producerId, l'id du producteur concerné par le rating qu'on souhaite récupérer.
 * @returns {*}
 */
async function getRatingAboutProducerIdMadeByPersonId(producerId, personId, { limit = 30, page = 0 } = {}) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    throw new Error('Received personRatingProducer.producerId is invalid!');
  }
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    throw new Error('Received personRatingProducer.personId is invalid!');
  }

  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  const res = await PersonRatingProducersModel.findOne({ producerId, personId })
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
  return res;
}

/**
 * Retourne tous les ratings fait par la personne correspondant à l'id reçu.
 *
 * @param {Integer} personId, L'id de la personne dont on souhaite récupérer tous les ratings qu'il a fait.
 */
function getAllRatingsMadeByPersonWithId(personId, { limit = 30, page = 0 } = {}) {
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    throw new Error('Received personRatingProducer.personId is invalid!');
  }

  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return PersonRatingProducersModel.find({ personId })
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
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
async function addPersonRatingProducer({ personId, producerId, rating }) {
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    throw new Error('Received personRatingProducer.personId is invalid!');
  }

  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    throw new Error('Received personRatingProducer.producerId is invalid!');
  }
  // les tests d'existence de personId et producerId sont fait directement dans le schéma mongoose

  // on check si cet personne a déjà voté pour ce producteur
  const ratingForThisProducerAlreadyMade = await PersonRatingProducersModel.findOne({ personId, producerId });

  if (ratingForThisProducerAlreadyMade != null) {
    // cette personne a déjà voté pour ce producteur !
    throw new Error('This person has already rated this producer! You can\'t rate twice the same producer.');
  }

  // on enregistre le nouveau rating dans la base de données
  return new PersonRatingProducersModel({ personId, producerId, rating }).save();
}

async function updateProducerRating(producerId) {
  let rating = await PersonRatingProducersModel.aggregate([
    { $match: { producerId: mongoose.Types.ObjectId(producerId) } },
    { $group: { _id: null, nbRatings: { $sum: 1 }, rating: { $avg: '$rating' } } },
    { $project: { _id: false } }
  ]);

  if (rating.length === 0) {
    rating = {
      rating: null,
      nbRatings: null
    };
  } else {
    rating = rating[0];
  }

  return producersServices.updateProducerRating(producerId, rating);
}

/**
 * Met à jour le rating possédant l'id reçu avec les données reçues.
 * Remplace toutes les données du rating dans la base de données par celles reçues!
 *
 * @param personRatingProducer, Les informations du rating à mettre à jour.
 */
async function updatePersonRatingProducer({ id, rating }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Received personRatingProducer.id is invalid!');
  }

  const update = await PersonRatingProducersModel.findByIdAndUpdate(id, { rating }, { new: true }); // retourne l'objet modifié
  await updateProducerRating(update.producerId);
  return update;
}

/**
 * Supprime le rating correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du rating à supprimer.
 */
function deletePersonRatingProducer(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Received personRatingProducer.id is invalid!');
  }

  return PersonRatingProducersModel.findByIdAndRemove(id);
}

module.exports = {
  getAllRatingsAboutProducerWithId,
  getRatingAboutProducerIdMadeByPersonId,
  getAllRatingsMadeByPersonWithId,
  countNbRatingsMadeByPersonWithId,
  countNbRatingsAboutProducerWithId,
  addPersonRatingProducer,
  updatePersonRatingProducer,
  deletePersonRatingProducer
};
