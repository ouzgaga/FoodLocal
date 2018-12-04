require('../chai-config');

const salespointService = require('../../src/graphql/services/salespoints.services');
const SalespointModel = require('../../src/graphql/models/salespoints.modelgql');

let magasin1 = {
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
};

let magasin2 = {
  name: 'Chez toi',
  address: {
    number: 12,
    street: 'Chemin de par là-bas',
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
    }
  ]
};

describe('tests salespoints services', () => {
  beforeEach(async() => {
    // on supprime tout le contenu de la DB
    await SalespointModel.deleteMany();

    // on ajoute le contenu de départ
    // on ajoute 2 points de vente
    magasin1 = {
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
    };
    magasin1 = await SalespointModel.create(magasin1);
    magasin2 = {
      name: 'Chez toi',
      address: {
        number: 12,
        street: 'Chemin de par là-bas',
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
        }
      ]
    };
    magasin2 = await SalespointModel.create(magasin2);
  });

  it('should get all salespoints', async() => {
    const allSalespoints = await salespointService.getSalesPoints();

    allSalespoints.should.be.an('array');
    allSalespoints.length.should.be.equal(2);
    allSalespoints.map((salespoint) => {
      salespoint.should.be.not.null;
      salespoint.id.should.be.not.null;
      salespoint.name.should.be.not.null;
      salespoint.address.should.be.not.null;
      salespoint.address.should.be.an('object');
      salespoint.address.street.should.be.not.null;
      salespoint.address.city.should.be.not.null;
      salespoint.address.postalCode.should.be.not.null;
      salespoint.address.country.should.be.not.null;
      salespoint.address.longitude.should.be.not.null;
      salespoint.address.latitude.should.be.not.null;

      salespoint.schedule.should.be.not.null;
      salespoint.schedule.should.be.an('array');
      salespoint.schedule.map((schedule) => {
        schedule.weekDay.should.be.not.null;
        schedule.schedule.map((daySchedule) => {
          daySchedule.openingHour.should.be.not.null;
          daySchedule.closingHour.should.be.not.null;
        });
      });
    });
  });

  describe('tests getSalesPointById', () => {
    it('should get one salespoint', async() => {
      const salespointGotInDB = await salespointService.getSalesPointById(magasin1);
      salespointGotInDB.should.be.an('object');
      salespointGotInDB.should.be.not.null;
      salespointGotInDB.id.should.be.equal(magasin1.id);
      salespointGotInDB.name.should.be.equal(magasin1.name);
      salespointGotInDB.address.should.be.not.null;
      salespointGotInDB.address.should.be.an('object');
      salespointGotInDB.address.number.should.be.equal(magasin1.address.number);
      salespointGotInDB.address.street.should.be.equal(magasin1.address.street);
      salespointGotInDB.address.city.should.be.equal(magasin1.address.city);
      salespointGotInDB.address.postalCode.should.be.equal(magasin1.address.postalCode);
      salespointGotInDB.address.country.should.be.equal(magasin1.address.country);
      salespointGotInDB.address.longitude.should.be.equal(magasin1.address.longitude);
      salespointGotInDB.address.latitude.should.be.equal(magasin1.address.latitude);

      salespointGotInDB.schedule.should.be.not.null;
      salespointGotInDB.schedule.should.be.an('array');
      salespointGotInDB.schedule.length.should.be.equal(magasin1.schedule.length);

      for (let i = 0; i < salespointGotInDB.schedule.length; i++) {
        salespointGotInDB.schedule[i].weekDay.should.be.equal(magasin1.schedule[i].weekDay);
        for (let j = 0; j < salespointGotInDB.schedule[j].schedule; j++) {
          salespointGotInDB.schedule[i].schedule[j].openingHour.should.equal(magasin1.schedule[i].schedule[j].openingHour);
          salespointGotInDB.schedule[i].schedule[j].closingHour.should.equal(magasin1.schedule[i].schedule[j].closingHour);
        }
      }
    });

    it('should fail getting one salespoint because no id received', async() => {
      const productTypeGotInDB = await salespointService.getSalesPointById({ id: '' });
      productTypeGotInDB.message.should.be.equal('Received salespoint.id is invalid!');
    });
  });

  it('should add a new salespoint', async() => {
    const addedSalespoint = await salespointService.addSalesPoint(magasin1);
    addedSalespoint.should.be.an('object');
    addedSalespoint.should.be.not.null;
    addedSalespoint.id.should.be.equal(magasin1.id);
    addedSalespoint.name.should.be.equal(magasin1.name);
    addedSalespoint.address.should.be.not.null;
    addedSalespoint.address.should.be.an('object');
    addedSalespoint.address.number.should.be.equal(magasin1.address.number);
    addedSalespoint.address.street.should.be.equal(magasin1.address.street);
    addedSalespoint.address.city.should.be.equal(magasin1.address.city);
    addedSalespoint.address.postalCode.should.be.equal(magasin1.address.postalCode);
    addedSalespoint.address.country.should.be.equal(magasin1.address.country);
    addedSalespoint.address.longitude.should.be.equal(magasin1.address.longitude);
    addedSalespoint.address.latitude.should.be.equal(magasin1.address.latitude);

    addedSalespoint.schedule.should.be.not.null;
    addedSalespoint.schedule.should.be.an('array');
    addedSalespoint.schedule.length.should.be.equal(magasin1.schedule.length);

    for (let i = 0; i < addedSalespoint.schedule.length; i++) {
      addedSalespoint.schedule[i].weekDay.should.be.equal(magasin1.schedule[i].weekDay);
      for (let j = 0; j < addedSalespoint.schedule[j].schedule; j++) {
        addedSalespoint.schedule[i].schedule[j].openingHour.should.equal(magasin1.schedule[i].schedule[j].openingHour);
        addedSalespoint.schedule[i].schedule[j].closingHour.should.equal(magasin1.schedule[i].schedule[j].closingHour);
      }
    }
  });

  describe('tests updateSalesPoint', () => {
    it('should update a salespoint', async() => {
      let addedProduct = await salespointService.addSalesPoint(magasin2);
      addedProduct = {
        id: addedProduct.id,
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
      };
      const updatedSalespoint = await salespointService.updateSalesPoint(addedProduct);
      updatedSalespoint.should.be.an('object');
      updatedSalespoint.should.be.not.null;
      updatedSalespoint.name.should.be.equal(magasin1.name);
      updatedSalespoint.address.should.be.not.null;
      updatedSalespoint.address.should.be.an('object');
      updatedSalespoint.address.number.should.be.equal(magasin1.address.number);
      updatedSalespoint.address.street.should.be.equal(magasin1.address.street);
      updatedSalespoint.address.city.should.be.equal(magasin1.address.city);
      updatedSalespoint.address.postalCode.should.be.equal(magasin1.address.postalCode);
      updatedSalespoint.address.country.should.be.equal(magasin1.address.country);
      updatedSalespoint.address.longitude.should.be.equal(magasin1.address.longitude);
      updatedSalespoint.address.latitude.should.be.equal(magasin1.address.latitude);

      updatedSalespoint.schedule.should.be.not.null;
      updatedSalespoint.schedule.should.be.an('array');
      updatedSalespoint.schedule.length.should.be.equal(magasin1.schedule.length);

      for (let i = 0; i < updatedSalespoint.schedule.length; i++) {
        updatedSalespoint.schedule[i].weekDay.should.be.equal(magasin1.schedule[i].weekDay);
        for (let j = 0; j < updatedSalespoint.schedule[j].schedule; j++) {
          updatedSalespoint.schedule[i].schedule[j].openingHour.should.equal(magasin1.schedule[i].schedule[j].openingHour);
          updatedSalespoint.schedule[i].schedule[j].closingHour.should.equal(magasin1.schedule[i].schedule[j].closingHour);
        }
      }
    });

    it('should fail updating a salesPoint because no id received', async() => {
      const addedSalespoint = {
        id: '',
        ...magasin1
      };
      const updatedProduct = await salespointService.updateSalesPoint(addedSalespoint);

      updatedProduct.message.should.be.equal('Received salespoint.id is invalid!');
    });

    it('should fail updating a salesPoint because invalid id received', async() => {
      const addedSalespoint = {
        id: '5c04561e7209e21e582750', // id trop court (<24 caractères)
        ...magasin1
      };
      const updatedProduct = await salespointService.updateSalesPoint(addedSalespoint);

      updatedProduct.message.should.be.equal('Received salespoint.id is invalid!');
    });

    it('should fail updating a salesPoint because invalid id received', async() => {
      const addedSalespoint = {
        id: '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3', // id trop long (> 24 caractères)
        ...magasin1
      };
      const updatedProduct = await salespointService.updateSalesPoint(addedSalespoint);

      updatedProduct.message.should.be.equal('Received salespoint.id is invalid!');
    });
  });

  it('should delete a salesPoint', async() => {
    const addedSalespoint = await salespointService.addSalesPoint(magasin1);
    addedSalespoint.should.be.an('object');
    addedSalespoint.should.be.not.null;
    addedSalespoint.id.should.be.equal(magasin1.id);
    addedSalespoint.name.should.be.equal(magasin1.name);
    addedSalespoint.address.should.be.not.null;
    addedSalespoint.address.should.be.an('object');
    addedSalespoint.address.number.should.be.equal(magasin1.address.number);
    addedSalespoint.address.street.should.be.equal(magasin1.address.street);
    addedSalespoint.address.city.should.be.equal(magasin1.address.city);
    addedSalespoint.address.postalCode.should.be.equal(magasin1.address.postalCode);
    addedSalespoint.address.country.should.be.equal(magasin1.address.country);
    addedSalespoint.address.longitude.should.be.equal(magasin1.address.longitude);
    addedSalespoint.address.latitude.should.be.equal(magasin1.address.latitude);
    addedSalespoint.schedule.should.be.not.null;
    addedSalespoint.schedule.should.be.an('array');
    addedSalespoint.schedule.length.should.be.equal(magasin1.schedule.length);

    for (let i = 0; i < addedSalespoint.schedule.length; i++) {
      addedSalespoint.schedule[i].weekDay.should.be.equal(magasin1.schedule[i].weekDay);
      for (let j = 0; j < addedSalespoint.schedule[j].schedule; j++) {
        addedSalespoint.schedule[i].schedule[j].openingHour.should.equal(magasin1.schedule[i].schedule[j].openingHour);
        addedSalespoint.schedule[i].schedule[j].closingHour.should.equal(magasin1.schedule[i].schedule[j].closingHour);
      }
    }

    let deleteSalespoint = await salespointService.deleteSalesPoint(addedSalespoint);

    deleteSalespoint.should.be.not.null;

    deleteSalespoint = await salespointService.getSalesPointById(deleteSalespoint);
    it.should.be.null = deleteSalespoint; // Fixme: Ca marche de faire ça ??
  });
});
