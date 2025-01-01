const express = require('express');
require('dotenv').config();
const app = express();
const port = 8080;
const cors = require('cors');
const initializeDB = require("./routes/db.js");
const saasRouter = require('./routes/uploadSaas')
const reviewRouter = require('./routes/addReview.js');
const crawler = require('./routes/crawler.js');
var authRouter = require('./routes/auth');
var logger = require('morgan');
var session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');


// 미들웨어 설정
app.use(cors({
    origin: 'http://localhost:3000',  // React 앱의 주소
    credentials: true  // 쿠키 전달을 위해 필요
}));
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// 정적 파일 제공
app.use(express.static('public'));


// 세션 설정
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
        uri: process.env.MONGODB_URI,
        databaseName: 'jhnamok',
        collection: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,  // 24시간
        sameSite: 'lax',  // CSRF 보호
        secure: false,  // 개발환경에서는 false, 프로덕션에서는 true
    }
}));

// passport 미들웨어
app.use(passport.initialize());
app.use(passport.session());


app.use('/', authRouter);

// 사용자 인증 미들웨어
function isAuthenticated(req, res, next) {
    if (req.user) {  // 또는 req.isAuthenticated()
        next();
    } else {
        res.status(401).json({ error: "로그인이 필요합니다" });
    }
}

// 원래닉네임 보내기
app.get('/api/user/nickname', isAuthenticated, (req, res) => {
    res.json({ nickname: req.user.nickname });
});

// 닉네임 바꾸기
app.post('/change-nickname', isAuthenticated, async (req, res) => {
    try {
        const newNickname = req.body.nickname;
        const db = await initializeDB();
        
        // users 컬렉션의 닉네임 업데이트
        await db.collection('users').updateOne(
            { _id: req.user.id },
            { $set: { nickname: newNickname } }
        );
 
        // 세션의 사용자 정보 업데이트
        req.session.passport.user.nickname = newNickname;
        
        // 세션 저장
        req.session.save((err) => {
            if (err) {
                return res.status(500).json({ error: "세션 업데이트 실패" });
            }
            res.json({ 
                message: "닉네임이 변경되었습니다.",
                nickname: newNickname 
            });
        });
 
    } catch (error) {
        console.error('닉네임 변경 오류:', error);
        res.status(500).json({ error: "닉네임 변경 실패" });
    }
 });

// 로그인 상태 확인 API
app.get('/api/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            isAuthenticated: true,
            nickname: req.user.nickname
        });
    } else {
        res.json({
            isAuthenticated: false,
            nickname: null
        });
    }
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
        const db = await initializeDB();
        const result = await db.collection('appinfo').findOne({ name: req.params.name });
        if (!result) return res.status(404).json({ error: "앱을 찾을 수 없습니다" });

        const reviews = await db.collection('reviews').find({ name: req.params.name }).toArray();
        const users = await db.collection('users').find().toArray();  // 유저 정보 가져오기

        reviews.forEach(review => {
            const user = users.find(u => u._id.toString() === review.authorId);
            review.nickname = user?.nickname || '알 수 없음';
        });

        res.json({ result, reviews });
    } catch (error) {
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