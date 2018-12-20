const queryObjAllProducers = {
  query: `
    query{
      producers{
        firstname
        lastname
        email
        image
        emailValidated
        phoneNumber
        description
        website
        isValidated
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
        followers{
          firstname
          lastname
          email
        }
        products{
          description
          productType{
            name
            image
            category{
              name
              image
            }
          }
        }
        salespoint{
          name
          address{
            number
            street
            city
            postalCode
            country
            longitude
            latitude
          }
          schedule {
            monday {
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
      }
    }
  `,
  variables: {},
  context: {},
};

const queryObjProducerById = {
  query: `
          query($id: ID!){
            producer(producerId: $id){
              firstname
              lastname
              email
              image
              emailValidated
              phoneNumber
              description
              website
              isValidated
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
              followers{
                firstname
                lastname
                email
              }
              products{
                description
                productType{
                  name
                  image
                  category{
                    name
                    image
                  }
                }
              }
              salespoint{
                name
                address{
                  number
                  street
                  city
                  postalCode
                  country
                  longitude
                  latitude
                }
                schedule {
                  monday {
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
            }
          }`,
  variables: {},
  context: {},
};

const queryObjGetProducersWaitingForValidation = {
  query: `
    query{
      producersWaitingForValidation{
        firstname
        lastname
        email
        password
        image
        emailValidated
        phoneNumber
        description
        website
        isValidated
        products{
          description
          productType{
            name
            image
            category{
              name
              image
            }
          }
        }
        salespoint{
          name
          address{
            number
            street
            city
            postalCode
            country
            longitude
            latitude
          }
          schedule {
            monday {
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
      }
    }`,
  variables: {},
  context: {},
};

const queryObjGetFilterProducers = {
  query: `
    query($id: [ID!]){
      filterProducers(byProductTypeIds: $id){
        firstname
        lastname
        email
        password
        image
        emailValidated
        phoneNumber
        description
        website
        isValidated
        products{
          description
          productType{
            name
            image
            category{
              name
              image
            }
          }
        }
        salespoint{
          name
          address{
            number
            street
            city
            postalCode
            country
            longitude
            latitude
          }
          schedule {
            monday {
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
      }
    }`,
  variables: {},
  context: {},
};

const mutationValidateProducer = {
  mutation: `
    mutation($producerId: ID!, $state: Boolean!){
      validateAProducer(producerId: $producerId, validationState: $state){
        firstname
        lastname
        email
        image
        emailValidated
        phoneNumber
        description
        website
        isValidated
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
        followers{
          firstname
          lastname
          email
        }
        products{
          description
          productType{
            name
            image
            category{
              name
              image
            }
          }
        }
        salespoint{
          name
          address{
            number
            street
            city
            postalCode
            country
            longitude
            latitude
          }
          schedule {
            monday {
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
      }
    }`,
  variables: {},
  context: {},
};

const mutationAddProducer = {
  mutation: `
    mutation($producer: ProducerInputAdd!){
      addProducer(producer: $producer){
        firstname
        lastname
        email
        image
        emailValidated
        phoneNumber
        description
        website
        isValidated
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
        followers{
          firstname
          lastname
          email
        }
        products{
          description
          productType{
            name
            image
            category{
              name
              image
            }
          }
        }
        salespoint{
          name
          address{
            number
            street
            city
            postalCode
            country
            longitude
            latitude
          }
          schedule {
            monday {
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
      }
    }`,
  variables: {},
  context: {},
};

const mutationUpdateProducer = {
  mutation: `
    mutation($producer: ProducerInputUpdate!){
      updateProducer(producer: $producer){
        firstname
        lastname
        email
        image
        emailValidated
        phoneNumber
        description
        website
        isValidated
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
        followers{
          firstname
          lastname
          email
        }
        products{
          description
          productType{
            name
            image
            category{
              name
              image
            }
          }
        }
        salespoint{
          name
          address{
            number
            street
            city
            postalCode
            country
            longitude
            latitude
          }
          schedule {
            monday {
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
      }
    }`,
  variables: {},
  context: {},
};

const mutationDeleteProducer = {
  mutation: `
    mutation($id: ID!){
      deleteProducer(producerId: $id){
        firstname
        lastname
        email
        image
        emailValidated
        phoneNumber
        description
        website
        isValidated
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
        followers{
          firstname
          lastname
          email
        }
        products{
          description
          productType{
            name
            image
            category{
              name
              image
            }
          }
        }
        salespoint{
          name
          address{
            number
            street
            city
            postalCode
            country
            longitude
            latitude
          }
          schedule {
            monday {
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
      }
    }`,
  variables: {},
  context: {},
};

module.exports = {
  queryObjAllProducers,
  queryObjProducerById,
  queryObjGetProducersWaitingForValidation,
  queryObjGetFilterProducers,
  mutationValidateProducer,
  mutationAddProducer,
  mutationUpdateProducer,
  mutationDeleteProducer
};
