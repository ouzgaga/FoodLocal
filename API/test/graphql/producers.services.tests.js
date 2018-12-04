require('../chai-config');

const producersService = require('../../src/graphql/services/producers.services');
const ProducersModel = require('../../src/graphql/models/producers.modelgql');

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
      country: 'Suisse',
      longitude: 1.1234567,
      latitude: 1.123456789
    },
    schedule: [
      {
        weekDay: 'MONDAY',
        schedule: [
          {
            openingHour: '08:00',
            closingHour: '12:00'
          },
          {
            openingHour: '13:00',
            closingHour: '18:00'
          }
        ]
      },
      {
        weekDay: 'TUESDAY',
        schedule: [
          {
            openingHour: '08:00',
            closingHour: '18:00'
          }
        ]
      },
      {
        weekDay: 'WEDNESDAY',
        schedule: [
          {
            openingHour: '08:00',
            closingHour: '12:00'
          }
        ]
      },
      {
        weekDay: 'FRIDAY',
        schedule: [
          {
            openingHour: '13:00',
            closingHour: '18:00'
          }
        ]
      }
    ]
  },
  products: [
    {
      description: 'Une pomme monnnnstre bonne!',
      productType: {
        id: '5c050afa96f1ff3cca213d1f'
      }
    },
    {
      description: 'Une poire de folie!',
      productType: {
        id: '5c05ad449fdaf88060a42aef'
      }
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
      country: 'Suisse',
      longitude: 1.1234796,
      latitude: 1.123418029
    },
    schedule: [
      {
        weekDay: 'MONDAY',
        schedule: [
          {
            openingHour: '08:00',
            closingHour: '12:00'
          },
          {
            openingHour: '13:00',
            closingHour: '18:00'
          }
        ]
      },
      {
        weekDay: 'FRIDAY',
        schedule: [
          {
            openingHour: '13:00',
            closingHour: '18:00'
          }
        ]
      }
    ]
  },
  products: [
    {
      description: 'Une pomme monnnnstre bonne!',
      productType: {
        id: '5c050afa96f1ff3cca213d1f'
      }
    },
    {
      description: 'Une poire de folie!',
      productType: {
        id: '5c05ad449fdaf88060a42aef'
      }
    }
  ]
};

describe('tests producers services', () => {
  beforeEach(async() => {
    // on supprime tout le contenu de la DB
    await ProducersModel.deleteMany();

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
          country: 'Suisse',
          longitude: 1.1234567,
          latitude: 1.123456789
        },
        schedule: [
          {
            weekDay: 'MONDAY',
            schedule: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              },
              {
                openingHour: '13:00',
                closingHour: '18:00'
              }
            ]
          },
          {
            weekDay: 'TUESDAY',
            schedule: [
              {
                openingHour: '08:00',
                closingHour: '18:00'
              }
            ]
          },
          {
            weekDay: 'WEDNESDAY',
            schedule: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ]
          },
          {
            weekDay: 'FRIDAY',
            schedule: [
              {
                openingHour: '13:00',
                closingHour: '18:00'
              }
            ]
          }
        ]
      },
      products: [
        {
          description: 'Une pomme monnnnstre bonne!',
          productType: {
            id: '5c050afa96f1ff3cca213d1f'
          }
        },
        {
          description: 'Une poire de folie!',
          productType: {
            id: '5c05ad449fdaf88060a42aef'
          }
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
          country: 'Suisse',
          longitude: 1.1234796,
          latitude: 1.123418029
        },
        schedule: [
          {
            weekDay: 'MONDAY',
            schedule: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              },
              {
                openingHour: '13:00',
                closingHour: '18:00'
              }
            ]
          },
          {
            weekDay: 'FRIDAY',
            schedule: [
              {
                openingHour: '13:00',
                closingHour: '18:00'
              }
            ]
          }
        ]
      },
      products: [
        {
          description: 'Une pomme monnnnstre bonne!',
          productType: {
            id: '5c050afa96f1ff3cca213d1f'
          }
        },
        {
          description: 'Une poire de folie!',
          productType: {
            id: '5c05ad449fdaf88060a42aef'
          }
        }
      ]
    };
    antoine = await producersService.addProducer(antoine);
  });

  it('should get all producers', async() => {
    const allproducers = await producersService.getProducers();

    allproducers.should.be.an('array');
    allproducers.length.should.be.equal(2);
    allproducers.map((producer) => {
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
      producer.subscribedUsers.should.be.not.null;
      producer.subscribedUsers.should.be.an('array');
      producer.subscribedUsers.map((subscribedUser) => {
        subscribedUser.id.should.be.not.null;
        subscribedUser.firstname.should.be.not.null;
        subscribedUser.lastname.should.be.not.null;
        subscribedUser.email.should.be.not.null;
        subscribedUser.password.should.be.not.null;
      });
      producer.phoneNumber.should.be.not.null;
      producer.description.should.be.not.null;
      producer.salesPoint.should.be.not.null;
      producer.salesPoint.id.should.be.not.null;
    });
  });

  describe('tests getProducerById', () => {
    it('should get one producer', async() => {
      const producer = await producersService.getProducerById(benoit);
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
      producer.subscribedUsers.should.be.not.null;
      producer.subscribedUsers.should.be.an('array');
      producer.subscribedUsers.map((subscribedUser) => {
        subscribedUser.id.should.be.not.null;
        subscribedUser.firstname.should.be.not.null;
        subscribedUser.lastname.should.be.not.null;
        subscribedUser.email.should.be.not.null;
        subscribedUser.password.should.be.not.null;
      });
      producer.phoneNumber.should.be.not.null;
      producer.description.should.be.not.null;
      producer.salesPoint.should.be.not.null;
      producer.salesPoint.id.should.be.not.null;
    });

    it('should fail getting one user because no id received', async() => {
      const producerGotInDB = await producersService.getProducerById({ id: '' });
      producerGotInDB.message.should.be.equal('Received producer.id is invalid!');
    });
  });

  describe('tests addProducer', () => {
    it('should add a new producer', async() => {
      // on supprime tout le contenu de la DB
      await ProducersModel.deleteMany();

      const newProducer = {
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
            country: 'Suisse',
            longitude: 1.1234567,
            latitude: 1.123456789
          },
          schedule: [
            {
              weekDay: 'MONDAY',
              schedule: [
                {
                  openingHour: '08:00',
                  closingHour: '12:00'
                },
                {
                  openingHour: '13:00',
                  closingHour: '18:00'
                }
              ]
            },
            {
              weekDay: 'TUESDAY',
              schedule: [
                {
                  openingHour: '08:00',
                  closingHour: '18:00'
                }
              ]
            },
            {
              weekDay: 'WEDNESDAY',
              schedule: [
                {
                  openingHour: '08:00',
                  closingHour: '12:00'
                }
              ]
            },
            {
              weekDay: 'FRIDAY',
              schedule: [
                {
                  openingHour: '13:00',
                  closingHour: '18:00'
                }
              ]
            }
          ]
        },
        products: [
          {
            description: 'Une pomme monnnnstre bonne!',
            productType: {
              id: '5c050afa96f1ff3cca213d1f'
            }
          },
          {
            description: 'Une poire de folie!',
            productType: {
              id: '5c05ad449fdaf88060a42aef'
            }
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
      addedProducer.email.should.be.equal(benoit.email);
      addedProducer.password.should.be.not.null;
      addedProducer.password.should.be.equal(benoit.password);
      addedProducer.image.should.be.not.null;
      addedProducer.image.should.be.equal(benoit.image);
      addedProducer.subscriptions.should.be.not.null;
      addedProducer.subscriptions.should.be.an('array');
      addedProducer.subscriptions.length.should.be.equal(benoit.subscriptions.length);
      addedProducer.emailValidated.should.be.not.null;
      addedProducer.emailValidated.should.be.equal(benoit.emailValidated);
    });

    it('should fail adding a new producer with an already used email', async() => {
      // on supprime tout le contenu de la DB
      await ProducersModel.deleteMany();

      const newProducer = {
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
            country: 'Suisse',
            longitude: 1.1234567,
            latitude: 1.123456789
          },
          schedule: [
            {
              weekDay: 'MONDAY',
              schedule: [
                {
                  openingHour: '08:00',
                  closingHour: '12:00'
                },
                {
                  openingHour: '13:00',
                  closingHour: '18:00'
                }
              ]
            },
            {
              weekDay: 'TUESDAY',
              schedule: [
                {
                  openingHour: '08:00',
                  closingHour: '18:00'
                }
              ]
            },
            {
              weekDay: 'WEDNESDAY',
              schedule: [
                {
                  openingHour: '08:00',
                  closingHour: '12:00'
                }
              ]
            },
            {
              weekDay: 'FRIDAY',
              schedule: [
                {
                  openingHour: '13:00',
                  closingHour: '18:00'
                }
              ]
            }
          ]
        },
        products: [
          {
            description: 'Une pomme monnnnstre bonne!',
            productType: {
              id: '5c050afa96f1ff3cca213d1f'
            }
          },
          {
            description: 'Une poire de folie!',
            productType: {
              id: '5c05ad449fdaf88060a42aef'
            }
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
      addedProducer.email.should.be.equal(benoit.email);
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
      const addedProducer = {
        id: antoine.id,
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
            country: 'Suisse',
            longitude: 1.1234567,
            latitude: 1.123456789
          },
          schedule: [
            {
              weekDay: 'MONDAY',
              schedule: [
                {
                  openingHour: '08:00',
                  closingHour: '12:00'
                },
                {
                  openingHour: '13:00',
                  closingHour: '18:00'
                }
              ]
            },
            {
              weekDay: 'TUESDAY',
              schedule: [
                {
                  openingHour: '08:00',
                  closingHour: '18:00'
                }
              ]
            },
            {
              weekDay: 'WEDNESDAY',
              schedule: [
                {
                  openingHour: '08:00',
                  closingHour: '12:00'
                }
              ]
            },
            {
              weekDay: 'FRIDAY',
              schedule: [
                {
                  openingHour: '13:00',
                  closingHour: '18:00'
                }
              ]
            }
          ]
        },
        products: [
          {
            description: 'Une pomme monnnnstre bonne!',
            productType: {
              id: '5c050afa96f1ff3cca213d1f'
            }
          },
          {
            description: 'Une poire de folie!',
            productType: {
              id: '5c05ad449fdaf88060a42aef'
            }
          }
        ]
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

  it('should delete a producer', async() => {
    let deleteProducer = await producersService.deleteProducer(benoit);

    deleteProducer.should.be.not.null;

    deleteProducer = await producersService.getProducerById(deleteProducer);
    it.should.be.null = deleteProducer; // Fixme: Ca marche de faire ça ??
  });
});
