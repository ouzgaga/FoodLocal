const mongoose = require('mongoose');
const { ProductType: ProductTypeModel } = require('../models/products.modelgql');

/**
 * Retourne "limit" types de produits de la base de données, fitlrés
 * selon les tags "tags" reçus à partir de la page "page". Sans
 * paramètres, retourne tous les types de produits de la base de
 * données.
 *
 * @param {Array} tags, Tags à utiliser pour filtrer les résultats.
 * @param {Integer} limit, Nombre maximum de produits à retourner.
 * @param {Integer} page, Numéro de la page à retourner. Permet par exemple de récupérer la "page"ème page de "limit" types de produits. Par exemple, si
 *   "limit" vaut 20 et "page" vaut 3, on récupère la 3ème page de 20 types de produits, soit les types de produits 41 à 60.
 */
function getProductTypes({ tags = undefined, limit = 50, page = 0 } = {}) {
  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return ProductTypeModel.find({ tags })
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

/**
 * Ajoute un nouveau type de produit dans la base de données.
 * Attention, doublons autorisés!
 *
 * @param {Integer} productType, Les informations du type de produit à ajouter.
 */
function addProductType(productType) {
  const newProductType = {
    ...productType,
    categoryId: productType.categoryId,
    producersIds: []
  };
  return new ProductTypeModel(newProductType).save();
}

/**
 * Retourne le type de produit correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du type de produit à récupérer.
 */
function getProductTypeById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received productType.id is invalid!');
  } else {
    return ProductTypeModel.findById(id);
  }
}

function getProductTypeByCategory(productTypeCategoryId) {
  if (!mongoose.Types.ObjectId.isValid(productTypeCategoryId)) {
    return new Error('Received productTypeCategory.id is invalid!');
  } else {
    return ProductTypeModel.find({ categoryId: productTypeCategoryId });
  }
}

async function getAllProducersIdsProposingProductsOfReceivedProductsTypeIds(productTypeIdsTab) {
  // on récupère tous les productTypes à partir des ids contenus dans le tableau reçu en paramètre
  const productTypes = await ProductTypeModel.find({ _id: { $in: productTypeIdsTab } });

  const producersIds = [];

  // on récupère tous les ids des producteurs proposant des produits de ces productTypes
  productTypes.map(p => p.producersIds.map(id => producersIds.push(id)));
  return producersIds;
}

/**
 * Met à jour le type de produit possédant l'id reçu avec les données
 * reçues. Remplace toutes les données du type de produit dans la base
 * de données par celles reçues!
 *
 * @param {ProductType} productType, Les informations du type de produit à mettre à jour.
 */
async function updateProductType(productType) {
  if (!mongoose.Types.ObjectId.isValid(productType.id)) {
    return new Error('Received productType.id is invalid!');
  }

  const updatedProductType = {
    id: productType.id,
    name: productType.name,
    image: productType.image,
    categoryId: productType.categoryId,
    producersIds: productType.producersIds != null ? productType.producersIds.map(p => p.id) : []
  };

  return ProductTypeModel.findByIdAndUpdate(updatedProductType.id, updatedProductType, { new: true }); // retourne l'objet modifié
}

async function addProducerProducingThisProductType(idProductType, idProducer) {
  const productType = await getProductTypeById(idProductType);
  if (productType.producersIds != null) {
    productType.producersIds.push(idProducer);
  } else {
    productType.producerIds = [idProducer];
  }

  return updateProductType(productType);
}

/**
 * Supprime le type de produit correspondant à l'id reçu. Ne supprime pas sa catégorie.
 *
 * @param id, Les informations du type de produit à supprimer.
 */
function deleteProductType(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received productType.id is invalid!');
  }

  // FIXME: c'est quoi la différence entre findByIdAndDelete() et findByIdAndRemove() ?
  // FIXME: On retourne quoi après la suppression?
  return ProductTypeModel.findByIdAndRemove(id);
}

module.exports = {
  getProductTypes,
  getProductTypeByCategory,
  getAllProducersIdsProposingProductsOfReceivedProductsTypeIds,
  addProductType,
  addProducerProducingThisProductType,
  getProductTypeById,
  updateProductType,
  deleteProductType
};
