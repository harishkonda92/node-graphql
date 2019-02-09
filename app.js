const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const app = express();
const { buildSchema } = require('graphql')
app.use(bodyParser.json());
const mongoose = require('mongoose');



const Event = require('./models/event');

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
            createEvent(eventInput: InputEvent): Event
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
            const event = new Event({
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event.save().then(
                data => {
                    console.log(data)
                    return {...data._doc}
                }
            ).catch(err => {
                console.log(err);
                throw err;
            });
            return;
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb://harish_gql:harish123@ds139534.mlab.com:39534/utilities`, { useNewUrlParser: true })
    .then(() => {
        app.listen(30001);
    }).catch(error => {
        // console.log(`mongodb://${process.env.MONGO_USER}:${process.env.PWD}@ds139534.mlab.com:39534/utilities`)
        console.log(error)
    });
