const express = require('express');
const salespointsRoute = require('./salespoints.service');

const router = new express.Router();

/**
 * Retourne tous les points de vente de la base de données.
 */
router.get('/', async (req, res, next) => {
  const options = {
    tags: req.query.tags,
    limit: req.query.limit,
    page: req.query.page
  };

  try {
    const result = await salespointsRoute.getSalesPoints(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Crée un nouveau point de vente dans la base de données.
 * Doublons autorisés!
 */
router.post('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await salespointsRoute.addSalesPoints(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Retourne le point de vente correspondant à l'id reçu.
 */
router.get('/:id', async (req, res, next) => {
  const options = {
    id: req.params.id
  };

  try {
    const result = await salespointsRoute.getSalesPointById(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Met à jour le point de vente possédant l'id reçu avec les
 * données reçues.
 */
router.put('/:id', async (req, res, next) => {
  const options = {
    id: req.params.id
  };

  try {
    const result = await salespointsRoute.updateSalesPoint(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Supprime le point de vente correspondant à l'id reçu.
 */
router.delete('/:id', async (req, res, next) => {
  const options = {
    id: req.params.id
  };

  try {
    const result = await salespointsRoute.deleteSalesPoint(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
