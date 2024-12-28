const express = require('express');
const router = express.Router();
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const initializeDB = require("./db.js");

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
      const folder = file.fieldname === 'logo' ? 'logos' : 'pictures';
      cb(null, `${folder}/${Date.now()}-${file.originalname}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  }),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
    cb(null, true);
  }
});

// AddSaasForm에서 받은 데이터를 db에 저장하는 라우트
router.post('/', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'pictures', maxCount: 3 }
]), async (req, res) => {
  try {
    const { name, siteUrl, info, youtubeUrl, description } = req.body;

    // YouTube URL에서 videoId 추출
    const videoId = extractVideoId(youtubeUrl);
    const logoUrl = req.files.logo ? req.files.logo[0].location : null;
    const pictureUrls = req.files.pictures ? req.files.pictures.map(file => file.location) : [];

    const saasData = {
      name,
      siteUrl,
      info,
      videoId,
      description,
      logo: logoUrl,
      pictures: pictureUrls,
      averageRating: 0,
      ratingCount: 0,
      createdAt: new Date()
    };

    const db = await initializeDB();
    await db.collection('appinfo').insertOne(saasData);

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

// YouTube URL에서 videoId 추출 함수
const extractVideoId = (youtubeUrl) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
  const match = youtubeUrl.match(regex);
  return match ? match[1] : null; // 매칭되면 videoId 반환, 없으면 null
};

module.exports = router;