const express = require('express');
require('dotenv').config();
const app = express();
const port = 8080;
const cors = require('cors');
const initializeDB = require("./routes/db.js");
const saasRouter = require('./routes/uploadSaas')
const reviewRouter = require('./routes/addReview.js');
const crawler = require('./routes/crawler.js');


// 미들웨어 설정
app.use(cors());
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// 정적 파일 제공
app.use(express.static('public'));

// 라우트 설정
app.get('/', (req, res) => {
    res.send('환영합니다! Express 서버입니다.');
});

// 이미지처리 라우트
app.use('/addsaas', saasRouter);

// 로고찾기 라우트
app.use('/api', crawler);


// Category에서 categorybox 안에 내용채우기
app.get('/api/sites', async (req, res) => {
    try {
        const db = await initializeDB();
        const sites = await db.collection('appinfo').find().toArray(); 
        const reviews = await db.collection('reviews').find().toArray(); 
        console.log(reviews[0])
        res.json({ sites, reviews });
        
        
      
    } catch (error) {
        console.error('Error fetching app data:', error);
        res.status(500).json({ message: "서버 에러가 발생했습니다" });
    }
});

// appinfo 안에 내용들 get요청 처리
app.get('/appinfo/:name', async (req, res) => {
    try {
        const db = await initializeDB();  // 이 줄 추가
        console.log('요청된 이름:', req.params.name);
        
        const result = await db.collection('appinfo').findOne({ 
            name: req.params.name
        });

        const reviews = await db.collection('reviews').find({ 
            name: req.params.name
        }).toArray();



        console.log(result)
        console.log(reviews) 
        
        if (!result) {
            return res.status(404).json({ error: "앱을 찾을 수 없습니다" });
        }
        
        res.json({ result, reviews });
    } catch (error) {
        console.log("못찾음")
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// 리뷰 제출 라우트
app.use('/api/reviews', reviewRouter);

// 404 에러 처리
app.use((req, res, next) => {
    res.status(404).send('페이지를 찾을 수 없습니다');
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('서버 에러가 발생했습니다');
});

// 서버 시작
initializeDB().then(() => {
    app.listen(port, () => {
      console.log('http://localhost:8080 에서 서버 실행중')
    })
  }).catch(err => {
    console.error('DB 초기화 실패:', err)
  });