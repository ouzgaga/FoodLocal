const queryObjAllUsers = {
  query: `
    query{
      users{
        firstname
        lastname
        email
        image
        emailValidated
        followingProducers{
          firstname
          lastname
          email
          password
          image
          emailValidated
          phoneNumber
          rating {
            nbRatings
            rating
          }
        }
      }
    }
  `,
  variables: {},
  context: {},
};

const queryObjUserById = {
  query: `
    query($id: ID!){
      user(userId: $id){
        firstname
        lastname
        email
        image
        emailValidated
        followingProducers{
          firstname
          lastname
          email
          password
          image
          emailValidated
          phoneNumber
          rating {
            nbRatings
            rating
          }
        }
      }
    }
  `,
  variables: {},
  context: {},
};
module.exports = {
  queryObjAllUsers,
  queryObjUserById
};
