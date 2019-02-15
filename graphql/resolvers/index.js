const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId();
const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return user;
    }
    catch (error) {
        throw error;
    }
}

const events = async eventIds => {
    try {
        const events = Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return { ...event, date: new Date(event.date).toISOString() }
        })
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

            console.log(args);
            let createdEvent;
            const event =  await Event.create({
                // _id: Math.random().ceil.toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(),
                creator: '5c61aef959a1103dc8d0bc98'
            });
            createdEvent = { ...event._doc, date: new Date(event.date).toISOString() };
            const user = await User.findById('5c61aef959a1103dc8d0bc98');
            console.log(user, 66)
            if (!user) {
                throw new Error('User not exists')
            }
            user.createdEvents.push(event).save();
            return { ...createdEvent }
        } catch (error) {
            throw error;
        }
    },

    createUser: async (args) => {
        try {

            const user = User.findOne({ email: args.userInput.email })
            if (user) {
                throw new Error('User exists already!')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const newuser = new User({
                email: args.userInput.email,
                password: hashedPassword,
            }).save()

            return { ...newuser._doc, password: null, _id: newuser.id };

        } catch (error) {
            throw error

        }

    }
}

