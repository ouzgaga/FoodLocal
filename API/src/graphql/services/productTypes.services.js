const mongoose = require('mongoose');
const ProductTypesModel = require('../models/productTypes.modelgql');
const ProducerModel = require('../models/producers.modelgql');

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

  return ProductTypesModel.find(tags)
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

/**
 * Retourne le type de produit correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du type de produit à récupérer.
 */
function getProductTypeById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Received productType.id is invalid!');
  }

  return ProductTypesModel.findById(id);
}

function getProductTypeByCategory(productTypeCategoryId) {
  if (!mongoose.Types.ObjectId.isValid(productTypeCategoryId)) {
    throw new Error('Received productTypeCategory.id is invalid!');
  }

  return getProductTypes({ tags: { categoryId: productTypeCategoryId } });
}

function getProducersIdsProposingProductsOfAllReceivedProductsTypeIds(productTypeIdsTab) {
  return ProducerModel.aggregate(
    [
      { $match: { kind: 'producers' } },
      {
        $lookup: { from: 'products', localField: 'productsIds', foreignField: '_id', as: 'products' }
      },
      {
        $project: {
          products: { productTypeId: true }
        }
      },
      {
        $group: {
          _id: { producer: '$_id' },
          productTypeIds: { $addToSet: '$products.productTypeId' }
        }
      },
      {
        $unwind: { path: '$productTypeIds' }
      },
      {
        $match: {
          productTypeIds: {
            $all: productTypeIdsTab
          }
        }
      }
    ]
  );
}

/**
 * Ajoute un nouveau type de produit dans la base de données.
 * Attention, doublons autorisés!
 *
 * @param {Integer} productType, Les informations du type de produit à ajouter.
 */
function addProductType(productType) {
  const newProductType = {
    name: productType.name,
    image: productType.image,
    categoryId: productType.categoryId
  };
  return new ProductTypesModel(newProductType).save();
}

async function addProducerProducingThisProductType(productTypeId, producerId) {
  return ProductTypesModel.findByIdAndUpdate(productTypeId, { $addToSet: { producersIds: producerId } }, { new: true }); // retourne l'objet modifié
}

async function removeProducerProducingThisProductType(productTypeId, producerId) {
  return ProductTypesModel.findByIdAndUpdate(productTypeId, { $pull: { producersIds: producerId } }, { new: true }); // retourne l'objet modifié
}

/**
 * Met à jour le type de produit possédant l'id reçu avec les données
 * reçues. Remplace toutes les données du type de produit dans la base
 * de données par celles reçues!
 *
 * @param {ProductType} productType, Les informations du type de produit à mettre à jour.
 */
function updateProductType(productType) {
  if (!mongoose.Types.ObjectId.isValid(productType.id)) {
    throw new Error('Received productType.id is invalid!');
  }

  const updatedProductType = {
    id: productType.id,
    name: productType.name,
    image: productType.image,
    categoryId: productType.categoryId
    // fixme: checker que le tableau de producersIds n'est pas supprimé lorsqu'on met à jour!
  };

  return ProductTypesModel.findByIdAndUpdate(updatedProductType.id, updatedProductType, { new: true }); // retourne l'objet modifié
}

/**
 * Supprime le type de produit correspondant à l'id reçu. Ne supprime pas sa catégorie.
 *
 * @param id, Les informations du type de produit à supprimer.
 */
function deleteProductType(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Received productType.id is invalid!');
  }

  return ProductTypesModel.findByIdAndRemove(id);
}

module.exports = {
  getProductTypes,
  getProductTypeByCategory,
  getProducersIdsProposingProductsOfAllReceivedProductsTypeIds,
  addProductType,
  addProducerProducingThisProductType,
  removeProducerProducingThisProductType,
  getProductTypeById,
  updateProductType,
  deleteProductType
};
