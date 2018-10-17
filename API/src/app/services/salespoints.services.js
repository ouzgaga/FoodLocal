const mongoose = require('mongoose');
require('../models/salespoints.model');

const salespoints = mongoose.model('salespoints');


/**
 * Retourne tous les points de vente de la base de données.
 */
function getSalesPoints(requestOptions) {

}


/**
 * Ajoute un nouveau point de vente dans la base de données.
 * Doublons autorisés!
 */
function addSalesPoints(requestOptions) {

}


/**
 * Retourne le point de vente correspondant à l'id reçu.
 */
function getSalesPointById(requestOptions) {

}


/**
 * Met à jour le point de vente possédant l'id reçu avec les
 * données reçues. Remplace toutes les données du point de
 * vente dans la base de données par celles reçues!
 */
function updateSalesPoint(requestOptions) {

}


/**
 * Supprime le point de vente correspondant à l'id reçu.
 */
function deleteSalesPoint(requestOptions) {

}


module.exports = {
  getSalesPoints,
  addSalesPoints,
  getSalesPointById,
  updateSalesPoint,
  deleteSalesPoint,
};
