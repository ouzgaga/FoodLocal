/**
 * @param {Object} options
 * @param {Array} options.tags Tags à utiliser pour filtrer les résultats.
 * @param {Integer} options.limit Nombre maximum de points de vente à retourner.
 * @param {Integer} options.page Numéro de la page à retourner. Permet par exemple de récupérer la 3ème page de 20 points de ventes, soit les points de vente 41 à 60.
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getSalesPoints = async (options) => {
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
    data: 'getSalesPoints ok!'
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.addSalesPoints = async (options) => {
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
    data: 'addSalesPoints ok!'
  };
};

/**
 * @param {Object} options
 * @param {Integer} options.id L&#x27;id du point de vente à récupérer.
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getSalesPointById = async (options) => {
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
    data: 'getSalesPointById ok!'
  };
};

/**
 * @param {Object} options
 * @param {Integer} options.id l&#x27;id du point de vente à mettre à jour.
 * @throws {Error}
 * @return {Promise}
 */
module.exports.updateSalesPoint = async (options) => {
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
    data: 'updateSalesPoint ok!'
  };
};

/**
 * @param {Object} options
 * @param {Integer} options.id L&#x27;id du point de vente à supprimer.
 * @throws {Error}
 * @return {Promise}
 */
module.exports.deleteSalesPoint = async (options) => {
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
    data: 'deleteSalesPoint ok!'
  };
};

