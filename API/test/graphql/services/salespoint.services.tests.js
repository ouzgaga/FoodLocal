const salespointsServices = require('../../../src/graphql/services/salespoints.services');
const producersServices = require('../../../src/graphql/services/producers.services');
const clearDB = require('../clearDB');

let benoit;
let antoine;
let salespointWithSchedule;
let salespointWithoutSchedule;

let tabSalespoints = [];

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  //
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

  salespointWithSchedule = {
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

  salespointWithoutSchedule = {
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

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  // on ajoute 1 producteur contenant le salespoint 'salespointWithSchedule'
  benoit = (await producersServices.addProducer(benoit)).toObject();
  benoit = (await producersServices.addSalespointToProducer(benoit.id, salespointWithSchedule)).toObject();
  salespointWithSchedule = (await salespointsServices.getSalespointById(benoit.salespointId)).toObject();

  // on ajoute 1 producteur contenant le salespoint 'salespointWithoutSchedule''
  antoine = (await producersServices.addProducer(antoine)).toObject();
  antoine = (await producersServices.addSalespointToProducer(antoine.id, salespointWithoutSchedule)).toObject();
  salespointWithoutSchedule = (await salespointsServices.getSalespointById(antoine.salespointId)).toObject();

  tabSalespoints = [salespointWithSchedule, salespointWithoutSchedule];
};

describe('tests salespoints services', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('tests getSalespoints', () => {
    it('should get all salespoints', async() => {
      // on récupère un tableau contenant tous les salespoints
      let allSalespoints = await salespointsServices.getSalespoints();

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
        salespoint.address.location.coordinates[0].should.be.equal(tabSalespoints[index].address.location.coordinates[0]);
        salespoint.address.location.coordinates[1].should.be.equal(tabSalespoints[index].address.location.coordinates[1]);

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

  describe('tests getSalespointById', () => {
    beforeEach(async() => {
      await clearAndPopulateDB();

      tabSalespoints[0]._id = undefined;
      tabSalespoints[0].address.location = undefined;
      tabSalespoints[0].address.longitude = 1.1234567;
      tabSalespoints[0].address.latitude = 1.123456789;
      tabSalespoints[1]._id = undefined;
      tabSalespoints[1].address.location = undefined;
      tabSalespoints[1].address.longitude = 1.1234567;
      tabSalespoints[1].address.latitude = 1.123456789;
    });

    it('should get one salespoint', async() => {
      const salespointGotInDB = (await salespointsServices.getSalespointById(salespointWithSchedule.id)).toObject();
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
      salespointGotInDB.address.location.coordinates[0].should.be.equal(salespointWithSchedule.address.longitude);
      salespointGotInDB.address.location.coordinates[1].should.be.equal(salespointWithSchedule.address.latitude);

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
      try {
        await salespointsServices.getSalespointById('');
      } catch (err) {
        err.name.should.be.equal('CastError');
        err.kind.should.be.equal('ObjectId');
      }
    });

    it('should fail getting one salespoint because invalid id received', async() => {
      try {
        await salespointsServices.getSalespointById(salespointWithoutSchedule.id + salespointWithoutSchedule.id);
      } catch (err) {
        err.name.should.be.equal('CastError');
        err.kind.should.be.equal('ObjectId');
      }
    });

    it('should fail getting one salespoint because unknown id received', async() => {
      const salespoint = await salespointsServices.getSalespointById('abcdefabcdefabcdefabcdef');
      expect(salespoint).to.be.null;
    });
  });

  describe('tests addSalespoint', () => {
    beforeEach(async() => {
      await clearAndPopulateDB();

      tabSalespoints[0]._id = undefined;
      tabSalespoints[0].address.location = undefined;
      tabSalespoints[0].address.longitude = 1.1234567;
      tabSalespoints[0].address.latitude = 1.123456789;
      tabSalespoints[1]._id = undefined;
      tabSalespoints[1].address.location = undefined;
      tabSalespoints[1].address.longitude = 1.1234567;
      tabSalespoints[1].address.latitude = 1.123456789;
    });

    it('should add a new salespoint with a schedule', async() => {
      const addedSalespoint = (await salespointsServices.addSalespoint(salespointWithSchedule)).toObject();
      addedSalespoint.should.be.not.null;
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
      addedSalespoint.address.location.coordinates[0].should.be.equal(salespointWithSchedule.address.longitude);
      addedSalespoint.address.location.coordinates[1].should.be.equal(salespointWithSchedule.address.latitude);

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
      const addedSalespoint = (await salespointsServices.addSalespoint(salespointWithoutSchedule)).toObject();
      addedSalespoint.should.be.not.null;
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
      addedSalespoint.address.location.coordinates[0].should.be.equal(salespointWithoutSchedule.address.longitude);
      addedSalespoint.address.location.coordinates[1].should.be.equal(salespointWithoutSchedule.address.latitude);

      expect(addedSalespoint.schedule).to.be.null;
    });

    it('should fail adding a new salespoint because missing mendatory information (name)', async() => {
      salespointWithoutSchedule.name = undefined;
      try {
        await salespointsServices.addSalespoint(salespointWithoutSchedule);
      } catch (err) {
        expect(err.message).to.be.equal('salespoints validation failed: name: Path `name` is required.');
      }
    });
  });

  describe('tests updateSalespoint', () => {
    beforeEach(async() => {
      await clearAndPopulateDB();

      tabSalespoints[0]._id = undefined;
      tabSalespoints[0].address.location = undefined;
      tabSalespoints[0].address.longitude = 1.1234567;
      tabSalespoints[0].address.latitude = 1.123456789;
      tabSalespoints[1]._id = undefined;
      tabSalespoints[1].address.location = undefined;
      tabSalespoints[1].address.longitude = 1.1234567;
      tabSalespoints[1].address.latitude = 1.123456789;
    });

    it('should update a salespoint', async() => {
      const updatedProducerWithSalespoint = await salespointsServices.updateSalespoint(antoine.id, salespointWithSchedule);
      const salespoint = (await salespointsServices.getSalespointById(updatedProducerWithSalespoint.salespointId)).toObject();

      salespoint.should.be.not.null;
      salespoint.id.should.be.not.null; // ne peut pas être égal à salespointWithSchedule.id
      salespoint.name.should.be.equal(salespointWithSchedule.name);
      salespoint.address.should.be.not.null;
      salespoint.address.should.be.an('object');
      if (salespointWithSchedule.address.number) {
        salespoint.address.number.should.be.equal(salespointWithSchedule.address.number);
      }
      salespoint.address.street.should.be.equal(salespointWithSchedule.address.street);
      salespoint.address.city.should.be.equal(salespointWithSchedule.address.city);
      salespoint.address.postalCode.should.be.equal(salespointWithSchedule.address.postalCode);
      salespoint.address.state.should.be.equal(salespointWithSchedule.address.state);
      salespoint.address.country.should.be.equal(salespointWithSchedule.address.country);
      salespoint.address.location.coordinates[0].should.be.equal(salespointWithSchedule.address.longitude);
      salespoint.address.location.coordinates[1].should.be.equal(salespointWithSchedule.address.latitude);

      if (salespointWithSchedule.schedule) {
        salespoint.schedule.should.be.not.null;
        salespoint.schedule.should.be.an('object');
        salespoint.schedule.monday.should.be.an('array');
        const mondayPromise = salespoint.schedule.monday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.monday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.monday[index].closingHour);
        });
        salespoint.schedule.tuesday.should.be.an('array');
        const tuesdayPromise = salespoint.schedule.tuesday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.tuesday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.tuesday[index].closingHour);
        });
        salespoint.schedule.wednesday.should.be.an('array');
        const wednesdayPromise = salespoint.schedule.wednesday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.wednesday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.wednesday[index].closingHour);
        });
        salespoint.schedule.thursday.should.be.an('array');
        const thursdayPromise = salespoint.schedule.thursday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.thursday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.thursday[index].closingHour);
        });
        salespoint.schedule.friday.should.be.an('array');
        const fridayPromise = salespoint.schedule.friday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.friday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.friday[index].closingHour);
        });
        salespoint.schedule.saturday.should.be.an('array');
        const saturdayPromise = salespoint.schedule.saturday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.saturday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.saturday[index].closingHour);
        });
        salespoint.schedule.sunday.should.be.an('array');
        const sundayPromise = salespoint.schedule.sunday.map((daySchedule, index) => {
          daySchedule.openingHour.should.be.equal(salespointWithSchedule.schedule.sunday[index].openingHour);
          daySchedule.closingHour.should.be.equal(salespointWithSchedule.schedule.sunday[index].closingHour);
        });

        await Promise.all(mondayPromise, tuesdayPromise, wednesdayPromise, thursdayPromise, fridayPromise, saturdayPromise, sundayPromise);
      }
    });

    it('should fail updating a salespoint because no producerId received', async() => {
      try {
        await salespointsServices.updateSalespoint(null, salespointWithSchedule);
      } catch (err) {
        err.message.should.be.equal('Received producerId is not in the database!');
      }
    });

    it('should fail updating a salespoint because invalid id received (too short)', async() => {
      try {
        await salespointsServices.updateSalespoint('abcdef', salespointWithSchedule);
      } catch (err) {
        err.message.should.be.equal('Received producerId is invalid!');
      }
    });

    it('should fail updating a salespoint because invalid id received (too long)', async() => {
      try {
        await salespointsServices.updateSalespoint('abcdefabcdefabcdefabcdefabcdef', salespointWithSchedule);
      } catch (err) {
        err.message.should.be.equal('Received producerId is invalid!');
      }
    });

    it('should fail updating a salespoint because unknown id received', async() => {
      try {
        await salespointsServices.updateSalespoint('abcdefabcdefabcdefabcdef', salespointWithSchedule);
      } catch (err) {
        err.message.should.be.equal('Received producerId is not in the database!');
      }
    });
  });

  describe('tests deleteSalespoint', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should delete a salespoint', async() => {
      // on supprime un salespoint
      let deleteSalespoint = (await salespointsServices.deleteSalespoint(salespointWithSchedule.id)).toObject();
      deleteSalespoint.should.be.not.null;
      deleteSalespoint.id.should.be.eql(salespointWithSchedule.id);

      try {
        // on tente de récupérer le même salespoint -> retourne null car le salespoint est introuvable dans la DB
        await salespointsServices.getSalespointById(deleteSalespoint.id);
      } catch (err) {
        err.message.should.be.euqal('Received salespoint.id is invalid!');
      }
    });

    it('should fail deleting a salespoint because given id not found in DB', async() => {
      // on supprime un salepoint inexistant
      const deleteSalespoint = await salespointsServices.deleteSalespoint('abcdefabcdefabcdefabcdef');
      expect(deleteSalespoint).to.be.null;
    });
  });
});
