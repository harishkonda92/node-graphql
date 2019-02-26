const Booking = require('../../models/bookings');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {

    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unathorised');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                // console.log(booking._doc.user)
                return transformBooking(booking);

            })
        } catch (error) {
            throw error;
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

