/** SUCCESS GETTING ALL PRODUCERS **/
const queryObjAllProducers = {
  query: `
          query{
            producers{
              firstname
              lastname
            }
          }
        `,
  variables: {},
  context: {},
  expected: {
    data: {
      producers: [
        {
          firstname: 'Benoît',
          lastname: 'Schopfer'
        },
        {
          firstname: 'Antoine',
          lastname: 'Rochat'
        },

      ]
    }
  }
};

/** SUCESS - GETTING PRODUCER WITH A CORRECT ID **/
const queryObjProducerWithCorrectId = {
  query: `
          query($id: ID!){
            producer(producerId: $id){
              id
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
                id
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
              salesPoint{
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
  expected: {
    data: {
      producer: {
        firstname: 'Benoît',
        lastname: 'Schopfer',
        email: 'benoit.schopfer5@heig-vd.ch',
        password: '1234abcd',
        image: 'Ceci est une image encodée en base64!',
        emailValidated: false,
        phoneNumber: '0761435196',
        description: 'Un chouet gaillard!',
        website: 'benoitschopfer.ch',
        isValidated: false,
        products: [
          {
            description: 'Une pomme moins bonne que celle d\'antoine!',
            productType: {
              name: 'Pomme',
              image: 'ceci est une image de pomme encodée en base64!',
              category: {
                name: 'Fruits',
                image: 'ceci est une image de fruits encodée en base64!'
              }
            }
          },
          {
            description: 'Une poire bof bof!',
            productType: {
              name: 'Poire',
              image: 'ceci est une image de poire encodée en base64!',
              category: {
                name: 'Fruits',
                image: 'ceci est une image de fruits encodée en base64!'
              }
            }
          }
        ],
        salesPoint: {
          name: 'Chez moi',
          address: {
            number: 6,
            street: 'Chemin de par ici',
            city: 'Yverdon',
            postalCode: '1400',
            country: 'Suisse',
            longitude: 1.1234567,
            latitude: 1.123456789
          },
          schedule: {
            monday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              },
              {
                openingHour: '13:00',
                closingHour: '18:00'
              }
            ],
            tuesday: [],
            wednesday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ],
            thursday: [],
            friday: [
              {
                openingHour: '08:00',
                closingHour: '12:00'
              }
            ],
            saturday: [],
            sunday: []
          }
        }
      }
    }
  }
};

module.exports = { queryObjAllProducers, queryObjProducerWithCorrectId };
