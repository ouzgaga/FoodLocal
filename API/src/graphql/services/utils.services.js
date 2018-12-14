const mongoose = require('mongoose');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const ProducersModel = require('../models/producers.modelgql');
const PersonsModel = require('../models/persons.modelgql');
const UsersModel = require('../models/users.modelgql');
const config = require('../../config/config');

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  (email, password, done) => {
    const user = PersonsModel.find(
      {
        email,
        password
      }
    );
    if (user != null) {
      return done(null, user);
    }
    return done(null, false);
  }
));

passport.use(new JWTStrategy(
  {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  },
  (jwtPayload, done) => {
    const { userId } = jwtPayload;
    const userInDB = UsersModel.findById(userId);
    if (userInDB != null) { // l'utilisateur existe dans la DB
      return done(null, userInDB);
    } else { // l'utilisateur n'existe pas dans la DB
      return done(null, false);
    }
  }
));


const isEmailUnused = async(emailUser) => {
  const existingUser = await UsersModel.findOne({ email: emailUser });
  const existingProducer = await ProducersModel.findOne({ email: emailUser });

  return existingUser === null && existingProducer === null;
};

const castIdInObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`The received id (${id}) is invalid!`);
  } else if (id.constructor !== mongoose.Types.ObjectId) { // on a un id valide qui n'est pas de type ObjectId --> on le cast
    return mongoose.Types.ObjectId(id);
  } else { // on a un id valide qui est déjà de type ObjectId --> on le retourne sans le caster
    return id;
  }
};

const castTabOfIdsInTabOfObjectIds = tabOfIds => tabOfIds.map(id => castIdInObjectId(id));

// FIXME comment ça marche avec graphql...?
const login = (email, password) => {
  const res = passport.authenticate('local', { session: false });
  console.log(res);
};

module.exports = {
  isEmailUnused,
  castIdInObjectId,
  castTabOfIdsInTabOfObjectIds,
  login
};
