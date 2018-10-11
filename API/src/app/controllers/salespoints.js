const salespointsServices = require('../services/salespoints');


/**
 * Retourne tous les points de vente de la base de données.
 */
function getSalesPoints(req, res, next) {
  salespointsServices.getSalesPoints();
}


/**
 * Crée un nouveau point de vente dans la base de données. 
 * Doublons autorisés!
 */
function addSalesPoints(req, res, next) {
  salespointsServices.addSalesPoints();
}


/**
 * Retourne le point de vente correspondant à l'id reçu.
 */
function getSalesPointById(req, res, next) {
  salespointsServices.getSalesPointById();
}


/**
 * Met à jour le point de vente possédant l'id reçu avec les 
 * données reçues.
 */
function updateSalesPoint(req, res, next) {
  salespointsServices.updateSalesPoint();
}


/**
 * Supprime le point de vente correspondant à l'id reçu.
 */
function deleteSalesPoint(req, res, next) {
  salespointsServices.deleteSalesPoint();
}

module.exports = {
  getSalesPoints,
  addSalesPoints,
  getSalesPointById,
  updateSalesPoint,
  deleteSalesPoint,
};
