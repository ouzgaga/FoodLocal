const jwt = require('jsonwebtoken');
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const snapshot = require('snap-shot-it');
const { resolvers, schema: typeDefs, connectionDirective } = require('../../../src/graphql/graphqlConfig');
const { populateDB, getTabUsers, getTabProducers } = require('../../populateDatabase');

// Making schema graphql
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    connection: connectionDirective
  }
});

let tabUsers;
let tabProducers;

const clearAndPopulateDB = async() => {
  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  await populateDB();

  tabUsers = await getTabUsers();
  tabProducers = await getTabProducers();
};

describe('Testing graphql resquest tokens', () => {
  describe('MUTATION tokens', () => {
    // ----------------------validateAnEmailToken(emailValidationToken: String!)-------------------------------------- //
    describe('Testing validateAnEmailToken(emailValidationToken: String!)', () => {
      beforeEach(async() => {
        await clearAndPopulateDB();
      });

      const { mutation } = {
        mutation: `
          mutation($emailValidationToken: String!) {
            validateAnEmailToken(emailValidationToken: $emailValidationToken) {
              token
            }
          }`
      };

      it('should validate an email with received token', async() => {
        // on vérifie que l'email du producteur ne soit pas encore validé
        const variableQuery = { id: tabProducers[0].id };
        const { query } = {
          query: `
            query($id: ID!){
              producer(producerId: $id){
                firstname
                lastname
                email
                image
                followingProducers{
                  edges {
                    node {
                      id
                      firstname
                      lastname
                      email
                      image
                    }
                  }
                }
                emailValidated
                isAdmin
                followers{
                  edges{
                    node{
                      id
                      firstname
                      lastname
                      email
                      image
                    }
                  }
                }
                phoneNumber
                description
                website
                salespoint{
                  name
                  address{
                    number
                    street
                    city
                    postalCode
                    state
                    country
                    longitude
                    latitude
                  }
                  schedule{
                    monday{
                      openingHour
                      closingHour
                    }
                    tuesday{
                      openingHour
                      closingHour
                    }
                    wednesday{
                      openingHour
                      closingHour
                    }
                    thursday{
                      openingHour
                      closingHour
                    }
                    friday{
                      openingHour
                      closingHour
                    }
                    saturday{
                      openingHour
                      closingHour
                    }
                    sunday{
                      openingHour
                      closingHour
                    }
                  }
                }
                isValidated
                products{
                  edges{
                    node{
                      id
                      description
                      productType{
                        id
                        name
                        image
                      }
                    }
                  }
                }
                rating{
                  nbRatings
                  grade
                }
              }
            }`
        };
        let result = await graphql(schema, query, null, null, variableQuery);

        expect(result.data.producer.emailValidated).to.be.false;

        // on demande un nouveu token de validation d'email
        let variables = { email: result.data.producer.email, password: '1234abcd' };
        const { mutation1 } = {
          mutation1:
            `mutation ($email: String!, $password: String!){
              askNewEmailToken(email: $email, password: $password){
                token
              }
            }`
        };
        result = await graphql(schema, mutation1, null, {}, variables);
        const { token } = result.data.askNewEmailToken;

        // on valide l'email à l'aide de ce token
        variables = { emailValidationToken: token };
        result = await graphql(schema, mutation, null, {}, variables);

        // on récupère à nouveau le producteur dans la DB et on check que son email ait bien été validé
        result = await graphql(schema, query, null, null, variableQuery);
        expect(result.data.producer.emailValidated).to.be.true;
      });

      it('should fail validating an email with received token because token has been modified', async() => {
        const variables = { emailValidationToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMmY0MWQ5OWZkMTY1NDMxZGM5MGNlNyIsImVtYWlsIjoiYmVub2l0QHBheXNhbi5jaCIsImlhdCI6MTU0NjYwMDk0NywiZXhwIjoxNTQ3MjA1NzQzfQ.gD7vCV4KAQKnU0Mus9BOIlkA_OMzXQBa3822PNcZM_g' };
        const result = await graphql(schema, mutation, null, null, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('invalid signature');
        expect(result.data).to.be.null;
        snapshot(result);
      });

      it('should fail validating an email with received token because invalid token received', async() => {
        const variables = { emailValidationToken: 'eyJhbGciOiJIzI1NiIsIn5cCI6IkpXVCJ9.eyJpZCI6IjVjMmY0MWQ5OWZkMTY1NDMxZGM5MGlNyIsImVtYWlsIjoiYmVub2l0QHBheXNhbi5jaCIsImlhdCI6MTU0NjYwMDk0NywiZXhwIjoxNTQ3Mj1NzQzfQ.gD7vCVKAQKnU0Mus9BOIlkA_OMzXQBa3822PNcZM_g' };
        const result = await graphql(schema, mutation, null, null, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('invalid token');
        expect(result.data).to.be.null;
        snapshot(result);
      });

      it('should fail validating an email with received token because no token received', async() => {
        const variables = { emailValidationToken: '' };
        const result = await graphql(schema, mutation, null, null, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('jwt must be provided');
        expect(result.data).to.be.null;
        snapshot(result);
      });

      it('should fail validating an email with received token because token has expired', async() => {
        const variables = { emailValidationToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMmY0MWQ5OWZkMTY1NDMxZGM5MGNlNyIsImVtYWlsIjoiYmVub2l0QHBheXNhbi5jaCIsImlhdCI6MTU0NTMwNDk0NywiZXhwIjoxNTQ1OTA5NzQ3fQ.kUo15r_2B6czmiHyxpNFNYvFk73NMHwj_uzHYYAHDbo' };
        const result = await graphql(schema, mutation, null, null, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Your token is expired. Please ask for a new one.');
        expect(result.data).to.be.null;
        snapshot(result);
      });
    });

    // ----------------------askNewEmailToken(email:String!, password: String!)-------------------------------------- //
    describe('Testing askNewEmailToken(email:String!, password: String!)', () => {
      beforeEach(async() => {
        await clearAndPopulateDB();
      });

      const { mutation } = {
        mutation: `
          mutation ($email: String!, $password: String!){
            askNewEmailToken(email: $email, password: $password){
              token
            }
          }`
      };

      it('should return a new token for validate an email', async() => {
        // on demande un nouveu token de validation d'email
        let variables = { email: tabProducers[0].email, password: '1234abcd' };

        let result = await graphql(schema, mutation, null, {}, variables);
        const token1 = result.data.askNewEmailToken.token;

        // on demande un nouveu token de validation d'email
        variables = { email: tabProducers[0].email, password: '1234abcd' };

        setTimeout(async() => {
          result = await graphql(schema, mutation, null, {}, variables);
          const token2 = result.data.askNewEmailToken.token;
          expect(token1).not.to.be.equal(token2);
        }, 1000);
      });

      it('should fail returning a new token for validate an email because email already validated', async() => {
        // on vérifie que l'email du producteur ne soit pas encore validé
        const variableQuery = { id: tabProducers[0].id };
        const { query } = {
          query: `
            query($id: ID!) {
              producer(producerId: $id) {
                firstname
                lastname
                email
                image
                followingProducers {
                  totalCount
                  edges {
                    node {
                      firstname
                      lastname
                      email
                    }
                  }
                }
                emailValidated
                isAdmin
                followers {
                  totalCount
                  edges {
                    node {
                      firstname
                      lastname
                      email
                    }
                  }
                }
                phoneNumber
                description
                website
                salespoint {
                  name
                  address {
                    number
                    street
                    city
                    postalCode
                    state
                    country
                    longitude
                    latitude
                  }
                  schedule {
                    monday {
                      openingHour
                      closingHour
                    }
                    tuesday {
                      openingHour
                      closingHour
                    }
                    wednesday {
                      openingHour
                      closingHour
                    }
                    thursday {
                      openingHour
                      closingHour
                    }
                    friday {
                      openingHour
                      closingHour
                    }
                    saturday {
                      openingHour
                      closingHour
                    }
                    sunday {
                      openingHour
                      closingHour
                    }
                  }
                }
                isValidated
                products {
                  edges {
                    node {
                      description
                      productType {
                        name
                        image
                        category {
                          name
                          image
                        }
                        producers {
                          edges {
                            node {
                              firstname
                              lastname
                              email
                            }
                          }
                        }
                      }
                    }
                  }
                }
                rating {
                  nbRatings
                  grade
                }
              }
            }`
        };
        let result = await graphql(schema, query, null, null, variableQuery);

        expect(result.data.producer.emailValidated).to.be.false;

        // on demande un nouveu token de validation d'email
        let variables = { email: result.data.producer.email, password: '1234abcd' };
        result = await graphql(schema, mutation, null, {}, variables);
        const { token } = result.data.askNewEmailToken;

        const { mutation1 } = {
          mutation1: `
            mutation($emailValidationToken: String!) {
              validateAnEmailToken(emailValidationToken: $emailValidationToken){
                token
              }
            }`
        };
        // on valide l'email à l'aide de ce token
        variables = { emailValidationToken: token };
        result = await graphql(schema, mutation1, null, {}, variables);
        expect(result.data.validateAnEmailToken.token).to.be.not.null;

        // on récupère à nouveau le producteur dans la DB et on check que son email ait bien été validé
        result = await graphql(schema, query, null, null, variableQuery);
        expect(result.data.producer.emailValidated).to.be.true;

        // on tente de revalide l'email à l'aide du même token -> erreur car email déjà validé
        variables = { emailValidationToken: token };
        result = await graphql(schema, mutation1, null, {}, variables);
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Email already validated!');
        expect(result.data).to.be.null;
        snapshot(result);
      });

      it('should fail returning a new token for validate an email because unknown email received', async() => {
        // on demande un nouveu token de validation d'email
        const variables = { email: 'unknown@mail.com', password: '1234abcd' };

        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal(`There is no user corresponding to the email "${variables.email}"`);
        expect(result.data).to.be.null;
        snapshot(result);
      });

      it('should fail returning a new token for validate an email because incorrect password received', async() => {
        // on demande un nouveu token de validation d'email
        const variables = { email: tabProducers[0].email, password: 'wrongPassword' };

        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Received password is not correct!');
        expect(result.data).to.be.null;
        snapshot(result);
      });
    });

    // ----------------------login(email: String!, password:String!)-------------------------------------- //
    describe('Testing login(email: String!, password:String!)', () => {
      beforeEach(async() => {
        await clearAndPopulateDB();
      });

      const { mutation } = {
        mutation:
          `mutation ($email: String!, $password: String!){
            login(email: $email, password: $password){
              token
            }
          }`
      };

      it('should return a new token because login succeed', async() => {
        const variables = { email: tabProducers[0].email, password: '1234abcd' };
        const result = await graphql(schema, mutation, null, {}, variables);
        const { token } = result.data.login;

        expect(token).to.be.not.null;
      });

      it('should fail during login because unknown email received', async() => {
        // on demande un nouveu token de validation d'email
        const variables = { email: 'unknown@mail.com', password: '1234abcd' };

        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal(`There is no user corresponding to the email "${variables.email}"`);
        expect(result.data).to.be.null;
        snapshot(result);
      });

      it('should fail during login because incorrect password received', async() => {
        // on demande un nouveu token de validation d'email
        const variables = { email: tabProducers[0].email, password: 'wrongPassword' };

        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Received password is not correct!');
        expect(result.data).to.be.null;
        snapshot(result);
      });
    });

    // ----------------------signUpAsUser(newUser: UserInputAdd!)-------------------------------------- //
    describe('Testing signUpAsUser(newUser: UserInputAdd!)', () => {
      beforeEach(async() => {
        await clearAndPopulateDB();
      });

      const { mutation } = {
        mutation:
        `mutation($user: UserInputAdd!){
          signUpAsUser(newUser:$user){
            token
          }
        }`
      };

      it('should create a new user and return a token', async() => {
        const variables = {
          user: {
            firstname: 'benoit',
            lastname: 'schop',
            email: 'ben@schop.ch',
            password: 'abcd1234'
          }
        };
        let result = await graphql(schema, mutation, null, {}, variables);
        const { token } = result.data.signUpAsUser;

        expect(token).to.be.not.null;

        const context = { id: tabUsers[0].id, email: tabUsers[0].email, isAdmin: true, kind: tabUsers[0].kind };
        const { query } = {
          query: `
            query($id: ID!) {
              user(userId: $id) {
                firstname
                lastname
                email
                image
                followingProducers {
                  edges {
                    node {
                      firstname
                      lastname
                      email
                      emailValidated
                      phoneNumber
                      rating {
                        nbRatings
                        grade
                      }
                    }
                  }
                }
                emailValidated
                isAdmin
              }
            }`
        };
        const tokenContent = await jwt.decode(token);
        const variableQuery = { id: tokenContent.id };
        result = await graphql(schema, query, null, context, variableQuery);
        expect(result.data.user).to.be.not.null;
        snapshot(result);
      });

      it('should fail creating a new user and returning a token because missing mendatory information (firstname)', async() => {
        const variables = {
          user: {
            lastname: 'schop',
            email: 'ben@schop.ch',
            password: 'abcd1234'
          }
        };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.firstname of required type String! was not provided.');
        snapshot(result);
      });

      it('should fail creating a new user and returning a token because missing mendatory information (lastname)', async() => {
        const variables = {
          user: {
            firstname: 'benoit',
            email: 'ben@schop.ch',
            password: 'abcd1234'
          }
        };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.lastname of required type String! was not provided.');
        snapshot(result);
      });

      it('should fail creating a new user and returning a token because missing mendatory information (email)', async() => {
        const variables = {
          user: {
            firstname: 'benoit',
            lastname: 'schop',
            password: 'abcd1234'
          }
        };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.email of required type String! was not provided.');
        snapshot(result);
      });

      it('should fail creating a new user and returning a token because missing mendatory information (password)', async() => {
        const variables = {
          user: {
            firstname: 'benoit',
            lastname: 'schop',
            email: 'ben@schop.ch'
          }
        };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.password of required type String! was not provided.');
        snapshot(result);
      });
    });

    // ----------------------signUpAsProducer(newProducer: ProducerInputAdd!)-------------------------------------- //
    describe('Testing signUpAsProducer(newProducer: ProducerInputAdd!)', () => {
      beforeEach(async() => {
        await clearAndPopulateDB();
      });

      const { mutation } = {
        mutation: `
          mutation($producer: ProducerInputAdd!) {
             signUpAsProducer(newProducer: $producer) {
               token
             }
           }`
      };

      it('should create a new producer and return a token', async() => {
        const variables = {
          producer: {
            firstname: 'benoit',
            lastname: 'schop',
            email: 'ben@schop.ch',
            password: 'abcd1234'
          }
        };
        let result = await graphql(schema, mutation, null, {}, variables);
        const { token } = result.data.signUpAsProducer;

        expect(token).to.be.not.null;

        const { query } = {
          query: `
            query($id: ID!){
              producer(producerId: $id){
                firstname
                lastname
                email
                image
                followingProducers{
                  edges {
                    node {
                      id
                      firstname
                      lastname
                      email
                      image
                    }
                  }
                }
                emailValidated
                isAdmin
                followers{
                  edges{
                    node{
                      id
                      firstname
                      lastname
                      email
                      image
                    }
                  }
                }
                phoneNumber
                description
                website
                salespoint{
                  name
                  address{
                    number
                    street
                    city
                    postalCode
                    state
                    country
                    longitude
                    latitude
                  }
                  schedule{
                    monday{
                      openingHour
                      closingHour
                    }
                    tuesday{
                      openingHour
                      closingHour
                    }
                    wednesday{
                      openingHour
                      closingHour
                    }
                    thursday{
                      openingHour
                      closingHour
                    }
                    friday{
                      openingHour
                      closingHour
                    }
                    saturday{
                      openingHour
                      closingHour
                    }
                    sunday{
                      openingHour
                      closingHour
                    }
                  }
                }
                isValidated
                products{
                  edges{
                    node{
                      id
                      description
                      productType{
                        id
                        name
                        image
                      }
                    }
                  }
                }
                rating{
                  nbRatings
                  grade
                }
              }
            }`
        };
        const tokenContent = await jwt.decode(token);
        const variableQuery = { id: tokenContent.id };
        result = await graphql(schema, query, null, null, variableQuery);
        expect(result.data.producer).to.be.not.null;
        snapshot(result);
      });

      it('should fail creating a new producer and returning a token because missing mendatory information (firstname)', async() => {
        const variables = {
          producer: {
            lastname: 'schop',
            email: 'ben@schop.ch',
            password: 'abcd1234'
          }
        };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.firstname of required type String! was not provided.');
        snapshot(result);
      });

      it('should fail creating a new producer and returning a token because missing mendatory information (lastname)', async() => {
        const variables = {
          producer: {
            firstname: 'benoit',
            email: 'ben@schop.ch',
            password: 'abcd1234'
          }
        };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.lastname of required type String! was not provided.');
        snapshot(result);
      });

      it('should fail creating a new producer and returning a token because missing mendatory information (email)', async() => {
        const variables = {
          producer: {
            firstname: 'benoit',
            lastname: 'schop',
            password: 'abcd1234'
          }
        };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.email of required type String! was not provided.');
        snapshot(result);
      });

      it('should fail creating a new producer and returning a token because missing mendatory information (password)', async() => {
        const variables = {
          producer: {
            firstname: 'benoit',
            lastname: 'schop',
            email: 'ben@schop.ch'
          }
        };
        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Field value.password of required type String! was not provided.');
        snapshot(result);
      });
    });

    // ----------------------upgradeUserToProducer(idUserToUpgrade: ID!, password: String!)-------------------------------------- //
    describe('Testing upgradeUserToProducer(idUserToUpgrade: ID!, password: String!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabUsers[0].id, email: tabUsers[0].email, isAdmin: true, kind: tabUsers[0].kind };
      });

      const { mutation } = {
        mutation:
          `mutation($idUser: ID!, $password: String!) {
            upgradeUserToProducer(idUserToUpgrade: $idUser, password: $password) {
              producer {
                firstname
                lastname
                email
                image
                followingProducers {
                  edges {
                    node {
                      firstname
                      lastname
                      email
                    }
                  }
                }
                emailValidated
                isAdmin
                followers {
                  edges {
                    node {
                      firstname
                      lastname
                      email
                    }
                  }
                }
                phoneNumber
                description
                website
                salespoint {
                  name
                  address {
                    number
                    street
                    city
                    postalCode
                    state
                    country
                    longitude
                    latitude
                  }
                  schedule {
                    monday {
                      openingHour
                      closingHour
                    }
                    tuesday {
                      openingHour
                      closingHour
                    }
                    wednesday {
                      openingHour
                      closingHour
                    }
                    thursday {
                      openingHour
                      closingHour
                    }
                    friday {
                      openingHour
                      closingHour
                    }
                    saturday {
                      openingHour
                      closingHour
                    }
                    sunday {
                      openingHour
                      closingHour
                    }
                  }
                }
                isValidated
                products {
                  edges {
                    node {
                      description
                      productType {
                        name
                        image
                        category {
                          name
                          image
                        }
                        producers {
                          edges {
                            node {
                              firstname
                              lastname
                              email
                            }
                          }
                        }
                      }
                    }
                  }
                }
                rating {
                  nbRatings
                  grade
                }
              }
              newLoginToken {
                token
              }
            }
          }`
      };

      it('should create a new producer and return a new token', async() => {
        const variables = {
          idUser: tabUsers[0].id,
          password: '1234abcd'
        };
        let result = await graphql(schema, mutation, null, context, variables);

        expect(result.data.upgradeUserToProducer.producer).to.be.not.null;
        expect(result.data.upgradeUserToProducer.newLoginToken).to.be.not.null;

        const { query: queryProducer } = {
          query: `
            query($id: ID!){
              producer(producerId: $id){
                firstname
                lastname
                email
                image
                followingProducers{
                  edges {
                    node {
                      id
                      firstname
                      lastname
                      email
                      image
                    }
                  }
                }
                emailValidated
                isAdmin
                followers{
                  edges{
                    node{
                      id
                      firstname
                      lastname
                      email
                      image
                    }
                  }
                }
                phoneNumber
                description
                website
                salespoint{
                  name
                  address{
                    number
                    street
                    city
                    postalCode
                    state
                    country
                    longitude
                    latitude
                  }
                  schedule{
                    monday{
                      openingHour
                      closingHour
                    }
                    tuesday{
                      openingHour
                      closingHour
                    }
                    wednesday{
                      openingHour
                      closingHour
                    }
                    thursday{
                      openingHour
                      closingHour
                    }
                    friday{
                      openingHour
                      closingHour
                    }
                    saturday{
                      openingHour
                      closingHour
                    }
                    sunday{
                      openingHour
                      closingHour
                    }
                  }
                }
                isValidated
                products{
                  edges{
                    node{
                      id
                      description
                      productType{
                        id
                        name
                        image
                      }
                    }
                  }
                }
                rating{
                  nbRatings
                  grade
                }
              }
            }`
        };
        const tokenContent = await jwt.decode(result.data.upgradeUserToProducer.newLoginToken.token);

        const variableQuery = { id: tokenContent.id };
        result = await graphql(schema, queryProducer, null, null, variableQuery);
        expect(result.data.producer).to.be.not.null;

        const { query: queryUser } = {
          query: `
query($id: ID!) {
  user(userId: $id) {
    firstname
    lastname
    email
    image
    followingProducers {
      edges {
        node {
          id
          firstname
          lastname
          email
          image
          phoneNumber
          rating {
            nbRatings
            grade
          }
        }
      }
    }
    emailValidated
    isAdmin
  }
}`
        };
        result = await graphql(schema, queryUser, null, context, variableQuery);
        expect(result.data.user).to.be.null;
      });

      it('should fail creating a new producer and returning a new token because wrong password', async() => {
        const variables = {
          idUser: tabUsers[0].id,
          password: 'wrongPassword'
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Received password is not correct!');
        expect(result.data).to.be.null;
        snapshot(result);
      });
      it('should fail creating a new producer and returning a new token because unknown idUser received', async() => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = {
          idUser: context.id,
          password: '1234abcd'
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('The received idUserToUpgrade is not in the database!');
        expect(result.data).to.be.null;
        snapshot(result);
      });

      it('should fail creating a new producer and returning a new token because idUser received (too short)', async() => {
        context.id = 'abcdef';
        const variables = {
          idUser: context.id,
          password: '1234abcd'
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdef" at path "_id" for model "users"');
        expect(result.data).to.be.null;
        snapshot(result);
      });

      it('should fail creating a new producer and returning a new token because invalid idUser received (too long)', async() => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = {
          idUser: context.id,
          password: '1234abcd'
        };
        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.equal('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "users"');
        expect(result.data).to.be.null;
        snapshot(result);
      });

      it('should fail adding a new productType because not authenticated', async() => {
        const variables = {
          idUser: tabUsers[0].id,
          password: '1234abcd'
        };

        const result = await graphql(schema, mutation, null, {}, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('Sorry, you need to be authenticated to do that.');
        snapshot(result);
      });

      it('should fail adding a new productType because not authenticated as yourself', async() => {
        const variables = {
          idUser: tabUsers[1].id,
          password: '1234abcd'
        };

        const result = await graphql(schema, mutation, null, context, variables);

        expect(result.errors).to.be.not.null;
        expect(result.errors.length).to.be.equal(1);
        expect(result.errors[0].message).to.be.contains('You can\'t modify information of another user than yourself!');
        snapshot(result);
      });
    });
  });
});
