import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { connectToMongoDB } from './database';
import { Post } from './models/post';


const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    author: String!
    createdAt: String!
  }

  type Query {
    getPosts: [Post]
  }
`;

const resolvers = {
  Query: {
    getPosts: async () => await Post.find(),
  },
};

// 서버 시작
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at ${url}`);

  await connectToMongoDB();
}

startServer();
