const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const app = express();
const { buildSchema } = require('graphql')
app.use(bodyParser.json());
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId();

const Event = require('./models/event');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const user = userId => {
    return User.findById(userId)
        .then(result => {
            return result;
        })
        .catch(err => {
            throw err;
        })
}
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

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
        }
        input  InputEvent {
            title: String!
            description: String!
            price: Float!
        }
        type RootMutation {
            createEvent(eventInput: InputEvent): Event
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery, 
            mutation: RootMutation,
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        console.log(event._doc)
                        return {
                            ...event._doc,
                            _id: event.id,
                            creator: user.bind(this, event.creator)
                        };
                    });
                });

        },
        createEvent: (args) => {
            console.log(args);
            let createdEvent;
            const event = new Event({
                // _id: Math.random().ceil.toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(),
                creator: '5c61aef959a1103dc8d0bc98'
            });
            return event
                .save()
                .then(
                    data => {
                        createdEvent = { ...data._doc };
                        return User.findById('5c61aef959a1103dc8d0bc98');
                        console.log(data)
                        // return { ...data._doc }
                    }
                ).then(
                    user => {
                        if (!user) {
                            throw new Error('User not exists')
                        }
                        user.createdEvents.push(event);
                        return user.save();
                    })
                .then(result => {
                    return { ...createdEvent }
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },

        createUser: (args) => {
            return User.findOne({ email: args.userInput.email })
                .then((user) => {
                    if (user) {
                        throw new Error('User exists already!')
                    }
                    return bcrypt.hash(args.userInput.password, 12)
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword,
                    });
                    return user
                        .save()
                })
                .then(result => {
                    return { ...result._doc, password: null, _id: result.id };
                })
                .catch(err => {
                    throw err
                });
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb://harish_gql:harish123@ds139534.mlab.com:39534/utilities`, { useNewUrlParser: true })
    .then(() => {
        app.listen(3000, () => {
            console.log('im listening on 3000')
        });
    }).catch(error => {
        // console.log(`mongodb://${process.env.MONGO_USER}:${process.env.PWD}@ds139534.mlab.com:39534/utilities`)
        console.log(error)
    });
