const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const app = express();
const { buildSchema } = require('graphql')
app.use(bodyParser.json());

const events = []
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }
        input  InputEvent {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        type RootMutation {
            createEvent(eventINput: InputEvent): Event
        }
        schema {
            query: RootQuery, 
            mutation: RootMutation,
        }
    `),
    rootValue: {
        events: () => {
            return ['travelling, riding, cooking'];
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.title,
                description: args.description,
                price: +args.price,
                date: new Date().toISOString()
            };
            events.push(event);
            return events;
        }
    },
    graphiql: true
}))

app.listen(3000);