const mongoose = require('mongoose');
require('../models/products.model');

const products = mongoose.model('Products');


/**
 * Retourne tous les produits de la base de données.
 */
function getProducts(requestOptions) {
  return products.getProducts(requestOptions);
}


/**
 * Ajoute un nouveau produit dans la base de données. Doublons
 * autorisés!
 */
function addProduct(requestOptions) {
  return products.addProduct(requestOptions);
}


/**
 * Retourne le produit correspondant à l'id reçu.
 */
function getProductById(requestOptions) {
  return products.getProductById(requestOptions);
}


/**
 * Met à jour le produit possédant l'id reçu.
 */
function updateProduct(requestOptions) {
  return products.updateProduct(requestOptions);
}


/**
 * Supprime le produit correspondant à l'id reçu.
 */
function deleteProduct(requestOptions) {
  return products.deleteProduct(requestOptions);
}


module.exports = {
  getProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
