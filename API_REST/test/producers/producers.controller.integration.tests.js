require('../../src/graphql/models/producers.modelgql');
require('../chai-config');
const request = require('supertest');
const httpStatus = require('http-status');

const mongoose = require('mongoose');
const app = require('../../src/app.js');

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
  phoneNumber: '0123456',
  email      : 'antoine@react.com',
  isValidated: true,
  password   : '123456789'
};
const jerem = {
  name       : 'Jerem',
  description: 'Unlinter professionel!',
  phoneNumber: '0123456',
  email      : 'jerem@ABasESLint.com',
  isValidated: true,
  password   : '123456789'
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

describe('tests producers controller', () => {
  beforeEach(() => Producers.deleteMany()
    .then(() => Promise.all([antoine, benoit, james, jerem].map(p => Producers.create(p)))
      .then(res => ids = res.map(d => d._id.toString()))));

  describe('GET /producers', () => {
    it('should fetch all producers', () => request(app)
      .get('/producers')
      .set('Accept', 'application/json')
      .expect(httpStatus.OK)
      .then((response) => {
        response.body.should.be.an('array');
        response.body.length.should.be.equal(4);

        response.body.map(d => d._id.toString()).should.have.members(ids);
      }));

    it('should fetch all producers with default limit of 50', () => {
      const tabPromises = [...Array(100).keys()].map((identifier) => {
        const tonio = { ...antoine };
        tonio.name += identifier;
        return Producers.create(tonio);
      });

      return Producers.deleteMany()
        .then(() => Promise.all(tabPromises)
          .then(() => request(app)
            .get('/producers')
            .set('Accept', 'application/json')
            .expect(httpStatus.OK)
            .then((response) => {
              response.body.should.be.an('array');
              response.body.length.should.be.equal(50);

              for (let i = 0; i < 50; i++) {
                response.body[i].name.should.be.equal(`Antoine${i}`);
              }
            })));
    });

    /*it('should fetch all producers that have their description containing the word "Responsable"', () => request(app)
      .get('/producers')
      .query({ tags: { description: /.*Professionel.*!/i } }) // description contains 'Professionel'
      .set('Accept', 'application/json')
      .expect(httpStatus.OK)
      .then((response) => {
        response.body.should.be.an('array');
        response.body.should.be.lengthOf(2);
        const objects = response.body.map(d => d.toObject().name);
        objects.should.have.members([james.name, benoit.name]);
      }));

    it('should fetch all producers that have their name = "Benoît" AND their description containing the word "Responsable"', () => {
      const tabPromises = [...Array(100).keys()].map((identifier) => {
        const tonio = { ...antoine };
        tonio.name += identifier;
        return Producers.create(tonio);
      });

      return Producers.deleteMany()
        .then(() => Promise.all(tabPromises))
        .then(() => request(app)
          .get('/producers')
          .query({ tags: { name: 'Antoine', description: /.*Professionel.*!/i } }) // name = 'Antoine' AND description contains 'Professionel'
          .set('Accept', 'application/json')
          .expect(httpStatus.OK))
        .then((response) => {
          response.body.length.should.be.equal(1);
        });
    });*/
  });
});
