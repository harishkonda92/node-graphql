const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId();
const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const Booking = require('../../models/bookings');
const user = async userId => {
    try {
        let user = await User.findById(userId);
        // console.log(user, 10)
        return { ...user._doc, createdEvents: await events(user.createdEvents) }

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
        // console.log(events)
        return events;
    } catch (error) {
        throw error;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId)
        // console.log(event, 40)
        return {
            ...event._doc,
            _id: event.id,
            creator: user(event.creator)
        }
    } catch (error) {
        // console.log(error)
        throw error;
    }
}
module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                // console.log(event.creator)
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event.date).toISOString(),
                    creator: user(event.creator)
                };
            });
        } catch (error) {
            throw error;
        }
    },

    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                // console.log(booking._doc.user)
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user(booking._doc.user),
                    event: singleEvent(booking._doc.event),
                    createdAt: new Date(booking.createdAt).toISOString(),
                    updatedAt: new Date(booking.updatedAt).toISOString(),
                }
            })
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
                creator: '5c7026540892ee237084825e'
            });
            let creator = await user(event.creator);
            createdEvent = {
                ...event._doc,
                date: new Date(event.date).toISOString(),
                creator: creator._doc,

            };
            // console.log(await user(event.creator)   )
            const newuser = await User.findById('5c7026540892ee237084825e');
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
    },

    bookEvent: async (args) => {
        try {


            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const bookEvent = new Booking({
                user: '5c7026540892ee237084825e',
                event: fetchedEvent
            });
            // console.log(fetchedEvent);s
            const result = await bookEvent.save();
            return {
                ...result._doc,
                user: user(bookEvent._doc.user),
                event: singleEvent(bookEvent._doc.event),
                createdAt: new Date(result.createdAt).toISOString(),
                updatedAt: new Date(result.updatedAt).toISOString()
            }
        } catch (error) {
            throw error
        }
    },

    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            // console.log(booking,166)
            const event = {
                ...booking.event._doc, _id: booking.event_id,
                creator: await user(booking.event._doc.creator)
            }
            // console.log(event, 171)  
            await Booking.deleteOne({
                _id: args.bookingId
            });
            // console.log(await user(booking.event.creator), 171);
            return event;
        } catch (error) {
            throw error;
        }
    }
}

