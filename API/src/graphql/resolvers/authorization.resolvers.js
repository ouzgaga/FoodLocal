const { ForbiddenError } = require('apollo-server-express');

const checkIfIsAuthenticated = idInContext => (idInContext ? true : new ForbiddenError('Sorry, you need to be authenticated to do that.'));

const checkIfIsYourself = (idInContext, idInArgs) => (idInArgs === idInContext ? true : new ForbiddenError(
  'You can\'t modify information of another user than yourself!'
));

const checkIfIsAdmin = isAdmin => (isAdmin ? true : new ForbiddenError('Sorry, you need to be an administrator to do that.'));

const checkIfIsUser = kind => (kind === 'users' ? true : new ForbiddenError('You can\'t modify information of another user than yourself!'));

const checkIfisProducer = kind => (kind === 'producers' ? true : new ForbiddenError('You can\'t modify information of another user than yourself!'));


const isAuthenticated = (idInContext) => {
  const result = checkIfIsAuthenticated(idInContext);
  if (result.message != null) {
    throw result;
  }
  return true;
};

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
