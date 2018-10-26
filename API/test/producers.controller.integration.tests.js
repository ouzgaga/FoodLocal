require('../src/app/models/producers.model');
require('./chai-config');
const request = require('supertest');
const httpStatus = require('http-status');

const mongoose = require('mongoose');
const app = require('../src/app.js');

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
  beforeEach(() => Producers.remove()
    .then(() => Promise.all([antoine, benoit, james, jerem].map(p => Producers.create(p)))
      .then(res => ids = res.map(d => d._id.toString()))));

  // afterEach(() => Producers.remove());

  describe('GET /producers', () => {
    it('should fetch all producers', () => request(app)
      .get('/producers')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        response.body.should.be.an('array');
        response.body.length.should.be.equal(4);

        response.body.map(d => d._id.toString()).should.have.members(ids);
      }));

    it('should fetch all producers filtered with one tags', () => request(app)
      .get('/producers')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        response.body.length.should.be.equal(4);
      }));

    it('should fetch all producers filtered with multiple tags', () => request(app)
      .get('/producers')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        response.body.length.should.be.equal(4);
      }));
  });
});
