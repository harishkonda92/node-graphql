const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const { dateToString } = require('../../helpers/date');
const { user } = require('./merge');

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
module.exports = {
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
}

