const express = require('express');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const productsServices = require('../services/products.services');

const router = new express.Router();

/**
 * Retourne "limit" produits de la base de données, fitlrés
 * selon les tags "tags" reçus à partir de la page "page". Sans
 * paramètres, retourne tous les produits de la base de
 * données.
 *
 * @param {Array} req.query.tags, Tags à utiliser pour filtrer les résultats. Séparer plusieurs tags à l'aide de ",".
 * @param {Integer} req.query.limit, Nombre maximum de produits à retourner.
 * @param {Integer} req.query.page, Numéro de la page à retourner. Permet par exemple de récupérer la "page"ème page de "limit" produits. Par exemple, si
 *   "limit" vaut 20 et "page" vaut 3, on récupère la 3ème page de 20 produits, soit les produits 41 à 60.
 */
router.get('/', (req, res, next) => {
  const requestOptions = {
    tags : req.query.tags,
    limit: req.query.limit,
    page : req.query.page
  };

  productsServices.getProducts(requestOptions).then((result) => {
    res.status(result.status || httpStatus.OK).send(result);// result.data);
  }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
    {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      title : err.title,
      error : err.message
    }
  ));
});

/**
 * Ajoute un nouveau produit dans la base de données.
 * Attention, doublons autorisés!
 *
 * @param {Integer} req.body, Les informations du produit à ajouter.
 */
router.post('/', (req, res, next) => {
  productsServices.addProduct(req.body).then((result) => {
    res.status(result.status || httpStatus.OK).send(result);// result.data);
  }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
    {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      title : err.title,
      error : err.message
    }
  ));
});

/**
 * Retourne le produit correspondant à l'id reçu.
 *
 * @param {Integer} req.params.id, L'id du produit à récupérer.
 */
router.get('/:id', (req, res, next) => {
  productsServices.getProductById(req.params).then((result) => {
    res.status(result.status || httpStatus.OK).send(result);// result.data);
  }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
    {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      title : err.title,
      error : err.message
    }
  ));
});

/**
 * Met à jour le produit possédant l'id reçu avec les données
 * reçues. Remplace toutes les données du produit dans la base
 * de données par celles reçues!
 *
 * @param {Integer} req.params, Les informations du produit à mettre à jour.
 */
router.put('/:id', (req, res, next) => {
  productsServices.updateProduct(req.params).then((result) => {
    res.status(result.status || httpStatus.OK).send(result);// result.data);
  }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
    {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      title : err.title,
      error : err.message
    }
  ));
});

/**
 * Supprime le produit correspondant à l'id reçu.
 *
 * @param {Integer} req.params.id, L'id du produit à supprimer
 */
router.delete('/:id', (req, res, next) => {
  productsServices.deleteProduct(req.params).then((result) => {
    res.status(result.status || httpStatus.OK).send(result);// result.data);
  }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
    {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      title : err.title,
      error : err.message
    }
  ));
});

module.exports = router;
