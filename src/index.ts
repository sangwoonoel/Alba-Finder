import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { connectToMongoDB } from './database';
import { Post} from './models/post';
import { User } from './models/user';


const typeDefs = gql`
  type User {
    id: ID!
    nickname: String!            # 닉네임
    mannerTemperature: Float!    # 매너 온도 (Float 타입 사용)
    isVerified: Boolean!         # 인증 (Boolean 타입 사용)
    representativeName: String!  # 대표자명
    companyName: String!         # 업체명
    businessRegistrationNumber: String! # 사업자등록번호
  }
  type PostAuthor {
    userId: ID!
    nickname: String!    
    mannerTemperature: Float!
    isVerified: Boolean!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: PostAuthor!
    createdAt: String!
  }

  input UserInput {
    nickname: String!
    mannerTemperature: Float!
    isVerified: Boolean!
    representativeName: String!
    companyName: String!
    businessRegistrationNumber: String!
  }

  type Query {
    getPosts: [Post]
    getPost(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!, authorId: ID!): Post
    updatePost(id: ID!, title: String, content: String, authorId: String): Post
    deletePost(id: ID!): Post
    createUser(userInput: UserInput!): User
  }
`;

const resolvers = {
  Query: {
    getPosts: async () => await Post.find(),
    getPost: async (_: any, { id }: { id: string }) => await Post.findById(id),
  },
  Mutation: {
    createPost: async (_: any, { title, content, authorId }: { title: string, content: string, authorId: string }) => {
        const user = await User.findById(authorId);
        if (!user) {
          throw new Error('User not found');
        }
        const newPost = new Post({
          title,
          content,
          author: {
            userId: user.id,
            nickname: user.nickname,
            mannerTemperature: user.mannerTemperature,
            isVerified: user.isVerified,
          },
        });
        return await newPost.save();
      },
    
    updatePost: async (_: any, { id, title, content, authorId }: { id: string, title?: string, content?: string, authorId?: string }) => {
        let author;
        if (authorId) {
          const user = await User.findById(authorId);
          if (!user) {
            throw new Error('User not found');
          }
          author = {
            userId: user.id,
            nickname: user.nickname,
            mannerTemperature: user.mannerTemperature,
            isVerified: user.isVerified,
          };
        }
  
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
    createUser: async (_: any, { userInput }: { userInput: any }) => {
        const newUser = new User(userInput);
        return await newUser.save();
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
