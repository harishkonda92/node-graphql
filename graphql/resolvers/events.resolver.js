const { dateToString } = require('../../helpers/date');
const Event = require('../../models/event');
const { user } = require('./merge');
const User = require('../../models/user');
const {transformEvent} = require('./merge');
module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(async event => {
                console.log(await transformEvent(event))
                return await transformEvent(event);
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
                creator: '5c7424d4d48dd012e81662dc'
            });
            let creator = await user(event.creator);
            createdEvent = await transformEvent(event);
            // console.log(await user(event.creator)   )
            const newuser = await User.findById('5c7424d4d48dd012e81662dc');
            if (!newuser) {
                throw new Error('User not exists')
            }
            newuser.createdEvents.push(event);
            await newuser.save();
            console.log(createdEvent, 70)
            return { ...createdEvent }
        } catch (error) {
            console.log(error)
            throw error;
        }
    },
}

