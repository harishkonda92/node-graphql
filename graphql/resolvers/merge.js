const User = require('../../models/user');
const Event = require('../../models/event')
const { dateToString } = require('../../helpers/date');
const dataLoader = require('dataloader');
const eventLoader = new dataLoader((eventIds) => {
    return events(eventIds);
});

const userLoader = new dataLoader(userIds => {
    return User.find({ _id: { $in: userIds } });
})
const user = async userId => {
    try {
        console.log(userId)
        // let user = await User.findById(userId);
        let user = await userLoader.load(userId.toString());
        // console.log(user, 10)
        return {
            ...user._doc,
            // createdEvents: await events(user.createdEvents)
            createdEvents: eventLoader.loadMany.bind(this, (user._doc.createdEvents))
        }

    }
    catch (error) {
        throw error;
    }
}

const events = async eventIds => {
    try {
        let events = await Event.find({ _id: { $in: eventIds } })
        events = events.map(async event => {
            // console.log(event)
            return await transformEvent(event)
        });
        // console.log(events)
        return events;
    } catch (error) {
        throw error;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString())
        // console.log(event, 40)
        // return await transformEvent(event);
        return event
    } catch (error) {
        // console.log(error)
        throw error;
    }
}

const transformEvent = async event => {
    // console.log(event.creator, 55)
    const creator = await user(event.creator);
    // const creator = await userLoader.loadMany.bind(this, event.creator);

    return new Promise(async (resolve, reject) => {
        resolve({
            ...event._doc,
            date: dateToString(event.date),
            creator: creator
        })
    })
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt),
    }
}

exports.user = user;
exports.singleEvent = singleEvent;
exports.events = events;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
