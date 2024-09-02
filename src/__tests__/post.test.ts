import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import fetch from 'node-fetch';
import { typeDefs, resolvers } from '../index'; 
import { connectToTestMongoDB, resetTestMongoDB, disconnectFromTestMongoDB } from '../testDatabase';


let server: ApolloServer;
let url: string;

beforeAll(async () => {

  await connectToTestMongoDB();
  server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url: serverUrl } = await startStandaloneServer(server, {
    listen: { port: 0 },
  });

  url = serverUrl;
}, 30000); 

// 오히려 넣으면 오류가 나는 상황이구나
beforeEach(async () => {
    resetTestMongoDB();
});
// 오류 안나게 다 준비 되게 해서 짜야해,

afterAll(async () => {
  await disconnectFromTestMongoDB();
  await server.stop();
});

describe('GraphQL CRUD API', () => {
  let createdPostId: string;

  it('should create a new post', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            createPost(title: "Test Post", content: "Test Content", author: "Tester") {
              id
              title
              content
              author
              createdAt
            }
          }
        `,
      }),
    });

    const result = await response.json() as {
      data: {
        createPost: {
          id: string;
          title: string;
          content: string;
          author: string;
          createdAt: string;
        }
      }
    };

    expect(result.data.createPost.title).toBe('Test Post');
    expect(result.data.createPost.content).toBe('Test Content');
    expect(result.data.createPost.author).toBe('Tester');

    createdPostId = result.data.createPost.id; // 생성된 게시물 ID 저장
  });

  it('should retrieve the created post', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            getPost(id: "${createdPostId}") {
              title
              content
              author
            }
          }
        `,
      }),
    });

    const result = await response.json() as {
      data: {
        getPost: {
          title: string;
          content: string;
          author: string;
        }
      }
    };

    expect(result.data.getPost.title).toBe('Test Post');
    expect(result.data.getPost.content).toBe('Test Content');
    expect(result.data.getPost.author).toBe('Tester');
  });

  it('should update the created post', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            updatePost(id: "${createdPostId}", title: "Updated Post", content: "Updated Content", author: "Updated Author") {
              id
              title
              content
              author
            }
          }
        `,
      }),
    });

    const result = await response.json() as {
      data: {
        updatePost: {
          id: string;
          title: string;
          content: string;
          author: string;
        }
      }
    };

    expect(result.data.updatePost.title).toBe('Updated Post');
    expect(result.data.updatePost.content).toBe('Updated Content');
    expect(result.data.updatePost.author).toBe('Updated Author');
  });

  it('should delete the created post', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            deletePost(id: "${createdPostId}") {
              id
            }
          }
        `,
      }),
    });

    const result = await response.json() as {
      data: {
        deletePost: {
          id: string;
        }
      }
    };

    expect(result.data.deletePost.id).toBe(createdPostId);
  });

  it('should return null when retrieving a deleted post', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            getPost(id: "${createdPostId}") {
              id
            }
          }
        `,
      }),
    });

    const result = await response.json() as {
      data: {
        getPost: any;
      }
    };

    expect(result.data.getPost).toBeNull();
  });
});


////////////
// // src/__tests__/server.test.ts
// import request from 'supertest';
// import { ApolloServer } from '@apollo/server';
// import { startStandaloneServer } from '@apollo/server/standalone';
// // import { MongoMemoryServer } from 'mongodb-memory-server';
// import mongoose from 'mongoose';
// import { typeDefs, resolvers } from '../index'; // 실제 파일 경로에 맞게 수정
// // import { connectToTestMongoDB,  } from '../testDatabase'; // 실제 파일 경로에 맞게 수정
// import { Post } from '../models/post'; // 실제 파일 경로에 맞게 수정
// // import { typeDefs, resolvers } from '../index'; 
// import { connectToTestMongoDB, disconnectFromTestMongoDB } from '../testDatabase';

// let server: ApolloServer;
// // let mongoServer: MongoMemoryServer;

// beforeAll(async () => {
//   await connectToTestMongoDB();
//   server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });

//   await startStandaloneServer(server, {
//     listen: { port: 0 },
//   });
// });

// afterAll(async () => {
// //   await mongoose.disconnect();
// //   await mongoServer.stop();
//   await disconnectFromTestMongoDB();
//   await server.stop();
// });

// // beforeEach(async () => {
// //   const collections = await mongoose.connection.db.collections();
// //   for (let collection of collections) {
// //     await collection.deleteMany({});
// //   }
// // });

// describe('GraphQL API', () => {
//   it('should create a new post', async () => {
//     const response = await request('http://localhost:4000')
//       .post('/graphql')
//       .send({
//         query: `
//           mutation {
//             createPost(title: "Test Post", content: "Test Content", author: "Tester") {
//               id
//               title
//               content
//               author
//               createdAt
//             }
//           }
//         `,
//       });

//     expect(response.body.data.createPost.title).toBe('Test Post');
//     expect(response.body.data.createPost.content).toBe('Test Content');
//     expect(response.body.data.createPost.author).toBe('Tester');
//   });

//   it('should retrieve posts', async () => {
//     await new Post({ title: 'Sample Post', content: 'Sample Content', author: 'Sample Author' }).save();

//     const response = await request('http://localhost:4000')
//       .post('/graphql')
//       .send({
//         query: `
//           query {
//             getPosts {
//               id
//               title
//               content
//               author
//             }
//           }
//         `,
//       });

//     expect(response.body.data.getPosts.length).toBe(1);
//     expect(response.body.data.getPosts[0].title).toBe('Sample Post');
//   });

//   it('should update a post', async () => {
//     const post = await new Post({ title: 'Old Title', content: 'Old Content', author: 'Author' }).save();

//     const response = await request('http://localhost:4000')
//       .post('/graphql')
//       .send({
//         query: `
//           mutation {
//             updatePost(id: "${post.id}", title: "New Title", content: "New Content", author: "New Author") {
//               id
//               title
//               content
//               author
//             }
//           }
//         `,
//       });

//     expect(response.body.data.updatePost.title).toBe('New Title');
//     expect(response.body.data.updatePost.content).toBe('New Content');
//     expect(response.body.data.updatePost.author).toBe('New Author');
//   });

//   it('should delete a post', async () => {
//     const post = await new Post({ title: 'Post to Delete', content: 'Content', author: 'Author' }).save();

//     const response = await request('http://localhost:4000')
//       .post('/graphql')
//       .send({
//         query: `
//           mutation {
//             deletePost(id: "${post.id}") {
//               id
//               title
//             }
//           }
//         `,
//       });

//     expect(response.body.data.deletePost.title).toBe('Post to Delete');

//     const findDeletedPost = await Post.findById(post.id);
//     expect(findDeletedPost).toBeNull();
//   });
// });
