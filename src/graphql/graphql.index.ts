import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { postTypeDefs, postResolvers } from './post/post.index';
import { userTypeDefs, userResolvers } from './user/user.index';

export const typeDefs = mergeTypeDefs([postTypeDefs, userTypeDefs]);
export const resolvers = mergeResolvers([postResolvers, userResolvers]);