require('../../src/app/models/producers.model');
require('../chai-config');
const mongoose = require('mongoose');
const producersServices = require('../../src/app/services/producers.services');

const Producers = mongoose.model('producers');

const benoit = {
  name       : 'Benoît',
  description: 'Responsable API!',
  phoneNumber: '0123456789',
  email      : 'benoit@api.com',
  isValidated: true,
  password   : '123456'
};
const antoine = {
  name       : 'Antoine',
  description: 'Linter professionel!',
  phoneNumber: '0123456789',
  email      : 'antoine@react.com',
  isValidated: true,
  password   : '123456'
};
const jerem = {
  name       : 'Jerem',
  description: 'Unlinter professionel!',
  phoneNumber: '0123456789',
  email      : 'jerem@ABasESLint.com',
  isValidated: true,
  password   : '123456'
};
const james = {
  name       : 'James',
  description: 'Responsable Infrastructure!',
  phoneNumber: '0123456789',
  email      : 'james@GoogleCloudEstMonAmi.com',
  isValidated: true,
  password   : '123456'
};
let ids;

describe('tests producers services', () => {
  beforeEach(() => Producers.deleteMany()
    .then(() => Promise.all([antoine, benoit, james, jerem].map(p => Producers.create(p)))
      .then(res => ids = res.map(d => d._id.toString()))));

  describe('getProducer', () => {
    it('should fetch all producers', () => producersServices.getProducer()
      .then((allProducers) => {
        allProducers.should.be.an('array');
        allProducers.should.be.lengthOf(4);

        allProducers.map(d => d._id.toString()).should.have.members(ids);
      }));

    it('should fetch all producers with default limit of 50', () => {
      const tabPromises = [...Array(100).keys()].map((identifier) => {
        const tonio = { ...antoine };
        tonio.name += identifier;
        return Producers.create(tonio);
      });

      return Producers.deleteMany().then(() => Promise.all(tabPromises)
        .then(() => producersServices.getProducer()
          .then((response) => {
            console.log("ERRRRRR", response);
            response.should.be.an('array');
            response.should.be.lengthOf(50);

            for (let i = 0; i < 50; i++) {
              response[i].name.should.be.equal(`Antoine${i}`);
            }
          })));
    });

    it('should fetch all producers that have their description containing the word "Responsable"', () => producersServices
      .getProducer({ tags: { description: /.*Responsable.*/i } }) // description contains 'Responsable'
      .then((results) => {
        const objects = results.map(d => d.toObject().name);
        objects.should.have.members([james.name, benoit.name]);
      }));

    it('should fetch all producers that have their name = "Benoît" AND their description containing the word "Responsable"',
      () => producersServices.getProducer({ tags: { name: 'Benoît', description: /.*Responsable.*/i } }) // name = 'Benoît' AND description contains 'Responsable'
        .then((results) => {
          results.should.be.an('array');
          results.should.be.lengthOf(1);
          const objects = results[0].toObject();
          objects.name.should.be.equal(benoit.name);
          objects.description.should.be.equal(benoit.description);
          objects.phoneNumber.should.be.equal(benoit.phoneNumber);
          objects.email.should.be.equal(benoit.email);
          objects.isValidated.should.be.equal(benoit.isValidated);
          objects.password.should.be.equal(benoit.password);
        }));

    it('should fetch all producers with limit of 10', () => {
      const tabPromises = [...Array(10).keys()].map(() => Producers.create(antoine));

      return Promise.all(tabPromises)
        .then(() => producersServices.getProducer()
          .then((allProducers) => {
            allProducers.should.be.an('array');
            allProducers.should.be.lengthOf(14);
          }).then(() => producersServices.getProducer({ limit: 10 })
            .then((limitedRes) => {
              limitedRes.should.be.an('array');
              limitedRes.should.be.lengthOf(10);
            })));
    });

    it('should fetch all producers from 50th to 99th (default limit is 50)', () => {
      const tabPromises = [...Array(100).keys()].map((identifier) => {
        const tonio = { ...antoine };
        tonio.name += identifier;
        return Producers.create(tonio);
      });

      let allProducersInDB;
      return Producers.deleteMany().then(() => Promise.all(tabPromises)
        .then(() => producersServices.getProducer({ limit: 110 })
          .then((allProducers) => {
            allProducersInDB = allProducers;
            allProducers.should.be.an('array');
            allProducers.should.be.lengthOf(100);
          })).then(() => producersServices.getProducer({ page: 1 })
          .then((limitedRes) => {
            limitedRes.should.be.an('array');
            limitedRes.should.be.lengthOf(50);
            for (let i = 0; i < 50; i++) {
              limitedRes[i].name.should.be.equal(allProducersInDB[i + 50].name);
            }
          })));
    });

    it('should fetch all producers with limit of 5 from 5th to 9th', () => {
      const tabPromises = [...Array(10).keys()].map((identifier) => {
        const tonio = { ...antoine };
        tonio.name += identifier;
        return Producers.create(tonio);
      });

      let allProducersInDB;
      return Promise.all(tabPromises)
        .then(() => producersServices.getProducer()
          .then((allProducers) => {
            allProducersInDB = allProducers;
            allProducers.should.be.an('array');
            allProducers.should.be.lengthOf(14);
          })).then(() => producersServices.getProducer({ limit: 5, page: 1 })
          .then((limitedRes) => {
            limitedRes.should.be.an('array');
            limitedRes.should.be.lengthOf(5);
            for (let i = 0; i < 5; i++) {
              limitedRes[i].name.should.be.equal(allProducersInDB[i + 5].name);
            }
          }));
    });

    // TODO: ajouter les tests pour lat, long et zoom lorsque les fonctionnalités seront implémentées...!
  });

  describe('addProducer', () => {
    it('should add new producer', () => producersServices.addProducer(benoit)
      .then((producer) => {
        producer.should.be.an('object');
        producer.should.be.not.null;
        producer._id.should.be.not.null;

        producer.name.should.be.equal(benoit.name);
        producer.description.should.be.equal(benoit.description);
        producer.phoneNumber.should.be.equal(benoit.phoneNumber);
        producer.email.should.be.equal(benoit.email);
        producer.isValidated.should.be.equal(benoit.isValidated);
        producer.password.should.be.equal(benoit.password);
      }));
  });

  describe('getProducerById', () => {
    it('should get producer with id', () => producersServices.getProducerById({ id: ids[1] })
      .then((producer) => {
        producer.should.be.an('object');
        producer.should.be.not.null;
        producer._id.should.be.not.null;
        producer.name.should.be.equal(benoit.name);
        producer.description.should.be.equal(benoit.description);
        producer.phoneNumber.should.be.equal(benoit.phoneNumber);
        producer.email.should.be.equal(benoit.email);
        producer.isValidated.should.be.equal(benoit.isValidated);
        producer.password.should.be.equal(benoit.password);
      }));
  });

  describe('updateProducer', () => {
    it('should update Antoine in Benoît', () => producersServices.updateProducer(ids[0], benoit)
      .then((producer) => {
        producer.should.be.an('object');
        producer.should.be.not.null;
        producer._id.should.be.not.null;
        producer.name.should.be.equal(benoit.name);
        producer.description.should.be.equal(benoit.description);
        producer.phoneNumber.should.be.equal(benoit.phoneNumber);
        producer.email.should.be.equal(benoit.email);
        producer.isValidated.should.be.equal(benoit.isValidated);
        producer.password.should.be.equal(benoit.password);
      }));
  });

  describe('deleteProducer', () => {
    it('should delete Antoine from DB', () => producersServices.deleteProducer({ id: ids[0] })
      .then((producer) => {
        producer.should.be.an('object');
        return producersServices.getProducer()
          .then((res) => {
            res.length.should.be.equal(3);
            res.map(d => d.toObject()._id).should.not.contain(producer.toObject()._id);
          });
      }));
  });
});
