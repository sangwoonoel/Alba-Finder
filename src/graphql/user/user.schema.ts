import gql from 'graphql-tag';


export const userTypeDefs = gql`
  type User {
    id: ID!
    nickname: String!
    mannerTemperature: Float!
    isVerified: Boolean!
    representativeName: String!
    companyName: String!
    businessRegistrationNumber: String! 
  }

  input UserInput {
    nickname: String!
    mannerTemperature: Float!
    isVerified: Boolean!
    representativeName: String!
    companyName: String!
    businessRegistrationNumber: String!
  }
  
  type Mutation {
    createUser(userInput: UserInput!): User
  }
`;
