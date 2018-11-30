const { gql } = require('apollo-server-express');

const typeDefs = gql`
    enum UserType{
        USER
        PRODUCER
    }

    interface Person {
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
        password: String!
        image: String # faudra l'encoder en base64
        subscriptions:[Producer!]!
        emailValidated: Boolean!
    }

    type User implements Person {
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
        password: String!
        image: String # faudra l'encoder en base64
        subscriptions:[Producer!]!
        emailValidated: Boolean!
    }

    input UserInput {
        firstname: String!
        lastname: String!
        email: String!
        password: String!
        image: String
    }

    type Producer implements Person {
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
        password: String!
        image: String # faudra l'encoder en base64
        subscriptions:[Producer!]!
        emailValidated: Boolean!
        subscribedUsers : [User!]!
        phoneNumber: String
        description: String
        website: String
        salesPoint: SalesPoint!
        isValidated: Boolean!
        Products: [Product!]!
    }

    input ProducerInputAdd {
        firstname: String!
        lastname: String!
        email: String!
        password: String!
        image: String
        phoneNumber: String
        description: String
        website: String
        salesPoint: SalesPointInput!
        Products: [ProductInput!]
    }

    input ProducerInputUpdate {
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
        password: String!
        image: String # faudra l'encoder en base64
        subscriptions:[ProducerInputUpdate!]!
        emailValidated: Boolean!
        subscribedUsers : [UserInput!]!
        phoneNumber: String
        description: String
        website: String
        salesPoint: SalesPointInput!
        isValidated: Boolean!
        Products: [ProductInput!]!
    }

    type Product {
        id: ID!
        description: String
        productType: ProductType!
    }

    input ProductInput {
        description: String
        productType: ProductTypeInput!
    }

    type ProductType {
        id: ID!
        name: String!
        image: String # faudra l'encoder en base64
    }

    input ProductTypeInput {
        name: String!
        image: String
    }

    type Address {
        number: Int
        street: String!
        city: String!
        postalCode: String!
        country: String!
        longitude: Float!
        latitude: Float!
    }

    input AddressInput {
        number: Int
        street: String!
        city: String!
        postalCode: String!
        country: String!
        longitude: Float!
        latitude: Float!
    }

    enum WeekDays{
        MONDAY
        TUESDAY
        WEDNESDAY
        THURSDAY
        FRIDAY
        SATURSDAY
        SUNDAY
    }

    type DailySchedule {
        weekDay: WeekDays!
        openingHourAM: String!
        closingHourAM: String
        openingHourPM: String
        closingHourPM: String!
    }

    input DailyScheduleInput {
        weekDay: WeekDays!
        openingHourAM: String!
        closingHourAM: String
        openingHourPM: String
        closingHourPM: String!
    }

    type SalesPoint {
        id: ID!
        name: String!
        address: Address
        schedule: [DailySchedule!]
    }

    input SalesPointInput {
        name: String!
        address: AddressInput
        schedule: [DailyScheduleInput!]
    }

    type Query {
        producers: [Producer!]!
        producer(id: ID!) : Producer
    }


    type Mutation {
        addProducer(producer: ProducerInputAdd!): Producer!
        updateProducerInfos(producer: ProducerInputUpdate!): Producer
        #deleteProducer(producer: Producer!): Producer
    }
`;

module.exports = typeDefs;
