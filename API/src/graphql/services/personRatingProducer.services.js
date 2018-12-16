const mongoose = require('mongoose');
const PersonRatingProducerModel = require('../models/personRatingProducer.modelgql');
const PersonModel = require('../models/persons.modelgql');
const ProducersServices = require('./producers.services');

/**
 * Retourne tous les ratings concernant le producteur correspondant à l'id reçu.
 *
 * @param {Integer} producerId, L'id du producteur dont on souhaite récupérer tous les ratings le concernant.
 */
function getAllRatingsAboutProducerWithId(producerId, { limit = 30, page = 0 } = {}) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    return new Error('Received personRatingProducer.producerId is invalid!');
  } else {
    let skip;
    if (page !== 0) {
      skip = page * limit;
    }

    return PersonRatingProducerModel.find({ producerId })
      .sort({ _id: 1 })
      .skip(+skip)
      .limit(+limit);
  }
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
    return new Error('Received personRatingProducer.producerId is invalid!');
  } else if (!mongoose.Types.ObjectId.isValid(personId)) {
    return new Error('Received personRatingProducer.personId is invalid!');
  } else {
    let skip;
    if (page !== 0) {
      skip = page * limit;
    }

    const res = await PersonRatingProducerModel.findOne({ producerId, personId })
      .sort({ _id: 1 })
      .skip(+skip)
      .limit(+limit);
    return res;
  }
}

/**
 * Retourne tous les ratings fait par la personne correspondant à l'id reçu.
 *
 * @param {Integer} personId, L'id de la personne dont on souhaite récupérer tous les ratings qu'il a fait.
 */
function getAllRatingsMadeByPersonWithId(personId, { limit = 30, page = 0 } = {}) {
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    return new Error('Received personRatingProducer.personId is invalid!');
  } else {
    let skip;
    if (page !== 0) {
      skip = page * limit;
    }

    return PersonRatingProducerModel.find({ personId })
      .sort({ _id: 1 })
      .skip(+skip)
      .limit(+limit);
  }
}

/**
 * Ajoute un nouveau rating dans la base de données.
 * Doublons autorisés!
 *
 * @param personRatingProducer, Les informations du rating à ajouter.
 */
async function addPersonRatingProducer({ personId, producerId, rating }) {
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    return new Error('Received personId is invalid!');
  } else if (!mongoose.Types.ObjectId.isValid(producerId)) {
    return new Error('Received producerId is invalid!');
  }

  const personIsInDB = await checkIfPersonIdExistInDB(personId);
  const producerIsInDB = await checkIfPersonIdExistInDB(producerId);

  if (!personIsInDB) {
    return new Error('There is no person with this id in database!');
  }
  if (!producerIsInDB) {
    return new Error('There is no producer with this id in database!');
  }
  // Si on arrive jusqu'ici alors personId et producerId existent bien dans la DB
  const ratingForThisProducerAlreadyMade = await PersonRatingProducerModel.find({ personId, producerId });

  if (ratingForThisProducerAlreadyMade.length !== 0) {
    // cette personne a déjà voté pour ce producteur ! // fixme: ou mettre à jour le rating existant...??
    return new Error('This person has already rated this producer! You can\'t rate twice the same producer.');
  }

  const newRating = await new PersonRatingProducerModel({ personId, producerId, rating }).save();

  await updateProducerRating(producerId);

  return newRating;
}

async function updateProducerRating(producerId) {
  // pas besoin de checker la validité de l'id -> il l'est forcément!
  const nbRatings = await PersonRatingProducerModel.count({ producerId });

  // FIXME: PAUL: j'arrive pas à faire fonctionner le aggregate...?
  /*
  const rating = await PersonRatingProducerModel.aggregate([
    { $match: { producerId } },
    { $group: { _id: 'producerId', average: { $avg: 'rating' } } }
  ]);
  */

  let ratings = await PersonRatingProducerModel.find({ producerId });
  if (ratings.length !== 0) {
    ratings = await ratings.map(r => r.toObject());
    let { rating } = ratings.reduce((r1, r2) => ({ rating: (r1.rating + r2.rating) }));
    rating = rating / nbRatings;
    return ProducersServices.updateProducerRating(producerId, { nbRatings, rating });
  } else {
    return ProducersServices.updateProducerRating(producerId, { nbRating: null, rating: null });
  }
}

/**
 * Met à jour le rating possédant l'id reçu avec les données reçues.
 * Remplace toutes les données du rating dans la base de données par celles reçues!
 *
 * @param personRatingProducer, Les informations du rating à mettre à jour.
 */
async function updatePersonRatingProducer({ id, rating }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received personRatingProducer.id is invalid!');
  }

  const update = await PersonRatingProducerModel.findByIdAndUpdate(id, { rating }, { new: true }); // retourne l'objet modifié
  await updateProducerRating(update.producerId);
  return update;
}

async function checkIfPersonIdExistInDB(personId) {
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    return new Error('Received personRatingProducer.id is invalid!');
  }

  const person = await PersonModel.findById(personId);
  return person != null; // todo: checker si marche aussi si id est undefined!
}

/**
 * Supprime le rating correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du rating à supprimer.
 */
async function deletePersonRatingProducer(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received personRatingProducer.id is invalid!');
  }

  const deletedRating = await PersonRatingProducerModel.findByIdAndRemove(id);
  if (deletedRating != null) {
    await updateProducerRating(deletedRating.producerId);
  }
  return deletedRating;
}

module.exports = {
  getAllRatingsAboutProducerWithId,
  getRatingAboutProducerIdMadeByPersonId,
  getAllRatingsMadeByPersonWithId,
  addPersonRatingProducer,
  updatePersonRatingProducer,
  deletePersonRatingProducer
};
