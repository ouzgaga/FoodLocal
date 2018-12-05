const UsersModel = require('../models/user.modelgql');
const ProducersModel = require('../models/producers.modelgql');

const isEmailUnused = async(emailUser) => {
  const existingUser = await UsersModel.findOne({ email: emailUser });
  const existingProducer = await ProducersModel.findOne({ email: emailUser });

  return existingUser === null && existingProducer === null;
};

module.exports = {
  isEmailUnused
};
