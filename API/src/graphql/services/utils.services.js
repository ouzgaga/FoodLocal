const PersonsModel = require('../models/persons.modelgql');

const isEmailUnused = async(emailUser) => {
  const existingPerson = await PersonsModel.findOne({ email: emailUser });
  return existingPerson === null;
};

module.exports = {
  isEmailUnused
};
