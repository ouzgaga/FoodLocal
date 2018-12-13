require('../../chai-config');

const producersService = require('../../../src/graphql/services/producers.services');
const productsService = require('../../../src/graphql/services/products.services');
const productTypeService = require('../../../src/graphql/services/productType.services');
const ProducersModel = require('../../../src/graphql/models/producers.modelgql');
const userModel = require('../../../src/graphql/models/user.modelgql');
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

let benoit = {
  firstname: 'Benoît',
  lastname: 'Schopfer',
  email: 'benoit.schopfer5@heig-vd.ch',
  password: '1234abcd',
  image: 'Ceci est une image encodée en base64!',
  phoneNumber: '0761435196',
  description: 'Un chouet gaillard!',
  website: 'benoitschopfer.ch',
  salesPoint: {
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
  },
  products: [
    {
      description: 'Une pomme monnnnstre bonne!',
      productTypeId: {
        id: '5c050afa96f1ff3cca213d1f'
      }
    },
    {
      description: 'Une poire de folie!',
      productTypeId: '5c05ad449fdaf88060a42aef'
    }
  ]
};

let antoine = {
  firstname: 'Antoine',
  lastname: 'Rochat',
  email: 'antoine.rochat5@heig-vd.ch',
  password: '1234abcd',
  image: 'Ceci est l\'image d\'un tueur encodée en base64!',
  phoneNumber: '0761435196',
  description: 'Un vrai payouz!',
  salesPoint: {
    name: 'Chez lui, perdu au milieu de rien',
    address: {
      number: 12,
      street: 'Chemin de par ici',
      city: 'Quelque part par là-bas',
      postalCode: '1234',
      state: 'Vaud',
      country: 'Suisse',
      longitude: 1.1234796,
      latitude: 1.123418029
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
  },
  products: [
    {
      description: 'Une pomme monnnnstre bonne!',
      productTypeId: {
        id: '5c050afa96f1ff3cca213d1f'
      }
    },
    {
      description: 'Une poire de folie!',
      productTypeId: '5c05ad449fdaf88060a42aef'
    }
  ]
};

describe('tests producers services', () => {
  beforeEach(async() => {
    // on supprime tout le contenu de la DB
    await ProducersModel.deleteMany();
    await ProductModel.deleteMany();
    await ProductTypeModel.deleteMany();
    await ProductTypeCategoryModel.deleteMany();
    await userModel.deleteMany();
    await salespointsModel.deleteMany();
    await tokensValidationEmailModel.deleteMany();

    // on ajoute le contenu de départ

    // on ajoute le productTypeCategory
    productTypeCategory = await ProductTypeCategoryModel.create(productTypeCategory);

    // on ajoute 2 productType
    productTypePomme = {
      name: productTypePomme.name,
      image: productTypePomme.image,
      categoryId: productTypeCategory.id,
      producersIds: []
    };
    const addedProductTypePomme = await ProductTypeModel.create(productTypePomme);
    productTypePomme = {
      id: addedProductTypePomme.id,
      name: addedProductTypePomme.name,
      image: addedProductTypePomme.image,
      categoryId: productTypeCategory.id,
      producersIds: addedProductTypePomme.producersIds
    };

    productTypePoire = {
      name: productTypePoire.name,
      image: productTypePoire.image,
      categoryId: productTypeCategory.id,
      producersIds: []
    };
    const addedProductTypePoire = await ProductTypeModel.create(productTypePoire);
    productTypePoire = {
      id: addedProductTypePoire.id,
      name: addedProductTypePoire.name,
      image: addedProductTypePoire.image,
      categoryId: productTypeCategory.id,
      producersIds: addedProductTypePoire.producersIds
    };

    // on ajoute le contenu de départ
    // on ajoute 2 points de vente
    benoit = {
      firstname: 'Benoît',
      lastname: 'Schopfer',
      email: 'benoit.schopfer5@heig-vd.ch',
      password: '1234abcd',
      image: 'Ceci est une image encodée en base64!',
      phoneNumber: '0761435196',
      description: 'Un chouet gaillard!',
      website: 'benoitschopfer.ch',
      salesPoint: {
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
      },
      products: [
        {
          description: 'Une pomme monnnnstre bonne!',
          productTypeId: addedProductTypePomme.id
        },
        {
          description: 'Une poire de folie!',
          productTypeId: addedProductTypePoire.id
        }
      ]
    };
    benoit = await producersService.addProducer(benoit);

    antoine = {
      firstname: 'Antoine',
      lastname: 'Rochat',
      email: 'antoine.rochat5@heig-vd.ch',
      password: '1234abcd',
      image: 'Ceci est l\'image d\'un tueur encodée en base64!',
      phoneNumber: '0761435196',
      description: 'Un vrai payouz!',
      salesPoint: {
        name: 'Chez lui, perdu au milieu de rien',
        address: {
          number: 12,
          street: 'Chemin de par ici',
          city: 'Quelque part par là-bas',
          postalCode: '1234',
          state: 'Vaud',
          country: 'Suisse',
          longitude: 1.1234796,
          latitude: 1.123418029
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
      },
      products: [
        {
          description: 'Une pomme monnnnstre bonne!',
          productTypeId: addedProductTypePomme.id
        }
      ]
    };
    antoine = await producersService.addProducer(antoine);
  });

  afterEach(() => {
    // on supprime tout le contenu de la DB
    // mongoose.connection.db.dropDatabase();
  });

  it('should get all producers', async() => {
    const allproducers = await producersService.getProducers();

    allproducers.should.be.an('array');
    allproducers.length.should.be.equal(2);
    allproducers.forEach((producer) => {
      producer.should.be.not.null;
      producer.id.should.be.not.null;
      producer.firstname.should.be.not.null;
      producer.lastname.should.be.not.null;
      producer.email.should.be.not.null;
      producer.password.should.be.not.null;
      producer.image.should.be.not.null;
      producer.subscriptions.should.be.not.null;
      producer.subscriptions.should.be.an('array');
      producer.subscriptions.length.should.be.equal(0);
      producer.emailValidated.should.be.not.null;
      producer.emailValidated.should.be.equal(false);
      producer.subscribedUsersIds.should.be.not.null;
      producer.subscribedUsersIds.should.be.an('array');
      producer.subscribedUsersIds.forEach((subscribedUser) => {
        subscribedUser.id.should.be.not.null;
        subscribedUser.firstname.should.be.not.null;
        subscribedUser.lastname.should.be.not.null;
        subscribedUser.email.should.be.not.null;
        subscribedUser.password.should.be.not.null;
      });
      producer.phoneNumber.should.be.not.null;
      producer.description.should.be.not.null;
      producer.salesPointId.should.be.not.null;
      producer.salesPointId.id.should.be.not.null;
    });
  });

  describe('tests getProducerById', () => {
    it('should get one producer', async() => {
      const producer = await producersService.getProducerById(benoit.id);
      producer.should.be.not.null;
      producer.id.should.be.not.null;
      producer.firstname.should.be.not.null;
      producer.firstname.should.be.equal(benoit.firstname);
      producer.lastname.should.be.not.null;
      producer.lastname.should.be.equal(benoit.lastname);
      producer.email.should.be.not.null;
      producer.email.should.be.equal(benoit.email);
      producer.password.should.be.not.null;
      producer.password.should.be.equal(benoit.password);
      producer.image.should.be.not.null;
      producer.image.should.be.equal(benoit.image);
      producer.subscriptions.should.be.not.null;
      producer.subscriptions.should.be.an('array');
      producer.subscriptions.length.should.be.equal(benoit.subscriptions.length);
      producer.emailValidated.should.be.not.null;
      producer.emailValidated.should.be.equal(benoit.emailValidated);
      producer.subscribedUsersIds.should.be.not.null;
      producer.subscribedUsersIds.should.be.an('array');
      producer.subscribedUsersIds.forEach((subscribedUser) => {
        subscribedUser.id.should.be.not.null;
        subscribedUser.firstname.should.be.not.null;
        subscribedUser.lastname.should.be.not.null;
        subscribedUser.email.should.be.not.null;
        subscribedUser.password.should.be.not.null;
      });
      producer.phoneNumber.should.be.not.null;
      producer.description.should.be.not.null;
      producer.salesPointId.should.be.not.null;
      producer.salesPointId.id.should.be.not.null;
    });

    it('should fail getting one producer because no id received', async() => {
      const producerGotInDB = await producersService.getProducerById('');
      producerGotInDB.message.should.be.equal('Received producer.id is invalid!');
    });

    it('should fail getting one producer because invalid id received', async() => {
      const producerGotInDB = await producersService.getProducerById(benoit.id + benoit.id);
      producerGotInDB.message.should.be.equal('Received producer.id is invalid!');
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
      await producersService.validateAProducer(allProducersWaitingForValidation[0].id, true);

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
      let producers = await producersService.getAllProducersInReceivedIdList([benoit.id, antoine.id]);
      producers.should.be.an('array');
      producers.length.should.be.equal(2);

      // on récupre 1 seul producteur
      producers = await producersService.getAllProducersInReceivedIdList([benoit.id]);
      producers.should.be.not.null;
      producers.should.be.an('array');
      producers.length.should.be.equal(1);

      // on check les données du producteur récupéré
      producers[0].should.be.not.null;
      producers[0].id.should.be.not.null;
      producers[0].firstname.should.be.not.null;
      producers[0].firstname.should.be.equal(benoit.firstname);
      producers[0].lastname.should.be.not.null;
      producers[0].lastname.should.be.equal(benoit.lastname);
      producers[0].email.should.be.not.null;
      producers[0].email.should.be.equal(benoit.email);
      producers[0].password.should.be.not.null;
      producers[0].password.should.be.equal(benoit.password);
      producers[0].image.should.be.not.null;
      producers[0].image.should.be.equal(benoit.image);
      producers[0].subscriptions.should.be.not.null;
      producers[0].subscriptions.should.be.an('array');
      producers[0].subscriptions.length.should.be.equal(benoit.subscriptions.length);
      producers[0].emailValidated.should.be.not.null;
      producers[0].emailValidated.should.be.equal(benoit.emailValidated);
      producers[0].subscribedUsersIds.should.be.not.null;
      producers[0].subscribedUsersIds.should.be.an('array');
      producers[0].subscribedUsersIds.forEach((subscribedUser) => {
        subscribedUser.id.should.be.not.null;
        subscribedUser.firstname.should.be.not.null;
        subscribedUser.lastname.should.be.not.null;
        subscribedUser.email.should.be.not.null;
        subscribedUser.password.should.be.not.null;
      });
      producers[0].phoneNumber.should.be.not.null;
      producers[0].description.should.be.not.null;
      producers[0].salesPointId.should.be.not.null;
      producers[0].salesPointId.id.should.be.not.null;
    });
  });

  describe('tests filterProducers by productTypeIds', () => {
    it('should return only producers that produce some products of the given productTypeIds', async() => {
      let producersOfPommes = await producersService.filterProducers([productTypePomme.id]);
      producersOfPommes.should.be.an('array');
      producersOfPommes.length.should.be.equal(2);

      producersOfPommes = await producersService.filterProducers([productTypePoire.id]);
      producersOfPommes.should.be.an('array');
      producersOfPommes.length.should.be.equal(1);
    });
  });


  describe('tests addProducer', () => {
    it('should add a new producer', async() => {
      const newProducer = {
        firstname: 'Benoît',
        lastname: 'Schopfer',
        email: 'benoit.schopfer@heig-vd.ch',
        password: '1234abcd',
        image: 'Ceci est une image encodée en base64!',
        phoneNumber: '0761435196',
        description: 'Un chouet gaillard!',
        website: 'benoitschopfer.ch',
        salesPoint: {
          name: 'Chez moi',
          address: {
            number: 6,
            street: 'Chemin de par ici',
            city: 'Yverdon',
            postalCode: '1400',
            state: 'vaud',
            country: 'Suisse',
            longitude: 1.1234567,
            latitude: 1.123456789
          },
          schedule: {
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
        },
        products: [
          {
            description: 'Une pomme monnnnstre bonne!',
            productTypeId: productTypePomme.id
          },
          {
            description: 'Une poire de folie!',
            productTypeId: productTypePoire.id
          }
        ]
      };

      const addedProducer = await producersService.addProducer(newProducer);
      addedProducer.should.be.not.null;
      addedProducer.id.should.be.not.null;
      addedProducer.firstname.should.be.not.null;
      addedProducer.firstname.should.be.equal(benoit.firstname);
      addedProducer.lastname.should.be.not.null;
      addedProducer.lastname.should.be.equal(benoit.lastname);
      addedProducer.email.should.be.not.null;
      addedProducer.email.should.be.equal('benoit.schopfer@heig-vd.ch');
      addedProducer.password.should.be.not.null;
      addedProducer.password.should.be.equal(benoit.password);
      addedProducer.image.should.be.not.null;
      addedProducer.image.should.be.equal(benoit.image);
      addedProducer.subscriptions.should.be.not.null;
      addedProducer.subscriptions.should.be.an('array');
      addedProducer.subscriptions.length.should.be.equal(benoit.subscriptions.length);
      addedProducer.emailValidated.should.be.not.null;
      addedProducer.emailValidated.should.be.equal(benoit.emailValidated);
      addedProducer.subscribedUsersIds.should.be.not.null;
      addedProducer.subscribedUsersIds.should.be.an('array');
      const subscribedUserPromises = addedProducer.subscribedUsersIds.map((subscribedUser) => {
        subscribedUser.id.should.be.not.null;
        subscribedUser.firstname.should.be.not.null;
        subscribedUser.lastname.should.be.not.null;
        subscribedUser.email.should.be.not.null;
        subscribedUser.password.should.be.not.null;
      });
      addedProducer.phoneNumber.should.be.not.null;
      addedProducer.description.should.be.not.null;
      addedProducer.salesPointId.should.be.not.null;
      addedProducer.salesPointId.id.should.be.not.null;
      addedProducer.kind.should.be.not.null;
      addedProducer.kind.should.be.equal('producers');

      const promises = addedProducer.productsIds.map((async(productId) => {
        const product = await productsService.getProductById(productId);
        const productType = await productTypeService.getProductTypeById(product.productTypeId);
        productType.should.be.not.null;
        productType.producersIds.should.be.not.null;
        const addedProducerId = addedProducer.id.toString();
        const filtredTab = await productType.producersIds.filter((elem) => elem.toString() === addedProducerId);
        filtredTab.length.should.be.equal(1);
      }));

      await Promise.all(promises, subscribedUserPromises);
    });
  });

  it('should fail adding a new producer with an already used email', async() => {
    const newProducer = {
      firstname: 'Benoît',
      lastname: 'Schopfer',
      email: 'benoit.schopfer@heig-vd.ch',
      password: '1234abcd',
      image: 'Ceci est une image encodée en base64!',
      phoneNumber: '0761435196',
      description: 'Un chouet gaillard!',
      website: 'benoitschopfer.ch',
      salesPointId: {
        name: 'Chez moi',
        address: {
          number: 6,
          street: 'Chemin de par ici',
          city: 'Yverdon',
          postalCode: '1400',
          country: 'Suisse',
          longitude: 1.1234567,
          latitude: 1.123456789
        },
        schedule: {
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
      },
      productsIds: [
        {
          description: 'Une pomme monnnnstre bonne!',
          productTypeId: productTypePomme.id
        },
        {
          description: 'Une poire de folie!',
          productTypeId: productTypePoire.id
        }
      ]
    };

    let addedProducer = await producersService.addProducer(newProducer);
    addedProducer.should.be.not.null;
    addedProducer.id.should.be.not.null;
    addedProducer.firstname.should.be.not.null;
    addedProducer.firstname.should.be.equal(benoit.firstname);
    addedProducer.lastname.should.be.not.null;
    addedProducer.lastname.should.be.equal(benoit.lastname);
    addedProducer.email.should.be.not.null;
    addedProducer.email.should.be.equal('benoit.schopfer@heig-vd.ch');
    addedProducer.password.should.be.not.null;
    addedProducer.password.should.be.equal(benoit.password);
    addedProducer.image.should.be.not.null;
    addedProducer.image.should.be.equal(benoit.image);
    addedProducer.subscriptions.should.be.not.null;
    addedProducer.subscriptions.should.be.an('array');
    addedProducer.subscriptions.length.should.be.equal(benoit.subscriptions.length);
    addedProducer.emailValidated.should.be.not.null;
    addedProducer.emailValidated.should.be.equal(benoit.emailValidated);

    try {
      addedProducer = await producersService.addProducer(newProducer);
    } catch (e) {
      e.message.should.be.equal('This email is already used.');
    }
  });
});

describe('tests updateProducer', () => {
  it('should update a producer', async() => {
    const addedProducer = await producersService.getProducerById(benoit.id);
    const producerToUpdate = {
      ...addedProducer

    };
    const updatedProducer = await producersService.updateProducer(addedProducer);
    updatedProducer.should.be.not.null;
    updatedProducer.id.should.be.not.null;
    updatedProducer.firstname.should.be.not.null;
    updatedProducer.firstname.should.be.equal(benoit.firstname);
    updatedProducer.lastname.should.be.not.null;
    updatedProducer.lastname.should.be.equal(benoit.lastname);
    updatedProducer.email.should.be.not.null;
    updatedProducer.email.should.be.equal(benoit.email);
    updatedProducer.password.should.be.not.null;
    updatedProducer.password.should.be.equal(benoit.password);
    updatedProducer.image.should.be.not.null;
    updatedProducer.image.should.be.equal(benoit.image);
    updatedProducer.subscriptions.should.be.not.null;
    updatedProducer.subscriptions.should.be.an('array');
    updatedProducer.subscriptions.length.should.be.equal(benoit.subscriptions.length);
    updatedProducer.emailValidated.should.be.not.null;
    updatedProducer.emailValidated.should.be.equal(benoit.emailValidated);
  });

  it('should fail updating a producer because no id received', async() => {
    const addedProducer = {
      id: '',
      ...benoit
    };
    const updatedProducer = await producersService.updateProducer(addedProducer);

    updatedProducer.message.should.be.equal('Received producer.id is invalid!');
  });

  it('should fail updating a producer because invalid id received', async() => {
    const addedProducer = {
      id: '5c04561e7209e21e582750', // id trop court (<24 caractères)
      ...benoit
    };
    const updatedProducer = await producersService.updateProducer(addedProducer);

    updatedProducer.message.should.be.equal('Received producer.id is invalid!');
  });

  it('should fail updating a producer because invalid id received', async() => {
    const addedProducer = {
      id: '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3', // id trop long (> 24 caractères)
      ...benoit
    };
    const updatedProducer = await producersService.updateProducer(addedProducer);

    updatedProducer.message.should.be.equal('Received producer.id is invalid!');
  });
});

describe('tests validateAProducer', () => {
  it('should unvalidate a validated producer', async() => {
    const producersWaitingForValidation = await producersService.getAllProducerWaitingForValidation();

    // on valide un producteur
    let validatedProducer = await producersService.validateAProducer(producersWaitingForValidation[0].id, true);
    validatedProducer.should.be.not.null;
    validatedProducer.isValidated.should.be.true;

    // on invalide ce même producteur
    validatedProducer = await producersService.validateAProducer(producersWaitingForValidation[0].id, true);
    validatedProducer.should.be.not.null;
    validatedProducer.isValidated.should.be.false;
  });

  // fixme: le beforeEach ne s'exécute pas entre 2 it() du même describe???!
  // si j'inverse ces 2 describes, ça marche plus....!
  it('should validate a producer', async() => {
    const producersWaitingForValidation = await producersService.getAllProducerWaitingForValidation();

    // on valide un producteur
    const validatedProducer = await producersService.validateAProducer(producersWaitingForValidation[0].id, true);
    validatedProducer.should.be.not.null;
    validatedProducer.isValidated.should.be.true;
  });
});

describe('tests deleteProducer', () => {
  it('should delete a producer', async() => {
    let deleteProducer = await producersService.deleteProducer(benoit.id);

    deleteProducer.should.be.not.null;

    deleteProducer = await producersService.getProducerById(deleteProducer.id);
    expect(deleteProducer).to.be.null;
  });
});
