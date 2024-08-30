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
    updatePost(id: ID!, title: String, content: String, author: String): Post
    deletePost(id: ID!): Post
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
    updatePost: async (_: any, { id, title, content, author }: { id: string, title?: string, content?: string, author?: string }) => {
        const updatedPost = await Post.findByIdAndUpdate(
          id,
          { title, content, author },
          { new: true }
        );
        return updatedPost;
    },
    deletePost: async (_: any, { id }: { id: string }) => {
        const deletedPost = await Post.findByIdAndDelete(id);
        return deletedPost;
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
