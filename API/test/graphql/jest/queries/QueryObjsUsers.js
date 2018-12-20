const queryObjAllUsers = {
  query: `
  query {
    users {
      firstname
      lastname
      email
      image
      followingProducers {
        firstname
        lastname
        email
        image
        emailValidated
        phoneNumber
        rating {
          nbRatings
          rating
        }
      }
      emailValidated
      isAdmin
    }
  }`,
  variables: {},
  context: {},
};

const queryObjUserById = {
  query: `
    query ($id: ID!){
      user(userId: $id) {
        firstname
        lastname
        email
        image
        followingProducers {
          firstname
          lastname
          email
          image
          emailValidated
          phoneNumber
          rating {
            nbRatings
            rating
          }
        }
        emailValidated
        isAdmin
      }
    }`,
  variables: {},
  context: {},
};
module.exports = {
  queryObjAllUsers,
  queryObjUserById
};
