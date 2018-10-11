const express = require('express');
const producersRoute = require('./producers.service');

const router = new express.Router();

/**
 * Retourne tous les producteurs de la base de données.
 */
router.get('/', async (req, res, next) => {
  const options = {
    tags: req.query.tags,
    limit: req.query.limit,
    page: req.query.page
  };

  try {
    const result = await producersRoute.getProducer(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Crée un nouveau producteur dans la base de données. Doublons
 * autorisés!
 */
router.post('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await producersRoute.addProducer(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Retourne le producteur correspondant à l'id reçu.
 */
router.get('/:id', async (req, res, next) => {
  const options = {
    id: req.params.id
  };

  try {
    const result = await producersRoute.getProducerById(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Met à jour le producteur possédant l'id reçu.
 */
router.put('/:id', async (req, res, next) => {
  const options = {
    id: req.params.id
  };

  try {
    const result = await producersRoute.updateProducer(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Supprime le producteur correspondant à l'id reçu.
 */
router.delete('/:id', async (req, res, next) => {
  const options = {
    id: req.params.id
  };

  try {
    const result = await producersRoute.deleteProducer(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
