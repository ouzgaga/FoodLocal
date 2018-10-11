const express = require('express');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const productsController = require('../controllers/products');

const router = new express.Router();

/**
 * Retourne tous les produits de la base de données.
 */
router.get('/', (req, res, next) => {
  productsController.getProducts(req, res, next);
});

/**
 * Ajoute un nouveau produit dans la base de données. Doublons 
 * autorisés!
 */
router.post('/', (req, res, next) => {
  productsController.addProduct(req, res, next);
});

/**
 * Retourne le produit correspondant à l'id reçu.
 */
router.get('/:id', (req, res, next) => {
  productsController.getProductById(req, res, next);
});

/**
 * Met à jour le produit possédant l'id reçu.
 */
router.put('/:id', (req, res, next) => {
  productsController.updateProduct(req, res, next);
});

/**
 * Supprime le produit correspondant à l'id reçu.
 */
router.delete('/:id', (req, res, next) => {
  productsController.deleteProduct(req, res, next);
});

module.exports = router;
