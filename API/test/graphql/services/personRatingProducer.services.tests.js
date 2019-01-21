const producersServices = require('../../../src/graphql/services/producers.services');
const personRatingProducerServices = require('../../../src/graphql/services/personRatingProducers.services');
const clearDB = require('../clearDB');

let benoit;
let antoine;
let james;
let ratingAntoine1;
let ratingAntoine2;
let ratingJames3;
let ratingJames4;
let ratingBenoit5;

let tabRatingsAboutAntoine = [];
let tabRatingsMadeByAntoine = [];

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------

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

  james = {
    firstname: 'James',
    lastname: 'Submith',
    email: 'james@paysan.ch',
    password: '1234abcd',
    image: 'Ceci est une image encodée en base64!',
    phoneNumber: '1234567123',
    description: 'Un vrai touriste!'
  };

  // on ajoute 3 producteurs
  benoit = (await producersServices.addProducer(benoit)).toObject();
  antoine = (await producersServices.addProducer(antoine)).toObject();
  james = (await producersServices.addProducer(james)).toObject();

  ratingAntoine1 = {
    producerId: antoine.id,
    personId: benoit.id,
    rating: 1
  };

  ratingAntoine2 = {
    producerId: antoine.id,
    personId: james.id,
    rating: 2
  };

  ratingJames3 = {
    producerId: james.id,
    personId: benoit.id,
    rating: 3
  };

  ratingJames4 = {
    producerId: james.id,
    personId: antoine.id,
    rating: 4
  };

  ratingBenoit5 = {
    producerId: benoit.id,
    personId: antoine.id,
    rating: 5
  };

  // on ajoute les ratings
  ratingAntoine1 = (await personRatingProducerServices.addOrUpdatePersonRatingProducer(ratingAntoine1)).toObject();
  ratingAntoine2 = (await personRatingProducerServices.addOrUpdatePersonRatingProducer(ratingAntoine2)).toObject();

  ratingJames3 = (await personRatingProducerServices.addOrUpdatePersonRatingProducer(ratingJames3)).toObject();
  ratingJames4 = (await personRatingProducerServices.addOrUpdatePersonRatingProducer(ratingJames4)).toObject();

  ratingBenoit5 = (await personRatingProducerServices.addOrUpdatePersonRatingProducer(ratingBenoit5)).toObject();

  tabRatingsAboutAntoine = [ratingAntoine1, ratingAntoine2];
  tabRatingsMadeByAntoine = [ratingJames4, ratingBenoit5];
};

describe('tests personRatingProducer services', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('tests getAllRatingsAboutProducerWithId', () => {
    it('should get all ratings about producer with received id', async() => {
      // on récupère un tableau contenant tous les ratings concernant le producteur avec l'id passé en paramètre
      let allRatingsAboutAntoine = await personRatingProducerServices.getAllRatingsAboutProducerWithId(antoine.id);

      // on transforme chaque personRatingProducer du tableau en un objet
      allRatingsAboutAntoine = allRatingsAboutAntoine.map(rating => rating.toObject());
      allRatingsAboutAntoine.should.be.an('array');
      allRatingsAboutAntoine.length.should.be.equal(2);
      // on test le contenu de chaque rating
      const promisesRatings = allRatingsAboutAntoine.map(async(rating, index) => {
        rating.should.be.not.null;
        rating.id.should.be.eql(tabRatingsAboutAntoine[index].id);
        rating.producerId.should.be.eql(tabRatingsAboutAntoine[index].producerId);
        rating.personId.should.be.eql(tabRatingsAboutAntoine[index].personId);
        rating.rating.should.be.equal(tabRatingsAboutAntoine[index].rating);
      });
      await Promise.all(promisesRatings);
    });

    it('should fail getting the rating about received producerId made by received personId because no producerId received', async() => {
      try {
        await personRatingProducerServices.getAllRatingsAboutProducerWithId(null);
      } catch (err) {
        err.message.should.be.equal('Received personRatingProducer.producerId is invalid!');
      }

      try {
        await personRatingProducerServices.getAllRatingsAboutProducerWithId(undefined);
      } catch (err) {
        err.message.should.be.equal('Received personRatingProducer.producerId is invalid!');
      }
    });

    it('should fail getting the rating about received producerId made by received personId because invalid producerId received', async() => {
      try {
        const ratings = await personRatingProducerServices.getAllRatingsAboutProducerWithId(benoit.id + benoit.id);
      } catch (err) {
        err.name.should.be.equal('CastError');
        err.kind.should.be.equal('ObjectId');
      }
    });

    it('should get no rating about received producerId made by received personId because unknown producerId received', async() => {
      const ratings = await personRatingProducerServices.getAllRatingsAboutProducerWithId('abcdefabcdefabcdefabcdef');
      ratings.length.should.be.equal(0);
    });
  });

  describe('tests getRatingAboutProducerIdMadeByPersonId', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should get the rating about received producerId made by received personId', async() => {
      // on récupère le rating concernant le producteur avec l'id passé en 1er paramètre et fait par la personne avec l'id passé en 2ème paramètre
      const rating = await personRatingProducerServices.getRatingAboutProducerIdMadeByPersonId(benoit.id, antoine.id);

      // on test le contenu du rating
      rating.should.be.not.null;
      rating.id.should.be.eql(ratingBenoit5.id);
      rating.producerId.should.be.eql(ratingBenoit5.producerId);
      rating.personId.should.be.eql(ratingBenoit5.personId);
      rating.rating.should.be.equal(ratingBenoit5.rating);
    });

    it('should fail getting the rating about received producerId made by received personId because no producerId received', async() => {
      try {
        await personRatingProducerServices.getRatingAboutProducerIdMadeByPersonId(null, antoine.id);
      } catch (err) {
        err.message.should.be.equal('Received personRatingProducer.producerId is invalid!');
      }
      try {
        await personRatingProducerServices.getRatingAboutProducerIdMadeByPersonId(undefined, antoine.id);
      } catch (err) {
        err.message.should.be.equal('Received personRatingProducer.producerId is invalid!');
      }
    });

    it('should fail getting the rating about received producerId made by received personId because invalid producerId received', async() => {
      try {
        await personRatingProducerServices.getRatingAboutProducerIdMadeByPersonId(benoit.id + benoit.id, antoine.id);
      } catch (err) {
        err.name.should.be.equal('CastError');
        err.kind.should.be.equal('ObjectId');
      }
    });

    it('should get no rating about received producerId made by received personId because unknown producerId received', async() => {
      const rating = await personRatingProducerServices.getRatingAboutProducerIdMadeByPersonId('abcdefabcdefabcdefabcdef', antoine.id);
      expect(rating).to.be.null;
    });

    it('should fail getting the rating about received producerId made by received personId because no personId received', async() => {
      try {
        await personRatingProducerServices.getRatingAboutProducerIdMadeByPersonId(benoit.id, null);
      } catch (err) {
        err.message.should.be.equal('Received personRatingProducer.personId is invalid!');
      }
      try {
        await personRatingProducerServices.getRatingAboutProducerIdMadeByPersonId(benoit.id, undefined);
      } catch (err) {
        err.message.should.be.equal('Received personRatingProducer.personId is invalid!');
      }
    });

    it('should fail getting the rating about received producerId made by received personId because invalid personId received', async() => {
      try {
        await personRatingProducerServices.getRatingAboutProducerIdMadeByPersonId(benoit.id, antoine.id + antoine.id);
      } catch (err) {
        err.name.should.be.equal('CastError');
        err.kind.should.be.equal('ObjectId');
      }
    });

    it('should get no rating about received producerId made by received personId because unknown personId received', async() => {
      const rating = await personRatingProducerServices.getRatingAboutProducerIdMadeByPersonId(benoit.id, 'abcdefabcdefabcdefabcdef');
      expect(rating).to.be.null;
    });
  });

  describe('tests getAllRatingsMadeByPersonWithId', () => {
    it('should get all ratings made by person with received id', async() => {
      // on récupère un tableau contenant tous les ratings concernant le producteur avec l'id passé en paramètre
      let allRatingsMadeByAntoine = await personRatingProducerServices.getAllRatingsMadeByPersonWithId(antoine.id);

      // on transforme chaque personRatingProducer du tableau en un objet
      allRatingsMadeByAntoine = allRatingsMadeByAntoine.map(rating => rating.toObject());
      allRatingsMadeByAntoine.should.be.an('array');
      allRatingsMadeByAntoine.length.should.be.equal(2);
      // on test le contenu de chaque rating
      const promisesRatings = allRatingsMadeByAntoine.map(async(rating, index) => {
        rating.should.be.not.null;
        rating.id.should.be.eql(tabRatingsMadeByAntoine[index].id);
        rating.producerId.should.be.eql(tabRatingsMadeByAntoine[index].producerId);
        rating.personId.should.be.eql(tabRatingsMadeByAntoine[index].personId);
        rating.rating.should.be.equal(tabRatingsMadeByAntoine[index].rating);
      });
      await Promise.all(promisesRatings);
    });

    it('should fail getting all the rating made by received personId because no personId received', async() => {
      try {
        await personRatingProducerServices.getAllRatingsMadeByPersonWithId(null);
      } catch (err) {
        err.message.should.be.equal('Received personRatingProducer.personId is invalid!');
      }
      try {
        await personRatingProducerServices.getAllRatingsMadeByPersonWithId(undefined);
      } catch (err) {
        err.message.should.be.equal('Received personRatingProducer.personId is invalid!');
      }
    });

    it('should fail getting all the rating made by received personId because invalid personId received', async() => {
      try {
        await personRatingProducerServices.getAllRatingsMadeByPersonWithId(benoit.id + benoit.id);
      } catch (err) {
        err.name.should.be.equal('CastError');
        err.kind.should.be.equal('ObjectId');
      }
    });

    it('should return any rating made by received personId because unknown personId received', async() => {
      const ratings = await personRatingProducerServices.getAllRatingsMadeByPersonWithId('abcdefabcdefabcdefabcdef');
      ratings.length.should.be.equal(0);
    });
  });

  describe('tests addOrUpdatePersonRatingProducer', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should add a new rating about a producer made by a person', async() => {
      // on crée un nouveau rating qu'on va ajouter au producteur
      const newRating = {
        producerId: benoit.id,
        personId: james.id,
        rating: 3
      };

      // on check les valeurs du rating enregistré dans le producteur avant d'ajouter un nouveau rating
      let benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);

      // on ajoute le nouveau rating
      const addedRating = (await personRatingProducerServices.addOrUpdatePersonRatingProducer(newRating)).toObject();
      // on check que les données ajoutées soient bien celles souhaitées
      addedRating.should.be.not.null;
      addedRating.id.should.be.not.null;
      addedRating.producerId.toString().should.be.eql(newRating.producerId);
      addedRating.personId.toString().should.be.eql(newRating.personId);
      addedRating.rating.should.be.equal(newRating.rating);

      // on check les valeurs du rating enregistré dans le producteur après avoir ajouté le nouveau rating
      benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      // on check que ces valeurs aient bien été mises à jour
      benoitProducer.rating.grade.should.be.equal(4);
      benoitProducer.rating.nbRatings.should.be.equal(2);
    });

    it('should fail adding a new rating about a producer made by a person because this person already rate this producer', async() => {
      // on check les valeurs du rating enregistré dans le producteur avant d'ajouter un nouveau rating
      let benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);

      try {
        // on ajoute le rating ratingBenoit5 alors qu'il a déjà été ajouté -> retournera une erreur
        await personRatingProducerServices.addOrUpdatePersonRatingProducer(ratingBenoit5);
      } catch (err) {
        err.message.should.be.equal('This person has already rated this producer! You can\'t rate twice the same producer.');
      }

      // on check que les valeurs du rating enregistré dans le producteur n'ont pas été modifiées pusique le rating n'a pas été ajouté
      benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);
    });

    it('should fail adding a new rating about a producer made by a person because received unknown producerId', async() => {
      // on met un producerId valide mais non présent dans la DB
      ratingBenoit5.producerId = 'abcdefabcdefabcdefabcdef';

      // on check les valeurs du rating enregistré dans le producteur avant d'ajouter un nouveau rating
      let benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);

      try {
        // on ajoute le rating ratingBenoit5 avec un producerId inconnu -> retournera une erreur
        await personRatingProducerServices.addOrUpdatePersonRatingProducer(ratingBenoit5);
      } catch (e) {
        e.should.be.not.null;
        e.message.should.be.equal(`The given producerId (${ratingBenoit5.producerId}) doesn’t exist in the database!`);
      }

      // on check que les valeurs du rating enregistré dans le producteur n'ont pas été modifiées pusique le rating n'a pas été ajouté
      benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);
    });

    it('should fail adding a new rating about a producer made by a person because received unknown personId', async() => {
      // on met un producerId valide mais non présent dans la DB
      ratingBenoit5.personId = 'abcdefabcdefabcdefabcdef';

      // on check les valeurs du rating enregistré dans le producteur avant d'ajouter un nouveau rating
      let benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);

      try {
        // on ajoute le rating ratingBenoit5 avec un personId inconnu -> retournera une erreur
        await personRatingProducerServices.addOrUpdatePersonRatingProducer(ratingBenoit5);
      } catch (e) {
        e.should.be.not.null;
        e.message.should.be.equal(`The given personId (${ratingBenoit5.personId}) doesn’t exist in the database!`);
      }

      // on check que les valeurs du rating enregistré dans le producteur n'ont pas été modifiées pusique le rating n'a pas été ajouté
      benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);
    });

    it('should fail adding a new rating about a producer made by a person because rating < 1', async() => {
      // on met un producerId valide mais non présent dans la DB
      const newRating = {
        producerId: benoit.id,
        personId: james.id,
        rating: 0
      };

      // on check les valeurs du rating enregistré dans le producteur avant d'ajouter un nouveau rating
      let benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);

      // on ajoute le rating ratingBenoit5 avec un grade < 1 -> retournera une erreur
      try {
        await personRatingProducerServices.addOrUpdatePersonRatingProducer(newRating);
      } catch (error) {
        error.name.should.be.equal('ValidationError');
        error.message.should.be.equal('Validation failed: rating: Path `rating` (0) is less than minimum allowed value (1).');
      }

      // on check que les valeurs du rating enregistré dans le producteur n'ont pas été modifiées pusique le rating n'a pas été ajouté
      benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);
    });

    it('should fail adding a new rating about a producer made by a person because rating > 5', async() => {
      // on met un producerId valide mais non présent dans la DB
      const newRating = {
        producerId: benoit.id,
        personId: james.id,
        rating: 6
      };

      // on check les valeurs du rating enregistré dans le producteur avant d'ajouter un nouveau rating
      let benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);

      // on ajoute le rating ratingBenoit5 avec un personId inconnu -> retournera une erreur
      try {
        await personRatingProducerServices.addOrUpdatePersonRatingProducer(newRating);
      } catch (error) {
        error.name.should.be.equal('ValidationError');
        error.message.should.be.equal('Validation failed: rating: Path `rating` (6) is more than maximum allowed value (5).');
      }

      // on check que les valeurs du rating enregistré dans le producteur n'ont pas été modifiées pusique le rating n'a pas été ajouté
      benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);
    });


    it('should fail adding a new rating about a producer made by a person because rating is not an integer', async() => {
      // on met un producerId valide mais non présent dans la DB
      const newRating = {
        producerId: benoit.id,
        personId: james.id,
        rating: 3.5
      };

      // on check les valeurs du rating enregistré dans le producteur avant d'ajouter un nouveau rating
      let benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);

      // on ajoute le rating ratingBenoit5 avec un personId inconnu -> retournera une erreur
      try {
        await personRatingProducerServices.addOrUpdatePersonRatingProducer(newRating);
      } catch (error) {
        error.name.should.be.equal('ValidationError');
        error.message.should.be.equal('Validation failed: rating: 3.5 is not an integer value');
      }

      // on check que les valeurs du rating enregistré dans le producteur n'ont pas été modifiées pusique le rating n'a pas été ajouté
      benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);
    });
  });

  describe('tests updateProducerRating', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should update a personProducerRating', async() => {
      ratingAntoine1.rating = 4;
      const rating = (await personRatingProducerServices.addOrUpdatePersonRatingProducer(ratingAntoine1)).toObject();
      rating.should.be.not.null;
      rating.id.should.be.eql(ratingAntoine1.id);
      rating.producerId.should.be.eql(ratingAntoine1.producerId);
      rating.personId.should.be.eql(ratingAntoine1.personId);
      rating.rating.should.be.equal(ratingAntoine1.rating);

      // on check que les valeurs du rating enregistré dans le producteur n'ont pas été modifiées pusique le rating n'a pas été ajouté
      const AntoineProducer = (await producersServices.getProducerById(antoine.id)).toObject();
      AntoineProducer.rating.grade.should.be.equal(3);
      AntoineProducer.rating.nbRatings.should.be.equal(2);
    });

    it('should fail updating a rating because new rating < 1', async() => {
      // on check les valeurs du rating enregistré dans le producteur avant d'ajouter un nouveau rating
      let benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);

      // on ajoute le rating ratingBenoit5 avec un personId inconnu -> retournera une erreur
      try {
        ratingAntoine1.rating = 0;

        await personRatingProducerServices.addOrUpdatePersonRatingProducer(ratingAntoine1);
      } catch (error) {
        error.message.should.be.equal('Validation failed: rating: Path `rating` (0) is less than minimum allowed value (1).');
      }

      // on check que les valeurs du rating enregistré dans le producteur n'ont pas été modifiées pusique le rating n'a pas été ajouté
      benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);
    });

    it('should fail updating a rating because rating > 5', async() => {
      // on check les valeurs du rating enregistré dans le producteur avant d'ajouter un nouveau rating
      let benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);

      // on ajoute le rating ratingBenoit5 avec un personId inconnu -> retournera une erreur
      try {
        ratingAntoine1.rating = 6;

        await personRatingProducerServices.addOrUpdatePersonRatingProducer(ratingAntoine1);
      } catch (error) {
        error.message.should.be.equal('Validation failed: rating: Path `rating` (6) is more than maximum allowed value (5).');
      }

      // on check que les valeurs du rating enregistré dans le producteur n'ont pas été modifiées pusique le rating n'a pas été ajouté
      benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);
    });

    it('should fail updating a rating because rating is not an integer', async() => {
      // on check les valeurs du rating enregistré dans le producteur avant d'ajouter un nouveau rating
      let benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);

      // on ajoute le rating ratingBenoit5 avec un personId inconnu -> retournera une erreur
      try {
        ratingAntoine1.rating = 2.5;

        await personRatingProducerServices.addOrUpdatePersonRatingProducer(ratingAntoine1);
      } catch (error) {
        error.message.should.be.equal('Validation failed: rating: 2.5 is not an integer value');
      }

      // on check que les valeurs du rating enregistré dans le producteur n'ont pas été modifiées pusique le rating n'a pas été ajouté
      benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);
    });
  });

  describe('tests deleteSalespoint', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should delete a personRatingProducer', async() => {
      // on check les valeurs du rating enregistré dans le producteur avant de supprimer un rating
      let antoineProducer = (await producersServices.getProducerById(antoine.id)).toObject();
      antoineProducer.rating.grade.should.be.equal(1.5);
      antoineProducer.rating.nbRatings.should.be.equal(2);

      // on supprime un rating
      let deletedRating = (await personRatingProducerServices.deletePersonRatingProducer(ratingAntoine1.id)).toObject();
      // on test le contenu du rating supprimé
      deletedRating.should.be.not.null;
      deletedRating.id.should.be.eql(ratingAntoine1.id);
      deletedRating.producerId.should.be.eql(ratingAntoine1.producerId);
      deletedRating.personId.should.be.eql(ratingAntoine1.personId);
      deletedRating.rating.should.be.equal(ratingAntoine1.rating);

      // on check que les valeurs du rating enregistré dans le producteur ont bien été mises à jour
      antoineProducer = (await producersServices.getProducerById(antoine.id)).toObject();
      antoineProducer.rating.grade.should.be.equal(2);
      antoineProducer.rating.nbRatings.should.be.equal(1);

      deletedRating = await personRatingProducerServices.deletePersonRatingProducer(ratingAntoine1.id);
      expect(deletedRating).to.be.null;
    });

    it('should delete the last personRatingProducer about a producer', async() => {
      // on check les valeurs du rating enregistré dans le producteur avant de supprimer un rating
      let benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      benoitProducer.rating.grade.should.be.equal(5);
      benoitProducer.rating.nbRatings.should.be.equal(1);

      // on supprime un rating
      let deletedRating = (await personRatingProducerServices.deletePersonRatingProducer(ratingBenoit5.id)).toObject();
      // on test le contenu du rating supprimé
      deletedRating.should.be.not.null;
      deletedRating.id.should.be.eql(ratingBenoit5.id);
      deletedRating.producerId.should.be.eql(ratingBenoit5.producerId);
      deletedRating.personId.should.be.eql(ratingBenoit5.personId);
      deletedRating.rating.should.be.equal(ratingBenoit5.rating);

      // on check que les valeurs du rating enregistré dans le producteur ont bien été mises à jour
      benoitProducer = (await producersServices.getProducerById(benoit.id)).toObject();
      expect(benoitProducer.rating).to.be.null;

      deletedRating = await personRatingProducerServices.deletePersonRatingProducer(ratingBenoit5.id);
      expect(deletedRating).to.be.null;
    });

    it('should fail deleting a personRatingProducer about a producer because no id received', async() => {
      try {
        await personRatingProducerServices.deletePersonRatingProducer('');
      } catch (err) {
        err.name.should.be.equal('CastError');
        err.kind.should.be.equal('ObjectId');
      }
    });

    it('should fail deleting a personRatingProducer about a producer because invalid id received', async() => {
      try {
        await personRatingProducerServices.deletePersonRatingProducer(benoit.id + benoit.id);
      } catch (err) {
        err.name.should.be.equal('CastError');
        err.kind.should.be.equal('ObjectId');
      }
    });

    it('should fail deleting a personRatingProducer about a producer because unknown id received', async() => {
      const rating = await personRatingProducerServices.deletePersonRatingProducer('abcdefabcdefabcdefabcdef');
      expect(rating).to.be.null;
    });
  });
});
