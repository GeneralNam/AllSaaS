const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');

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

// GET 요청 예시
app.get('/api/users', (req, res) => {
    // 예시 데이터
    const users = [
        { id: 1, name: '홍길동' },
        { id: 2, name: '김철수' }
    ];
    res.json(users);
});

// POST 요청 예시
app.post('/api/users', (req, res) => {
    const newUser = req.body;
    // 여기서 데이터베이스에 저장하는 로직이 들어갈 수 있습니다
    res.status(201).json({
        message: '사용자가 생성되었습니다',
        user: newUser
    });
});

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
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다`);
});