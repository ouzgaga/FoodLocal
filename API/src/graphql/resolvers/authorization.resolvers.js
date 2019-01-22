const { ForbiddenError } = require('apollo-server-express');

/**
 * Retourne true si idInContext != null.
 * @param idInContext, l'id récupéré dans le context.
 * @returns true si idInContext != null, lève une erreur sinon.
 */
const checkIfIsAuthenticated = idInContext => (idInContext ? true : new ForbiddenError('Sorry, you need to be authenticated to do that.'));

/**
 * Retourne true si idInContext === idInArgs
 * @param idInContext, l'id récupéré dans le context.
 * @param idInArgs, l'id récupéré dans les paramètres de la requête.
 * @returns true si idInContext === idInArgs, lève une erreur sinon.
 */
const checkIfIsYourself = (idInContext, idInArgs) => (idInArgs === idInContext ? true : new ForbiddenError(
  'You can\'t modify information of another user than yourself!'
));

/**
 * Retourne true si isAdmin != null.
 * @returns true si isAdmin != null, lève une erreur sinon.
 */
const checkIfIsAdmin = isAdmin => (isAdmin ? true : new ForbiddenError('Sorry, you need to be an administrator to do that.'));

/**
 * Retourne true si kind === 'users'.
 * @returns true si kind === 'users', lève une erreur sinon.
 */
const checkIfIsUser = kind => (kind === 'users' ? true : new ForbiddenError('You can\'t modify information of another user than yourself!'));

/**
 * Retourne true si kind === 'producers'.
 * @returns true si kind === 'producers', lève une erreur sinon.
 */
const checkIfisProducer = kind => (kind === 'producers' ? true : new ForbiddenError('You can\'t modify information of another user than yourself!'));

/**
 * Retourne true si l'id reçu en paramètre != null, lève une erreur sinon.
 * @param idInContext, l'id récupéré dans le context.
 * @returns true si l'id reçu en paramètre != null, lève une erreur sinon.
 */
const isAuthenticated = (idInContext) => {
  const result = checkIfIsAuthenticated(idInContext);
  if (result.message != null) {
    throw result;
  }
  return true;
};

/**
 * Retourne true si idInContext === idInArgs, lève une erreur sinon.
 * @param idInContext, l'id récupéré dans le context.
 * @param idInArgs, l'id récupéré dans les paramètres de la requête.
 * @returns true si idInContext === idInArgs, lève une erreur sinon.
 */
const isAuthenticatedAndIsYourself = (idInContext, idInArgs) => {
  const resultAuthenticated = checkIfIsAuthenticated(idInContext);
  const resultYourself = checkIfIsYourself(idInContext, idInArgs);
  if (resultAuthenticated.message != null) {
    throw resultAuthenticated;
  }
  if (resultYourself.message != null) {
    throw resultYourself;
  }
  return true;
};

/**
 * Retourne true si idInContext != null et isAdmin === true, lève une erreur sinon.
 * @param idInContext, l'id récupéré dans le context.
 * @param isAdmin, le booléen isAdmin récupéré dans le context.
 * @returns true si idInContext != null && isAdmin === true, lève une erreur sinon.
 */
const isAuthenticatedAsAdmin = (idInContext, isAdmin) => {
  const resultAuthenticated = checkIfIsAuthenticated(idInContext);
  const resultAdmin = checkIfIsAdmin(isAdmin);
  if (resultAuthenticated.message != null) {
    throw resultAuthenticated;
  }
  if (resultAdmin.message != null) {
    throw resultAdmin;
  }
  return true;
};

/**
 * Retourne true si idInContext === idInArgs et kind === 'users', lève une erreur sinon.
 * @param idInContext, l'id récupéré dans le context.
 * @param idInArgs, l'id récupéré dans les paramètres de la requête.
 * @param kind, la string kind récupérée dans le context.
 * @returns true si idInContext === idInArgs && kind === 'users', lève une erreur sinon.
 */
const isAuthenticatedAsUserAndIsYourself = (idInContext, idInArgs, kind) => {
  const resultAuthenticated = checkIfIsAuthenticated(idInContext);
  const resultYourself = checkIfIsYourself(idInContext, idInArgs);
  const resultUser = checkIfIsUser(kind);
  if (resultAuthenticated.message != null) {
    throw resultAuthenticated;
  }
  if (resultYourself.message != null) {
    throw resultYourself;
  }
  if (resultUser.message != null) {
    throw resultUser;
  }
  return true;
};

/**
 * Retourne true si idInContext === idInArgs et kind === 'producers', lève une erreur sinon.
 * @param idInContext, l'id récupéré dans le context.
 * @param idInArgs, l'id récupéré dans les paramètres de la requête.
 * @param kind, la string kind récupérée dans le context.
 * @returns true si idInContext === idInArgs && kind === 'producers', lève une erreur sinon.
 */
const isAuthenticatedAsProducerAndIsYourself = (idInContext, idInArgs, kind) => {
  const resultAuthenticated = checkIfIsAuthenticated(idInContext);
  const resultYourself = checkIfIsYourself(idInContext, idInArgs);
  const resultProducer = checkIfisProducer(kind);
  if (resultAuthenticated.message != null) {
    throw resultAuthenticated;
  }
  if (resultYourself.message != null) {
    throw resultYourself;
  }
  if (resultProducer.message != null) {
    throw resultProducer;
  }
  return true;
};

module.exports = {
  isAuthenticated,
  isAuthenticatedAndIsYourself,
  isAuthenticatedAsAdmin,
  isAuthenticatedAsProducerAndIsYourself,
  isAuthenticatedAsUserAndIsYourself
};
