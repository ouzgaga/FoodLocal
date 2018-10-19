/*
require('dotenv').config();
require('../src/app/models/producers.model');
const request = require('supertest');
const express = require('express');

const chai = require('chai');
const config = require('../src/config/config');

const should = chai.should();

const Producers = mongoose.model('producers');
describe('tests producers', () => {
  before((done) => {
    mongoose.connect(config.db, { useMongoClient: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, `unable to connect to database at ${config.db}`));
    db.once('open', () => {
      console.log('Connecté à la DB de tests!');
      done();
    });
  });

  describe('tests /producers endpoint', () => {
    let p1;
    let p2;
    let p3;
    let p4;

    before((done) => {
      p1 = new Producers({
        name       : 'Benoît',
        description: 'Un mec badass!',
        phoneNumber: '0123456789',
        email      : 'benoit@badasse.com',
        isValidated: true,
        password   : '123456'
      }).save();
      p2 = new Producers({
        name       : 'Antoine',
        description: 'Un mec trop con!',
        phoneNumber: '0123456789',
        email      : 'antoine@tropcon.com',
        isValidated: true,
        password   : '123456'
      }).save();
      p3 = new Producers({
        name       : 'Jerem',
        description: 'Un mec bonnard!',
        phoneNumber: '0123456789',
        email      : 'jerem@bonnard.com',
        isValidated: true,
        password   : '123456'
      }).save();
      p4 = new Producers({
        name       : 'James',
        description: 'Un vrai boulet!',
        phoneNumber: '0123456789',
        email      : 'james@boulet.com',
        isValidated: true,
        password   : '123456'
      }).save();

      Promise.all([p1, p2, p3, p4]).then(() => done());
    });

    after((done) => {
      Producers.remove().then(() => done());
    });
  });
});
*/
