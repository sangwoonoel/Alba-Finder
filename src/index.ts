import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';


// GraphQL 스키마 정의
const typeDefs = gql`
  type Query {
    blog: String
  }
`;

// 리졸버 정의
const resolvers = {
  Query: {
    blog: () => 'Welcome!',
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
}

startServer();
