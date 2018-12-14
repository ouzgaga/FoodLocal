const merge = require('lodash/merge');
const path = require('path');
const { fileLoader, mergeTypes } = require('merge-graphql-schemas');

const Producer = require('./resolvers/producers.resolvers');
const User = require('./resolvers/users.resolvers');
const Utils = require('./resolvers/utils.resolvers');
const Person = require('./resolvers/person.resolvers');
const Product = require('./resolvers/products.resolvers');
const Salespoint = require('./resolvers/salespoint.resolvers');
const TokenValidationEmail = require('./resolvers/tokenValidationEmail.resolvers');


const resolvers = merge(
  Person,
  Producer,
  User,
  Product,
  Salespoint,
  Utils,
  TokenValidationEmail
);

const typesArray = fileLoader(path.join(__dirname, './schemas'));
const schema = mergeTypes(typesArray, { all: true });

module.exports = {
  resolvers,
  schema
};