require('../src/app/models/producers.model');
require('./chai-config');
const mongoose = require('mongoose');
const salespointsServices = require('../src/app/services/salespoints.services');

const Producers = mongoose.model('producers');
const Salespoints = mongoose.model('salespoints');

const producer1 = {
  name       : 'À la ferme',
  description: 'Petite ferme sympa!',
  phoneNumber: '0123456789',
  email      : 'ferme@locale.ch',
  isValidated: true,
  password   : '123456'
};
const producer2 = {
  name       : 'Au bon vin',
  description: 'Un vignoble magnifique!',
  phoneNumber: '0123456789',
  email      : 'aubonvin@vignoble.ch',
  isValidated: true,
  password   : '123456'
};

const fermeVignobleSchedules = {
  schedule: {
    dailySchedule: [
      {
        weekday      : 'lundi',
        openingHourAM: '2018-01-01T08:00:00.000Z',
        openingHourPM: '2018-01-01T13:00:00.000Z',
        closingHourAM: '2018-01-01T11:30:00.000Z',
        closingHourPM: '2018-01-01T18:00:00.000Z'
      },
      {
        weekday      : 'mardi',
        openingHourAM: '2018-01-01T08:00:00.000Z',
        openingHourPM: '2018-01-01T13:00:00.000Z',
        closingHourAM: '2018-01-01T11:30:00.000Z',
        closingHourPM: '2018-01-01T18:00:00.000Z'
      },
      {
        weekday      : 'mercredi',
        openingHourAM: '2018-01-01T08:00:00.000Z',
        openingHourPM: '2018-01-01T13:00:00.000Z',
        closingHourAM: '2018-01-01T11:30:00.000Z',
        closingHourPM: '2018-01-01T18:00:00.000Z'
      },
      {
        weekday      : 'jeudi',
        openingHourAM: '2018-01-01T08:00:00.000Z',
        openingHourPM: '2018-01-01T13:00:00.000Z',
        closingHourAM: '2018-01-01T11:30:00.000Z',
        closingHourPM: '2018-01-01T18:00:00.000Z'
      },
      {
        weekday      : 'vendredi',
        openingHourAM: '2018-01-01T08:00:00.000Z',
        openingHourPM: '2018-01-01T13:00:00.000Z',
        closingHourAM: '2018-01-01T11:30:00.000Z',
        closingHourPM: '2018-01-01T18:00:00.000Z'
      }
    ]
  }
};
const marcheSchedule = {
  schedule: {
    dailySchedule: [
      {
        weekday      : 'samedi',
        openingHourAM: '2018-01-01T08:00:00.000Z',
        closingHourPM: '2018-01-01T15:00:00.000Z'
      }
    ]
  }
};

const ferme = {
  name       : 'La Ferme',
  description: 'Viendez acheter et c\'est tout.',
  type       : 'Ferme',
  address    : {
    number    : '20',
    street    : 'Avenue des Sports 20',
    city      : 'Yverdon-les-Bains',
    postalCode: 1400,
    country   : 'Suisse',
    longitude : 46.7754351,
    latitude  : 6.6510671
  },
  producers  : []
};
const vignoble = {
  name       : 'Domaine de par là-bas',
  description: 'Viendez! Ya du bon vin pas cher.',
  type       : 'Vignoble',
  address    : {
    number    : '2',
    street    : 'Chemin de Bahyse-Dessus',
    city      : 'Bourg-en-Lavaux',
    postalCode: 1096,
    country   : 'Suisse',
    longitude : 46.5006296,
    latitude  : 6.7332682
  },
  producers  : []
};
const marche = {
  name       : 'Marché du village',
  description: 'Viendez acheter des légumes frais.',
  type       : 'Marché',
  address    : {
    number    : '9',
    street    : 'Place du village',
    city      : 'Assens',
    postalCode: 1042,
    country   : 'Suisse',
    longitude : 46.5006396,
    latitude  : 6.7332612
  },
  producers  : []
};

let ids;

describe('tests salespoints services', () => {
  beforeEach(() => Salespoints.remove()
    .then(() => Producers.remove())
    .then(() => Promise.all([producer1, producer2].map(p => Producers.create(p)))
      .then((producers) => {
        const prod1 = producers[0];
        const prod2 = producers[1];
        ferme.producers = [prod1._id];
        vignoble.producers = [prod2._id];
        marche.producers = [prod1._id, prod2._id];
      })
      .then(() => Promise.all([ferme, vignoble, marche].map(p => Salespoints.create(p))))
      .then(res => ids = res.map(d => d._id.toString()))));

  describe('getSalesPoints', () => {
    it('should fetch all salespoints', () => salespointsServices.getSalesPoints()
      .then((allSalespoints) => {
        allSalespoints.should.be.an('array');
        allSalespoints.should.be.lengthOf(3);

        allSalespoints.map(d => d._id.toString()).should.have.members(ids);
      }));

    it('should fetch all salespoints with default limit of 50', () => {
      const tabPromises = [...Array(100).keys()].map((identifier) => {
        const fermeArray = { ...ferme };
        fermeArray.name += identifier;
        return Salespoints.create(fermeArray);
      });

      return Salespoints.remove().then(() => Promise.all(tabPromises)
        .then(() => salespointsServices.getSalesPoints()
          .then((response) => {
            response.should.be.an('array');
            response.should.be.lengthOf(50);

            for (let i = 0; i < 50; i++) {
              response[i].name.should.be.equal(`La Ferme${i}`);
            }
          })));
    });

    /*
    it('should fetch all salespoints that have their description containing the word "acheter"', () => salespointsServices
      .getSalesPoints({ tags: { description: /.*acheter.*!/i } }) // description contains 'acheter'
      .then((results) => {
        const objects = results.map(d => d.name);
        objects.should.have.members([ferme.name, marche.name]);
      }));

    it('should fetch all salespoints that have their name = "Pomme" AND their description containing the word "belle"',
       () => salespointsServices.getSalesPoints({ tags: { name: 'Pomme', description: /.*belle.*!/i } }) // name = 'Benoît' AND description contains 'Responsable'
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
*/

    it('should fetch all salespoints with limit of 10', () => {
      const tabPromises = [...Array(10).keys()].map(() => Salespoints.create(ferme));

      return Promise.all(tabPromises)
        .then(() => salespointsServices.getSalesPoints()
          .then((allSalespoints) => {
            allSalespoints.should.be.an('array');
            allSalespoints.should.be.lengthOf(13);
          }).then(() => salespointsServices.getSalesPoints({ limit: 10 })
            .then((limitedRes) => {
              limitedRes.should.be.an('array');
              limitedRes.should.be.lengthOf(10);
            })));
    });

    it('should fetch all salespoints from 50th to 99th (default limit is 50)', () => {
      const tabPromises = [...Array(100).keys()].map((identifier) => {
        const fermeArray = { ...ferme };
        fermeArray.name += identifier;
        return Salespoints.create(fermeArray);
      });

      let allSalespointsInDB;
      return Salespoints.remove().then(() => Promise.all(tabPromises)
        .then(() => salespointsServices.getSalesPoints({ limit: 110 })
          .then((allSalespoints) => {
            allSalespointsInDB = allSalespoints;
            allSalespoints.should.be.an('array');
            allSalespoints.should.be.lengthOf(100);
          })).then(() => salespointsServices.getSalesPoints({ page: 1 })
          .then((limitedRes) => {
            limitedRes.should.be.an('array');
            limitedRes.should.be.lengthOf(50);
            for (let i = 0; i < 50; i++) {
              limitedRes[i].name.should.be.equal(allSalespointsInDB[i + 50].name);
            }
          })));
    });

    it('should fetch all salespoints with limit of 5 from 5th to 9th', () => {
      const tabPromises = [...Array(10).keys()].map((identifier) => {
        const fermeArray = { ...ferme };
        fermeArray.name += identifier;
        return Salespoints.create(fermeArray);
      });

      let allSalespointsInDB;
      return Promise.all(tabPromises)
        .then(() => salespointsServices.getSalesPoints()
          .then((allSalespoints) => {
            allSalespointsInDB = allSalespoints;
            allSalespoints.should.be.an('array');
            allSalespoints.should.be.lengthOf(13);
          })).then(() => salespointsServices.getSalesPoints({ limit: 5, page: 1 })
          .then((limitedRes) => {
            limitedRes.should.be.an('array');
            limitedRes.should.be.lengthOf(5);
            for (let i = 0; i < 5; i++) {
              limitedRes[i].name.should.be.equal(allSalespointsInDB[i + 5].name);
            }
          }));
    });
  });

  describe('addSalespoints', () => {
    it('should add new salespoint', () => salespointsServices.addSalesPoint(ferme)
      .then((salespoint) => {
        salespoint.should.be.an('object');
        salespoint.should.be.not.null;
        salespoint._id.should.be.not.null;

        salespoint.name.should.be.equal(ferme.name);
        salespoint.description.should.be.equal(ferme.description);
        salespoint.type.should.be.equal(ferme.type);
        salespoint.address.number.should.be.equal(ferme.address.number);
        salespoint.address.street.should.be.equal(ferme.address.street);
        salespoint.address.city.should.be.equal(ferme.address.city);
        salespoint.address.postalCode.should.be.equal(ferme.address.postalCode);
        salespoint.address.country.should.be.equal(ferme.address.country);
        salespoint.address.longitude.should.be.equal(ferme.address.longitude);
        salespoint.address.latitude.should.be.equal(ferme.address.latitude);

        salespoint.schedule.should.be.an('array');
        salespoint.schedule.length.should.be.equal(0);

        salespoint.producers.should.be.an('array');
        salespoint.producers.length.should.be.equal(1);
      }));
  });

  describe('getProductById', () => {
    it('should get salespoints with id', () => salespointsServices.getSalesPointById({ id: ids[2] })
      .then((salespoint) => {
        salespoint.should.be.an('object');
        salespoint.should.be.not.null;
        salespoint._id.should.be.not.null;

        salespoint.name.should.be.equal(marche.name);
        salespoint.description.should.be.equal(marche.description);
        salespoint.type.should.be.equal(marche.type);
        salespoint.address.number.should.be.equal(marche.address.number);
        salespoint.address.street.should.be.equal(marche.address.street);
        salespoint.address.city.should.be.equal(marche.address.city);
        salespoint.address.postalCode.should.be.equal(marche.address.postalCode);
        salespoint.address.country.should.be.equal(marche.address.country);
        salespoint.address.longitude.should.be.equal(marche.address.longitude);
        salespoint.address.latitude.should.be.equal(marche.address.latitude);

        salespoint.schedule.should.be.an('array');
        salespoint.schedule.length.should.be.equal(0);

        salespoint.producers.should.be.an('array');
        salespoint.producers.length.should.be.equal(2);
      }));
  });

  describe('updateProduct', () => {
    it('should update ferme in marche', () => salespointsServices.updateSalesPoint(ids[0], marche)
      .then((salespoint) => {
        salespoint.should.be.an('object');
        salespoint.should.be.not.null;
        salespoint._id.should.be.not.null;

        salespoint.name.should.be.equal(marche.name);
        salespoint.description.should.be.equal(marche.description);
        salespoint.type.should.be.equal(marche.type);
        salespoint.address.number.should.be.equal(marche.address.number);
        salespoint.address.street.should.be.equal(marche.address.street);
        salespoint.address.city.should.be.equal(marche.address.city);
        salespoint.address.postalCode.should.be.equal(marche.address.postalCode);
        salespoint.address.country.should.be.equal(marche.address.country);
        salespoint.address.longitude.should.be.equal(marche.address.longitude);
        salespoint.address.latitude.should.be.equal(marche.address.latitude);

        salespoint.schedule.should.be.an('array');
        salespoint.schedule.length.should.be.equal(0);

        salespoint.producers.should.be.an('array');
        salespoint.producers.length.should.be.equal(2);
      }));
  });

  describe('deleteProduct', () => {
    it('should delete marche from DB', () => salespointsServices.deleteSalesPoint({ id: ids[2] })
      .then((salespoint) => {
        salespoint.should.be.an('object');
        return salespointsServices.getSalesPoints()
          .then((res) => {
            res.length.should.be.equal(2);
            res.map(d => d.toObject()._id).should.not.contain(salespoint.toObject()._id);
          });
      }));
  });
});
