import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | undefined;

/**
 * connectToTestMongoDB
 * 테스트 환경에서 메모리 내 MongoDB에 연결하는 함수입니다.
 */
export async function connectToTestMongoDB() {
  // 메모리 내 MongoDB 인스턴스를 생성하고 시작합니다.
  mongoServer = await MongoMemoryServer.create();
  
  // 생성된 메모리 내 MongoDB의 URI를 가져옵니다.
  const mongoUri = mongoServer.getUri();

  // Mongoose를 사용해 메모리 내 MongoDB에 연결합니다.
  await mongoose.connect(mongoUri);

  console.log('Connected to in-memory MongoDB for testing');
}

export async function resetTestMongoDB() {
  // MongoDB가 연결되어 있는지 확인
  if (mongoose.connection.readyState !== 1) {
    throw new Error('MongoDB is not connected');
  }

  // 연결된 상태에서만 db를 사용하여 컬렉션을 초기화
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('Failed to get the database instance from mongoose connection');
  }

  const collections = await db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }

  console.log('Test MongoDB has been reset');
}
/**
 * disconnectFromTestMongoDB
 * 테스트가 완료된 후 메모리 내 MongoDB와의 연결을 해제하고 서버를 종료하는 함수입니다.
 */
export async function disconnectFromTestMongoDB() {
  // Mongoose 연결 해제
  await mongoose.disconnect();
  
  // 메모리 내 MongoDB 서버가 활성화되어 있으면 이를 중지합니다.
  if (mongoServer) {
    await mongoServer.stop();
  }
}