const productsServices = require('../services/products');


/**
 * Retourne tous les produits de la base de données.
 */
function getProducts(req, res, next) {
  productsServices.getProducts();
}


/**
 * Ajoute un nouveau produit dans la base de données. Doublons 
 * autorisés!
 */
function addProduct(req, res, next) {
  productsServices.addProduct();
}


/**
 * Retourne le produit correspondant à l'id reçu.
 */
function getProductById(req, res, next) {
  productsServices.getProductById();
}


/**
 * Met à jour le produit possédant l'id reçu.
 */
function updateProduct(req, res, next) {
  productsServices.updateProduct();
}


/**
 * Supprime le produit correspondant à l'id reçu.
 */
function deleteProduct(req, res, next) {
  productsServices.deleteProduct();
}

module.exports = {
  getProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
