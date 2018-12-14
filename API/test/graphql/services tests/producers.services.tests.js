require('../../chai-config');

const producersService = require('../../../src/graphql/services/producers.services');
const productsService = require('../../../src/graphql/services/products.services');
const productTypeService = require('../../../src/graphql/services/productType.services');
const ProducersModel = require('../../../src/graphql/models/producers.modelgql');
const PersonModel = require('../../../src/graphql/models/persons.modelgql');
const userModel = require('../../../src/graphql/models/users.modelgql');
const salespointsModel = require('../../../src/graphql/models/salespoints.modelgql');
const tokensValidationEmailModel = require('../../../src/graphql/models/tokensValidationEmail.modelgql');
const { Products: ProductModel, ProductType: ProductTypeModel, ProductTypeCategory: ProductTypeCategoryModel } = require(
  '../../../src/graphql/models/products.modelgql'
);

let productTypeCategory = {
  name: 'Fruits',
  image: 'ceci est une image de fruits encodée en base64!'
};

let productTypePomme = {
  name: 'Pomme',
  image: 'ceci est une image de pomme encodée en base64!'
};

let productTypePoire = {
  name: 'Poire',
  image: 'ceci est une image de poire encodée en base64!'
};

const productPomme = {
  description: 'Une pomme monnnnstre bonne!'
};

const productPoire = {
  description: 'Une poire de folie!'
};

const salespointBenoit = {
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

let benoit = {
  firstname: 'Benoît',
  lastname: 'Schöpfli',
  email: 'benoit@paysan.ch',
  password: '1234abcd',
  image: 'Ceci est une image encodée en base64!',
  phoneNumber: '0761435196',
  description: 'Un chouet gaillard!',
  website: 'benoitpaysan.ch',
  salesPoint: salespointBenoit,
  productsIds: []
};

let antoine = {
  firstname: 'Antoine',
  lastname: 'Rochaille',
  email: 'antoine.@paysan.ch',
  password: '1234abcd',
  image: 'Ceci est l\'image d\'un tueur encodée en base64!',
  phoneNumber: '0761435196',
  description: 'Un vrai payouz!',
  productsIds: []
};

let tabProducers = [benoit, antoine];

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await ProducersModel.deleteMany();
  await ProductModel.deleteMany();
  await ProductTypeModel.deleteMany();
  await ProductTypeCategoryModel.deleteMany();
  await PersonModel.deleteMany();
  await userModel.deleteMany();
  await salespointsModel.deleteMany();
  await tokensValidationEmailModel.deleteMany();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  // on ajoute 1 productTypeCategory
  productTypeCategory = (await ProductTypeCategoryModel.create(productTypeCategory)).toObject();

  // on ajoute 2 productType
  // FIXME: Paul: ya un moyen de transformer le _id en id lorsqu'on fait un toObject() ? --> juste id n'est plus reconnu après un toObject()...
  productTypePomme.categoryId = productTypeCategory._id;
  productTypePomme = (await ProductTypeModel.create(productTypePomme)).toObject();
  productTypePoire.categoryId = productTypeCategory._id;
  productTypePoire = (await ProductTypeModel.create(productTypePoire)).toObject();

  // on set le productTypeId avec les id de productType qu'on vient d'ajouter
  productPomme.productTypeId = productTypePomme._id;
  productPoire.productTypeId = productTypePoire._id;

  // on ajoute 1 producteur contenant le salespoint 'salespointBenoit' ainsi que 2 produits ('productPomme' et 'productPoire')
  benoit.products = [];
  benoit.products.push(productPomme);
  benoit.products.push(productPoire);
  benoit.salesPoint = salespointBenoit;
  benoit = (await producersService.addProducer(benoit)).toObject();

  // on ajoute 1 producteur ne contenant pas de salespoint ainsi que 1 produit ('productPomme')
  antoine.products = [];
  antoine.products.push(productPomme);
  antoine = (await producersService.addProducer(antoine)).toObject();

  tabProducers = [benoit, antoine];
};

describe('tests producers services', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('tests getProducers', () => {
    it('should get all producers', async() => {
      // on récupère un tableau contenant tous les producteurs
      let allProducers = await producersService.getProducers();

      // on transforme chaque producteur du tableau en un objet
      allProducers = allProducers.map(producer => producer.toObject());
      allProducers.should.be.an('array');
      allProducers.length.should.be.equal(2);

      // pour chaque producteur, on test les éléments critiques
      const promises = await allProducers.map(async(producer, index) => {
        producer._id.should.be.eql(tabProducers[index]._id);

        // Todo: tester l'intérieur de subscription lorsqu'on pourra les gérer...!
        producer.subscriptions.should.be.not.null;
        producer.subscriptions.should.be.an('array');

        // Todo: tester l'intérieur de subscribedUsersIds lorsqu'on pourra les gérer...!
        producer.subscribedUsersIds.should.be.not.null;
        producer.subscribedUsersIds.should.be.an('array');

        // FIXME: Paul: comment je peux tester ça, sachant que salesPointId est parfois null mais parfois pas...?
        // producer.salesPointId.should.be.eql(tabProducers[index].salesPointId);

        const promisesTestsProductsIds = producer.productsIds.map((async(productId) => {
          // on récupère les infos du produit correspondant
          const product = (await productsService.getProductById(productId)).toObject();

          // on récupère les infos du productType correspondant au produit
          const productType = (await productTypeService.getProductTypeById(product.productTypeId)).toObject();
          productType.should.be.not.null;
          productType.producersIds.should.be.not.null;
          const addedProducerId = producer._id.toString();

          // on vérifie que l'id du producteur ait bien été ajouté dans le tableau 'productersIds' du productType
          const filtredTab = await productType.producersIds.filter((elem) => elem.toString() === addedProducerId);
          filtredTab.length.should.be.equal(1);
        }));
        await Promise.all(promisesTestsProductsIds);
      });
      await Promise.all(promises);
    });
  });

  describe('tests getProducerById', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should get one producer', async() => {
      // on récupère le producteur corresondant à l'id donné
      const producer = (await producersService.getProducerById(benoit._id)).toObject();

      // on test son contenu
      producer.should.be.not.null;
      producer._id.should.be.eql(benoit._id);
      producer.firstname.should.be.equal(benoit.firstname);
      producer.lastname.should.be.equal(benoit.lastname);
      producer.email.should.be.equal(benoit.email);
      producer.password.should.be.equal(benoit.password);
      producer.image.should.be.equal(benoit.image);

      // Todo: tester l'intérieur de subscription lorsqu'on pourra les gérer...!
      producer.subscriptions.should.be.an('array');
      producer.subscriptions.length.should.be.equal(benoit.subscriptions.length);

      producer.emailValidated.should.be.equal(benoit.emailValidated);
      producer.subscribedUsersIds.should.be.an('array');
      producer.subscribedUsersIds.length.should.be.equal(benoit.subscribedUsersIds.length);
      // Todo: tester l'intérieur de subscribedUsersIds lorsqu'on pourra les gérer...!
      /*
      // le 2ème paramètre (index) permet de récupérer l'index de l'itération (le i d'un for normal)
      producer.subscribedUsersIds.forEach((subscribedUser, index) => {
        subscribedUser._id.should.be.not.null;
        subscribedUser.firstname.should.be.not.null;
        subscribedUser.lastname.should.be.not.null;
        subscribedUser.email.should.be.not.null;
        subscribedUser.password.should.be.not.null;
      });
      */
      producer.phoneNumber.should.be.equal(benoit.phoneNumber);
      producer.description.should.be.equal(benoit.description);
      producer.website.should.be.equal(benoit.website);
      producer.salesPointId.should.be.eql(benoit.salesPointId);
      producer.isValidated.should.be.equal(benoit.isValidated);

      // on test le tableau productsIds et son contenu
      const promisesTestsProductsIds = producer.productsIds.map((async(productId, index) => {
        productId.should.be.eql(benoit.productsIds[index]);

        // on récupère les infos du produit correspondant
        const product = (await productsService.getProductById(productId)).toObject();

        // on récupère les infos du productType correspondant au produit
        const productType = (await productTypeService.getProductTypeById(product.productTypeId)).toObject();
        productType.should.be.not.null;
        productType.producersIds.should.be.not.null;
        const addedProducerId = producer._id.toString();

        // on vérifie que l'id du producteur ait bien été ajouté dans le tableau 'productersIds' du productType
        const filtredTab = await productType.producersIds.filter((elem) => elem.toString() === addedProducerId);
        filtredTab.length.should.be.equal(1);
      }));
      await Promise.all(promisesTestsProductsIds);
    });

    it('should fail getting one producer because no id received', async() => {
      const producerGotInDB = await producersService.getProducerById('');
      producerGotInDB.message.should.be.equal('Received producer.id is invalid!');
    });

    it('should fail getting one producer because invalid id received', async() => {
      const producerGotInDB = await producersService.getProducerById(benoit._id + benoit._id);
      producerGotInDB.message.should.be.equal('Received producer.id is invalid!');
    });

    it('should fail getting one producer because unknown id received', async() => {
      const producerGotInDB = await producersService.getProducerById('abcdefabcdefabcdefabcdef');
      // FIXME: Paul: est-ce que c'est la meilleure façon de tester si un element est nul? -> faire elem.should.be.null lève une erreur...
      expect(producerGotInDB).to.be.null;
    });
  });

  describe('tests getAllProducerWaitingForValidation', () => {
    it('should get all producers waiting for validation', async() => {
      // on récupère tous les producteurs non validés (isValidated = false)
      let allProducersWaitingForValidation = await producersService.getAllProducerWaitingForValidation();
      allProducersWaitingForValidation.should.be.an('array');
      allProducersWaitingForValidation.length.should.be.equal(2);
      allProducersWaitingForValidation.forEach(p => p.isValidated.should.be.false);

      // on valide un des producteurs non validé
      await producersService.validateAProducer(allProducersWaitingForValidation[0]._id, true);

      // on récupère tous les producteurs non validés --> il y en a bien un de moins
      allProducersWaitingForValidation = await producersService.getAllProducerWaitingForValidation();
      allProducersWaitingForValidation.should.be.an('array');
      allProducersWaitingForValidation.length.should.be.equal(1);
      allProducersWaitingForValidation.forEach(p => p.isValidated.should.be.false);
    });
  });

  describe('tests getAllProducersInReceivedIdList', () => {
    it('should get all producers with id in received list', async() => {
      // on récupère 2 producteurs
      let producers = await producersService.getAllProducersInReceivedIdList([benoit._id, antoine._id]);
      producers.should.be.an('array');
      producers.length.should.be.equal(2);

      // on récupère 1 seul producteur
      producers = await producersService.getAllProducersInReceivedIdList([benoit._id]);
      producers.should.be.not.null;
      producers.should.be.an('array');
      producers.length.should.be.equal(1);

      // on récupère aucun producteur
      producers = await producersService.getAllProducersInReceivedIdList([]);
      producers.should.be.not.null;
      producers.should.be.an('array');
      producers.length.should.be.equal(0);
    });
  });

  describe('tests filterProducers by productTypeIds', () => {
    it('should return only producers that produce some products of the given productTypeIds', async() => {
      // on récupère tous les producteurs produisant des produits de la catégorie 'productTypePomme'
      let producersOfPommes = await producersService.filterProducers([productTypePomme._id]);
      producersOfPommes.should.be.an('array');
      producersOfPommes.length.should.be.equal(2);

      // on récupère tous les producteurs produisant des produits de la catégorie 'productTypePoire'
      producersOfPommes = await producersService.filterProducers([productTypePoire._id]);
      producersOfPommes.should.be.an('array');
      producersOfPommes.length.should.be.equal(1);
    });
  });

  describe('tests addProducer', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should add a new producer', async() => {
      benoit.email = 'benoit1@paysan.ch';
      benoit.products = [];
      benoit.products.push(productPomme);
      benoit.products.push(productPoire);
      benoit.salesPoint = salespointBenoit;

      const addedProducer = await producersService.addProducer(benoit);
      // on test son contenu
      addedProducer.should.be.not.null;
      addedProducer._id.should.be.not.null; // ne peut pas être égal à benoit._id !
      addedProducer.firstname.should.be.equal(benoit.firstname);
      addedProducer.lastname.should.be.equal(benoit.lastname);
      addedProducer.email.should.be.equal(benoit.email);
      addedProducer.password.should.be.equal(benoit.password);
      addedProducer.image.should.be.equal(benoit.image);

      // Todo: tester l'intérieur de subscription lorsqu'on pourra les gérer...!
      addedProducer.subscriptions.should.be.an('array');
      addedProducer.subscriptions.length.should.be.equal(benoit.subscriptions.length);

      addedProducer.emailValidated.should.be.equal(benoit.emailValidated);
      addedProducer.subscribedUsersIds.should.be.an('array');
      addedProducer.subscribedUsersIds.length.should.be.equal(benoit.subscribedUsersIds.length);
      // Todo: tester l'intérieur de subscribedUsersIds lorsqu'on pourra les gérer...!
      /*
      // le 2ème paramètre (index) permet de récupérer l'index de l'itération (le i d'un for normal)
      producer.subscribedUsersIds.forEach((subscribedUser, index) => {
        subscribedUser._id.should.be.not.null;
        subscribedUser.firstname.should.be.not.null;
        subscribedUser.lastname.should.be.not.null;
        subscribedUser.email.should.be.not.null;
        subscribedUser.password.should.be.not.null;
      });
      */
      addedProducer.phoneNumber.should.be.equal(benoit.phoneNumber);
      addedProducer.description.should.be.equal(benoit.description);
      addedProducer.website.should.be.equal(benoit.website);
      addedProducer.salesPointId.should.be.not.null; // ne peut pas être égal à benoit.salesPointId !
      addedProducer.isValidated.should.be.equal(benoit.isValidated);

      // on test le tableau productsIds et son contenu
      const promisesTestsProductsIds = addedProducer.productsIds.map((async(productId) => {
        productId.should.be.not.null;

        // on récupère les infos du produit correspondant
        const product = (await productsService.getProductById(productId)).toObject();

        // on récupère les infos du productType correspondant au produit
        const productType = (await productTypeService.getProductTypeById(product.productTypeId)).toObject();
        productType.should.be.not.null;
        productType.producersIds.should.be.not.null;
        const addedProducerId = addedProducer._id.toString();

        // on vérifie que l'id du producteur ait bien été ajouté dans le tableau 'productersIds' du productType
        const filtredTab = await productType.producersIds.filter((elem) => elem.toString() === addedProducerId);
        filtredTab.length.should.be.equal(1);
      }));
      await Promise.all(promisesTestsProductsIds);
    });

    // TODO: ajouter des tests d'échec d'ajout lorsqu'il manque des données obligatoires

    it('should fail adding a new producer with an already used email', async() => {
      benoit.email = 'benoit@paysan.ch';
      benoit.products = [];
      benoit.products.push(productPomme);
      benoit.products.push(productPoire);
      benoit.salesPoint = salespointBenoit;

      const addedProducer = (await producersService.addProducer(benoit)).toObject();
      addedProducer.should.be.not.null;
      addedProducer._id.should.be.not.null;
      addedProducer.firstname.should.be.equal(benoit.firstname);
      addedProducer.lastname.should.be.equal(benoit.lastname);
      addedProducer.email.should.be.equal(benoit.email);
      // pas la peine de tester tout les champs

      // FIXME: Paul : c'est quoi la façon jolie de faire un test d'erreur avec chai? ^
      try {
        await producersService.addProducer(benoit);
      } catch (e) {
        e.message.should.be.equal('This email is already used.');
      }
    });
  });

  describe('tests updateProducer', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should update a producer', async() => {
      const producer = (await producersService.getProducerById(antoine._id)).toObject();

      // on copie l'id du producer dans benoit --> revient à mettre à jour l'ensemble des données (sauf l'id) de 'producer'
      benoit._id = producer._id;

      // on crée le champ id car on en a besoin dans updateProducer()
      benoit.id = benoit._id;

      // on met à jour dans la DB
      const updatedProducer = (await producersService.updateProducer(benoit)).toObject();

      // on test son contenu
      updatedProducer.should.be.not.null;
      updatedProducer._id.should.be.eql(benoit._id);
      updatedProducer.firstname.should.be.equal(benoit.firstname);
      updatedProducer.lastname.should.be.equal(benoit.lastname);
      updatedProducer.email.should.be.equal(benoit.email);
      updatedProducer.password.should.be.equal(benoit.password);
      updatedProducer.image.should.be.equal(benoit.image);

      // Todo: tester l'intérieur de subscription lorsqu'on pourra les gérer...!
      updatedProducer.subscriptions.should.be.an('array');
      updatedProducer.subscriptions.length.should.be.equal(benoit.subscriptions.length);

      updatedProducer.emailValidated.should.be.equal(benoit.emailValidated);
      updatedProducer.subscribedUsersIds.should.be.an('array');
      updatedProducer.subscribedUsersIds.length.should.be.equal(benoit.subscribedUsersIds.length);
      // Todo: tester l'intérieur de subscribedUsersIds lorsqu'on pourra les gérer...!
      /*
      // le 2ème paramètre (index) permet de récupérer l'index de l'itération (le i d'un for normal)
      producer.subscribedUsersIds.forEach((subscribedUser, index) => {
        subscribedUser._id.should.be.not.null;
        subscribedUser.firstname.should.be.not.null;
        subscribedUser.lastname.should.be.not.null;
        subscribedUser.email.should.be.not.null;
        subscribedUser.password.should.be.not.null;
      });
      */
      updatedProducer.phoneNumber.should.be.equal(benoit.phoneNumber);
      updatedProducer.description.should.be.equal(benoit.description);
      updatedProducer.website.should.be.equal(benoit.website);
      updatedProducer.salesPointId.should.be.eql(benoit.salesPointId);
      updatedProducer.isValidated.should.be.equal(benoit.isValidated);

      // on test le tableau productsIds et son contenu
      const promisesTestsProductsIds = updatedProducer.productsIds.map((async(productId, index) => {
        productId.should.be.eql(benoit.productsIds[index]);

        // on récupère les infos du produit correspondant
        const product = (await productsService.getProductById(productId)).toObject();

        // on récupère les infos du productType correspondant au produit
        const productType = (await productTypeService.getProductTypeById(product.productTypeId)).toObject();
        productType.should.be.not.null;
        productType.producersIds.should.be.not.null;
        const addedProducerId = updatedProducer._id.toString();

        // on vérifie que l'id du producteur ait bien été ajouté dans le tableau 'productersIds' du productType
        const filtredTab = await productType.producersIds.filter(elem => elem.toString() === addedProducerId);
        filtredTab.length.should.be.equal(1);
      }));
      await Promise.all(promisesTestsProductsIds);
    });

    it('should fail updating a producer because no id received', async() => {
      benoit.id = '';
      const updatedProducer = await producersService.updateProducer(benoit);

      updatedProducer.message.should.be.equal('Received producer.id is invalid!');
    });

    it('should fail updating a producer because invalid id received', async() => {
      benoit.id = '5c04561e7209e21e582750'; // id trop court (<24 caractères)
      const updatedProducer = await producersService.updateProducer(benoit);

      updatedProducer.message.should.be.equal('Received producer.id is invalid!');
    });

    it('should fail updating a producer because invalid id received', async() => {
      benoit.id = '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3'; // id trop long (> 24 caractères)
      const updatedProducer = await producersService.updateProducer(benoit);

      updatedProducer.message.should.be.equal('Received producer.id is invalid!');
    });

    it('should fail updating a producer because unknown id received', async() => {
      benoit.id = 'abcdefabcdefabcdefabcdef';
      const updatedProducer = await producersService.updateProducer(benoit);

      updatedProducer.message.should.be.equal('The received id is not in the database!');
    });
  });

  describe('tests validateAProducer', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should validate a producer', async() => {
      const producersWaitingForValidation = await producersService.getAllProducerWaitingForValidation();

      // on valide un producteur
      const validatedProducer = await producersService.validateAProducer(producersWaitingForValidation[0]._id, true);
      validatedProducer.should.be.not.null;
      validatedProducer.isValidated.should.be.true;
    });

    it('should unvalidate a validated producer', async() => {
      const producersWaitingForValidation = await producersService.getAllProducerWaitingForValidation();

      // on valide un producteur
      let validatedProducer = await producersService.validateAProducer(producersWaitingForValidation[0]._id, true);
      validatedProducer.should.be.not.null;
      validatedProducer.isValidated.should.be.true;

      // on invalide ce même producteur
      validatedProducer = await producersService.validateAProducer(producersWaitingForValidation[0]._id, true);
      validatedProducer.should.be.not.null;
      validatedProducer.isValidated.should.be.false;
    });
  });

  describe('tests deleteProducer', () => {
    it('should delete a producer', async() => {
      // on supprime un producteur
      let deleteProducer = await producersService.deleteProducer(benoit._id);
      deleteProducer.should.be.not.null;
      deleteProducer._id.should.be.eql(benoit._id);

      // on tente de re-supprimer le même producteur -> retourne null car le producteur est introuvable dans la DB
      deleteProducer = await producersService.getProducerById(deleteProducer._id);

      // FIXME: Paul: est-ce que c'est la meilleure façon de tester si un element est nul? -> faire elem.should.be.null lève une erreur...
      expect(deleteProducer).to.be.null;
    });
  });
});
