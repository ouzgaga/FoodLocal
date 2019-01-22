const { defaultFieldResolver } = require('graphql');
const { connectionArgs, connectionFromArray } = require('graphql-relay');
const { SchemaDirectiveVisitor } = require('apollo-server-express');

/**
 * Classe créant une directive permettant de créer automatiquement une connexion à partir d'un tableau. Lorsque la directive @connection est ajoutée dans le
 * schéma, le résultat obtenu dans le resolver correspondant est passé par cette classe. Les 4 paramètres optionnels (after, before, first et last) sont alors
 * ajoutés et le résultat du resolver (un tableau) est passé dans la fonction connectionFromArray qui le transforme tout seul en une connection respectant
 * la spécification des connections décrite ici: https://facebook.github.io/relay/graphql/connections.htm
 *
 * Créé par notre dieu à tous: Paul Nta
 */
class ConnectionDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    // get original resolver
    const { resolve = defaultFieldResolver } = field;

    // add connections arguments
    field.args.push({ name: 'after', type: connectionArgs.after.type });
    field.args.push({ name: 'before', type: connectionArgs.before.type });
    field.args.push({ name: 'first', type: connectionArgs.first.type });
    field.args.push({ name: 'last', type: connectionArgs.last.type });

    // wrap resolver
    field.resolve = async function(...args) {
      const results = await resolve.apply(this, args);

      if (args[1] == null || args[1].first == null || args[1].first > 100) {
        args[1].first = 100;
      }
      if (args[1].last == null || args[1].last > 100) {
        args[1].last = 100;
      }

      return connectionFromArray(results, args[1]);
    };
  }
}

module.exports = ConnectionDirective;
