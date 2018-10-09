const express = require('express');
const productsRoute = require('./products.service');

const router = new express.Router();

/**
 * Retourne tous les produits de la base de données.
 */
router.get('/', async (req, res, next) => {
  const options = {
    tags: req.query.tags,
    limit: req.query.limit,
    page: req.query.page
  };

  try {
    const result = await productsRoute.getProducts(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Ajoute un nouveau produit dans la base de données. Doublons
 * autorisés!
 */
router.post('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await productsRoute.addProduct(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Retourne le produit correspondant à l'id reçu.
 */
router.get('/:id', async (req, res, next) => {
  const options = {
    id: req.params.id
  };

  try {
    const result = await productsRoute.getProductById(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Met à jour le produit possédant l'id reçu.
 */
router.put('/:id', async (req, res, next) => {
  const options = {
    id: req.params.id
  };

  try {
    const result = await productsRoute.updateProduct(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Supprime le produit correspondant à l'id reçu.
 */
router.delete('/:id', async (req, res, next) => {
  const options = {
    id: req.params.id
  };

  try {
    const result = await productsRoute.deleteProduct(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
