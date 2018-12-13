require('../../chai-config');

const usersService = require('../../../src/graphql/services/users.services');
const UsersModel = require('../../../src/graphql/models/user.modelgql');

let benoit = {
  firstname: 'Benoît',
  lastname: 'Schopfer',
  email: 'benoit.schopfer@heig-vd.ch',
  password: '1234abcd',
  image: 'ceci est une image encodée en base64!',
  subscriptions: [],
  emailValidated: false
};

let antoine = {
  firstname: 'Antoine',
  lastname: 'Rochat',
  email: 'antoine.rochat@heig-vd.ch',
  password: '1234abcd',
  image: 'ceci est l\'image d\'un tueur encodée en base64!',
  subscriptions: [],
  emailValidated: false
};

describe('tests users services', () => {
  beforeEach(async() => {
    // on supprime tout le contenu de la DB
    await UsersModel.deleteMany();

    // on ajoute le contenu de départ
    // on ajoute 2 points de vente
    benoit = {
      firstname: 'Benoît',
      lastname: 'Schopfer',
      email: 'benoit.schopfer@heig-vd.ch',
      password: '1234abcd',
      image: 'ceci est une image encodée en base64!',
      subscriptions: [],
      emailValidated: false
    };
    benoit = await UsersModel.create(benoit);

    antoine = {
      firstname: 'Antoine',
      lastname: 'Rochat',
      email: 'antoine.rochat@heig-vd.ch',
      password: '1234abcd',
      image: 'ceci est l\'image d\'un tueur encodée en base64!',
      subscriptions: [],
      emailValidated: false
    };
    antoine = await UsersModel.create(antoine);
  });

  describe('tests getUsers', () => {
    it('should get all users', async() => {
      const allusers = await usersService.getUsers();

      allusers.should.be.an('array');
      allusers.length.should.be.equal(2);
      allusers.map((user) => {
        user.should.be.not.null;
        user.id.should.be.not.null;
        user.firstname.should.be.not.null;
        user.lastname.should.be.not.null;
        user.email.should.be.not.null;
        user.password.should.be.not.null;
        user.image.should.be.not.null;
        user.subscriptions.should.be.not.null;
        user.subscriptions.should.be.an('array');
        user.subscriptions.length.should.be.equal(0);
        user.emailValidated.should.be.not.null;
        user.emailValidated.should.be.equal(false);
      });
    });
  });

  describe('tests getUserById', () => {
    it('should get one user', async() => {
      const user = await usersService.getUserById(benoit.id);
      user.should.be.not.null;
      user.id.should.be.not.null;
      user.firstname.should.be.not.null;
      user.firstname.should.be.equal(benoit.firstname);
      user.lastname.should.be.not.null;
      user.lastname.should.be.equal(benoit.lastname);
      user.email.should.be.not.null;
      user.email.should.be.equal(benoit.email);
      user.password.should.be.not.null;
      user.password.should.be.equal(benoit.password);
      user.image.should.be.not.null;
      user.image.should.be.equal(benoit.image);
      user.subscriptions.should.be.not.null;
      user.subscriptions.should.be.an('array');
      user.subscriptions.length.should.be.equal(benoit.subscriptions.length);
      user.emailValidated.should.be.not.null;
      user.emailValidated.should.be.equal(benoit.emailValidated);
    });

    it('should fail getting one user because no id received', async() => {
      const userGotInDB = await usersService.getUserById('');
      userGotInDB.message.should.be.equal('Received user.id is invalid!');
    });
  });

  describe('tests addUser', () => {
    it('should add a new user', async() => {
      // on supprime tout le contenu de la DB
      await UsersModel.deleteMany();

      const newUser = {
        firstname: 'Benoît',
        lastname: 'Schopfer',
        email: 'benoit.schopfer@heig-vd.ch',
        password: '1234abcd',
        image: 'ceci est une image encodée en base64!',
        subscriptions: [],
        emailValidated: false
      };

      const addedUser = await usersService.addUser(newUser);
      addedUser.should.be.not.null;
      addedUser.id.should.be.not.null;
      addedUser.firstname.should.be.not.null;
      addedUser.firstname.should.be.equal(benoit.firstname);
      addedUser.lastname.should.be.not.null;
      addedUser.lastname.should.be.equal(benoit.lastname);
      addedUser.email.should.be.not.null;
      addedUser.email.should.be.equal(benoit.email);
      addedUser.password.should.be.not.null;
      addedUser.password.should.be.equal(benoit.password);
      addedUser.image.should.be.not.null;
      addedUser.image.should.be.equal(benoit.image);
      addedUser.subscriptions.should.be.not.null;
      addedUser.subscriptions.should.be.an('array');
      addedUser.subscriptions.length.should.be.equal(benoit.subscriptions.length);
      addedUser.emailValidated.should.be.not.null;
      addedUser.emailValidated.should.be.equal(benoit.emailValidated);
    });

    it('should fail adding a new user with an already used email', async() => {
      // on supprime tout le contenu de la DB
      await UsersModel.deleteMany();

      const newUser = {
        firstname: 'Benoît',
        lastname: 'Schopfer',
        email: 'benoit.schopfer@heig-vd.ch',
        password: '1234abcd',
        image: 'ceci est une image encodée en base64!',
        subscriptions: [],
        emailValidated: false
      };

      let addedUser = await usersService.addUser(newUser);
      addedUser.should.be.not.null;
      addedUser.id.should.be.not.null;
      addedUser.firstname.should.be.not.null;
      addedUser.firstname.should.be.equal(benoit.firstname);
      addedUser.lastname.should.be.not.null;
      addedUser.lastname.should.be.equal(benoit.lastname);
      addedUser.email.should.be.not.null;
      addedUser.email.should.be.equal(benoit.email);
      addedUser.password.should.be.not.null;
      addedUser.password.should.be.equal(benoit.password);
      addedUser.image.should.be.not.null;
      addedUser.image.should.be.equal(benoit.image);
      addedUser.subscriptions.should.be.not.null;
      addedUser.subscriptions.should.be.an('array');
      addedUser.subscriptions.length.should.be.equal(benoit.subscriptions.length);
      addedUser.emailValidated.should.be.not.null;
      addedUser.emailValidated.should.be.equal(benoit.emailValidated);

      try {
        addedUser = await usersService.addUser(newUser);
      } catch (e) {
        e.message.should.be.equal('This email is already used.');
      }
    });
  });

  describe('tests updateUser', () => {
    it('should update a user', async() => {
      const addedUser = {
        id: antoine.id,
        firstname: 'Benoît',
        lastname: 'Schopfer',
        email: 'benoit.schopfer@heig-vd.ch',
        password: '1234abcd',
        image: 'ceci est une image encodée en base64!',
        subscriptions: [],
        emailValidated: false
      };
      const updatedUser = await usersService.updateUser(addedUser);
      updatedUser.should.be.not.null;
      updatedUser.id.should.be.not.null;
      updatedUser.firstname.should.be.not.null;
      updatedUser.firstname.should.be.equal(benoit.firstname);
      updatedUser.lastname.should.be.not.null;
      updatedUser.lastname.should.be.equal(benoit.lastname);
      updatedUser.email.should.be.not.null;
      updatedUser.email.should.be.equal(benoit.email);
      updatedUser.password.should.be.not.null;
      updatedUser.password.should.be.equal(benoit.password);
      updatedUser.image.should.be.not.null;
      updatedUser.image.should.be.equal(benoit.image);
      updatedUser.subscriptions.should.be.not.null;
      updatedUser.subscriptions.should.be.an('array');
      updatedUser.subscriptions.length.should.be.equal(benoit.subscriptions.length);
      updatedUser.emailValidated.should.be.not.null;
      updatedUser.emailValidated.should.be.equal(benoit.emailValidated);
    });

    it('should fail updating a user because no id received', async() => {
      const addedUser = {
        id: '',
        ...benoit
      };
      const updatedUser = await usersService.updateUser(addedUser);

      updatedUser.message.should.be.equal('Received user.id is invalid!');
    });

    it('should fail updating a user because invalid id received', async() => {
      const addedUser = {
        id: '5c04561e7209e21e582750', // id trop court (<24 caractères)
        ...benoit
      };
      const updatedUser = await usersService.updateUser(addedUser);

      updatedUser.message.should.be.equal('Received user.id is invalid!');
    });

    it('should fail updating a user because invalid id received', async() => {
      const addedUser = {
        id: '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3', // id trop long (> 24 caractères)
        ...benoit
      };
      const updatedUser = await usersService.updateUser(addedUser);

      updatedUser.message.should.be.equal('Received user.id is invalid!');
    });

    it('should fail updating a user because id received not found in DB', async() => {
      const addedUser = {
        id: '675c04561e7209e21e582750', // id trop long (> 24 caractères)
        firstname: 'Benoît',
        lastname: 'Schopfer',
        email: 'benoit.schopfer@heig-vd.ch',
        password: '1234abcd',
        image: 'ceci est une image encodée en base64!',
        subscriptions: [],
        emailValidated: false
      };
      const updatedUser = await usersService.updateUser(addedUser);
    });
  });

  describe('tests deleteUser', () => {
    it('should delete a user', async() => {
      let deleteUser = await usersService.deleteUser(benoit);

      deleteUser.should.be.not.null;

      deleteUser = await usersService.getUserById(deleteUser);
      expect(deleteUser).to.be.null;
    });
  });
});
