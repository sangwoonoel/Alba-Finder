import { User } from '../../models/user';

export const userResolvers = {
  Mutation: {
    createUser: async (_: any, { userInput }: { userInput: any }) => {
      const newUser = new User(userInput);
      return await newUser.save();
    },
  },
};