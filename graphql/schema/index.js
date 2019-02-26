const { buildSchema } = require('graphql');

module.exports = buildSchema(`

        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }
        type Booking {
            _id: ID!
            event: Event!
            user: User!
            createdAt: String!
            updatedAt: String!
        }

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
        }

        type User {
            _id: ID,
            email: String!,
            password: String,
            createdEvents: [Event!]
        }

        input UserInput {
            email: String!,
            password: String!
        }
        type RootQuery {
            events: [Event!]!
            bookings: [Booking!]!
            login(email: String!, password: String!): AuthData!
        }
        input  InputEvent {
            title: String!
            description: String!
            price: Float!
        }
        type RootMutation {
            createEvent(eventInput: InputEvent): Event
            createUser(userInput: UserInput): User
            bookEvent(eventId: ID!): Booking!
            cancelBooking(bookingId: ID!): Event!
        }
        schema {
            query: RootQuery, 
            mutation: RootMutation,
        }
    `);