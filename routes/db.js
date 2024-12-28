const {MongoClient} = require('mongodb');
require('dotenv').config();


const connectionString = process.env.MONGODB_URI;
const client = new MongoClient(connectionString);

  

let db; // 데이터베이스 객체를 저장할 변수

async function initializeDB() {
  if (!db) {
    try {
      const conn = await client.connect(); // 비동기 함수 내부에서 await 사용
      db = conn.db("jhnamok"); // 데이터베이스 선택
      console.log("MongoDB 연결 성공!");
    } catch (e) {
      console.error("MongoDB 연결 실패:", e.message);
      throw e; // 에러를 호출한 쪽에서 처리
    }
  }
  return db;
}

module.exports = initializeDB ;// initializeDB를 호출하면 데이터베이스 객체를 반환