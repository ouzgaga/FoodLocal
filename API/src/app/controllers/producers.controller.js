const express = require('express');
const httpStatus = require('http-status');
const producersServices = require('../services/producers.services');

const router = new express.Router();

/**
 * Retourne "limit" producteurs de la base de données, fitlrés
 * selon les tags "tags" reçus à partir de la page "page". Sans
 * paramètres, retourne tous les producteurs de la base de
 * données.
 *
 * @param {JSON} req.query.tags, Tags à utiliser pour filtrer les résultats.
 * @param {Integer} req.query.limit, Nombre maximum de producteurs à retourner.
 * @param {Integer} req.query.page, Numéro de la page à retourner. Permet par exemple de récupérer la "page"ème page de "limit" producteurs. Par
 *   exemple, si "limit" vaut 20 et "page" vaut 3, on récupère la 3ème page de 20 producteurs, soit les producteurs 41 à 60.
 * @param {Number} req.query.lat, La latitude de l'utilisateur
 * @param {Number} req.query.long, La longitude de l'utilisateur
 * @param {Integer} req.query.zoom, Le zoom actuel de la map de l'utilisateur. Permet à l'API de déterminer la zone vue par l'utilisateur et donc quels
 *   producteurs retourner pour l'affichage.
 */
router.get('/', (req, res, next) => producersServices.getProducer(req.query)
  .then(result => res.status(httpStatus.OK).send(result))
  .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR)
    .send(
      {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        title : err.title,
        error : err.message
      }
    )));

/**
 * Ajoute un nouveau producteur dans la base de données.
 * Attention, doublons autorisés!
 *
 * @param {Integer} req.body, Les informations du producteur à ajouter.
 */
// TODO: changer la valeur retournée! Retourner le code 201 avec une entête link contenant le lien vers /producers/:idQuiVientD'êtreCréé
router.post('/', (req, res, next) => producersServices.addProducer(req.body)
  .then(result => res.status(httpStatus.OK).send(result))
  .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR)
    .send(
      {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        title : err.title,
        error : err.message
      }
    )));

/**
 * Retourne le producteur correspondant à l'id reçu.
 *
 * @param {Integer} req.params.id, L'id du producteur à récupérer.
 */
router.get('/:id', (req, res, next) => producersServices.getProducerById(req.params)
  .then((result) => {
    if (result) {
      res.status(httpStatus.OK).send(result);
    } else {
      res.status(httpStatus.NO_CONTENT).send();
    }
  }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR)
    .send(
      {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        title : err.title,
        error : err.message
      }
    )));

/**
 * Met à jour le producteur possédant l'id reçu avec les
 * données reçues. Remplace toutes les données du producteur
 * dans la base de données par celles reçues!
 *
 * @param {Integer} req.params.id, L'id du producteur à mettre à jour.
 * @param {Integer} req.body, Les informations du producteur à mettre à jour.
 */
router.put('/:id', (req, res, next) => producersServices.updateProducer(req.params.id, req.body)
  .then(result => res.status(httpStatus.OK)
    .send(result))
  .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR)
    .send(
      {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        title : err.title,
        error : err.message
      }
    )));

/**
 * Supprime le producteur correspondant à l'id reçu.
 *
 * @param {Integer} req.params.id, L'id du producteur à supprimer.
 */
router.delete('/:id', (req, res, next) => producersServices.deleteProducer(req.params.id)
  .then(result => res.status(httpStatus.OK).send(result))
  .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR)
    .send(
      {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        title : err.title,
        error : err.message
      }
    )));

module.exports = router;
