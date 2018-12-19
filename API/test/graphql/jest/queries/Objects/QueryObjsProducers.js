/** SUCCESS GETTING ALL PRODUCERS */
const queryObjAllProducers = {
  query: `
    query{
      producers{
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
    }
  `,
  variables: {},
  context: {},
};

/** SUCESS - GETTING PRODUCER WITH A CORRECT ID */
const queryObjProducerWithCorrectId = {
  query: `
          query($id: ID!){
            producer(producerId: $id){
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

const queryObjProducerWithWrongId = {
  query: `
          query($id: ID!){
            producer(producerId: $id){
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
  variables: { /* To add in test */ },
  context: {}
};

module.exports = { queryObjAllProducers, queryObjProducerWithCorrectId, queryObjProducerWithWrongId };
