const mongoose = require('mongoose');
const { Products: ProductModel } = require('../models/products.modelgql');
const productTypeServices = require('./productType.services');

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

/**
 * Retourne tous les produits dont l'id se trouve dans la liste passée en paramètre.
 * @param listOfIdToGet, liste contenant les ids des produits que l'on cherche.
 * @returns {*}
 */
function getAllProductsInReceivedIdList(listOfIdToGet) {
  return ProductModel.find({ _id: { $in: listOfIdToGet } }).sort({ _id: 1 });
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
    return ProductModel.findById(id);
  }
}

/**
 * Ajoute un nouveau produit dans la base de données.
 * Attention, doublons autorisés!
 *
 * @param {Integer} product, Les informations du produit à ajouter.
 */
async function addProduct(product) {
  if (product.productTypeId != null && !mongoose.Types.ObjectId.isValid(product.productTypeId)) {
    return new Error('Received productType.id is invalid!');
  } else {
    const productType = await productTypeServices.getProductTypeById(product.productTypeId);

    if (productType != null) {
      const newProduct = {
        description: product.description,
        productTypeId: productType.id
      };

      return new ProductModel(newProduct).save();
    } else {
      throw new Error("This productType.id doesn't exist!");
    }
  }
}

async function addAllProductsInArray(productsArray) {
  // FIXME: Comment faire pour ne récupérer que l'objet souhaité (celui qui est dans _doc) sans tous les champs de mongoose...?
  const promises = [];
  productsArray.forEach(product => promises.push(addProduct(product)));
  const resolvedPromises = await Promise.all(promises);
  return resolvedPromises.map(addedProduct => addedProduct.id);
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

  return ProductModel.findByIdAndUpdate(product.id, updatedProduct, { new: true }); // retourne l'objet modifié
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
