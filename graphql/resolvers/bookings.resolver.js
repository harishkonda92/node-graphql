const Booking = require('../../models/bookings');
const { transformBooking, transformEvent, user, singleEvent } = require('./merge');
const Event = require('../../models/event');

module.exports = {

    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unathorised');
        }
        try {
            const bookings = await Booking.find({ user: req.userId });
            return bookings.map(booking => {
                // console.log(booking._doc.user)
                return transformBooking(booking);

            })
        } catch (error) {
            throw error;
        }
    },
    bookEvent: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Unathorised');
            }
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const bookEvent = new Booking({
                user: req.userId,
                event: fetchedEvent
            });
            // console.log(fetchedEvent);s
            const result = await bookEvent.save();
            return {
                ...result._doc,
                user: user.bind(this, bookEvent._doc.user),
                event: singleEvent(bookEvent._doc.event),
                createdAt: new Date(result.createdAt).toISOString(),
                updatedAt: new Date(result.updatedAt).toISOString()
            }
        } catch (error) {
            throw error
        }
    },

    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unathorised');
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            // console.log(booking,166)
            const event = await transformEvent(booking.event)
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

