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
    getPost(id: ID!): Post
  }
  type Mutation {
    createPost(title: String!, content: String!, author: String!): Post
  }
`;

const resolvers = {
  Query: {
    getPosts: async () => await Post.find(),
    getPost: async (_: any, { id }: { id: string }) => await Post.findById(id),
  },
  Mutation: {
    createPost: async (_: any, { title, content, author }: { title: string, content: string, author: string }) => {
      const newPost = new Post({ title, content, author });
      return await newPost.save();
    },
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
