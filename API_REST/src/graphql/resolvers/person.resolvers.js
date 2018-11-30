require('../../app/models/producers.model');

const PersonType = {
  USER    : 'users',
  PRODUCER: 'producers'
};


const personResolvers = {
  __resolveType(obj) {
    switch (obj.kind) {
      case PersonType.USER:
        return 'User';
      case PersonType.PRODUCER:
        return 'Producer';
      default:
        return null;
    }
  }
};

module.exports = personResolvers;
