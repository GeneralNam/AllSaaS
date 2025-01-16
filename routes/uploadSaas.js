import express from 'express';
const router = express.Router();
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import initializeDB from './db.js';

// S3 클라이언트 설정
const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

// Multer-S3 설정
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'jhnamforum1',
    key: function (req, file, cb) {
      cb(null, `userPhotos/${Date.now()}-${file.originalname}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 제한
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
    cb(null, true);
  }
});

// 여러 장의 사진을 처리하는 라우트
router.post('/site', upload.array('userPhotos', 3), async (req, res) => {

  const STATUS = {
    PENDING: 0,    // 검토미완료
    APPROVED: 1,   // 검토완료
  }
  try {
    const { siteUrl, userDescription } = req.body;
    const userId = req.user.id;
    
    // 업로드된 파일들의 URL을 배열로 저장
    const photoUrls = req.files ? req.files.map(file => file.location) : [];

    const saasData = {
      type: 'site',
      siteUrl,
      userDescription,
      userId,
      photoUrls, // 여러 장의 사진 URL을 배열로 저장
      status: STATUS.PENDING,
      createdAt: new Date()
    };

    const db = await initializeDB();
    await db.collection('suggestions').insertOne(saasData);

    res.status(201).json({
      success: true,
      message: 'SaaS가 성공적으로 추가되었습니다.',
      data: saasData
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      success: false,
      message: '서버 에러가 발생했습니다.',
      error: error.message
    });
  }
});

export default router;