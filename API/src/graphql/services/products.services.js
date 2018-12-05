const mongoose = require('mongoose');
const { Products: ProductModel } = require('../models/products.modelgql');

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

  return ProductModel.find({ tags })
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

function getAllProductsInReceivedIdList(listOfIdToGet) {
  return ProductModel.find({ _id: { $in: listOfIdToGet } });
}

/**
 * Ajoute un nouveau produit dans la base de données.
 * Attention, doublons autorisés!
 *
 * @param {Integer} product, Les informations du produit à ajouter.
 */
async function addProduct(product) {
  let productTypeId;
  if (!mongoose.Types.ObjectId.isValid(product.productType.id)) {
    return new Error('Received productType.id is invalid!');
  } else {
    // FIXME: je comprend pas pourquoi je dois faire ça....?! Sans ça, il ne trouve pas de résultat alors que yen a.....
    productTypeId = new mongoose.Types.ObjectId(product.productType.id);
  }
  const newProduct = {
    description: product.description,
    productType: productTypeId
  };

  return new ProductModel(newProduct).save();
}

async function addAllProductsInArray(productsArray) {
  const promises = [];
  productsArray.map(product => promises.push(addProduct(product)));
  const resolvedPromises = await Promise.all(promises);
  return resolvedPromises.map(res => res.id);
}

/**
 * Retourne le produit correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du produit à récupérer.
 */
function getProductById({ id }) {
  let objectId = id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received product.id is invalid!');
  } else {
    // FIXME: je comprend pas pourquoi je dois faire ça....?! Sans ça, il ne trouve pas de résultat alors que yen a.....
    objectId = new mongoose.Types.ObjectId(id);
  }

  return ProductModel.findById(objectId);
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
    productType: product.productType.id
  };

  return ProductModel.findByIdAndUpdate(product.id, updatedProduct, { new: true }); // retourne l'objet modifié
}

/**
 * Supprime le produit correspondant à l'id reçu. Ne supprime pas le type du produit ni sa catégorie.
 *
 * @param product, Les informations du produit à supprimer.
 */
function deleteProduct({ id }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received product.id is invalid!');
  }

  return ProductModel.findByIdAndRemove(id);
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
