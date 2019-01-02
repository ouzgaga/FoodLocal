const mongoose = require('mongoose');
const SalespointsModel = require('../models/salespoints.modelgql');

/**
 * Retourne "limit" points de vente de la base de données, fitlrés
 * selon les tags "tags" reçus à partir de la page "page". Sans
 * paramètres, retourne tous les points de vente de la base de
 * données.
 *
 * @param {Array} tags, Tags à utiliser pour filtrer les résultats.
 * @param {Integer} limit, Nombre maximum de points de vente à retourner.
 * @param {Integer} page, Numéro de la page à retourner. Permet par exemple de récupérer la "page"ème page de "limit" points de vente. Par
 *   exemple, si "limit" vaut 20 et "page" vaut 3, on récupère la 3ème page de 20 points de vente, soit les points de vente 41 à 60.
 */
function getSalespoints({ tags = undefined, limit = 50, page = 0 } = {}) {
  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return SalespointsModel.find({ tags })
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

/**
 * Retourne le point de vente correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du point de vente à récupérer.
 */
function getSalespointById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received salespoint.id is invalid!');
  } else {
    return SalespointsModel.findById(id);
  }
}

/**
 * Ajoute un nouveau point de vente dans la base de données.
 * Doublons autorisés!
 *
 * @param salespoint, Les informations du point de vente à ajouter.
 */
function addSalespoint(salespoint) {
  return new SalespointsModel(salespoint).save();
}

/**
 * Met à jour le point de vente possédant l'id reçu avec les
 * données reçues. Remplace toutes les données du point de
 * vente dans la base de données par celles reçues!
 *
 * @param {Integer} salespoint, Les informations du point de vente à mettre à jour.
 */
async function updateSalespoint(producerId, { name, address, schedule }) {
  const producer = await producersServices.getProducerById(producerId);

  if (producer == null) {
    return new Error('Received producerId is not in the database!');
  }
  if (producer.message != null) {
    // l'appel à getProducerById() a retournée l'erreur "Received producer.id is invalid!"
    return new Error('Received producerId is invalid!');
  }
  if (producer.salespointId == null) {
    return new Error('Impossible to update this salespoint because this producer doesn\'t have one.');
  }

  const updatedSalespoint = {};

  // on ne déclare le nom, l'adresse ou l'horaire que s'il est réellement donné, sinon, on ne les déclare même pas (pour
  // ne pas remplacer ceux contenus dans la DB par null sans le vouloir
  if (name !== undefined) {
    updatedSalespoint.name = name;
  }
  if (address !== undefined) {
    updatedSalespoint.address = address;
  }
  if (schedule !== undefined) {
    updatedSalespoint.schedule = schedule;
  }

  await SalespointsModel.findByIdAndUpdate(producer.salespointId, updatedSalespoint, { new: true }); // retourne l'objet modifié
  return producer;
}

/**
 * Supprime le point de vente correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du point de vente à supprimer.
 */
async function deleteSalespoint(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received salespoint.id is invalid!');
  }

  return SalespointsModel.findByIdAndRemove(id);
}

module.exports = {
  getSalespoints,
  addSalespoint,
  getSalespointById,
  updateSalespoint,
  deleteSalespoint
};

const producersServices = require('./producers.services');
