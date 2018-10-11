/**
 * @param {Object} options
 * @param {Array} options.tags Tags à utiliser pour filtrer les résultats.
 * @param {Integer} options.limit Nombre maximum de produits à retourner.
 * @param {Integer} options.page Numéro de la page à retourner. Permet par exemple de récupérer la 3ème page de 20 produits, soit les produits 41 à 60.
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getProducts = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new Error({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: 'getProducts ok!'
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.addProduct = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new Error({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: 'addProduct ok!'
  };
};

/**
 * @param {Object} options
 * @param {Integer} options.id l&#x27;id du produit à récupérer
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getProductById = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new Error({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: 'getProductById ok!'
  };
};

/**
 * @param {Object} options
 * @param {Integer} options.id l&#x27;id du produit à mettre à jour.
 * @throws {Error}
 * @return {Promise}
 */
module.exports.updateProduct = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new Error({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: 'updateProduct ok!'
  };
};

/**
 * @param {Object} options
 * @param {Integer} options.id l&#x27;id du produit à supprimer
 * @throws {Error}
 * @return {Promise}
 */
module.exports.deleteProduct = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new Error({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: 'deleteProduct ok!'
  };
};

