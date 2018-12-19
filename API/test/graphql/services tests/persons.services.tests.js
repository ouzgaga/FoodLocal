const personsServices = require('../../../src/graphql/services/persons.services');
const producersServices = require('../../../src/graphql/services/producers.services');
const usersServices = require('../../../src/graphql/services/users.services');
const clearDB = require('../clearDB');
const populateDB = require('../../PopulateDatabase');

let producers = [];
let users = [];

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  await populateDB();

  users = await usersServices.getUsers();
  users = users.map(u => u.toObject());
  producers = await producersServices.getProducers();
  producers = producers.map(p => p.toObject());
};

describe('tests users services', () => {
  beforeEach(() => clearAndPopulateDB());


  describe('tests isEmailUnused', () => {
    it('should return false because this email is already used', async() => {
      let res = await personsServices.isEmailUnused(users[0].email);
      res.should.be.false;

      res = await personsServices.isEmailUnused(producers[0].email);
      res.should.be.false;
    });

    it('should return true because this email is not used', async() => {
      const res = await personsServices.isEmailUnused('coucou@payouz.ch');
      res.should.be.true;
    });
  });

  describe('tests checkIfPersonIdExistInDB', () => {
    it('should return true because this user is in th DB', async() => {
      const personIsInDB = await personsServices.checkIfPersonIdExistInDB(users[0].id);
      personIsInDB.should.be.true;
    });

    it('should return true because this producer is in th DB (without check if it is really a producer)', async() => {
      const personIsInDB = await personsServices.checkIfPersonIdExistInDB(producers[0].id);
      personIsInDB.should.be.true;
    });

    it('should return true because this producer is in th DB and it is really a producer', async() => {
      const personIsInDB = await personsServices.checkIfPersonIdExistInDB(producers[0].id, true);
      personIsInDB.should.be.true;

      producers[0].kind.should.be.equal('producers');
    });

    it('should return false because the received id is not a producer\'s id', async() => {
      const personIsInDB = await personsServices.checkIfPersonIdExistInDB(users[0].id, true);
      personIsInDB.should.be.false;

      users[0].kind.should.be.equal('users');
    });

    it('should return false because the received id is an unknown id', async() => {
      let personIsInDB = await personsServices.checkIfPersonIdExistInDB('abcdefabcdefabcdefabcdef');
      personIsInDB.should.be.false;

      personIsInDB = await personsServices.checkIfPersonIdExistInDB('abcdefabcdefabcdefabcdef', true);
      personIsInDB.should.be.false;
    });

    it('should return false because no id received', async() => {
      let personIsInDB = await personsServices.checkIfPersonIdExistInDB('');
      personIsInDB.message.should.be.equal('Received personRatingProducer.id is invalid!');

      personIsInDB = await personsServices.checkIfPersonIdExistInDB('', true);
      personIsInDB.message.should.be.equal('Received personRatingProducer.id is invalid!');
    });

    it('should return false because invalid id received', async() => {
      let personIsInDB = await personsServices.checkIfPersonIdExistInDB('abcedf'); // id trop court (< 24 caractères)
      personIsInDB.message.should.be.equal('Received personRatingProducer.id is invalid!');

      personIsInDB = await personsServices.checkIfPersonIdExistInDB('abcedf', true); // id trop court (< 24 caractères)
      personIsInDB.message.should.be.equal('Received personRatingProducer.id is invalid!');

      personIsInDB = await personsServices.checkIfPersonIdExistInDB('abcedfabcedfabcedfabcedfabcedf'); // id trop long (> 24 caractères)
      personIsInDB.message.should.be.equal('Received personRatingProducer.id is invalid!');

      personIsInDB = await personsServices.checkIfPersonIdExistInDB('abcedfabcedfabcedfabcedfabcedf', true); // id trop long (> 24 caractères)
      personIsInDB.message.should.be.equal('Received personRatingProducer.id is invalid!');
    });
  });


  describe('tests getAllPersonsInReceivedIdList', () => {
    it('should get all persons with id in received list', async() => {
      // on récupère 3 personnes dans la DB
      let persons = await personsServices.getAllPersonsInReceivedIdList([users[0].id, users[1].id, producers[0].id]);
      persons.should.be.an('array');
      persons.length.should.be.equal(3);

      // on récupère 2 utilisateurs
      persons = await personsServices.getAllPersonsInReceivedIdList([users[0].id, producers[0].id]);
      persons.should.be.not.null;
      persons.should.be.an('array');
      persons.length.should.be.equal(2);

      // on récupère aucun utilisateur
      persons = await personsServices.getAllPersonsInReceivedIdList([]);
      persons.should.be.not.null;
      persons.should.be.an('array');
      persons.length.should.be.equal(0);
    });
  });
});
