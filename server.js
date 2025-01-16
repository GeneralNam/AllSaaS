import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import connectMongoDBSession from 'connect-mongodb-session';
import initializeDB from "./routes/db.js";
import saasRouter from './routes/uploadSaas.js';
import reviewRouter from './routes/addReview.js';
import crawler from './routes/crawler.js';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';
import userEditRouter from './routes/userEdit.js';
import userInquiryRouter from './routes/userInquiry.js';    

dotenv.config();
const app = express();
const port = 8080;
const MongoDBStore = connectMongoDBSession(session);

// 미들웨어 설정
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax',
        secure: false,
    }
}));

// passport 미들웨어
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRouter);

// 사용자 인증 미들웨어
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ error: "로그인이 필요합니다" });
    }
};

// 닉네임 바꾸기
app.post('/change-nickname', isAuthenticated, async (req, res) => {
    try {
        const newNickname = req.body.nickname;
        const db = await initializeDB();
        
        await db.collection('users').updateOne(
            { _id: req.user.id },
            { $set: { nickname: newNickname } }
        );
 
        req.session.passport.user.nickname = newNickname;
        
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

// 사이트 업로드 라우트
app.use('/suggestion', saasRouter);

// 사이트 편집 라우트
app.use('/suggestion', userEditRouter);

// 사이트 문의 라우트
app.use('/suggestion/', userInquiryRouter);

// 크롤링 라우트
app.use('/api', crawler);

app.get('/api/sites', async (req, res) => {
    try {
        const db = await initializeDB();
        const sites = await db.collection('appinfo').find().toArray(); 
        const reviews = await db.collection('reviews').find().toArray(); 
        res.json({ sites, reviews });
    } catch (error) {
        console.error('Error fetching app data:', error);
        res.status(500).json({ message: "서버 에러가 발생했습니다" });
    }
});

app.get('/appinfo/:name', async (req, res) => {
    try {
        const db = await initializeDB();
        const result = await db.collection('appinfo').findOne({ name: req.params.name });
        if (!result) return res.status(404).json({ error: "앱을 찾을 수 없습니다" });

        const reviews = await db.collection('reviews').find({ name: req.params.name }).toArray();
        const users = await db.collection('users').find().toArray();

        reviews.forEach(review => {
            const user = users.find(u => u._id.toString() === review.authorId);
            review.nickname = user?.nickname || '알 수 없음';
        });

        res.json({ result, reviews });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// 리뷰 라우트
app.use('/api/reviews', reviewRouter);

// 관리자 페이지 라우트
app.use('/admin', adminRouter);

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