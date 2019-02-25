const authResolver = require('./auth');
const eventResolver = require('./events.resolver');
const bookingResolver = require('./bookings.resolver');

const rootResolver = {
    ...authResolver,
    ...eventResolver,
    ...bookingResolver
}

module.exports = rootResolver;