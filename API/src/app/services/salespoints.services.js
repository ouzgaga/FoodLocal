const mongoose = require('mongoose');
require('../models/salesPoints.model');

const salesPoints = mongoose.model('salesPoints');


/**
 * Retourne tous les points de vente de la base de données.
 */
function getsalesPoints(requestOptions) {
  return salesPoints.getsalesPoints(requestOptions);
}


/**
 * Crée un nouveau point de vente dans la base de données.
 * Doublons autorisés!
 */
function addsalesPoints(requestOptions) {
  return salesPoints.addsalesPoints(requestOptions);
}


/**
 * Retourne le point de vente correspondant à l'id reçu.
 */
function getsalesPointById(requestOptions) {
  return salesPoints.getsalesPointById(requestOptions);
}


/**
 * Met à jour le point de vente possédant l'id reçu avec les
 * données reçues.
 */
function updatesalesPoint(requestOptions) {
  return salesPoints.updatesalesPoint(requestOptions);
}


/**
 * Supprime le point de vente correspondant à l'id reçu.
 */
function deletesalesPoint(requestOptions) {
  return salesPoints.deletesalesPoint(requestOptions);
}


module.exports = {
  getsalesPoints,
  addsalesPoints,
  getsalesPointById,
  updatesalesPoint,
  deletesalesPoint,
};
