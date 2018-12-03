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
  // Si le productType ne possède pas d'id -> on l'ajoute à la DB
  if (productType.id === undefined) {
    const newProductType = {
      ...productType,
      category: productType.category.id
    };
    return new ProductTypeModel(newProductType).save();
  } else {
    // Si le productType possède un id, il est déjà dans la DB -> pas besoin de l'ajouter -> on retourne simplement ce productType
    // FIXME: ou bien on met à jour le contenu de la DB ...?
    return productType;
  }
}

/**
 * Retourne le type de produit correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du type de produit à récupérer.
 */
function getProductTypeById({ id }) {
  let objectId = id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received productType.id is invalid!');
  } else {
    // FIXME: je comprend pas pourquoi je dois faire ça....?! Sans ça, il ne trouve pas de résultat alors que yen a.....
    objectId = new mongoose.Types.ObjectId(id);
  }

  return ProductTypeModel.findById(objectId);
}

/**
 * Met à jour le type de produit possédant l'id reçu avec les données
 * reçues. Remplace toutes les données du type de produit dans la base
 * de données par celles reçues!
 *
 * @param {Integer} productType, Les informations du type de produit à mettre à jour.
 */
async function updateProductType(productType) {
  if (!mongoose.Types.ObjectId.isValid(productType.id)) {
    return new Error('Received productType.id is invalid!');
  }

  const updatedProductType = {
    ...productType,
    category: productType.category.id
  };

  return ProductTypeModel.findByIdAndUpdate(updatedProductType.id, updatedProductType, { new: true }); // retourne l'objet modifié
}

/**
 * Supprime le type de produit correspondant à l'id reçu. Ne supprime pas sa catégorie.
 *
 * @param productType, Les informations du type de produit à supprimer.
 */
function deleteProductType(productType) {
  if (!mongoose.Types.ObjectId.isValid(productType.id)) {
    return new Error('Received productType.id is invalid!');
  }

  // FIXME: c'est quoi la différence entre findByIdAndDelete() et findByIdAndRemove() ?
  // FIXME: On retourne quoi après la suppression?
  return ProductTypeModel.findByIdAndRemove(productType.id);
}

module.exports = {
  getProductTypes,
  addProductType,
  getProductTypeById,
  updateProductType,
  deleteProductType
};
