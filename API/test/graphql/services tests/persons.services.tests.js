const personsService = require('../../../src/graphql/services/persons.services');
const producersService = require('../../../src/graphql/services/producers.services');
const usersService = require('../../../src/graphql/services/users.services');
const clearDB = require('../clearDB');
const populateDB = require('../../PopulateDatabase');

let producers = [];
let users = [];

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  await populateDB();

  users = await usersService.getUsers();
  users = users.map(u => u.toObject());
  producers = await producersService.getProducers();
  producers = producers.map(p => p.toObject());
};

describe('tests users services', () => {
  beforeEach(() => clearAndPopulateDB());


  describe('tests isEmailUnused', () => {
    it('should return false because this email is already used', async() => {
      let res = await personsService.isEmailUnused(users[0].email);
      res.should.be.false;

      res = await personsService.isEmailUnused(producers[0].email);
      res.should.be.false;
    });

    it('should return true because this email is not used', async() => {
      const res = await personsService.isEmailUnused('coucou@payouz.ch');
      res.should.be.true;
    });
  });

  describe('tests checkIfPersonIdExistInDB', () => {
    it('should return true because this user is in th DB', async() => {
      const personIsInDB = await personsService.checkIfPersonIdExistInDB(users[0].id);
      personIsInDB.should.be.true;
    });

    it('should return true because this producer is in th DB (without check if it is really a producer)', async() => {
      const personIsInDB = await personsService.checkIfPersonIdExistInDB(producers[0].id);
      personIsInDB.should.be.true;
    });

    it('should return true because this producer is in th DB and it is really a producer', async() => {
      const personIsInDB = await personsService.checkIfPersonIdExistInDB(producers[0].id, true);
      personIsInDB.should.be.true;

      producers[0].kind.should.be.equal('producers');
    });

    it('should return false because the received id is not a producer\'s id', async() => {
      const personIsInDB = await personsService.checkIfPersonIdExistInDB(users[0].id, true);
      personIsInDB.should.be.false;

      users[0].kind.should.be.equal('users');
    });

    it('should return false because the received id is an unknown id', async() => {
      let personIsInDB = await personsService.checkIfPersonIdExistInDB('abcdefabcdefabcdefabcdef');
      personIsInDB.should.be.false;

      personIsInDB = await personsService.checkIfPersonIdExistInDB('abcdefabcdefabcdefabcdef', true);
      personIsInDB.should.be.false;
    });

    it('should return false because no id received', async() => {
      let personIsInDB = await personsService.checkIfPersonIdExistInDB('');
      personIsInDB.message.should.be.equal('Received personRatingProducer.id is invalid!');

      personIsInDB = await personsService.checkIfPersonIdExistInDB('', true);
      personIsInDB.message.should.be.equal('Received personRatingProducer.id is invalid!');
    });

    it('should return false because invalid id received', async() => {
      let personIsInDB = await personsService.checkIfPersonIdExistInDB('abcedf'); // id trop court (< 24 caractères)
      personIsInDB.message.should.be.equal('Received personRatingProducer.id is invalid!');

      personIsInDB = await personsService.checkIfPersonIdExistInDB('abcedf', true); // id trop court (< 24 caractères)
      personIsInDB.message.should.be.equal('Received personRatingProducer.id is invalid!');

      personIsInDB = await personsService.checkIfPersonIdExistInDB('abcedfabcedfabcedfabcedfabcedf'); // id trop long (> 24 caractères)
      personIsInDB.message.should.be.equal('Received personRatingProducer.id is invalid!');

      personIsInDB = await personsService.checkIfPersonIdExistInDB('abcedfabcedfabcedfabcedfabcedf', true); // id trop long (> 24 caractères)
      personIsInDB.message.should.be.equal('Received personRatingProducer.id is invalid!');
    });
  });


  describe('tests getAllPersonsInReceivedIdList', () => {
    it('should get all persons with id in received list', async() => {
      // on récupère 3 personnes dans la DB
      let persons = await personsService.getAllPersonsInReceivedIdList([users[0].id, users[1].id, producers[0].id]);
      persons.should.be.an('array');
      persons.length.should.be.equal(3);

      // on récupère 2 utilisateurs
      persons = await personsService.getAllPersonsInReceivedIdList([users[0].id, producers[0].id]);
      persons.should.be.not.null;
      persons.should.be.an('array');
      persons.length.should.be.equal(2);

      // on récupère aucun utilisateur
      persons = await personsService.getAllPersonsInReceivedIdList([]);
      persons.should.be.not.null;
      persons.should.be.an('array');
      persons.length.should.be.equal(0);
    });
  });

  describe('tests subscribePersonToProducer', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should add only once a person to the followers of a producer', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      let person = (await personsService.subscribePersonToProducer(producers[0].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds[0].should.be.eql(producers[0]._id);

      // on récupère le producteur qui a un nouveau follower
      let producer0 = (await producersService.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(1);
      producer0.followersIds.should.contain.deep(users[0]._id);

      // on ajoute à nouveau le follower users[0] au producer producers[0] -> il ne doit pas être ajouté une 2ème fois.
      person = (await personsService.subscribePersonToProducer(producers[0].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds.should.contain.deep(producers[0]._id);

      // on récupère le producteur qui ne devrait pas avoir de 2ème nouveau follower
      producer0 = (await producersService.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(1);
      producer0.followersIds.should.contain.deep(users[0]._id);
    });

    it('should add multiple persons to the followers of a producer', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      let person = (await personsService.subscribePersonToProducer(producers[0].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds.should.contain.deep(producers[0]._id);

      // on récupère le producteur qui a un nouveau follower
      let producer0 = (await producersService.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(1);
      producer0.followersIds.should.contain.deep(users[0]._id);

      // on ajoute le follower users[1] au producer producers[0]
      person = (await personsService.subscribePersonToProducer(producers[0].id, users[1].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds.should.contain.deep(producers[0]._id);

      // on récupère le producteur qui devrait avoir un 2ème follower
      producer0 = (await producersService.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(2);
      producer0.followersIds.should.contain.deep(users[0]._id);
      producer0.followersIds.should.contain.deep(users[1]._id);

      // on ajoute le follower producer[1] au producer producers[0]
      person = (await personsService.subscribePersonToProducer(producers[0].id, producers[1].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds.should.contain.deep(producers[0]._id);

      // on ajoute le follower producer[2] au producer producers[0]
      person = (await personsService.subscribePersonToProducer(producers[0].id, producers[2].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds.should.contain.deep(producers[0]._id);

      // on récupère le producteur qui devrait avoir un total de 4 followers
      producer0 = (await producersService.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(4);
      producer0.followersIds.should.contain.deep(users[0]._id);
      producer0.followersIds.should.contain.deep(users[1]._id);
      producer0.followersIds.should.contain.deep(producers[1]._id);
      producer0.followersIds.should.contain.deep(producers[2]._id);
    });

    it('should add multiple producers to the following list of a person', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      let person = (await personsService.subscribePersonToProducer(producers[0].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds.should.contain.deep(producers[0]._id);

      // on récupère le producer0 qui a un nouveau follower
      const producer0 = (await producersService.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(1);
      producer0.followersIds.should.contain.deep(users[0]._id);

      // on ajoute le follower users[0] au producer producers[1]
      person = (await personsService.subscribePersonToProducer(producers[1].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(2);
      person.followingProducersIds.should.contain.deep(producers[0]._id);
      person.followingProducersIds.should.contain.deep(producers[1]._id);

      // on récupère le producer1 qui a un nouveau follower
      const producer1 = (await producersService.getProducerById(producers[1].id)).toObject();
      producer1.followersIds.length.should.be.equal(1);
      producer1.followersIds.should.contain.deep(users[0]._id);

      // on ajoute le follower users[0] au producer producers[2]
      person = (await personsService.subscribePersonToProducer(producers[2].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(3);
      person.followingProducersIds.should.contain.deep(producers[0]._id);
      person.followingProducersIds.should.contain.deep(producers[1]._id);
      person.followingProducersIds.should.contain.deep(producers[2]._id);

      // on récupère le producer2 qui a un nouveau follower
      const producer2 = (await producersService.getProducerById(producers[2].id)).toObject();
      producer2.followersIds.length.should.be.equal(1);
      producer2.followersIds.should.contain.deep(users[0]._id);

      // on ajoute le follower users[0] au producer producers[3]
      person = (await personsService.subscribePersonToProducer(producers[3].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(4);
      person.followingProducersIds.should.contain.deep(producers[0]._id);
      person.followingProducersIds.should.contain.deep(producers[1]._id);
      person.followingProducersIds.should.contain.deep(producers[2]._id);
      person.followingProducersIds.should.contain.deep(producers[3]._id);

      // on récupère le producer3 qui a un nouveau follower
      const producer3 = (await producersService.getProducerById(producers[0].id)).toObject();
      producer3.followersIds.length.should.be.equal(1);
      producer3.followersIds.should.contain.deep(users[0]._id);
    });

    it('should fail adding a person to the followers of a producer because personId and producerId are the sames', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      const person = await personsService.subscribePersonToProducer(producers[0].id, producers[0].id);
      person.message.should.not.be.null;
      person.message.should.be.equal('You can\'t follow yourself!');
    });

    it('should fail adding a person to the followers of a producer because producerId do not refer a producer', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      const person = await personsService.subscribePersonToProducer(users[0].id, users[1].id);
      person.message.should.not.be.null;
      person.message.should.be.equal('There is no producer with this id in database!');
    });
  });


  describe('tests unsubscribePersonToProducer', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should delete a person from the followers of a producer', async() => {
      // on ajoute les followers users[0] et users[1] au producer producers[0]
      await personsService.subscribePersonToProducer(producers[0].id, users[0].id);
      await personsService.subscribePersonToProducer(producers[0].id, users[1].id);

      // on récupère le producer0 qui a deux nouveaux followers
      let producer0 = (await producersService.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(2);
      producer0.followersIds.should.contain.deep(users[0]._id);
      producer0.followersIds.should.contain.deep(users[1]._id);

      // on supprime le follower users[0] des followers de producers[0]
      let person = (await personsService.unsubscribePersonToProducer(producers[0].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(0);
      person.followingProducersIds.should.not.contain.deep(producers[0]._id);

      // on récupère le producer0 qui n'a plus qu'un follower (users[1])
      producer0 = (await producersService.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(1);
      producer0.followersIds.should.not.contain.deep(users[0]._id);
      producer0.followersIds.should.contain.deep(users[1]._id);

      // on supprime le follower users[1] des followers de producers[0]
      person = (await personsService.unsubscribePersonToProducer(producers[0].id, users[1].id)).toObject();
      person.followingProducersIds.length.should.be.equal(0);
      person.followingProducersIds.should.not.contain.deep(producers[0]._id);

      // on récupère le producer0 qui n'a plus qu'un follower (users[1])
      producer0 = (await producersService.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(0);
      producer0.followersIds.should.not.contain.deep(users[0]._id);
      producer0.followersIds.should.not.contain.deep(users[1]._id);
    });

    it('should fail unsubscribe a person from the followers of a producer because personId and producerId are the sames', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      const person = await personsService.unsubscribePersonToProducer(producers[0].id, producers[0].id);
      person.message.should.not.be.null;
      person.message.should.be.equal('You can\'t follow yourself!');
    });

    it('should fail unsubscribe a person to the followers of a producer because producerId do not refer a producer', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      const person = await personsService.unsubscribePersonToProducer(users[0].id, users[1].id);
      person.message.should.not.be.null;
      person.message.should.be.equal('There is no producer with this id in database!');
    });
  });
});
