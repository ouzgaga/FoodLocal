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

let magasin2 = {
  name: 'Chez toi',
  address: {
    number: 12,
    street: 'Chemin de par là-bas',
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
    magasin1 = await SalespointModel.create(magasin1);
    magasin2 = {
      name: 'Chez toi',
      address: {
        number: 12,
        street: 'Chemin de par là-bas',
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
      salespoint.schedule.should.be.an('object');
      salespoint.schedule.monday.should.be.an('array');
      salespoint.schedule.tuesday.should.be.an('array');
      salespoint.schedule.wednesday.should.be.an('array');
      salespoint.schedule.thursday.should.be.an('array');
      salespoint.schedule.friday.should.be.an('array');
      salespoint.schedule.saturday.should.be.an('array');
      salespoint.schedule.sunday.should.be.an('array');
    });
  });

  describe('tests getSalesPointById', () => {
    it('should get one salespoint', async() => {
      const salespointGotInDB = await salespointService.getSalesPointById(magasin1.id);
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
      salespointGotInDB.schedule.should.be.an('object');
      salespointGotInDB.schedule.monday.should.be.an('array');
      salespointGotInDB.schedule.tuesday.should.be.an('array');
      salespointGotInDB.schedule.wednesday.should.be.an('array');
      salespointGotInDB.schedule.thursday.should.be.an('array');
      salespointGotInDB.schedule.friday.should.be.an('array');
      salespointGotInDB.schedule.saturday.should.be.an('array');
      salespointGotInDB.schedule.sunday.should.be.an('array');

      for (let i = 0; i < salespointGotInDB.schedule.monday.length; i++) {
        salespointGotInDB.schedule.monday[i].openingHour.should.equal(magasin1.schedule.monday[i].openingHour);
        salespointGotInDB.schedule.monday[i].closingHour.should.equal(magasin1.schedule.monday[i].closingHour);
      }
      for (let i = 0; i < salespointGotInDB.schedule.tuesday.length; i++) {
        salespointGotInDB.schedule.tuesday[i].openingHour.should.equal(magasin1.schedule.tuesday[i].openingHour);
        salespointGotInDB.schedule.tuesday[i].closingHour.should.equal(magasin1.schedule.tuesday[i].closingHour);
      }
      for (let i = 0; i < salespointGotInDB.schedule.wednesday.length; i++) {
        salespointGotInDB.schedule.wednesday[i].openingHour.should.equal(magasin1.schedule.wednesday[i].openingHour);
        salespointGotInDB.schedule.wednesday[i].closingHour.should.equal(magasin1.schedule.wednesday[i].closingHour);
      }
      for (let i = 0; i < salespointGotInDB.schedule.thursday.length; i++) {
        salespointGotInDB.schedule.thursday[i].openingHour.should.equal(magasin1.schedule.thursday[i].openingHour);
        salespointGotInDB.schedule.thursday[i].closingHour.should.equal(magasin1.schedule.thursday[i].closingHour);
      }
      for (let i = 0; i < salespointGotInDB.schedule.friday.length; i++) {
        salespointGotInDB.schedule.friday[i].openingHour.should.equal(magasin1.schedule.friday[i].openingHour);
        salespointGotInDB.schedule.friday[i].closingHour.should.equal(magasin1.schedule.friday[i].closingHour);
      }
      for (let i = 0; i < salespointGotInDB.schedule.saturday.length; i++) {
        salespointGotInDB.schedule.saturday[i].openingHour.should.equal(magasin1.schedule.saturday[i].openingHour);
        salespointGotInDB.schedule.saturday[i].closingHour.should.equal(magasin1.schedule.saturday[i].closingHour);
      }
      for (let i = 0; i < salespointGotInDB.schedule.sunday.length; i++) {
        salespointGotInDB.schedule.sunday[i].openingHour.should.equal(magasin1.schedule.sunday[i].openingHour);
        salespointGotInDB.schedule.sunday[i].closingHour.should.equal(magasin1.schedule.sunday[i].closingHour);
      }
    });

    it('should fail getting one salespoint because no id received', async() => {
      const productTypeGotInDB = await salespointService.getSalesPointById('');
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
    addedSalespoint.schedule.should.be.an('object');
    addedSalespoint.schedule.monday.should.be.an('array');
    addedSalespoint.schedule.tuesday.should.be.an('array');
    addedSalespoint.schedule.wednesday.should.be.an('array');
    addedSalespoint.schedule.thursday.should.be.an('array');
    addedSalespoint.schedule.friday.should.be.an('array');
    addedSalespoint.schedule.saturday.should.be.an('array');
    addedSalespoint.schedule.sunday.should.be.an('array');

    for (let i = 0; i < addedSalespoint.schedule.monday.length; i++) {
      addedSalespoint.schedule.monday[i].openingHour.should.equal(magasin1.schedule.monday[i].openingHour);
      addedSalespoint.schedule.monday[i].closingHour.should.equal(magasin1.schedule.monday[i].closingHour);
    }
    for (let i = 0; i < addedSalespoint.schedule.tuesday.length; i++) {
      addedSalespoint.schedule.tuesday[i].openingHour.should.equal(magasin1.schedule.tuesday[i].openingHour);
      addedSalespoint.schedule.tuesday[i].closingHour.should.equal(magasin1.schedule.tuesday[i].closingHour);
    }
    for (let i = 0; i < addedSalespoint.schedule.wednesday.length; i++) {
      addedSalespoint.schedule.wednesday[i].openingHour.should.equal(magasin1.schedule.wednesday[i].openingHour);
      addedSalespoint.schedule.wednesday[i].closingHour.should.equal(magasin1.schedule.wednesday[i].closingHour);
    }
    for (let i = 0; i < addedSalespoint.schedule.thursday.length; i++) {
      addedSalespoint.schedule.thursday[i].openingHour.should.equal(magasin1.schedule.thursday[i].openingHour);
      addedSalespoint.schedule.thursday[i].closingHour.should.equal(magasin1.schedule.thursday[i].closingHour);
    }
    for (let i = 0; i < addedSalespoint.schedule.friday.length; i++) {
      addedSalespoint.schedule.friday[i].openingHour.should.equal(magasin1.schedule.friday[i].openingHour);
      addedSalespoint.schedule.friday[i].closingHour.should.equal(magasin1.schedule.friday[i].closingHour);
    }
    for (let i = 0; i < addedSalespoint.schedule.saturday.length; i++) {
      addedSalespoint.schedule.saturday[i].openingHour.should.equal(magasin1.schedule.saturday[i].openingHour);
      addedSalespoint.schedule.saturday[i].closingHour.should.equal(magasin1.schedule.saturday[i].closingHour);
    }
    for (let i = 0; i < addedSalespoint.schedule.sunday.length; i++) {
      addedSalespoint.schedule.sunday[i].openingHour.should.equal(magasin1.schedule.sunday[i].openingHour);
      addedSalespoint.schedule.sunday[i].closingHour.should.equal(magasin1.schedule.sunday[i].closingHour);
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
      updatedSalespoint.schedule.should.be.an('object');
      updatedSalespoint.schedule.monday.should.be.an('array');
      updatedSalespoint.schedule.tuesday.should.be.an('array');
      updatedSalespoint.schedule.wednesday.should.be.an('array');
      updatedSalespoint.schedule.thursday.should.be.an('array');
      updatedSalespoint.schedule.friday.should.be.an('array');
      updatedSalespoint.schedule.saturday.should.be.an('array');
      updatedSalespoint.schedule.sunday.should.be.an('array');

      for (let i = 0; i < updatedSalespoint.schedule.monday.length; i++) {
        updatedSalespoint.schedule.monday[i].openingHour.should.equal(magasin1.schedule.monday[i].openingHour);
        updatedSalespoint.schedule.monday[i].closingHour.should.equal(magasin1.schedule.monday[i].closingHour);
      }
      for (let i = 0; i < updatedSalespoint.schedule.tuesday.length; i++) {
        updatedSalespoint.schedule.tuesday[i].openingHour.should.equal(magasin1.schedule.tuesday[i].openingHour);
        updatedSalespoint.schedule.tuesday[i].closingHour.should.equal(magasin1.schedule.tuesday[i].closingHour);
      }
      for (let i = 0; i < updatedSalespoint.schedule.wednesday.length; i++) {
        updatedSalespoint.schedule.wednesday[i].openingHour.should.equal(magasin1.schedule.wednesday[i].openingHour);
        updatedSalespoint.schedule.wednesday[i].closingHour.should.equal(magasin1.schedule.wednesday[i].closingHour);
      }
      for (let i = 0; i < updatedSalespoint.schedule.thursday.length; i++) {
        updatedSalespoint.schedule.thursday[i].openingHour.should.equal(magasin1.schedule.thursday[i].openingHour);
        updatedSalespoint.schedule.thursday[i].closingHour.should.equal(magasin1.schedule.thursday[i].closingHour);
      }
      for (let i = 0; i < updatedSalespoint.schedule.friday.length; i++) {
        updatedSalespoint.schedule.friday[i].openingHour.should.equal(magasin1.schedule.friday[i].openingHour);
        updatedSalespoint.schedule.friday[i].closingHour.should.equal(magasin1.schedule.friday[i].closingHour);
      }
      for (let i = 0; i < updatedSalespoint.schedule.saturday.length; i++) {
        updatedSalespoint.schedule.saturday[i].openingHour.should.equal(magasin1.schedule.saturday[i].openingHour);
        updatedSalespoint.schedule.saturday[i].closingHour.should.equal(magasin1.schedule.saturday[i].closingHour);
      }
      for (let i = 0; i < updatedSalespoint.schedule.sunday.length; i++) {
        updatedSalespoint.schedule.sunday[i].openingHour.should.equal(magasin1.schedule.sunday[i].openingHour);
        updatedSalespoint.schedule.sunday[i].closingHour.should.equal(magasin1.schedule.sunday[i].closingHour);
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
    addedSalespoint.schedule.should.be.an('object');
    addedSalespoint.schedule.monday.should.be.an('array');
    addedSalespoint.schedule.tuesday.should.be.an('array');
    addedSalespoint.schedule.wednesday.should.be.an('array');
    addedSalespoint.schedule.thursday.should.be.an('array');
    addedSalespoint.schedule.friday.should.be.an('array');
    addedSalespoint.schedule.saturday.should.be.an('array');
    addedSalespoint.schedule.sunday.should.be.an('array');

    for (let i = 0; i < addedSalespoint.schedule.monday.length; i++) {
      addedSalespoint.schedule.monday[i].openingHour.should.equal(magasin1.schedule.monday[i].openingHour);
      addedSalespoint.schedule.monday[i].closingHour.should.equal(magasin1.schedule.monday[i].closingHour);
    }
    for (let i = 0; i < addedSalespoint.schedule.tuesday.length; i++) {
      addedSalespoint.schedule.tuesday[i].openingHour.should.equal(magasin1.schedule.tuesday[i].openingHour);
      addedSalespoint.schedule.tuesday[i].closingHour.should.equal(magasin1.schedule.tuesday[i].closingHour);
    }
    for (let i = 0; i < addedSalespoint.schedule.wednesday.length; i++) {
      addedSalespoint.schedule.wednesday[i].openingHour.should.equal(magasin1.schedule.wednesday[i].openingHour);
      addedSalespoint.schedule.wednesday[i].closingHour.should.equal(magasin1.schedule.wednesday[i].closingHour);
    }
    for (let i = 0; i < addedSalespoint.schedule.thursday.length; i++) {
      addedSalespoint.schedule.thursday[i].openingHour.should.equal(magasin1.schedule.thursday[i].openingHour);
      addedSalespoint.schedule.thursday[i].closingHour.should.equal(magasin1.schedule.thursday[i].closingHour);
    }
    for (let i = 0; i < addedSalespoint.schedule.friday.length; i++) {
      addedSalespoint.schedule.friday[i].openingHour.should.equal(magasin1.schedule.friday[i].openingHour);
      addedSalespoint.schedule.friday[i].closingHour.should.equal(magasin1.schedule.friday[i].closingHour);
    }
    for (let i = 0; i < addedSalespoint.schedule.saturday.length; i++) {
      addedSalespoint.schedule.saturday[i].openingHour.should.equal(magasin1.schedule.saturday[i].openingHour);
      addedSalespoint.schedule.saturday[i].closingHour.should.equal(magasin1.schedule.saturday[i].closingHour);
    }
    for (let i = 0; i < addedSalespoint.schedule.sunday.length; i++) {
      addedSalespoint.schedule.sunday[i].openingHour.should.equal(magasin1.schedule.sunday[i].openingHour);
      addedSalespoint.schedule.sunday[i].closingHour.should.equal(magasin1.schedule.sunday[i].closingHour);
    }

    let deleteSalespoint = await salespointService.deleteSalesPoint(addedSalespoint);

    deleteSalespoint.should.be.not.null;

    deleteSalespoint = await salespointService.getSalesPointById(deleteSalespoint);
    it.should.be.null = deleteSalespoint; // Fixme: Ca marche de faire ça ??
  });
});
