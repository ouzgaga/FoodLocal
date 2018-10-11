const express = require('express');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const salespointsController = require('../controllers/salespoints');

const router = new express.Router();

/**
 * Retourne tous les points de vente de la base de données.
 */
router.get('/', (req, res, next) => {
  salespointsController.getSalesPoints(req, res, next);
});

/**
 * Crée un nouveau point de vente dans la base de données. 
 * Doublons autorisés!
 */
router.post('/', (req, res, next) => {
  salespointsController.addSalesPoints(req, res, next);
});

/**
 * Retourne le point de vente correspondant à l'id reçu.
 */
router.get('/:id', (req, res, next) => {
  salespointsController.getSalesPointById(req, res, next);
});

/**
 * Met à jour le point de vente possédant l'id reçu avec les 
 * données reçues.
 */
router.put('/:id', (req, res, next) => {
  salespointsController.updateSalesPoint(req, res, next);
});

/**
 * Supprime le point de vente correspondant à l'id reçu.
 */
router.delete('/:id', (req, res, next) => {
  salespointsController.deleteSalesPoint(req, res, next);
});

module.exports = router;
