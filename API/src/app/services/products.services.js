const productsModel = require('../models/products.model');


/**
 * Retourne tous les produits de la base de données.
 */
function getProducts(requestOptions) {
  return productsModel.getProducts(requestOptions);
}


/**
 * Ajoute un nouveau produit dans la base de données. Doublons
 * autorisés!
 */
function addProduct(requestOptions) {
  return productsModel.addProduct(requestOptions);
}


/**
 * Retourne le produit correspondant à l'id reçu.
 */
function getProductById(requestOptions) {
  return productsModel.getProductById(requestOptions);
}


/**
 * Met à jour le produit possédant l'id reçu.
 */
function updateProduct(requestOptions) {
  return productsModel.updateProduct(requestOptions);
}


/**
 * Supprime le produit correspondant à l'id reçu.
 */
function deleteProduct(requestOptions) {
  return productsModel.deleteProduct(requestOptions);
}


module.exports = {
  getProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
