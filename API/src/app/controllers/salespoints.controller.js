const express = require('express');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const salespointsServices = require('../services/salespoints.services');

const router = new express.Router();


/**
 * Retourne tous les points de vente de la base de données.
 */
router.get('/', (req, res, next) => {
  /**
   * @param {Object} req
   * @param {Array} req .tags Tags à utiliser pour filtrer les résultats. Séparer plusieurs tags à l&#x27;aide de &quot;,&quot;.
   * @param {Integer} req .limit Nombre maximum de points de vente à retourner.
   * @param {Integer} req .page Numéro de la page à retourner. Permet par exemple de récupérer la &quot;page&quot;ème page de &quot;limit&quot; points de vente. Par exemple, si &quot;limit&quot; vaut 20 et &quot;page&quot; vaut 3, on récupère la 3ème page de 20 points de vente, soit les points de vente 41 à 60.
   */
  const requestOptions = {
    tags: req.query.tags,
    limit: req.query.limit,
    page: req.query.page
  };

  salespointsServices.getSalesPoints(requestOptions)
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
 * Ajoute un nouveau point de vente dans la base de données.
 * Doublons autorisés!
 */
router.post('/', (req, res, next) => {
  /**
   * @param {Object} req
   */
  const requestOptions = {
  };

  salespointsServices.addSalesPoints(requestOptions)
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
 * Retourne le point de vente correspondant à l'id reçu.
 */
router.get('/:id', (req, res, next) => {
  /**
   * @param {Object} req
   * @param {Integer} req .id L&#x27;id du point de vente à récupérer.
   */
  const requestOptions = {
    id: req.params.id
  };

  salespointsServices.getSalesPointById(requestOptions)
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
 * Met à jour le point de vente possédant l'id reçu avec les
 * données reçues. Remplace toutes les données du point de
 * vente dans la base de données par celles reçues!
 */
router.put('/:id', (req, res, next) => {
  /**
   * @param {Object} req
   * @param {Integer} req .id L&#x27;id du point de vente à mettre à jour.
   */
  const requestOptions = {
    id: req.params.id
  };

  salespointsServices.updateSalesPoint(requestOptions)
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
 * Supprime le point de vente correspondant à l'id reçu.
 */
router.delete('/:id', (req, res, next) => {
  /**
   * @param {Object} req
   * @param {Integer} req .id L&#x27;id du point de vente à supprimer.
   */
  const requestOptions = {
    id: req.params.id
  };

  salespointsServices.deleteSalesPoint(requestOptions)
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
