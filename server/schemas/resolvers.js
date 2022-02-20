const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
                return userData;
            }
            throw new AuthenticationError('Cannot find a user with this id!');
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {user, token};
        },

        login: async (parent, {email,password}) =>{
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect info');
            }
            const checkPw = await user.isCorrectPassword(password);
            if (!checkPw) {
                throw new AuthenticationError('Incorrect info');
            }
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, {bookData}, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                  { _id: context.user._id },
                  { $push: { savedBooks: bookData } },
                  { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('Not logged in!');
        },

        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                  { _id: context.user._id },
                  { $pull: { savedBooks: {bookId} } },
                  { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('Not logged in!');
        }
    }
}

module.exports = resolvers;
