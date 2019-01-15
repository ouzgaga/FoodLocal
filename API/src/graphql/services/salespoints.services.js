const mongoose = require('mongoose');
const { SalespointsModel } = require('../models/salespoints.modelgql');

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
function getSalespoints({ tags = undefined } = {}) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return SalespointsModel.find({ tags })
    .sort({ _id: 1 });
}

/**
 * Retourne le point de vente correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du point de vente à récupérer.
 */
function getSalespointById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Received salespoint.id is invalid!');
  }

  return SalespointsModel.findById(id);
}

function geoFilterSalespoints({ longitude, latitude, maxDistance }) {
  return SalespointsModel.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [longitude, latitude] },
        spherical: true,
        distanceField: 'distance',
        maxDistance
      }
    }
  ]);
}

function countNbSalespointInDB() {
  return SalespointsModel.countDocuments();
}

/**
 * Ajoute un nouveau point de vente dans la base de données.
 * Doublons autorisés!
 *
 * @param salespoint, Les informations du point de vente à ajouter.
 */
function addSalespoint(salespoint) {
  const salespointToAdd = {
    ...salespoint
  };

  if (salespointToAdd.address != null) {
    const { number, street, city, postalCode, state, country, longitude, latitude } = salespointToAdd.address;

    salespointToAdd.address = {
      number,
      street,
      city,
      postalCode,
      state,
      country,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    };
  }

  return new SalespointsModel(salespointToAdd).save();
}

/**
 * Met à jour le point de vente possédant l'id reçu avec les
 * données reçues. Remplace toutes les données du point de
 * vente dans la base de données par celles reçues!
 *
 * @param {Integer} salespoint, Les informations du point de vente à mettre à jour.
 */
async function updateSalespoint(producerId, { name, address, schedule }) {
  let producer;
  try {
    producer = await producersServices.getProducerById(producerId);
  } catch (err) {
    // l'appel à getProducerById() a retournée l'erreur "Received producer.id is invalid!"
    throw new Error('Received producerId is invalid!');
  }
  if (producer == null) {
    throw new Error('Received producerId is not in the database!');
  }

  if (producer.salespointId == null) {
    throw new Error('Impossible to update this salespoint because this producer doesn\'t have one.');
  }

  const updatedSalespoint = {};

  // on ne déclare le nom, l'adresse ou l'horaire que s'il est réellement donné, sinon, on ne les déclare même pas (pour
  // ne pas remplacer ceux contenus dans la DB par null sans le vouloir
  if (name !== undefined) {
    updatedSalespoint.name = name;
  }
  if (address !== undefined) {
    const { number, street, city, postalCode, state, country, longitude, latitude } = address;
    updatedSalespoint.address = {
      number,
      street,
      city,
      postalCode,
      state,
      country,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    };
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
    throw new Error('Received salespoint.id is invalid!');
  }

  return SalespointsModel.findByIdAndRemove(id);
}

module.exports = {
  getSalespoints,
  geoFilterSalespoints,
  countNbSalespointInDB,
  addSalespoint,
  getSalespointById,
  updateSalespoint,
  deleteSalespoint
};

const producersServices = require('./producers.services');
