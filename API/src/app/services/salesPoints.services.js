const salespointsModel = require('../models/salespoints.model');

/**
 * Retourne tous les points de vente de la base de données.
 */
function getSalesPoints(requestOptions) {
  return salespointsModel.getSalesPoints(requestOptions);
}

/**
 * Crée un nouveau point de vente dans la base de données.
 * Doublons autorisés!
 */
function addSalesPoints(requestOptions) {
  return salespointsModel.addSalesPoints(requestOptions);
}

/**
 * Retourne le point de vente correspondant à l'id reçu.
 */
function getSalesPointById(requestOptions) {
  return salespointsModel.getSalesPointById(requestOptions);
}

/**
 * Met à jour le point de vente possédant l'id reçu avec les
 * données reçues.
 */
function updateSalesPoint(requestOptions) {
  return salespointsModel.updateSalesPoint(requestOptions);
}

/**
 * Supprime le point de vente correspondant à l'id reçu.
 */
function deleteSalesPoint(requestOptions) {
  return salespointsModel.deleteSalesPoint(requestOptions);
}

module.exports = {
  getSalesPoints,
  addSalesPoints,
  getSalesPointById,
  updateSalesPoint,
  deleteSalesPoint
};
