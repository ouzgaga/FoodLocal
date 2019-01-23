module.exports = {
  getProducts,
  getAllProductsInReceivedIdList,
  addAllProductsInArray,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct
};

const ProductsModel = require('../models/products.modelgql');
const productTypesServices = require('./productTypes.services');
const producersServices = require('./producers.services');
const notificationsServices = require('./notifications.services');

/**
 * Retourne tous les produits de la base de données, filtrés en fonction des tags reçus.
 *
 * @param tags, objet contenant les tags à utiliser pour filtrer les résultats. Séparer plusieurs tags à l'aide de ','.
 * @returns tous les produits de la base de données triés par id et filtrés en fonction des tags reçus.
 */
function getProducts({ tags = undefined } = {}) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return ProductsModel.find(tags)
    .sort({ _id: 1 });
}

/**
 * Retourne tous les produits dont l'id se trouve dans la liste passée en paramètre.
 * @param listOfIdToGet, un tableau contenant les ids des produits que l'on cherche.
 * @returns un tableau contenant tous les produits dont l'id se trouve dans le tableau listOfIdToGet reçu.
 */
function getAllProductsInReceivedIdList(listOfIdToGet) {
  return getProducts({ tags: { _id: { $in: listOfIdToGet } } });
}

/**
 * Retourne le produit correspondant à l'id reçu.
 *
 * @param id, l'id du produit à récupérer.
 * @returns retourne le produit correspondant à l'id reçu.
 */
function getProductById(id) {
  return ProductsModel.findById(id);
}

/**
 * Ajoute un nouveau produit dans la base de données et le lie au producteur correspondant à l'id 'producerId'.
 *
 * @param product, les informations du produit à ajouter.
 * @param producerId, l'id du producteur produisant le produit à ajouter.
 */
async function addProduct(product, producerId) {
  if (product.productTypeId == null) {
    throw new Error('Received product.productTypeId is invalid!');
  }

  const addedProduct = await new ProductsModel(product).save();

  // on ajoute l'id du producteur dans le tableau des producteurs produisant un ou plusieurs produits du productType de ce nouveau produit
  await productTypesServices.addProducerProducingThisProductType(product.productTypeId, producerId);

  // on ajoute l'id du produit dans le tableau des produits proposés par ce producteur
  await producersServices.addProductToProducer(addedProduct.id, producerId);

  // on ajoute une nouvelle notification signalant l'ajout d'un nouveau produit proposé par le producteur à tous ses followers
  await notificationsServices.addNotification('PRODUCER_UPDATE_PRODUCTS_LIST', producerId);

  return addedProduct;
}

/**
 * Ajoute tous les produits du tableau 'productArray' et les attribue au producteur correspondant à l'id 'producerId'.
 * @param productsArray, un tableau contenant tous les produits à ajouter.
 * @param producerId, l'id du producteur à qui lier les produits ajoutés.
 * @returns un tableau contenant tous les produits ajoutés.
 */
async function addAllProductsInArray(productsArray, producerId) {
  if (productsArray != null && productsArray.length !== 0) {
    const promisesAddProducts = productsArray.map(product => addProduct(product, producerId));
    return Promise.all(promisesAddProducts);
  }

  throw new Error('function addAllProductsInArray: received productsArray is null or empty!');
}

/**
 * Met à jour le produit correspondant à l'id reçu avec le reste des informations reçues.
 * @param id, l'id du produit à mettre à jour.
 * @param description, la decription du produit.
 * @param productTypeId, l'id du productType du produit.
 * @returns le produit mis à jour.
 */
async function updateProduct({ id, description, productTypeId }) {
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

  return ProductsModel.findByIdAndUpdate(id, updatedProduct, { new: true, runValidators: true }); // retourne l'objet modifié
}

/**
 * Supprime le produit correspondant à l'id reçu. Ne supprime pas le type du produit ni sa catégorie.
 *
 * @param id, l'id du produit à supprimer.
 * @param producerId, l'id du producteur possédant le produit.
 * @returns le produit supprimé.
 */
async function deleteProduct(id, producerId) {
  const product = await ProductsModel.findByIdAndRemove(id);

  if (product != null) {
    // on supprime l'id du producteur dans le tableau des producteurs produisant un ou plusieurs produits du productType du produit supprimé
    await productTypesServices.removeProducerProducingThisProductType(product.productTypeId, producerId);

    // on supprime l'id du produit dans le tableau des produits proposés par ce producteur
    await producersServices.removeProductFromProducer(product.id, producerId);
  }
  return product;
}
