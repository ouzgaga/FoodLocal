const express = require('express');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const productsServices = require('../services/products.services');

const router = new express.Router();


/**
 * Retourne tous les produits de la base de données.
 */
router.get('/', (req, res, next) => {
  /**
   * @param {Object} req
   * @param {Array} req .tags Tags à utiliser pour filtrer les résultats.
   * @param {Integer} req .limit Nombre maximum de produits à retourner.
   * @param {Integer} req .page Numéro de la page à retourner. Permet par exemple de récupérer la 3ème page de 20 produits, soit les produits 41 à 60.
   */
  const requestOptions = {
    tags: req.query.tags,
    limit: req.query.limit,
    page: req.query.page
  };


  productsServices.getProducts(requestOptions)
    .then((result) => {
      res.status(result.status || httpStatus.OK).send(result.data);
    }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(
        {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          title: 'Server error',
          error: err.message
        }
      ));
});


/**
 * Ajoute un nouveau produit dans la base de données. Doublons
 * autorisés!
 */
router.post('/', (req, res, next) => {
  /**
   * @param {Object} req
   */
  const requestOptions = {
  };


  productsServices.addProduct(requestOptions)
    .then((result) => {
      res.status(result.status || httpStatus.OK).send(result.data);
    }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(
        {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          title: 'Server error',
          error: err.message
        }
      ));
});


/**
 * Retourne le produit correspondant à l'id reçu.
 */
router.get('/:id', (req, res, next) => {
  /**
   * @param {Object} req
   * @param {Integer} req .id l&#x27;id du produit à récupérer
   */
  const requestOptions = {
    id: req.params.id
  };


  productsServices.getProductById(requestOptions)
    .then((result) => {
      res.status(result.status || httpStatus.OK).send(result.data);
    }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(
        {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          title: 'Server error',
          error: err.message
        }
      ));
});


/**
 * Met à jour le produit possédant l'id reçu.
 */
router.put('/:id', (req, res, next) => {
  /**
   * @param {Object} req
   * @param {Integer} req .id l&#x27;id du produit à mettre à jour.
   */
  const requestOptions = {
    id: req.params.id
  };


  productsServices.updateProduct(requestOptions)
    .then((result) => {
      res.status(result.status || httpStatus.OK).send(result.data);
    }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(
        {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          title: 'Server error',
          error: err.message
        }
      ));
});


/**
 * Supprime le produit correspondant à l'id reçu.
 */
router.delete('/:id', (req, res, next) => {
  /**
   * @param {Object} req
   * @param {Integer} req .id l&#x27;id du produit à supprimer
   */
  const requestOptions = {
    id: req.params.id
  };


  productsServices.deleteProduct(requestOptions)
    .then((result) => {
      res.status(result.status || httpStatus.OK).send(result.data);
    }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(
        {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          title: 'Server error',
          error: err.message
        }
      ));
});

module.exports = router;
