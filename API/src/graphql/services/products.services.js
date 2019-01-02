const mongoose = require('mongoose');
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
function getProducts({ tags = undefined, limit = 50, page = 0 } = {}) {
  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return ProductsModel.find({ tags })
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

/**
 * Retourne tous les produits dont l'id se trouve dans la liste passée en paramètre.
 * @param listOfIdToGet, liste contenant les ids des produits que l'on cherche.
 * @returns {*}
 */
function getAllProductsInReceivedIdList(listOfIdToGet) {
  return ProductsModel.find({ _id: { $in: listOfIdToGet } }).sort({ _id: 1 });
}

/**
 * Retourne le produit correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du produit à récupérer.
 */
function getProductById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received product.id is invalid!');
  } else {
    return ProductsModel.findById(id);
  }
}

/**
 * Ajoute un nouveau produit dans la base de données.
 * Attention, doublons autorisés!
 *
 * @param {Integer} product, Les informations du produit à ajouter.
 * @param producerId, L'id du producteur produisant le produit à ajouter.
 */
async function addProduct(product, producerId) {
  if (product.productTypeId != null && !mongoose.Types.ObjectId.isValid(product.productTypeId)) {
    return new Error('Received productType.id is invalid!');
  } else {
    const addedProduct = await new ProductsModel(product).save();

    // on ajoute l'id du producteur dans le tableau des producteurs produisant un ou plusieurs produits du productType de ce nouveau produit
    await productTypesServices.addProducerProducingThisProductType(product.productTypeId, producerId);

    // on ajoute l'id du produit dans le tableau des produits proposés par ce producteur
    await producersServices.addProductToProducer(addedProduct.id, producerId);

    return addedProduct;
  }
}

async function addAllProductsInArray(productsArray, producerId) {
  if (productsArray != null && productsArray.length !== 0) {
    const promisesAddProducts = productsArray.map(product => addProduct(product, producerId));
    return Promise.all(promisesAddProducts);
  } else {
    return new Error('function addAllProductsInArray: received productsArray is null or empty!');
  }
}

/**
 * Met à jour le produit possédant l'id reçu avec les données
 * reçues. Remplace toutes les données du produit dans la base
 * de données par celles reçues!
 * Ne modifie pas les informations du productType (car elles ne peuvent pas être modifiées par un producteur!)
 *
 * @param product, Les informations du produit à mettre à jour.
 */
async function updateProduct(product) {
  if (!mongoose.Types.ObjectId.isValid(product.id)) {
    return new Error('Received product.id is invalid!');
  }

  const updatedProduct = {
    ...product,
    productTypeId: product.productTypeId
  };

  return ProductsModel.findByIdAndUpdate(product.id, updatedProduct, { new: true }); // retourne l'objet modifié
}

/**
 * Supprime le produit correspondant à l'id reçu. Ne supprime pas le type du produit ni sa catégorie.
 *
 * @param product, Les informations du produit à supprimer.
 */
function deleteProduct(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received product.id is invalid!');
  }

  return ProductsModel.findByIdAndRemove(id);
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
