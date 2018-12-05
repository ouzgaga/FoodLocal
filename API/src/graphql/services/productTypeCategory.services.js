const mongoose = require('mongoose');
const { ProductTypeCategory: ProductTypeCategoryModel } = require('../models/products.modelgql');

/**
 * Retourne "limit" catégories de produits de la base de données, filtrés
 * selon les tags "tags" reçus à partir de la page "page". Sans
 * paramètres, retourne toutes les catégories de produits de la base de
 * données.
 *
 * @param {Array} tags, Tags à utiliser pour filtrer les résultats.
 * @param {Integer} limit, Nombre maximum de catégories de produits à retourner.
 * @param {Integer} page, Numéro de la page à retourner. Permet par exemple de récupérer la "page"ème page de "limit" catégories de produits. Par exemple, si
 *   "limit" vaut 20 et "page" vaut 3, on récupère la 3ème page de 20 catégories de produits, soit les catégories de produits 41 à 60.
 */
function getProductsCategories({ tags = undefined, limit = 50, page = 0 } = {}) {
  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return ProductTypeCategoryModel.find({ tags })
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

/**
 * Ajoute une nouvelle catégorie de produits dans la base de données.
 * Attention, doublons autorisés!
 *
 * @param productTypeCategory, Les informations de la catégorie de produits à ajouter.
 */
function addProductTypeCategory(productTypeCategory) {
  return new ProductTypeCategoryModel(productTypeCategory).save();
}

/**
 * Retourne la catégorie de produits correspondante à l'id reçu.
 *
 * @param productTypeCategory, un objet contenant l'id de la catégorie de produits à récupérer dans un champ nommé 'id'.
 */
function getProductTypeCategoryById(id) {
  let objectId = id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received productTypeCategory.id is invalid!');
  } else {
    // FIXME: je comprend pas pourquoi je dois faire ça....?! Sans ça, il ne trouve pas de résultat alors que yen a.....
    objectId = new mongoose.Types.ObjectId(id);
  }

  return ProductTypeCategoryModel.findById(objectId);
}

/**
 * Met à jour la catégorie de produits possédant l'id reçu avec les données
 * reçues. Remplace toutes les données de la catégorie de produits dans la base
 * de données par celles reçues!
 *
 * @param {Integer} productTypeCategory, Les informations de la catégorie de produits à mettre à jour.
 */
function updateProductTypeCategory(productTypeCategory) {
  if (!mongoose.Types.ObjectId.isValid(productTypeCategory.id)) {
    return new Error('Received productTypeCategory.id is invalid!');
  }

  return ProductTypeCategoryModel.findByIdAndUpdate(productTypeCategory.id, productTypeCategory, { new: true }); // retourne l'objet modifié
}

/**
 * Supprime la catégorie de produits correspondante à l'id reçu.
 *
 * @param {Integer} id, L'id de la catégorie de produits à supprimer.
 */
function deleteProductTypeCategory(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received productTypeCategory.id is invalid!');
  }

  return ProductTypeCategoryModel.findByIdAndRemove(id);
}

module.exports = {
  getProductsCategories,
  addProductTypeCategory,
  getProductTypeCategoryById,
  updateProductTypeCategory,
  deleteProductTypeCategory
};
