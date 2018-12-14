require('../../chai-config');
const salespointService = require('../../../src/graphql/services/salespoints.services');
const ProducersModel = require('../../../src/graphql/models/producers.modelgql');
const PersonModel = require('../../../src/graphql/models/persons.modelgql');
const UserModel = require('../../../src/graphql/models/users.modelgql');
const SalespointsModel = require('../../../src/graphql/models/salespoints.modelgql');
const TokensValidationEmailModel = require('../../../src/graphql/models/tokensValidationEmail.modelgql');
const { Products: ProductModel, ProductType: ProductTypeModel, ProductTypeCategory: ProductTypeCategoryModel } = require(
  '../../../src/graphql/models/products.modelgql'
);

let salespointWithSchedule = {
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

let salespointWithoutSchedule = {
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
  }
};

let tabSalespoints = [];

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await ProducersModel.deleteMany();
  await ProductModel.deleteMany();
  await ProductTypeModel.deleteMany();
  await ProductTypeCategoryModel.deleteMany();
  await PersonModel.deleteMany();
  await UserModel.deleteMany();
  await SalespointsModel.deleteMany();
  await TokensValidationEmailModel.deleteMany();


  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  // on ajoute 1 point de vente avec un horaire
  salespointWithSchedule = (await SalespointsModel.create(salespointWithSchedule)).toObject();

  salespointWithoutSchedule = (await SalespointsModel.create(salespointWithoutSchedule)).toObject();

  tabSalespoints = [salespointWithSchedule, salespointWithoutSchedule];
};

describe('tests salespoints services', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('tests getSalesPoints', () => {
    it('should get all salespoints', async() => {
      // on récupère un tableau contenant tous les salespoints
      let allSalespoints = await salespointService.getSalesPoints();

      // on transforme chaque salespoint du tableau en un objet
      allSalespoints = allSalespoints.map(producer => producer.toObject());
      allSalespoints.should.be.an('array');
      allSalespoints.length.should.be.equal(2);
      const promisesSalespoints = allSalespoints.map(async(salespoint, index) => {
        salespoint.should.be.not.null;
        salespoint.id.should.be.equal(tabSalespoints[index].id);
        salespoint.name.should.be.equal(tabSalespoints[index].name);
        salespoint.address.should.be.not.null;
        salespoint.address.should.be.an('object');
        if (tabSalespoints[index].address.number) {
          salespoint.address.number.should.be.equal(tabSalespoints[index].address.number);
        }
        salespoint.address.street.should.be.equal(tabSalespoints[index].address.street);
        salespoint.address.city.should.be.equal(tabSalespoints[index].address.city);
        salespoint.address.postalCode.should.be.equal(tabSalespoints[index].address.postalCode);
        salespoint.address.state.should.be.equal(tabSalespoints[index].address.state);
        salespoint.address.country.should.be.equal(tabSalespoints[index].address.country);
        salespoint.address.longitude.should.be.equal(tabSalespoints[index].address.longitude);
        salespoint.address.latitude.should.be.equal(tabSalespoints[index].address.latitude);

        if (tabSalespoints[index].schedule) {
          salespoint.schedule.should.be.not.null;
          salespoint.schedule.should.be.an('object');
          salespoint.schedule.monday.should.be.an('array');
          const mondayPromise = salespoint.schedule.monday.map((daySchedule, dayScheduleIndex) => {
            daySchedule.openingHour.should.be.equal(tabSalespoints[index].schedule.monday[dayScheduleIndex].openingHour);
            daySchedule.closingHour.should.be.equal(tabSalespoints[index].schedule.monday[dayScheduleIndex].closingHour);
          });
          salespoint.schedule.tuesday.should.be.an('array');
          const tuesdayPromise = salespoint.schedule.tuesday.map((daySchedule, dayScheduleIndex) => {
            daySchedule.openingHour.should.be.equal(tabSalespoints[index].schedule.tuesday[dayScheduleIndex].openingHour);
            daySchedule.closingHour.should.be.equal(tabSalespoints[index].schedule.tuesday[dayScheduleIndex].closingHour);
          });
          salespoint.schedule.wednesday.should.be.an('array');
          const wednesdayPromise = salespoint.schedule.wednesday.map((daySchedule, dayScheduleIndex) => {
            daySchedule.openingHour.should.be.equal(tabSalespoints[index].schedule.wednesday[dayScheduleIndex].openingHour);
            daySchedule.closingHour.should.be.equal(tabSalespoints[index].schedule.wednesday[dayScheduleIndex].closingHour);
          });
          salespoint.schedule.thursday.should.be.an('array');
          const thursdayPromise = salespoint.schedule.thursday.map((daySchedule, dayScheduleIndex) => {
            daySchedule.openingHour.should.be.equal(tabSalespoints[index].schedule.thursday[dayScheduleIndex].openingHour);
            daySchedule.closingHour.should.be.equal(tabSalespoints[index].schedule.thursday[dayScheduleIndex].closingHour);
          });
          salespoint.schedule.friday.should.be.an('array');
          const fridayPromise = salespoint.schedule.friday.map((daySchedule, dayScheduleIndex) => {
            daySchedule.openingHour.should.be.equal(tabSalespoints[index].schedule.friday[dayScheduleIndex].openingHour);
            daySchedule.closingHour.should.be.equal(tabSalespoints[index].schedule.friday[dayScheduleIndex].closingHour);
          });
          salespoint.schedule.saturday.should.be.an('array');
          const saturdayPromise = salespoint.schedule.saturday.map((daySchedule, dayScheduleIndex) => {
            daySchedule.openingHour.should.be.equal(tabSalespoints[index].schedule.saturday[dayScheduleIndex].openingHour);
            daySchedule.closingHour.should.be.equal(tabSalespoints[index].schedule.saturday[dayScheduleIndex].closingHour);
          });
          salespoint.schedule.sunday.should.be.an('array');
          const sundayPromise = salespoint.schedule.sunday.map((daySchedule, dayScheduleIndex) => {
            daySchedule.openingHour.should.be.equal(tabSalespoints[index].schedule.sunday[dayScheduleIndex].openingHour);
            daySchedule.closingHour.should.be.equal(tabSalespoints[index].schedule.sunday[dayScheduleIndex].closingHour);
          });

          await Promise.all(mondayPromise, tuesdayPromise, wednesdayPromise, thursdayPromise, fridayPromise, saturdayPromise, sundayPromise);
        }
      });
      await Promise.all(promisesSalespoints);
    });
  });

  describe('tests getSalesPointById', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should get one salespoint', async() => {
      const salespointGotInDB = (await salespointService.getSalesPointById(salespointWithSchedule.id)).toObject();
      salespointGotInDB.should.be.not.null;
      salespointGotInDB.id.should.be.equal(salespointWithSchedule.id);
      salespointGotInDB.name.should.be.equal(salespointWithSchedule.name);
      salespointGotInDB.address.should.be.not.null;
      salespointGotInDB.address.should.be.an('object');
      if (salespointWithSchedule.address.number) {
        salespointGotInDB.address.number.should.be.equal(salespointWithSchedule.address.number);
      }
      salespointGotInDB.address.street.should.be.equal(salespointWithSchedule.address.street);
      salespointGotInDB.address.city.should.be.equal(salespointWithSchedule.address.city);
      salespointGotInDB.address.postalCode.should.be.equal(salespointWithSchedule.address.postalCode);
      salespointGotInDB.address.state.should.be.equal(salespointWithSchedule.address.state);
      salespointGotInDB.address.country.should.be.equal(salespointWithSchedule.address.country);
      salespointGotInDB.address.longitude.should.be.equal(salespointWithSchedule.address.longitude);
      salespointGotInDB.address.latitude.should.be.equal(salespointWithSchedule.address.latitude);

      if (salespointWithSchedule.schedule) {
        salespointGotInDB.schedule.should.be.not.null;
        salespointGotInDB.schedule.should.be.an('object');
        salespointGotInDB.schedule.monday.should.be.an('array');
        const mondayPromise = salespointGotInDB.schedule.monday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.monday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.monday[index].closingHour);
        });
        salespointGotInDB.schedule.tuesday.should.be.an('array');
        const tuesdayPromise = salespointGotInDB.schedule.tuesday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.tuesday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.tuesday[index].closingHour);
        });
        salespointGotInDB.schedule.wednesday.should.be.an('array');
        const wednesdayPromise = salespointGotInDB.schedule.wednesday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.wednesday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.wednesday[index].closingHour);
        });
        salespointGotInDB.schedule.thursday.should.be.an('array');
        const thursdayPromise = salespointGotInDB.schedule.thursday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.thursday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.thursday[index].closingHour);
        });
        salespointGotInDB.schedule.friday.should.be.an('array');
        const fridayPromise = salespointGotInDB.schedule.friday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.friday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.friday[index].closingHour);
        });
        salespointGotInDB.schedule.saturday.should.be.an('array');
        const saturdayPromise = salespointGotInDB.schedule.saturday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.saturday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.saturday[index].closingHour);
        });
        salespointGotInDB.schedule.sunday.should.be.an('array');
        const sundayPromise = salespointGotInDB.schedule.sunday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.sunday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.sunday[index].closingHour);
        });

        await Promise.all(mondayPromise, tuesdayPromise, wednesdayPromise, thursdayPromise, fridayPromise, saturdayPromise, sundayPromise);
      }
    });

    it('should fail getting one salespoint because no id received', async() => {
      const salespoint = await salespointService.getSalesPointById('');
      salespoint.message.should.be.equal('Received salespoint.id is invalid!');
    });

    it('should fail getting one salespoint because invalid id received', async() => {
      const salespoint = await salespointService.getSalesPointById(salespointWithoutSchedule.id + salespointWithoutSchedule.id);
      salespoint.message.should.be.equal('Received salespoint.id is invalid!');
    });

    it('should fail getting one salespoint because unknown id received', async() => {
      const salespoint = await salespointService.getSalesPointById('abcdefabcdefabcdefabcdef');
      expect(salespoint).to.be.null;
    });
  });

  describe('tests addSalesPoint', () => {
    it('should add a new salespoint with a schedule', async() => {
      salespointWithSchedule._id = undefined;
      const addedSalespoint = (await salespointService.addSalesPoint(salespointWithSchedule)).toObject();
      addedSalespoint.should.be.not.null;
      addedSalespoint.id.should.be.not.null; // ne peut pas être égal à salespointWithSchedule.id
      addedSalespoint.name.should.be.equal(salespointWithSchedule.name);
      addedSalespoint.address.should.be.not.null;
      addedSalespoint.address.should.be.an('object');
      if (salespointWithSchedule.address.number) {
        addedSalespoint.address.number.should.be.equal(salespointWithSchedule.address.number);
      }
      addedSalespoint.address.street.should.be.equal(salespointWithSchedule.address.street);
      addedSalespoint.address.city.should.be.equal(salespointWithSchedule.address.city);
      addedSalespoint.address.postalCode.should.be.equal(salespointWithSchedule.address.postalCode);
      addedSalespoint.address.state.should.be.equal(salespointWithSchedule.address.state);
      addedSalespoint.address.country.should.be.equal(salespointWithSchedule.address.country);
      addedSalespoint.address.longitude.should.be.equal(salespointWithSchedule.address.longitude);
      addedSalespoint.address.latitude.should.be.equal(salespointWithSchedule.address.latitude);

      if (salespointWithSchedule.schedule) {
        addedSalespoint.schedule.should.be.not.null;
        addedSalespoint.schedule.should.be.an('object');
        addedSalespoint.schedule.monday.should.be.an('array');
        const mondayPromise = addedSalespoint.schedule.monday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.monday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.monday[index].closingHour);
        });
        addedSalespoint.schedule.tuesday.should.be.an('array');
        const tuesdayPromise = addedSalespoint.schedule.tuesday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.tuesday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.tuesday[index].closingHour);
        });
        addedSalespoint.schedule.wednesday.should.be.an('array');
        const wednesdayPromise = addedSalespoint.schedule.wednesday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.wednesday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.wednesday[index].closingHour);
        });
        addedSalespoint.schedule.thursday.should.be.an('array');
        const thursdayPromise = addedSalespoint.schedule.thursday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.thursday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.thursday[index].closingHour);
        });
        addedSalespoint.schedule.friday.should.be.an('array');
        const fridayPromise = addedSalespoint.schedule.friday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.friday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.friday[index].closingHour);
        });
        addedSalespoint.schedule.saturday.should.be.an('array');
        const saturdayPromise = addedSalespoint.schedule.saturday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.saturday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.saturday[index].closingHour);
        });
        addedSalespoint.schedule.sunday.should.be.an('array');
        const sundayPromise = addedSalespoint.schedule.sunday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.sunday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.sunday[index].closingHour);
        });

        await Promise.all(mondayPromise, tuesdayPromise, wednesdayPromise, thursdayPromise, fridayPromise, saturdayPromise, sundayPromise);
      }
    });

    it('should add a new salespoint without schedule', async() => {
      salespointWithoutSchedule._id = undefined;
      const addedSalespoint = (await salespointService.addSalesPoint(salespointWithoutSchedule)).toObject();
      addedSalespoint.should.be.not.null;
      addedSalespoint.id.should.be.not.null; // ne peut pas être égal à salespointWithoutSchedule.id
      addedSalespoint.name.should.be.equal(salespointWithoutSchedule.name);
      addedSalespoint.address.should.be.not.null;
      addedSalespoint.address.should.be.an('object');
      if (salespointWithoutSchedule.address.number) {
        addedSalespoint.address.number.should.be.equal(salespointWithoutSchedule.address.number);
      }
      addedSalespoint.address.street.should.be.equal(salespointWithoutSchedule.address.street);
      addedSalespoint.address.city.should.be.equal(salespointWithoutSchedule.address.city);
      addedSalespoint.address.postalCode.should.be.equal(salespointWithoutSchedule.address.postalCode);
      addedSalespoint.address.state.should.be.equal(salespointWithoutSchedule.address.state);
      addedSalespoint.address.country.should.be.equal(salespointWithoutSchedule.address.country);
      addedSalespoint.address.longitude.should.be.equal(salespointWithoutSchedule.address.longitude);
      addedSalespoint.address.latitude.should.be.equal(salespointWithoutSchedule.address.latitude);

      expect(addedSalespoint.schedule).to.be.null;
    });

    // TODO: ajouter des tests d'échec d'ajout lorsqu'il manque des données obligatoires
  });

  describe('tests updateSalesPoint', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should update a salespoint', async() => {
      // on récupère un salespoint
      let salespoint = (await salespointService.getSalesPointById(salespointWithoutSchedule.id)).toObject();
      // on le modifie
      salespoint = {
        ...salespointWithSchedule,
        id: salespoint.id,
        _id: salespoint._id
      };
      const updatedSalespoint = await salespointService.updateSalesPoint(salespoint);
      updatedSalespoint.should.be.not.null;
      updatedSalespoint.id.should.be.not.null; // ne peut pas être égal à salespointWithSchedule.id
      updatedSalespoint.name.should.be.equal(salespointWithSchedule.name);
      updatedSalespoint.address.should.be.not.null;
      updatedSalespoint.address.should.be.an('object');
      if (salespointWithSchedule.address.number) {
        updatedSalespoint.address.number.should.be.equal(salespointWithSchedule.address.number);
      }
      updatedSalespoint.address.street.should.be.equal(salespointWithSchedule.address.street);
      updatedSalespoint.address.city.should.be.equal(salespointWithSchedule.address.city);
      updatedSalespoint.address.postalCode.should.be.equal(salespointWithSchedule.address.postalCode);
      updatedSalespoint.address.state.should.be.equal(salespointWithSchedule.address.state);
      updatedSalespoint.address.country.should.be.equal(salespointWithSchedule.address.country);
      updatedSalespoint.address.longitude.should.be.equal(salespointWithSchedule.address.longitude);
      updatedSalespoint.address.latitude.should.be.equal(salespointWithSchedule.address.latitude);

      if (salespointWithSchedule.schedule) {
        updatedSalespoint.schedule.should.be.not.null;
        updatedSalespoint.schedule.should.be.an('object');
        updatedSalespoint.schedule.monday.should.be.an('array');
        const mondayPromise = updatedSalespoint.schedule.monday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.monday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.monday[index].closingHour);
        });
        updatedSalespoint.schedule.tuesday.should.be.an('array');
        const tuesdayPromise = updatedSalespoint.schedule.tuesday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.tuesday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.tuesday[index].closingHour);
        });
        updatedSalespoint.schedule.wednesday.should.be.an('array');
        const wednesdayPromise = updatedSalespoint.schedule.wednesday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.wednesday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.wednesday[index].closingHour);
        });
        updatedSalespoint.schedule.thursday.should.be.an('array');
        const thursdayPromise = updatedSalespoint.schedule.thursday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.thursday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.thursday[index].closingHour);
        });
        updatedSalespoint.schedule.friday.should.be.an('array');
        const fridayPromise = updatedSalespoint.schedule.friday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.friday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.friday[index].closingHour);
        });
        updatedSalespoint.schedule.saturday.should.be.an('array');
        const saturdayPromise = updatedSalespoint.schedule.saturday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.saturday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.saturday[index].closingHour);
        });
        updatedSalespoint.schedule.sunday.should.be.an('array');
        const sundayPromise = updatedSalespoint.schedule.sunday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.sunday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.sunday[index].closingHour);
        });

        await Promise.all(mondayPromise, tuesdayPromise, wednesdayPromise, thursdayPromise, fridayPromise, saturdayPromise, sundayPromise);
      }
    });

    it('should fail updating a salespoint because no id received', async() => {
      salespointWithSchedule.id = '';
      const updatedProduct = await salespointService.updateSalesPoint(salespointWithSchedule);

      updatedProduct.message.should.be.equal('Received salespoint.id is invalid!');
    });

    it('should fail updating a salespoint because invalid id received', async() => {
      salespointWithSchedule.id = '5c04561e7209e21e582750'; // id trop court (<24 caractères)
      const updatedProduct = await salespointService.updateSalesPoint(salespointWithSchedule);

      updatedProduct.message.should.be.equal('Received salespoint.id is invalid!');
    });

    it('should fail updating a salespoint because invalid id received', async() => {
      salespointWithSchedule.id = '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3'; // id trop long (> 24 caractères)
      const updatedProduct = await salespointService.updateSalesPoint(salespointWithSchedule);

      updatedProduct.message.should.be.equal('Received salespoint.id is invalid!');
    });

    it('should fail updating a salespoint because unknown id received', async() => {
      salespointWithSchedule.id = 'abcdefabcdefabcdefabcdef';
      const updatedProducer = await salespointService.updateSalesPoint(salespointWithSchedule);
      expect(updatedProducer).to.be.null;
    });
  });

  describe('tests deleteSalesPoint', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should delete a salespoint', async() => {
      // on supprime un salespoint
      let deleteSalespoint = (await salespointService.deleteSalesPoint(salespointWithSchedule.id)).toObject();
      deleteSalespoint.should.be.not.null;
      deleteSalespoint.id.should.be.eql(salespointWithSchedule.id);

      // on tente de récupérer le même salespoint -> retourne null car le salespoint est introuvable dans la DB
      deleteSalespoint = await salespointService.getSalesPointById(deleteSalespoint);
      expect(deleteSalespoint).to.be.null;
    });

    it('should fail deleting a salespoint because given id not found in DB', async() => {
      // on supprime un salepoint inexistant
      const deleteSalesPoint = await salespointService.deleteSalesPoint('abcdefabcdefabcdefabcdef');
      expect(deleteSalesPoint).to.be.null;
    });
  });
});
