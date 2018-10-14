const express = require('express');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const producersServices = require('../services/producers.services');

const router = new express.Router();

/**
 * Retourne tous les producteurs de la base de données.
 */
router.get('/', (req, res, next) => {
  /**
   * @param {Object} req
   * @param {Array} req .tags Tags à utiliser pour filtrer les résultats.
   * @param {Integer} req .limit Nombre maximum de producteurs à retourner.
   * @param {Integer} req .page Numéro de la page à retourner. Permet par exemple de récupérer la 3ème page de 20 producteurs, soit les producteurs 41 à 60.
   */
  const requestOptions = {
    tags: req.query.tags,
    limit: req.query.limit,
    page: req.query.page
  };

  producersServices.getProducer(requestOptions).then((result) => {
    res.status(result.status || httpStatus.OK).send(result);// result.data);
  }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
    {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      title: 'Server error',
      error: err.message
    }
  ));
});

/**
 * Crée un nouveau producteur dans la base de données. Doublons
 * autorisés!
 */
router.post('/', (req, res, next) => {
  producersServices.addProducer(req.body).then((result) => {
    res.status(result.status || httpStatus.OK).send(result);// result.data);
  }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    status: httpStatus.INTERNAL_SERVER_ERROR,
    title: 'Server error',
    error: err.message
  }));
});

/**
 * Retourne le producteur correspondant à l'id reçu.
 */
router.get('/:id', (req, res, next) => {
  /**
   * @param {Object} req
   * @param {Integer} req .id L&#x27;id du producteur à récupérer.
   */
  const requestOptions = {
    id: req.params.id
  };

  producersServices.getProducerById(requestOptions).then((result) => {
    res.status(result.status || httpStatus.OK).send(result);// result.data);
  }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
    {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      title: 'Server error',
      error: err.message
    }
  ));
});

/**
 * Met à jour le producteur possédant l'id reçu.
 */
router.put('/:id', (req, res, next) => {
  /**
   * @param {Object} req
   * @param {Integer} req .id l&#x27;id du producteur à mettre à jour.
   */
  const requestOptions = {
    id: req.params.id
  };

  producersServices.updateProducer(requestOptions).then((result) => {
    res.status(result.status || httpStatus.OK).send(result);// result.data);
  }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
    {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      title: 'Server error',
      error: err.message
    }
  ));
});

/**
 * Supprime le producteur correspondant à l'id reçu.
 */
router.delete('/:id', (req, res, next) => {
  /**
   * @param {Object} req
   * @param {Integer} req .id L&#x27;id du producteur à supprimer.
   */
  const requestOptions = {
    id: req.params.id
  };

  producersServices.deleteProducer(requestOptions).then((result) => {
    res.status(result.status || httpStatus.OK).send(result);// result.data);
  }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
    {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      title: 'Server error',
      error: err.message
    }
  ));
});

module.exports = router;
