const mongoose = require('mongoose');
const notificationsServices = require('./notifications.services');
const ProductsModel = require('../models/products.modelgql');
const productTypesServices = require('./productTypes.services');
const producersServices = require('./producers.services');

/**
 * Retourne "limit" produits de la base de données, fitlrés
 * selon les tags "tags" reçus à partir de la page "page". Sans
 * paramètres, retourne tous les produits de la base de
 * données.
 *
 * @param {Array} tags, Tags à utiliser pour filtrer les résultats.
 * @param {Integer} limit, Nombre maximum de produits à retourner.
 * @param {Integer} page, Numéro de la page à retourner. Permet par exemple de récupérer la "page"ème page de "limit" produits. Par exemple, si
 *   "limit" vaut 20 et "page" vaut 3, on récupère la 3ème page de 20 produits, soit les produits 41 à 60.
 */
function getProducts({ tags = undefined } = {}) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return ProductsModel.find({ tags })
    .sort({ _id: 1 });
}

/**
 * Retourne tous les produits dont l'id se trouve dans la liste passée en paramètre.
 * @param listOfIdToGet, liste contenant les ids des produits que l'on cherche.
 * @returns {*}
 */
function getAllProductsInReceivedIdList(listOfIdToGet) {
  return getProducts({ _id: { $in: listOfIdToGet } });
}

/**
 * Retourne le produit correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du produit à récupérer.
 */
function getProductById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Received product.id is invalid!');
  }

  return ProductsModel.findById(id);
}

/**
 * Ajoute un nouveau produit dans la base de données.
 * Attention, doublons autorisés!
 *
 * @param {Integer} product, Les informations du produit à ajouter.
 * @param producerId, L'id du producteur produisant le produit à ajouter.
 */
async function addProduct(product, producerId) {
  if (product.productTypeId == null || !mongoose.Types.ObjectId.isValid(product.productTypeId)) {
    throw new Error('Received productType.id is invalid!');
  }

  const addedProduct = await new ProductsModel(product).save();

  // on ajoute l'id du producteur dans le tableau des producteurs produisant un ou plusieurs produits du productType de ce nouveau produit
  const res = await productTypesServices.addProducerProducingThisProductType(product.productTypeId, producerId);

  // on ajoute l'id du produit dans le tableau des produits proposés par ce producteur
  await producersServices.addProductToProducer(addedProduct.id, producerId);

  // on ajoute une nouvelle notification signalant l'ajout d'un nouveau produit proposé par le producteur à tous ses followers
  await notificationsServices.addNotification('PRODUCER_UPDATE_PRODUCTS_LIST', producerId);

  return addedProduct;
}

async function addAllProductsInArray(productsArray, producerId) {
  if (productsArray != null && productsArray.length !== 0) {
    const promisesAddProducts = productsArray.map(product => addProduct(product, producerId));
    return Promise.all(promisesAddProducts);
  }

  throw new Error('function addAllProductsInArray: received productsArray is null or empty!');
}

/**
 * Met à jour le produit possédant l'id reçu avec les données
 * reçues. Remplace toutes les données du produit dans la base
 * de données par celles reçues!
 * Ne modifie pas les informations du productType (car elles ne peuvent pas être modifiées par un producteur!)
 *
 * @param product, Les informations du produit à mettre à jour.
 */
async function updateProduct({ id, description, productTypeId }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Received product.id is invalid!');
  }

  const updatedProduct = {
    id
  };
  // on ne déclare la description et le productTypeId que s'il est réellement donné, sinon, on ne les déclare même pas (pour
  // ne pas remplacer les données dans la DB par null sans le vouloir
  if (description !== undefined) {
    updatedProduct.description = description;
  }
  if (productTypeId !== undefined) {
    updatedProduct.productTypeId = productTypeId;
  }

  return ProductsModel.findByIdAndUpdate(id, updatedProduct, { new: true }); // retourne l'objet modifié
}

/**
 * Supprime le produit correspondant à l'id reçu. Ne supprime pas le type du produit ni sa catégorie.
 *
 * @param product, Les informations du produit à supprimer.
 */
async function deleteProduct(id, producerId) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Received product.id is invalid!');
  }

  const product = await ProductsModel.findByIdAndRemove(id);

  // on supprime l'id du producteur dans le tableau des producteurs produisant un ou plusieurs produits du productType du produit supprimé
  const res = await productTypesServices.removeProducerProducingThisProductType(product.productTypeId, producerId);

  // on supprime l'id du produit dans le tableau des produits proposés par ce producteur
  await producersServices.removeProductFromProducer(product.id, producerId);

  return product;
}

module.exports = {
  getProducts,
  getAllProductsInReceivedIdList,
  addAllProductsInArray,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct
};
