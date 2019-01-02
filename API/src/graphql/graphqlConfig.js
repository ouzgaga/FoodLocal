const merge = require('lodash/merge');
const path = require('path');
const { fileLoader, mergeTypes } = require('merge-graphql-schemas');

const Producer = require('./resolvers/producers.resolvers');
const User = require('./resolvers/users.resolvers');
const Person = require('./resolvers/persons.resolvers');
const PersonRatingProducer = require('./resolvers/personRatingProducers.resolvers');
const Product = require('./resolvers/products.resolvers');
const Salespoint = require('./resolvers/salespoints.resolvers');
const TokenValidationEmail = require('./resolvers/tokens.resolvers');


const resolvers = merge(
  Person,
  PersonRatingProducer,
  Producer,
  User,
  Product,
  Salespoint,
  TokenValidationEmail
);

const typesArray = fileLoader(path.join(__dirname, './schemas'));
const schema = mergeTypes(typesArray, { all: true });

module.exports = {
  resolvers,
  schema
};
