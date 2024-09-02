import gql from 'graphql-tag';


export const postTypeDefs = gql`
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
  
  type Query {
    getPosts: [Post]
    getPost(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!, authorId: ID!): Post
    updatePost(id: ID!, title: String, content: String, authorId: String): Post
    deletePost(id: ID!): Post
  }
`;
