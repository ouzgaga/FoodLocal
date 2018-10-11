const express = require('express');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const producersController = require('../controllers/producers');

const router = new express.Router();

/**
 * Retourne tous les producteurs de la base de données.
 */
router.get('/', (req, res, next) => {
  producersController.getProducer(req, res, next);
});

/**
 * Crée un nouveau producteur dans la base de données. Doublons 
 * autorisés!
 */
router.post('/', (req, res, next) => {
  producersController.addProducer(req, res, next);
});

/**
 * Retourne le producteur correspondant à l'id reçu.
 */
router.get('/:id', (req, res, next) => {
  producersController.getProducerById(req, res, next);
});

/**
 * Met à jour le producteur possédant l'id reçu.
 */
router.put('/:id', (req, res, next) => {
  producersController.updateProducer(req, res, next);
});

/**
 * Supprime le producteur correspondant à l'id reçu.
 */
router.delete('/:id', (req, res, next) => {
  producersController.deleteProducer(req, res, next);
});

module.exports = router;
