const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId();
const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const user = async userId => {
    try {
        let user = await User.findById(userId);
        return { ...user, createdEvents: await events(user.createdEvents) }

    }
    catch (error) {
        throw error;
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        events.map(event => {
            // console.log(event)
            return {
                ...event._doc,
                date: new Date(event.date).toISOString(),
                // creator: user(event.creator)
            }
        });
        console.log(events)
        return events;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                console.log(event._doc)
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event.date).toISOString(),
                    creator: user.bind(this, event.creator)
                };
            });
        } catch (error) {
            throw error;
        }
    },
    createEvent: async (args) => {
        try {

            let createdEvent;
            const event = await Event.create({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(),
                creator: '5c6e0de8662a970cac6b4565'
            });
            let creator = await user(event.creator);
            createdEvent = {
                ...event._doc,
                date: new Date(event.date).toISOString(),
                creator: creator._doc,

            };
            // console.log(await user(event.creator)   )
            const newuser = await User.findById('5c6e0de8662a970cac6b4565');
            if (!newuser) {
                throw new Error('User not exists')
            }
            newuser.createdEvents.push(event);
            await newuser.save();
            // console.log(createdEvent, 70)
            return { ...createdEvent }
        } catch (error) {
            console.log(error)
            throw error;
        }
    },

    createUser: async (args) => {
        try {

            const user = await User.findOne({ email: args.userInput.email })
            if (user) {
                throw new Error('User exists already!')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const newuser = await User.create({
                email: args.userInput.email,
                password: hashedPassword,
            })
            return { ...newuser._doc, password: null, _id: newuser.id };

        } catch (error) {
            throw error

        }

    }
}

