const User = require('../../models/user');
const Event = require('../../models/event')
const { dateToString } = require('../../helpers/date');

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
        const event = await Event.findById(eventId)
        // console.log(event, 40)
        return await transformEvent(event)
    } catch (error) {
        // console.log(error)
        throw error;
    }
}

const transformEvent = async event => {

    const creator = await user(event.creator);
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
        user: user(booking._doc.user),
        event: singleEvent(booking._doc.event),
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt),
    }
}

// exports.user = user;
exports.singleEvent = singleEvent;
// exports.events = events;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
