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
function getSalesPoints({ tags = undefined, limit = 50, page = 0 } = {}) {
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
 * Ajoute un nouveau point de vente dans la base de données.
 * Doublons autorisés!
 *
 * @param {Integer} salespoint, Les informations du point de vente à ajouter.
 */
function addSalesPoint(salespoint) {
  return new SalespointsModel(salespoint).save();
}

/**
 * Retourne le point de vente correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du point de vente à récupérer.
 */
function getSalesPointById(id) {
  let objectId = id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received salespoint.id is invalid!');
  } else {
    // FIXME: je comprend pas pourquoi je dois faire ça....?! Sans ça, il ne trouve pas de résultat alors que yen a.....
    objectId = new mongoose.Types.ObjectId(id);
  }

  return SalespointsModel.findById(objectId);
}

/**
 * Met à jour le point de vente possédant l'id reçu avec les
 * données reçues. Remplace toutes les données du point de
 * vente dans la base de données par celles reçues!
 *
 * @param {Integer} salespoint, Les informations du point de vente à mettre à jour.
 */
function updateSalesPoint(salespoint) {
  if (!mongoose.Types.ObjectId.isValid(salespoint.id)) {
    return new Error('Received salespoint.id is invalid!');
  }

  return SalespointsModel.findByIdAndUpdate(salespoint.id, salespoint, { new: true }); // retourne l'objet modifié
}

/**
 * Supprime le point de vente correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du point de vente à supprimer.
 */
function deleteSalesPoint(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received salespoint.id is invalid!');
  }

  return SalespointsModel.findByIdAndRemove(id);
}

module.exports = {
  getSalesPoints,
  addSalesPoint,
  getSalesPointById,
  updateSalesPoint,
  deleteSalesPoint
};
