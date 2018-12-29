const producersServices = require('../../../src/graphql/services/producers.services');
const salespointServices = require('../../../src/graphql/services/salespoints.services');
const usersServices = require('../../../src/graphql/services/users.services');
const productsServices = require('../../../src/graphql/services/products.services');
const productTypeServices = require('../../../src/graphql/services/productTypes.services');
const clearDB = require('../clearDB');
const populateDB = require('../../populateDatabase');
const ProductTypeModel = require('../../../src/graphql/models/productTypes.modelgql');
const ProductTypeCategoryModel = require('../../../src/graphql/models/productTypeCategories.modelgql');

let productTypeCategory;
let productTypePomme;
let productTypePoire;
let productPomme;
let productPoire;
let salespointBenoit;
let benoit;
let antoine;

let tabProductsBenoit = [];
let tabProductsAntoine = [];
let tabProducers = [benoit, antoine];

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ---------------------------------------- on set le contenu des différents objets utilisés dans les tests ----------------------------------------
  productTypeCategory = {
    name: 'Fruits',
    image: 'ceci est une image de fruits encodée en base64!'
  };

  productTypePomme = {
    name: 'Pomme',
    image: 'ceci est une image de pomme encodée en base64!'
  };

  productTypePoire = {
    name: 'Poire',
    image: 'ceci est une image de poire encodée en base64!'
  };

  const productPomme = {
    description: 'Une pomme monnnnstre bonne!'
  };

  const productPoire = {
    description: 'Une poire de folie!'
  };

  salespointBenoit = {
    name: 'Chez moi',
    address: {
      number: 6,
      street: 'Chemin de par ici',
      city: 'Yverdon',
      postalCode: '1400',
      state: 'Vaud',
      country: 'Suisse',
      longitude: 1.1234567,
      latitude: 1.123456789
    },
    schedule:
      {
        monday: [
          {
            openingHour: '08:00',
            closingHour: '12:00'
          },
          {
            openingHour: '13:00',
            closingHour: '18:00'
          }
        ],
        tuesday: [],
        wednesday: [
          {
            openingHour: '08:00',
            closingHour: '12:00'
          }
        ],
        thursday: [],
        friday: [
          {
            openingHour: '08:00',
            closingHour: '12:00'
          }
        ],
        saturday: [],
        sunday: []
      }
  };

  benoit = {
    firstname: 'Benoît',
    lastname: 'Schöpfli',
    email: 'benoit@paysan.ch',
    password: '1234abcd',
    image: 'Ceci est une image encodée en base64!',
    phoneNumber: '0761435196',
    description: 'Un chouet gaillard!',
    website: 'benoitpaysan.ch'
  };

  antoine = {
    firstname: 'Antoine',
    lastname: 'Rochaille',
    email: 'antoine@paysan.ch',
    password: '1234abcd',
    image: 'Ceci est l\'image d\'un tueur encodée en base64!',
    phoneNumber: '0761435196',
    description: 'Un vrai payouz!'
  };




  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  // on ajoute 1 productTypeCategory
  productTypeCategory = (await ProductTypeCategoryModel.create(productTypeCategory)).toObject();

  // on ajoute 2 productType
  productTypePomme.categoryId = productTypeCategory.id;
  productTypePomme = (await ProductTypeModel.create(productTypePomme)).toObject();
  productTypePoire.categoryId = productTypeCategory.id;
  productTypePoire = (await ProductTypeModel.create(productTypePoire)).toObject();

  // on set le productTypeId avec les id de productType qu'on vient d'ajouter
  productPomme.productTypeId = productTypePomme.id;
  productPoire.productTypeId = productTypePoire.id;

  // on ajoute 1 producteur contenant le salespoint 'salespointBenoit' ainsi que 2 produits ('productPomme' et 'productPoire')
  benoit = (await producersServices.addProducer(benoit)).toObject();
  await producersServices.addSalespointToProducer(benoit.id, salespointBenoit);
  tabProductsBenoit = await productsServices.addAllProductsInArray([productPomme, productPoire], benoit.id);
  tabProductsBenoit = tabProductsBenoit.map(product => product.toObject());
  benoit = (await producersServices.getProducerById(benoit.id)).toObject();

  // on ajoute 1 producteur ne contenant pas de salespoint ainsi que 1 produit ('productPomme')
  antoine = (await producersServices.addProducer(antoine)).toObject();
  tabProductsAntoine = await productsServices.addAllProductsInArray([productPomme], antoine.id);
  tabProductsAntoine = tabProductsAntoine.map(product => product.toObject());
  antoine = (await producersServices.getProducerById(antoine.id)).toObject();

  tabProducers = [benoit, antoine];
};

describe('tests producers services', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('tests getProducers', () => {
    it('should get all producers', async() => {
      // on récupère un tableau contenant tous les producteurs
      let allProducers = await producersServices.getProducers();

      // on transforme chaque producteur du tableau en un objet
      allProducers = allProducers.map(producer => producer.toObject());
      allProducers.should.be.an('array');
      allProducers.length.should.be.equal(2);

      // pour chaque producteur, on test les éléments critiques
      const promises = await allProducers.map(async(producer, index) => {
        producer.id.should.be.eql(tabProducers[index].id);

        // TODO: tester l'intérieur de subscription lorsqu'on pourra les gérer...!
        producer.followingProducersIds.should.be.not.null;
        producer.followingProducersIds.should.be.an('array');

        // TODO: tester l'intérieur de followersIds lorsqu'on pourra les gérer...!
        producer.followersIds.should.be.not.null;
        producer.followersIds.should.be.an('array');

        const promisesTestsProductsIds = producer.productsIds.map((async(productId) => {
          // on récupère les infos du produit correspondant
          const product = (await productsServices.getProductById(productId)).toObject();

          // on récupère les infos du productType correspondant au produit
          const productType = (await productTypeServices.getProductTypeById(product.productTypeId)).toObject();
          productType.should.be.not.null;
          productType.producersIds.should.be.not.null;
          const addedProducerId = producer.id.toString();

          // on vérifie que l'id du producteur ait bien été ajouté dans le tableau 'productersIds' du productType
          const filtredTab = await productType.producersIds.filter(elem => elem.toString() === addedProducerId);
          filtredTab.length.should.be.equal(1);
        }));
        await Promise.all(promisesTestsProductsIds);
      });
      await Promise.all(promises);
    });
  });

  describe('tests getProducerById', () => {
    it('should get one producer', async() => {
      // on récupère le producteur corresondant à l'id donné
      const producer = (await producersServices.getProducerById(benoit.id)).toObject();

      // on test son contenu
      producer.should.be.not.null;
      producer.id.should.be.eql(benoit.id);
      producer.firstname.should.be.equal(benoit.firstname);
      producer.lastname.should.be.equal(benoit.lastname);
      producer.email.should.be.equal(benoit.email);
      producer.password.should.be.equal(benoit.password);
      producer.image.should.be.equal(benoit.image);

      // TODO: tester l'intérieur de subscription lorsqu'on pourra les gérer...!
      producer.followingProducersIds.should.be.an('array');
      producer.followingProducersIds.length.should.be.equal(benoit.followingProducersIds.length);

      producer.emailValidated.should.be.equal(benoit.emailValidated);
      producer.followersIds.should.be.an('array');
      producer.followersIds.length.should.be.equal(benoit.followersIds.length);
      // TODO: tester l'intérieur de followersIds lorsqu'on pourra les gérer...!
      /*
      // le 2ème paramètre (index) permet de récupérer l'index de l'itération (le i d'un for normal)
      producer.followersIds.forEach((subscribedUser, index) => {
        subscribedUser.id.should.be.not.null;
        subscribedUser.firstname.should.be.not.null;
        subscribedUser.lastname.should.be.not.null;
        subscribedUser.email.should.be.not.null;
        subscribedUser.password.should.be.not.null;
      });
      */
      producer.phoneNumber.should.be.equal(benoit.phoneNumber);
      producer.description.should.be.equal(benoit.description);
      producer.website.should.be.equal(benoit.website);
      expect(producer.salespointId).to.be.eql(benoit.salespointId);
      producer.isValidated.should.be.equal(benoit.isValidated);

      // on test le tableau productsIds et son contenu
      const promisesTestsProductsIds = producer.productsIds.map((async(productId, index) => {
        productId.toString().should.be.eql(tabProductsBenoit[index].id);

        // on récupère les infos du produit correspondant
        const product = (await productsServices.getProductById(productId)).toObject();

        // on récupère les infos du productType correspondant au produit
        const productType = (await productTypeServices.getProductTypeById(product.productTypeId)).toObject();
        productType.should.be.not.null;
        productType.producersIds.should.be.not.null;
        const addedProducerId = producer.id.toString();

        // on vérifie que l'id du producteur ait bien été ajouté dans le tableau 'productersIds' du productType
        const filtredTab = await productType.producersIds.filter(elem => elem.toString() === addedProducerId);
        filtredTab.length.should.be.equal(1);
      }));
      await Promise.all(promisesTestsProductsIds);
    });

    it('should fail getting one producer because no id received', async() => {
      const producerGotInDB = await producersServices.getProducerById('');
      producerGotInDB.message.should.be.equal('Received producer.id is invalid!');
    });

    it('should fail getting one producer because invalid id received', async() => {
      const producerGotInDB = await producersServices.getProducerById(benoit.id + benoit.id);
      producerGotInDB.message.should.be.equal('Received producer.id is invalid!');
    });

    it('should fail getting one producer because unknown id received', async() => {
      const producerGotInDB = await producersServices.getProducerById('abcdefabcdefabcdefabcdef');
      expect(producerGotInDB).to.be.null;
    });
  });

  describe('tests getAllProducersInReceivedIdList', () => {
    it('should get all producers with id in received list', async() => {
      // on récupère 2 producteurs
      let producers = await producersServices.getAllProducersInReceivedIdList([benoit.id, antoine.id]);
      producers.should.be.an('array');
      producers.length.should.be.equal(2);

      // on récupère 1 seul producteur
      producers = await producersServices.getAllProducersInReceivedIdList([benoit.id]);
      producers.should.be.not.null;
      producers.should.be.an('array');
      producers.length.should.be.equal(1);

      // on récupère aucun producteur
      producers = await producersServices.getAllProducersInReceivedIdList([]);
      producers.should.be.not.null;
      producers.should.be.an('array');
      producers.length.should.be.equal(0);
    });
  });

  describe('tests getAllProducerWaitingForValidation', () => {
    it('should get all producers waiting for validation', async() => {
      // on récupère tous les producteurs non validés (isValidated = false)
      let allProducersWaitingForValidation = await producersServices.getAllProducerWaitingForValidation();
      allProducersWaitingForValidation.should.be.an('array');
      allProducersWaitingForValidation.length.should.be.equal(2);
      allProducersWaitingForValidation.forEach(p => p.isValidated.should.be.false);

      // on valide un des producteurs non validé
      await producersServices.validateAProducer(allProducersWaitingForValidation[0].id, true);

      // on récupère tous les producteurs non validés --> il y en a bien un de moins
      allProducersWaitingForValidation = await producersServices.getAllProducerWaitingForValidation();
      allProducersWaitingForValidation.should.be.an('array');
      allProducersWaitingForValidation.length.should.be.equal(1);
      allProducersWaitingForValidation.forEach(p => p.isValidated.should.be.false);
    });
  });

  describe('tests filterProducers by productTypeIds', () => {
    it('should return only producers that produce some products of the given productTypeIds', async() => {
      // on récupère tous les producteurs produisant des produits de la catégorie 'productTypePomme'
      const producersOfPommes = await producersServices.filterProducers([productTypePomme.id]);
      producersOfPommes.should.be.an('array');
      producersOfPommes.length.should.be.equal(2);

      // on récupère tous les producteurs produisant des produits de la catégorie 'productTypePoire'
      const producersOfPoires = await producersServices.filterProducers([productTypePoire.id]);
      producersOfPoires.should.be.an('array');
      producersOfPoires.length.should.be.equal(1);
    });
  });

  describe('tests addProducer', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should add a new producer', async() => {
      benoit.email = 'benoit1@paysan.ch';
      benoit.products = [];
      benoit.products.push(productPomme);
      benoit.products.push(productPoire);
      benoit.salespoint = salespointBenoit;

      // on ajoute un nouveau producteur
      const addedProducer = await producersServices.addProducer(benoit);
      // on test son contenu
      addedProducer.should.be.not.null;
      addedProducer.id.should.be.not.null; // ne peut pas être égal à benoit.id !
      addedProducer.firstname.should.be.equal(benoit.firstname);
      addedProducer.lastname.should.be.equal(benoit.lastname);
      addedProducer.email.should.be.equal(benoit.email);
      addedProducer.password.should.be.not.null;
      addedProducer.image.should.be.equal(benoit.image);

      // TODO: tester l'intérieur de subscription lorsqu'on pourra les gérer...!
      addedProducer.followingProducersIds.should.be.an('array');
      addedProducer.followingProducersIds.length.should.be.equal(benoit.followingProducersIds.length);

      addedProducer.emailValidated.should.be.equal(benoit.emailValidated);
      addedProducer.followersIds.should.be.an('array');
      addedProducer.followersIds.length.should.be.equal(benoit.followersIds.length);
      // TODO: tester l'intérieur de followersIds lorsqu'on pourra les gérer...!
      /*
      // le 2ème paramètre (index) permet de récupérer l'index de l'itération (le i d'un for normal)
      producer.followersIds.forEach((subscribedUser, index) => {
        subscribedUser.id.should.be.not.null;
        subscribedUser.firstname.should.be.not.null;
        subscribedUser.lastname.should.be.not.null;
        subscribedUser.email.should.be.not.null;
        subscribedUser.password.should.be.not.null;
      });
      */
      addedProducer.phoneNumber.should.be.equal(benoit.phoneNumber);
      addedProducer.description.should.be.equal(benoit.description);
      addedProducer.website.should.be.equal(benoit.website);
      expect(addedProducer.salespointId).to.be.null; // car n'est pas ajouté lors de la création d'un producteur
      addedProducer.isValidated.should.be.equal(benoit.isValidated);
      // on test le tableau productsIds et son contenu
      const promisesTestsProductsIds = addedProducer.productsIds.map((async(productId) => {
        productId.should.be.not.null;

        // on récupère les infos du produit correspondant
        const product = (await productsServices.getProductById(productId)).toObject();

        // on récupère les infos du productType correspondant au produit
        const productType = (await productTypeServices.getProductTypeById(product.productTypeId)).toObject();
        productType.should.be.not.null;
        productType.producersIds.should.be.not.null;
        const addedProducerId = addedProducer.id.toString();

        // on vérifie que l'id du producteur ait bien été ajouté dans le tableau 'productersIds' du productType
        const filtredTab = await productType.producersIds.filter(elem => elem.toString() === addedProducerId);
        filtredTab.length.should.be.equal(1);
      }));
      await Promise.all(promisesTestsProductsIds);
    });

    // TODO: ajouter des tests d'échec d'ajout lorsqu'il manque des données obligatoires

    it('should fail adding a new producer with an already used email', async() => {
      const productsIds = [];
      productsIds.push(productPomme);
      productsIds.push(productPoire);

      const producerToAdd = {
        ...benoit,
        email: 'benoit2@paysan.ch',
        salespoint: salespointBenoit,
        productsIds
      };

      // on ajoute un nouveau producteur
      const addedProducer = (await producersServices.addProducer(producerToAdd)).toObject();
      addedProducer.should.be.not.null;
      addedProducer.id.should.be.not.null;
      addedProducer.firstname.should.be.equal(producerToAdd.firstname);
      addedProducer.lastname.should.be.equal(producerToAdd.lastname);
      addedProducer.email.should.be.equal(producerToAdd.email);

      // on tente d'ajouter à nouveau le même producteur -> erreur car l'email est déjà utilisé
      const res = await producersServices.addProducer(producerToAdd);
      res.should.be.not.null;
      res.message.should.be.equal('This email is already used.');
    });
  });

  describe('tests addProductToProducer', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should add only once a new product to a producer', async() => {
      // on ajoute le produit aux produits proposés par le producteur
      benoit = (await producersServices.addProductToProducer(tabProductsAntoine[0].id, benoit.id)).toObject();
      expect(benoit.productsIds.length).to.be.equal(3);
      expect(benoit.productsIds.map(p => p.toString())).to.contain(tabProductsAntoine[0].id);

      // on tente d'ajouter le même produit
      benoit = (await producersServices.addProductToProducer(tabProductsAntoine[0].id, benoit.id)).toObject();
      // il ne devrait pas avoir été ajouté à nouveau -> la taille du tableau reste de 3
      expect(benoit.productsIds.length).to.be.equal(3);
      expect(benoit.productsIds.map(p => p.toString())).to.contain(tabProductsAntoine[0].id);
    });

    it('should not add a new product to a producer because invalid producerId received (too short)', async() => {
      try {
        benoit = await producersServices.addProductToProducer(tabProductsAntoine[0].id, 'abcdef');
      } catch (err) {
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "abcdef" at path "_id" for model "producers"');
      }
    });

    it('should not add a new product to a producer because invalid producerId received (too long)', async() => {
      try {
        benoit = await producersServices.addProductToProducer(tabProductsAntoine[0].id, 'abcdefabcdefabcdefabcdefabcdef');
      } catch (err) {
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "producers"');
      }
    });

    it('should not add a new product to a producer because unknown producerId received', async() => {
      benoit = await producersServices.addProductToProducer(tabProductsAntoine[0].id, 'abcdefabcdefabcdefabcdef');
      expect(benoit).to.be.null;
    });

    it('should not add a new product to a producer because invalid productId received (too short)', async() => {
      try {
        benoit = (await producersServices.addProductToProducer('abcedf', benoit.id)).toObject();
      } catch (err) {
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "abcedf" at path "_id" for model "products"');
      }
    });

    it('should not add a new product to a producer because invalid productId received (too long)', async() => {
      try {
        benoit = (await producersServices.addProductToProducer('abcedfabcedfabcedfabcedfabcedf', benoit.id)).toObject();
      } catch (err) {
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "abcedfabcedfabcedfabcedfabcedf" at path "_id" for model "products"');
      }
    });

    it('should not add a new product to a producer because unknown productId received', async() => {
      try {
        benoit = (await producersServices.addProductToProducer('abcedfabcedfabcedfabcedf', benoit.id)).toObject();
      } catch (err) {
        expect(err.message).to.be.equal('The given product (with id: abcedfabcedfabcedfabcedf) doesn’t exist in the database!');
      }
    });
  });

  describe('tests removeProductFromProducer', () => {
    it('should remove a product from a producer', async() => {
      // on ajoute le produit aux produits proposés par le producteur
      benoit = (await producersServices.addProductToProducer(tabProductsAntoine[0].id, benoit.id)).toObject();
      expect(benoit.productsIds.length).to.be.equal(3);
      expect(benoit.productsIds.map(p => p.toString())).to.contain(tabProductsAntoine[0].id);

      // on supprime le produit
      benoit = (await producersServices.removeProductFromProducer(tabProductsAntoine[0].id, benoit.id)).toObject();
      expect(benoit.productsIds.length).to.be.equal(2);
      expect(benoit.productsIds.map(p => p.toString())).not.to.contain(tabProductsAntoine[0].id);
    });
  });

  describe('tests addSalespointToProducer', () => {
    it('should add a salespoint to a producer', async() => {
      salespointBenoit = {
        name: 'Chez moi',
        address: {
          number: 6,
          street: 'Chemin de par ici',
          city: 'Yverdon',
          postalCode: '1400',
          state: 'Vaud',
          country: 'Suisse',
          longitude: 1.1234567,
          latitude: 1.123456789
        },
        schedule:
          {
            monday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              },
              {
                openingHour: '13:00',
                closingHour: '18:00'
              }
            ],
            tuesday: [],
            wednesday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ],
            thursday: [],
            friday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ],
            saturday: [],
            sunday: []
          }
      };

      // antoine n'a pas encore de point de vente
      expect(antoine.salespointId).to.be.null;

      // on ajoute un point de vente au producteur
      antoine = (await producersServices.addSalespointToProducer(antoine.id, salespointBenoit)).toObject();
      // antoine a maintenant un point de vente
      expect(antoine.salespointId).to.be.not.null;

      const salespoint = (await salespointServices.getSalesPointById(antoine.salespointId)).toObject();
      expect(salespoint.id).to.be.equal(antoine.salespointId.toString());
      expect(salespoint.name).to.be.equal(salespointBenoit.name);
    });

    it('should not add a salespoint to a producer because invalid producerId received (too short)', async() => {
      salespointBenoit = {
        name: 'Chez moi',
        address: {
          number: 6,
          street: 'Chemin de par ici',
          city: 'Yverdon',
          postalCode: '1400',
          state: 'Vaud',
          country: 'Suisse',
          longitude: 1.1234567,
          latitude: 1.123456789
        },
        schedule:
          {
            monday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              },
              {
                openingHour: '13:00',
                closingHour: '18:00'
              }
            ],
            tuesday: [],
            wednesday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ],
            thursday: [],
            friday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ],
            saturday: [],
            sunday: []
          }
      };

      // antoine n'a pas encore de point de vente
      expect(antoine.salespointId).to.be.null;

      // on ajoute un point de vente au producteur
      antoine = await producersServices.addSalespointToProducer('abcdef', salespointBenoit);
      expect(antoine.message).to.be.equal('Received producerId is invalid!');
    });

    it('should not add a salespoint to a producer because invalid producerId received (too long)', async() => {
      salespointBenoit = {
        name: 'Chez moi',
        address: {
          number: 6,
          street: 'Chemin de par ici',
          city: 'Yverdon',
          postalCode: '1400',
          state: 'Vaud',
          country: 'Suisse',
          longitude: 1.1234567,
          latitude: 1.123456789
        },
        schedule:
          {
            monday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              },
              {
                openingHour: '13:00',
                closingHour: '18:00'
              }
            ],
            tuesday: [],
            wednesday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ],
            thursday: [],
            friday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ],
            saturday: [],
            sunday: []
          }
      };

      // antoine n'a pas encore de point de vente
      expect(antoine.salespointId).to.be.null;

      // on ajoute un point de vente au producteur
      antoine = await producersServices.addSalespointToProducer('abcdefabcdefabcdefabcdefabcdef', salespointBenoit);
      expect(antoine.message).to.be.equal('Received producerId is invalid!');
    });

    it('should not add a salespoint to a producer because received producerId is unknown', async() => {
      salespointBenoit = {
        name: 'Chez moi',
        address: {
          number: 6,
          street: 'Chemin de par ici',
          city: 'Yverdon',
          postalCode: '1400',
          state: 'Vaud',
          country: 'Suisse',
          longitude: 1.1234567,
          latitude: 1.123456789
        },
        schedule:
          {
            monday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              },
              {
                openingHour: '13:00',
                closingHour: '18:00'
              }
            ],
            tuesday: [],
            wednesday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ],
            thursday: [],
            friday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ],
            saturday: [],
            sunday: []
          }
      };

      // antoine n'a pas encore de point de vente
      expect(antoine.salespointId).to.be.null;

      // on ajoute un point de vente au producteur
      antoine = await producersServices.addSalespointToProducer('abcdefabcdefabcdefabcdef', salespointBenoit);
      expect(antoine).to.be.null;
    });
  });

  describe('tests removeSalespointToProducer', () => {
    it('should remove a salespoint to a producer', async() => {
      salespointBenoit = {
        name: 'Chez moi',
        address: {
          number: 6,
          street: 'Chemin de par ici',
          city: 'Yverdon',
          postalCode: '1400',
          state: 'Vaud',
          country: 'Suisse',
          longitude: 1.1234567,
          latitude: 1.123456789
        },
        schedule:
          {
            monday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              },
              {
                openingHour: '13:00',
                closingHour: '18:00'
              }
            ],
            tuesday: [],
            wednesday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ],
            thursday: [],
            friday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ],
            saturday: [],
            sunday: []
          }
      };

      // antoine n'a pas encore de point de vente
      expect(antoine.salespointId).to.be.null;

      // on ajoute un point de vente au producteur
      antoine = (await producersServices.addSalespointToProducer(antoine.id, salespointBenoit)).toObject();
      // antoine a maintenant un point de vente
      expect(antoine.salespointId).to.be.not.null;

      // on supprime le point de vente du producteur
      antoine = (await producersServices.removeSalespointToProducer(antoine.id)).toObject();

      let salespoint = (await salespointServices.getSalesPointById(antoine.salespointId)).toObject();
      expect(salespoint.id).to.be.equal(antoine.salespointId.toString());
      expect(salespoint.name).to.be.equal(salespointBenoit.name);

      // antoine n'a plus de point de vente
      expect(antoine.salespointId).to.be.null;

      salespoint = (await salespointServices.getSalesPointById(antoine.salespointId)).toObject();
      expect(salespoint).to.be.null;
    });
  });

  describe('tests updateProducer', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should update a producer', async() => {
      // on récupère un producteur
      let producer = (await producersServices.getProducerById(antoine.id)).toObject();
      // on le modifie
      const { password } = producer;

      producer = {
        ...benoit,
        id: producer.id,
        // on tente de modifier le salespointId -> ne devrait pas se modifier lors de l'update
        salespoint: benoit.salespointId,
        // on tente de modifier le password -> ne devrait pas se modifier lors de l'update
        password: '12341234'
      };
      // on met à jour dans la DB
      const updatedProducer = (await producersServices.updateProducer(producer)).toObject();
      // on test son nouveau contenu
      updatedProducer.should.be.not.null;
      updatedProducer.id.should.be.equal(producer.id);
      updatedProducer.firstname.should.be.equal(producer.firstname);
      updatedProducer.lastname.should.be.equal(producer.lastname);
      updatedProducer.email.should.be.equal(producer.email);
      // on check que le password n'ait pas été modifié durant l'update!
      updatedProducer.password.should.be.equal(password);
      updatedProducer.image.should.be.equal(producer.image);

      // TODO: tester l'intérieur de subscription lorsqu'on pourra les gérer...!
      expect(updatedProducer.followingProducersIds).to.be.null;

      updatedProducer.emailValidated.should.be.equal(producer.emailValidated);
      expect(updatedProducer.followersIds).to.be.null;
      // TODO: tester l'intérieur de followersIds lorsqu'on pourra les gérer...!
      /*
      // le 2ème paramètre (index) permet de récupérer l'index de l'itération (le i d'un for normal)
      producer.followersIds.forEach((subscribedUser, index) => {
        subscribedUser.id.should.be.not.null;
        subscribedUser.firstname.should.be.not.null;
        subscribedUser.lastname.should.be.not.null;
        subscribedUser.email.should.be.not.null;
        subscribedUser.password.should.be.not.null;
      });
      */
      updatedProducer.phoneNumber.should.be.equal(producer.phoneNumber);
      updatedProducer.description.should.be.equal(producer.description);
      updatedProducer.website.should.be.equal(producer.website);
      expect(updatedProducer.salespointId).to.be.null; // car antoine.salespoint est null et que le salespointId n'est pas modifié lors d'un update
      updatedProducer.isValidated.should.be.equal(producer.isValidated);

      // on test le tableau productsIds et son contenu
      const promisesTestsProductsIds = updatedProducer.productsIds.map((async(productId, index) => {
        productId.toString().should.be.eql(tabProductsAntoine[index].id);

        // on récupère les infos du produit correspondant
        const product = (await productsServices.getProductById(productId)).toObject();

        // on récupère les infos du productType correspondant au produit
        const productType = (await productTypeServices.getProductTypeById(product.productTypeId)).toObject();
        productType.should.be.not.null;
        productType.producersIds.should.be.not.null;
        const addedProducerId = updatedProducer.id.toString();

        // on vérifie que l'id du producteur ait bien été ajouté dans le tableau 'productersIds' du productType
        const filtredTab = await productType.producersIds.filter(elem => elem.toString() === addedProducerId);
        filtredTab.length.should.be.equal(1); // FIXME: bug dans la 2ème itération...!
      }));
      await Promise.all(promisesTestsProductsIds);
    });

    it('should fail updating a producer because no id received', async() => {
      benoit.id = '';
      const updatedProducer = await producersServices.updateProducer(benoit);

      updatedProducer.message.should.be.equal('Received producer.id is invalid!');
    });

    it('should fail updating a producer because invalid id received', async() => {
      benoit.id = '5c04561e7209e21e582750'; // id trop court (<24 caractères)
      const updatedProducer = await producersServices.updateProducer(benoit);

      updatedProducer.message.should.be.equal('Received producer.id is invalid!');
    });

    it('should fail updating a producer because invalid id received', async() => {
      benoit.id = '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3'; // id trop long (> 24 caractères)
      const updatedProducer = await producersServices.updateProducer(benoit);

      updatedProducer.message.should.be.equal('Received producer.id is invalid!');
    });

    it('should fail updating a producer because unknown id received', async() => {
      benoit.id = 'abcdefabcdefabcdefabcdef';
      const updatedProducer = await producersServices.updateProducer(benoit);
      updatedProducer.message.should.be.equal('The received id is not in the database!');
    });
  });

  describe('tests validateAProducer', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should validate a producer', async() => {
      const producersWaitingForValidation = await producersServices.getAllProducerWaitingForValidation();

      // on valide un producteur
      const validatedProducer = await producersServices.validateAProducer(producersWaitingForValidation[0].id, true);
      validatedProducer.should.be.not.null;
      validatedProducer.isValidated.should.be.true;
    });

    it('should unvalidate a validated producer', async() => {
      const producersWaitingForValidation = await producersServices.getAllProducerWaitingForValidation();

      // on valide un producteur
      let validatedProducer = await producersServices.validateAProducer(producersWaitingForValidation[0].id, true);
      validatedProducer.should.be.not.null;
      validatedProducer.isValidated.should.be.true;

      // on invalide ce même producteur
      validatedProducer = await producersServices.validateAProducer(producersWaitingForValidation[0].id, true);
      validatedProducer.should.be.not.null;
      validatedProducer.isValidated.should.be.false;
    });
  });

  describe('tests deleteProducer', () => {
    it('should delete a producer', async() => {
      // on supprime un producteur
      let deleteProducer = (await producersServices.deleteProducer(benoit.id)).toObject();
      deleteProducer.should.be.not.null;
      deleteProducer.id.should.be.eql(benoit.id);

      // on tente de récupérer le même producteur -> retourne null car le producteur est introuvable dans la DB
      deleteProducer = await producersServices.getProducerById(deleteProducer.id);

      expect(deleteProducer).to.be.null;
    });

    it('should fail deleting a producer because given id not found in DB', async() => {
      // on supprime un producer inexistant -> retourne null car le producer est introuvable dans la DB
      const deleteProducer = await producersServices.deleteProducer('abcdefabcdefabcdefabcdef');

      expect(deleteProducer).to.be.null;
    });
  });

  describe('tests addFollowerToProducer', () => {
    let users;
    let producers;
    beforeEach(async() => {
      await clearAndPopulateDB();

      await populateDB();

      users = await usersServices.getUsers();
      users = users.map(u => u.toObject());
      producers = await producersServices.getProducers();
      producers = producers.map(p => p.toObject());
    });

    it('should add only once a person to the followers of a producer', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      let person = (await producersServices.addFollowerToProducer(producers[0].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds[0].should.be.eql(producers[0]._id);

      // on récupère le producteur qui a un nouveau follower
      let producer0 = (await producersServices.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(1);
      producer0.followersIds.should.contain.deep(users[0]._id);

      // on ajoute à nouveau le follower users[0] au producer producers[0] -> il ne doit pas être ajouté une 2ème fois.
      person = (await producersServices.addFollowerToProducer(producers[0].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds.should.contain.deep(producers[0]._id);

      // on récupère le producteur qui ne devrait pas avoir de 2ème nouveau follower
      producer0 = (await producersServices.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(1);
      producer0.followersIds.should.contain.deep(users[0]._id);
    });

    it('should add multiple persons to the followers of a producer', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      let person = (await producersServices.addFollowerToProducer(producers[0].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds.should.contain.deep(producers[0]._id);

      // on récupère le producteur qui a un nouveau follower
      let producer0 = (await producersServices.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(1);
      producer0.followersIds.should.contain.deep(users[0]._id);

      // on ajoute le follower users[1] au producer producers[0]
      person = (await producersServices.addFollowerToProducer(producers[0].id, users[1].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds.should.contain.deep(producers[0]._id);

      // on récupère le producteur qui devrait avoir un 2ème follower
      producer0 = (await producersServices.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(2);
      producer0.followersIds.should.contain.deep(users[0]._id);
      producer0.followersIds.should.contain.deep(users[1]._id);

      // on ajoute le follower producer[1] au producer producers[0]
      person = (await producersServices.addFollowerToProducer(producers[0].id, producers[1].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds.should.contain.deep(producers[0]._id);

      // on ajoute le follower producer[2] au producer producers[0]
      person = (await producersServices.addFollowerToProducer(producers[0].id, producers[2].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds.should.contain.deep(producers[0]._id);

      // on récupère le producteur qui devrait avoir un total de 4 followers
      producer0 = (await producersServices.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(4);
      producer0.followersIds.should.contain.deep(users[0]._id);
      producer0.followersIds.should.contain.deep(users[1]._id);
      producer0.followersIds.should.contain.deep(producers[1]._id);
      producer0.followersIds.should.contain.deep(producers[2]._id);
    });

    it('should add multiple producers to the following list of a person', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      let person = (await producersServices.addFollowerToProducer(producers[0].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(1);
      person.followingProducersIds.should.contain.deep(producers[0]._id);

      // on récupère le producer0 qui a un nouveau follower
      const producer0 = (await producersServices.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(1);
      producer0.followersIds.should.contain.deep(users[0]._id);

      // on ajoute le follower users[0] au producer producers[1]
      person = (await producersServices.addFollowerToProducer(producers[1].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(2);
      person.followingProducersIds.should.contain.deep(producers[0]._id);
      person.followingProducersIds.should.contain.deep(producers[1]._id);

      // on récupère le producer1 qui a un nouveau follower
      const producer1 = (await producersServices.getProducerById(producers[1].id)).toObject();
      producer1.followersIds.length.should.be.equal(1);
      producer1.followersIds.should.contain.deep(users[0]._id);

      // on ajoute le follower users[0] au producer producers[2]
      person = (await producersServices.addFollowerToProducer(producers[2].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(3);
      person.followingProducersIds.should.contain.deep(producers[0]._id);
      person.followingProducersIds.should.contain.deep(producers[1]._id);
      person.followingProducersIds.should.contain.deep(producers[2]._id);

      // on récupère le producer2 qui a un nouveau follower
      const producer2 = (await producersServices.getProducerById(producers[2].id)).toObject();
      producer2.followersIds.length.should.be.equal(1);
      producer2.followersIds.should.contain.deep(users[0]._id);

      // on ajoute le follower users[0] au producer producers[3]
      person = (await producersServices.addFollowerToProducer(producers[3].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(4);
      person.followingProducersIds.should.contain.deep(producers[0]._id);
      person.followingProducersIds.should.contain.deep(producers[1]._id);
      person.followingProducersIds.should.contain.deep(producers[2]._id);
      person.followingProducersIds.should.contain.deep(producers[3]._id);

      // on récupère le producer3 qui a un nouveau follower
      const producer3 = (await producersServices.getProducerById(producers[0].id)).toObject();
      producer3.followersIds.length.should.be.equal(1);
      producer3.followersIds.should.contain.deep(users[0]._id);
    });

    it('should fail adding a person to the followers of a producer because personId and producerId are the sames', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      const person = await producersServices.addFollowerToProducer(producers[0].id, producers[0].id);
      person.message.should.not.be.null;
      person.message.should.be.equal('You can\'t follow yourself!');
    });

    it('should fail adding a person to the followers of a producer because producerId do not refer a producer', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      const person = await producersServices.addFollowerToProducer(users[0].id, users[1].id);
      person.message.should.not.be.null;
      person.message.should.be.equal('There is no producer with this id in database!');
    });
  });

  describe('tests removeFollowerToProducer', () => {
    let users;
    let producers;
    beforeEach(async() => {
      await clearAndPopulateDB();

      await populateDB();

      users = await usersServices.getUsers();
      users = users.map(u => u.toObject());
      producers = await producersServices.getProducers();
      producers = producers.map(p => p.toObject());
    });

    it('should delete a person from the followers of a producer', async() => {
      // on ajoute les followers users[0] et users[1] au producer producers[0]
      await producersServices.addFollowerToProducer(producers[0].id, users[0].id);
      await producersServices.addFollowerToProducer(producers[0].id, users[1].id);

      // on récupère le producer0 qui a deux nouveaux followers
      let producer0 = (await producersServices.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(2);
      producer0.followersIds.should.contain.deep(users[0]._id);
      producer0.followersIds.should.contain.deep(users[1]._id);

      // on supprime le follower users[0] des followers de producers[0]
      let person = (await producersServices.removeFollowerToProducer(producers[0].id, users[0].id)).toObject();
      person.followingProducersIds.length.should.be.equal(0);
      person.followingProducersIds.should.not.contain.deep(producers[0]._id);

      // on récupère le producer0 qui n'a plus qu'un follower (users[1])
      producer0 = (await producersServices.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(1);
      producer0.followersIds.should.not.contain.deep(users[0]._id);
      producer0.followersIds.should.contain.deep(users[1]._id);

      // on supprime le follower users[1] des followers de producers[0]
      person = (await producersServices.removeFollowerToProducer(producers[0].id, users[1].id)).toObject();
      person.followingProducersIds.length.should.be.equal(0);
      person.followingProducersIds.should.not.contain.deep(producers[0]._id);

      // on récupère le producer0 qui n'a plus qu'un follower (users[1])
      producer0 = (await producersServices.getProducerById(producers[0].id)).toObject();
      producer0.followersIds.length.should.be.equal(0);
      producer0.followersIds.should.not.contain.deep(users[0]._id);
      producer0.followersIds.should.not.contain.deep(users[1]._id);
    });

    it('should fail unsubscribe a person from the followers of a producer because personId and producerId are the sames', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      const person = await producersServices.removeFollowerToProducer(producers[0].id, producers[0].id);
      person.message.should.not.be.null;
      person.message.should.be.equal('You can\'t follow yourself!');
    });

    it('should fail unsubscribe a person to the followers of a producer because producerId do not refer a producer', async() => {
      // on ajoute le follower users[0] au producer producers[0]
      const person = await producersServices.removeFollowerToProducer(users[0].id, users[1].id);
      person.message.should.not.be.null;
      person.message.should.be.equal('There is no producer with this id in database!');
    });
  });
});
