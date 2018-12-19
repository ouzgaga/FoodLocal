const MongooseQueryParser = require('mongoose-query-parser');
const mongoose = require('mongoose');
require('../../graphql/models/salespoints.modelgql');

const Salespoints = mongoose.model('salespoints');
const parser = new MongooseQueryParser.MongooseQueryParser();

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
function getSalesPoints ({ tags = undefined, limit = 50, page = 0 } = {}) {
  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  if (tags !== undefined && typeof (tags) !== 'object') { // très moche mais fonctionne....
    // FIXME: les tags fonctionnent pour les tests (passés commes Objects JSON), mais pas via PostMan (passé comme une string il semble...)!
    tags = JSON.parse(tags); // transforme la string en object

    tags = parser.parse(tags); // permet de filtrer la string au format mongoose...
    return Salespoints.find(tags.filter).sort({ _id: 1 }).skip(+skip).limit(+limit)
      .exec();
  }

  return Salespoints.find({ tags }).sort({ _id: 1 }).skip(+skip).limit(+limit)
    .exec();
}

/**
 * Ajoute un nouveau point de vente dans la base de données.
 * Doublons autorisés!
 *
 * @param {Integer} bodyContent, Les informations du point de vente à ajouter.
 */
function addSalesPoints (bodyContent) {
  return new Salespoints(bodyContent).save();
}

/**
 * Retourne le point de vente correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du point de vente à récupérer.
 */
function getSalesPointById ({ id }) {
  return Salespoints.findById(id).exec();
}

/**
 * Met à jour le point de vente possédant l'id reçu avec les
 * données reçues. Remplace toutes les données du point de
 * vente dans la base de données par celles reçues!
 *
 * @param {Integer} id, L'id du point de vente à mettre à jour.
 * @param {Integer} salespointInfos, Les informations du point de vente à mettre à jour.
 */
function updateSalesPoint (id, salespointInfos) {
  return Salespoints.findByIdAndUpdate(id, salespointInfos, { new: true }); // retourne l'objet modifié
  // return Salespoints.updateOne(salespointInfos); // retourne un OK mais pas l'objet modifié
}

/**
 * Supprime le point de vente correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du point de vente à supprimer.
 */
function deleteSalesPoint ({ id }) {
  return Salespoints.findByIdAndRemove(id);
}

module.exports = {
  getSalesPoints,
  addSalesPoint: addSalesPoints,
  getSalesPointById,
  updateSalesPoint,
  deleteSalesPoint
};
