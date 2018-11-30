require('../../src/app/models/producers.model');
require('../chai-config');
const mongoose = require('mongoose');
const productsServices = require('../../src/app/services/products.services');

const Producers = mongoose.model('producers');
const Products = mongoose.model('products');

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
const pomme = {
  name          : 'Pomme',
  description   : 'Ceci est une belle pomme!',
  category      : 'Fruit',
  type          : 'Pomme',
  availableFrom : '2018-01-01T00:00:00.000Z',
  availableUntil: '2018-08-01T00:00:00.000Z',
  producers     : []
};
const poire = {
  name          : 'Poire',
  description   : 'Ceci est une poire!',
  category      : 'Fruit',
  type          : 'Poire',
  availableFrom : '2018-05-01T00:00:00.000Z',
  availableUntil: '2018-12-01T00:00:00.000Z',
  producers     : []
};
const courgette = {
  name          : 'Courgette',
  description   : 'Ceci est une belle courgette!',
  category      : 'Légume',
  type          : 'Courgette',
  availableFrom : '2018-02-01T00:00:00.000Z',
  availableUntil: '2018-10-01T00:00:00.000Z',
  producers     : []
};
const carotte = {
  name          : 'Tomate',
  description   : 'Ceci est une tomate!',
  category      : 'Légume',
  type          : 'Tomate',
  availableFrom : '2018-02-01T00:00:00.000Z',
  availableUntil: '2018-10-01T00:00:00.000Z',
  producers     : []
};
let ids;

describe('tests products services', () => {
  beforeEach(() => Products.deleteMany()
    .then(() => Producers.deleteMany())
    .then(() => Promise.all([producer1, producer2].map(p => Producers.create(p)))
      .then((producers) => {
        const prod1 = producers[0];
        const prod2 = producers[1];
        pomme.producers = [prod1._id, prod2._id];
        poire.producers = [prod1._id, prod2._id];
        courgette.producers = [prod1._id];
        carotte.producers = [prod2._id];
      })
      .then(() => Promise.all([pomme, poire, courgette, carotte].map(p => Products.create(p))))
      .then(res => ids = res.map(d => d._id.toString()))));

  describe('getProducts', () => {
    it('should fetch all products', () => productsServices.getProducts()
      .then((allProducts) => {
        allProducts.should.be.an('array');
        allProducts.should.be.lengthOf(4);

        allProducts.map(d => d._id.toString()).should.have.members(ids);
      }));

    it('should fetch all products with default limit of 50', () => {
      const tabPromises = [...Array(100).keys()].map((identifier) => {
        const pommeArray = { ...pomme };
        pommeArray.name += identifier;
        return Products.create(pommeArray);
      });

      return Products.deleteMany().then(() => Promise.all(tabPromises)
        .then(() => productsServices.getProducts()
          .then((response) => {
            response.should.be.an('array');
            response.should.be.lengthOf(50);

            for (let i = 0; i < 50; i++) {
              response[i].name.should.be.equal(`Pomme${i}`);
            }
          })));
    });

    /*it('should fetch all products that have their description containing the word "belle"', () => productsServices
      .getProducts({ tags: { description: /.*belle.*!/i } }) // description contains 'Responsable'
      .then((results) => {
        const objects = results.map(d => d.name);
        objects.should.have.members([pomme.name, courgette.name]);
      }));

    it('should fetch all products that have their name = "Pomme" AND their description containing the word "belle"',
      () => productsServices.getProducts({ tags: { name: 'Pomme', description: /.*belle.*!/i } }) // name = 'Benoît' AND description contains 'Responsable'
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
    it('should fetch all products with limit of 10', () => {
      const tabPromises = [...Array(10).keys()].map(() => Products.create(pomme));

      return Promise.all(tabPromises)
        .then(() => productsServices.getProducts()
          .then((allProducts) => {
            allProducts.should.be.an('array');
            allProducts.should.be.lengthOf(14);
          }).then(() => productsServices.getProducts({ limit: 10 })
            .then((limitedRes) => {
              limitedRes.should.be.an('array');
              limitedRes.should.be.lengthOf(10);
            })));
    });

    it('should fetch all products from 50th to 99th (default limit is 50)', () => {
      const tabPromises = [...Array(100).keys()].map((identifier) => {
        const pommeArray = { ...pomme };
        pommeArray.name += identifier;
        return Products.create(pommeArray);
      });

      let allProductsInDB;
      return Products.deleteMany().then(() => Promise.all(tabPromises)
        .then(() => productsServices.getProducts({ limit: 110 })
          .then((allProducts) => {
            allProductsInDB = allProducts;
            allProducts.should.be.an('array');
            allProducts.should.be.lengthOf(100);
          })).then(() => productsServices.getProducts({ page: 1 })
          .then((limitedRes) => {
            limitedRes.should.be.an('array');
            limitedRes.should.be.lengthOf(50);
            for (let i = 0; i < 50; i++) {
              limitedRes[i].name.should.be.equal(allProductsInDB[i + 50].name);
            }
          })));
    });

    it('should fetch all products with limit of 5 from 5th to 9th', () => {
      const tabPromises = [...Array(10).keys()].map((identifier) => {
        const pommeArray = { ...pomme };
        pommeArray.name += identifier;
        return Products.create(pommeArray);
      });

      let allProductsInDB;
      return Promise.all(tabPromises)
        .then(() => productsServices.getProducts()
          .then((allProducts) => {
            allProductsInDB = allProducts;
            allProducts.should.be.an('array');
            allProducts.should.be.lengthOf(14);
          })).then(() => productsServices.getProducts({ limit: 5, page: 1 })
          .then((limitedRes) => {
            limitedRes.should.be.an('array');
            limitedRes.should.be.lengthOf(5);
            for (let i = 0; i < 5; i++) {
              limitedRes[i].name.should.be.equal(allProductsInDB[i + 5].name);
            }
          }));
    });
  });

  describe('addProduct', () => {
    it('should add new product', () => productsServices.addProduct(poire)
      .then((product) => {
        product.should.be.an('object');
        product.should.be.not.null;
        product._id.should.be.not.null;

        product.name.should.be.equal(poire.name);
        product.description.should.be.equal(poire.description);
        product.category.should.be.equal(poire.category);
        product.type.should.be.equal(poire.type);

        product.availableFrom.should.be.eql(new Date(poire.availableFrom));
        product.availableUntil.should.be.eql(new Date(poire.availableUntil));

        product.producers.should.be.an('array');
        product.producers.length.should.be.equal(2);
      }));
  });

  describe('getProductById', () => {
    it('should get products with id', () => productsServices.getProductById({ id: ids[1] })
      .then((product) => {
        product.should.be.an('object');
        product.should.be.not.null;
        product._id.should.be.not.null;

        product.name.should.be.equal(poire.name);
        product.description.should.be.equal(poire.description);
        product.category.should.be.equal(poire.category);
        product.type.should.be.equal(poire.type);

        product.availableFrom.should.be.eql(new Date(poire.availableFrom));
        product.availableUntil.should.be.eql(new Date(poire.availableUntil));

        product.producers.should.be.an('array');
        product.producers.length.should.be.equal(2);
      }));
  });

  describe('updateProduct', () => {
    it('should update pomme in carotte', () => productsServices.updateProduct(ids[0], courgette)
      .then((product) => {
        product.should.be.an('object');
        product.should.be.not.null;
        product._id.should.be.not.null;

        product.name.should.be.equal(courgette.name);
        product.description.should.be.equal(courgette.description);
        product.category.should.be.equal(courgette.category);
        product.type.should.be.equal(courgette.type);

        product.availableFrom.should.be.eql(new Date(courgette.availableFrom));
        product.availableUntil.should.be.eql(new Date(courgette.availableUntil));

        product.producers.should.be.an('array');
        product.producers.length.should.not.be.equal(2);
        product.producers.length.should.be.equal(1);
      }));
  });

  describe('deleteProduct', () => {
    it('should delete carotte from DB', () => productsServices.deleteProduct({ id: ids[3] })
      .then((product) => {
        product.should.be.an('object');
        return productsServices.getProducts()
          .then((res) => {
            res.length.should.be.equal(3);
            res.map(d => d.toObject()._id).should.not.contain(product.toObject()._id);
          });
      }));
  });
});
