require('../../chai-config');
const usersService = require('../../../src/graphql/services/users.services');
const productsService = require('../../../src/graphql/services/products.services');
const productTypeService = require('../../../src/graphql/services/productType.services');
const UsersModel = require('../../../src/graphql/models/users.modelgql');
const PersonModel = require('../../../src/graphql/models/persons.modelgql');
const UserModel = require('../../../src/graphql/models/users.modelgql');
const SalespointsModel = require('../../../src/graphql/models/salespoints.modelgql');
const TokensValidationEmailModel = require('../../../src/graphql/models/tokensValidationEmail.modelgql');
const { Products: ProductModel, ProductType: ProductTypeModel, ProductTypeCategory: ProductTypeCategoryModel } = require(
  '../../../src/graphql/models/products.modelgql'
);

let benoit = {
  firstname: 'Benoît',
  lastname: 'Schöpfli',
  email: 'benoit@paysan.ch',
  password: '1234abcd',
  image: 'ceci est une image encodée en base64!',
  subscriptions: [],
  emailValidated: false
};

let antoine = {
  firstname: 'Antoine',
  lastname: 'Rochaille',
  email: 'antoine@paysan.ch',
  password: '1234abcd',
  image: 'ceci est l\'image d\'un tueur encodée en base64!',
  subscriptions: [],
  emailValidated: false
};

let tabUsers = [benoit, antoine];

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await UsersModel.deleteMany();
  await ProductModel.deleteMany();
  await ProductTypeModel.deleteMany();
  await ProductTypeCategoryModel.deleteMany();
  await PersonModel.deleteMany();
  await UserModel.deleteMany();
  await SalespointsModel.deleteMany();
  await TokensValidationEmailModel.deleteMany();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------

  // on ajoute 2 utilisateurs
  benoit = (await usersService.addUser(benoit)).toObject();
  antoine = (await usersService.addUser(antoine)).toObject();

  tabUsers = [benoit, antoine];
};

describe('tests users services', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('tests getUsers', () => {
    it('should get all users', async() => {
      // on récupère un tableau contenant tous les utilisateurs
      let allUsers = await usersService.getUsers();

      // on transforme chaque utilisateur du tableau en un objet
      allUsers = allUsers.map(user => user.toObject());
      allUsers.should.be.an('array');
      allUsers.length.should.be.equal(2);

      // pour chaque utilisateur, on test les éléments critiques
      const promises = await allUsers.map(async(user, index) => {
        user.id.should.be.eql(tabUsers[index].id);

        // TODO: tester l'intérieur de subscription lorsqu'on pourra les gérer...!
        user.subscriptions.should.be.not.null;
        user.subscriptions.should.be.an('array');
      });
      await Promise.all(promises);
    });
  });

  describe('tests getUserById', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should get one user', async() => {
      // on récupère le utilisateur corresondant à l'id donné
      const user = (await usersService.getUserById(benoit.id)).toObject();

      // on test son contenu
      user.should.be.not.null;
      user.id.should.be.eql(benoit.id);
      user.firstname.should.be.equal(benoit.firstname);
      user.lastname.should.be.equal(benoit.lastname);
      user.email.should.be.equal(benoit.email);
      user.password.should.be.equal(benoit.password);
      user.image.should.be.equal(benoit.image);

      // TODO: tester l'intérieur de subscription lorsqu'on pourra les gérer...!
      user.subscriptions.should.be.an('array');
      user.subscriptions.length.should.be.equal(benoit.subscriptions.length);

      user.emailValidated.should.be.equal(benoit.emailValidated);
    });

    it('should fail getting one user because no id received', async() => {
      const userGotInDB = await usersService.getUserById('');
      userGotInDB.message.should.be.equal('Received user.id is invalid!');
    });

    it('should fail getting one user because invalid id received', async() => {
      const userGotInDB = await usersService.getUserById(benoit.id + benoit.id);
      userGotInDB.message.should.be.equal('Received user.id is invalid!');
    });

    it('should fail getting one user because unknown id received', async() => {
      const userGotInDB = await usersService.getUserById('abcdefabcdefabcdefabcdef');
      expect(userGotInDB).to.be.null;
    });
  });

  describe('tests getAllUsersInReceivedIdList', () => {
    it('should get all users with id in received list', async() => {
      // on récupère 2 utilisateurs
      let users = await usersService.getAllUsersInReceivedIdList([benoit.id, antoine.id]);
      users.should.be.an('array');
      users.length.should.be.equal(2);

      // on récupère 1 seul utilisateur
      users = await usersService.getAllUsersInReceivedIdList([benoit.id]);
      users.should.be.not.null;
      users.should.be.an('array');
      users.length.should.be.equal(1);

      // on récupère aucun utilisateur
      users = await usersService.getAllUsersInReceivedIdList([]);
      users.should.be.not.null;
      users.should.be.an('array');
      users.length.should.be.equal(0);
    });
  });

  describe('tests addUser', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should add a new user', async() => {
      benoit._id = undefined;
      benoit.email = 'benoit1@paysan.ch';

      // on ajoute un nouveau utilisateur
      const addedUser = await usersService.addUser(benoit);
      // on test son contenu
      addedUser.should.be.not.null;
      addedUser.id.should.be.not.null; // ne peut pas être égal à benoit.id !
      addedUser.firstname.should.be.equal(benoit.firstname);
      addedUser.lastname.should.be.equal(benoit.lastname);
      addedUser.email.should.be.equal(benoit.email);
      addedUser.password.should.be.equal(benoit.password);
      addedUser.image.should.be.equal(benoit.image);

      // TODO: tester l'intérieur de subscription lorsqu'on pourra les gérer...!
      addedUser.subscriptions.should.be.an('array');
      addedUser.subscriptions.length.should.be.equal(benoit.subscriptions.length);

      addedUser.emailValidated.should.be.equal(benoit.emailValidated);
    });

    // TODO: ajouter des tests d'échec d'ajout lorsqu'il manque des données obligatoires

    it('should fail adding a new user with an already used email', async() => {
      const userToAdd = {
        ...benoit,
        email: 'benoit2@paysan.ch',
        _id: undefined,
        id: undefined
      };

      // on ajoute un nouveau utilisateur
      const addedUser = (await usersService.addUser(userToAdd)).toObject();
      addedUser.should.be.not.null;
      addedUser.id.should.be.not.null;
      addedUser.firstname.should.be.equal(userToAdd.firstname);
      addedUser.lastname.should.be.equal(userToAdd.lastname);
      addedUser.email.should.be.equal(userToAdd.email);

      // on tente d'ajouter à nouveau le même utilisateur -> erreur car l'email est déjà utilisé
      const res = await usersService.addUser(userToAdd);
      res.should.be.not.null;
      res.message.should.be.equal('This email is already used.');
    });
  });

  describe('tests updateUser', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should update a user', async() => {
      // on récupère un utilisateur
      let user = (await usersService.getUserById(antoine.id)).toObject();
      // on le modifie
      user = {
        ...benoit,
        id: user.id
      };
      // on met à jour dans la DB
      const updatedUser = (await usersService.updateUser(user)).toObject();
      // on test son nouveau contenu
      updatedUser.should.be.not.null;
      updatedUser.id.should.be.equal(user.id);
      updatedUser.firstname.should.be.equal(user.firstname);
      updatedUser.lastname.should.be.equal(user.lastname);
      updatedUser.email.should.be.equal(user.email);
      updatedUser.password.should.be.equal(user.password);
      updatedUser.image.should.be.equal(user.image);

      // TODO: tester l'intérieur de subscription lorsqu'on pourra les gérer...!
      updatedUser.subscriptions.should.be.an('array');
      updatedUser.subscriptions.length.should.be.equal(user.subscriptions.length);

      updatedUser.emailValidated.should.be.equal(user.emailValidated);
    });

    it('should fail updating a user because no id received', async() => {
      benoit.id = '';
      const updatedUser = await usersService.updateUser(benoit);

      updatedUser.message.should.be.equal('Received user.id is invalid!');
    });

    it('should fail updating a user because invalid id received', async() => {
      benoit.id = '5c04561e7209e21e582750'; // id trop court (<24 caractères)
      const updatedUser = await usersService.updateUser(benoit);

      updatedUser.message.should.be.equal('Received user.id is invalid!');
    });

    it('should fail updating a user because invalid id received', async() => {
      benoit.id = '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3'; // id trop long (> 24 caractères)
      const updatedUser = await usersService.updateUser(benoit);

      updatedUser.message.should.be.equal('Received user.id is invalid!');
    });

    it('should fail updating a user because unknown id received', async() => {
      benoit.id = 'abcdefabcdefabcdefabcdef';
      const updatedUser = await usersService.updateUser(benoit);
      expect(updatedUser).to.be.null;
    });
  });

  describe('tests deleteUser', () => {
    it('should delete a user', async() => {
      // on supprime un utilisateur
      let deleteUser = (await usersService.deleteUser(benoit.id)).toObject();
      deleteUser.should.be.not.null;
      deleteUser.id.should.be.eql(benoit.id);

      // on tente de récupérer le même utilisateur -> retourne null car le utilisateur est introuvable dans la DB
      deleteUser = await usersService.getUserById(deleteUser.id);

      expect(deleteUser).to.be.null;
    });

    it('should fail deleting a user because given id not found in DB', async() => {
      // on supprime un user inexistant -> retourne null car le user est introuvable dans la DB
      const deleteUser = await usersService.deleteUser('abcdefabcdefabcdefabcdef');

      expect(deleteUser).to.be.null;
    });
  });
});
