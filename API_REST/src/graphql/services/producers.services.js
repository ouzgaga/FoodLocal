const Producers = require('../models/producers.model');

/**
 * Retourne "limit" producteurs de la base de données, fitlrés
 * selon les tags "tags" reçus à partir de la page "page". Sans
 * paramètres, retourne tous les producteurs de la base de
 * données.
 *
 * @param {Array} tags, Tags à utiliser pour filtrer les résultats. Séparer plusieurs tags à l'aide de ','.
 * @param {Integer} limit, Nombre maximum de producteurs à retourner.
 * @param {Integer} page, Numéro de la page à retourner. Permet par exemple de récupérer la 'page'ème page de 'limit'
 * producteurs. Par exemple, si 'limit' vaut 20 et 'page' vaut 3, on récupère la 3ème page de 20 producteurs, soit les producteurs 41 à 60.
 */
function getProducers({ tags = undefined, limit = 30, page = 0 } = {}) {
  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return Producers.find(tags)
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit)
    .exec();
}

/**
 * Retourne le producteur correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du producteur à récupérer.
 * @returns {*}
 */
function getProducerById({ id }) {
  return Producers.findById(id);
}

/**
 * Retourne tous les producteurs dont l'id se trouve dans la liste passée en paramètre.
 * @param listOfIdToGet, liste contenant les ids des producteurs que l'on cherche.
 * @returns {*}
 */
function getAllProducersInReceivedIdList(listOfIdToGet) {
  return Producers.find({ _id: { $in: listOfIdToGet } });
}


/**
 * Ajoute un nouveau producteur dans la base de données.
 * Doublons autorisés!
 *
 * @param {Integer} bodyContent, Les informations du producteur à ajouter.
 */
function addProducer(bodyContent) {
  return new Producers(bodyContent).save();
}

/**
 * Met à jour le producteur possédant l'id reçu avec les
 * données reçues. Remplace toutes les données du producteur
 * dans la base de données par celles reçues!
 *
 * @param {Integer} id, L'id du producteur à mettre à jour.
 * @param {Integer} producerInfos, Les informations du producteur à mettre à jour.
 */
function updateProducer(id, producerInfos) {
  return Producers.findByIdAndUpdate(id, producerInfos, { new: true }); // retourne l'objet modifié  // FIXME: faut-il ajouter .exec() ??
  // return Producers.updateOne(producerInfos); // retourne un OK mais pas l'objet modifié
}

/**
 * Supprime le producteur correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du producteur à supprimer.
 */
function deleteProducer({ id }) {
  return Producers.findByIdAndRemove(id);
}

module.exports = {
  getProducers,
  addProducer,
  getProducerById,
  updateProducer,
  deleteProducer,
  getAllProducersInReceivedIdList
};
