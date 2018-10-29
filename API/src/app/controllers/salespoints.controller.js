const express = require('express');
const httpStatus = require('http-status');
const salespointsServices = require('../services/salespoints.services');

const router = new express.Router();

/**
 * Retourne "limit" points de vente de la base de données, fitlrés
 *    selon les tags "tags" reçus à partir de la page "page". Sans
 *    paramètres, retourne tous les points de vente de la base de
 *    données.
 *
 * @param {JSON} req.query.tags, Tags à utiliser pour filtrer les résultats.
 * @param {Integer} req.query.limit, Nombre maximum de points de vente à retourner.
 * @param {Integer} req.query.page, Numéro de la page à retourner. Permet par exemple de récupérer la "page"ème page de "limit" points de
 *   vente. Par exemple, si "limit" vaut 20 et "page" vaut 3, on récupère la 3ème page de 20 points de vente, soit les points de vente 41 à
 *   60.
 */
router.get('/', (req, res, next) => salespointsServices.getSalesPoints(req.query)
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
 * Ajoute un nouveau point de vente dans la base de données.
 * Doublons autorisés!
 *
 * @param {Integer} req.body, Les informations du point de vente à ajouter.
 */
router.post('/', (req, res, next) => salespointsServices.addSalesPoints(req.body)
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
 * Retourne le point de vente correspondant à l'id reçu.
 *
 * @param  req.params.id, L'id du point de vente à récupérer.
 */
router.get('/:id', (req, res, next) => salespointsServices.getSalesPointById(req.params)
  .then((result) => {
    if (!res) {
      res.status(httpStatus.OK).send(result); // FIXME: faut-il mettre un return dans ce genre de fonction ou pas besoin?
    } else {
      res.status(httpStatus.NO_CONTENT).send();
    }
  })
  .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR)
    .send(
      {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        title : err.title,
        error : err.message
      }
    )));

/**
 * Met à jour le point de vente possédant l'id reçu avec les
 * données reçues. Remplace toutes les données du point de
 * vente dans la base de données par celles reçues!
 *
 * @param  req.params.id, L'id du point de vente à mettre à jour.
 * @param {Integer} req.body, Les informations du point de vente à mettre à jour.
 */
router.put('/:id', (req, res, next) => salespointsServices.updateSalesPoint(req.params.id, req.body)
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
 * Supprime le point de vente correspondant à l'id reçu.
 *
 * @param  req.params.id, L'id du point de vente à supprimer.
 */
router.delete('/:id', (req, res, next) => salespointsServices.deleteSalesPoint(req.params)
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
