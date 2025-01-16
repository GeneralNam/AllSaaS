import express from 'express';
import { ObjectId } from 'mongodb';
import initializeDB from './db.js';

const router = express.Router();

const STATUS = {
  PENDING: 0,
  APPROVED: 1
};

router.use((req, res, next) => {
  console.log('요청 전체 URL:', req.originalUrl);
  console.log('요청 메서드:', req.method);
  console.log('요청 경로:', req.path);
  next();
});

router.get('/', async (req, res) => {
  try {
    const db = await initializeDB();
    const suggestions = await db.collection('suggestions')
      .find({}, {
        projection: {
          _id: 1,
          type: 1,
          userId: 1,
          status: 1,
        }
      })
      .sort({ createdAt: -1 })
      .toArray();
    console.log(suggestions);
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ message: '데이터를 가져오는데 실패했습니다.' });
  }
});

router.patch('/suggestions/:id', async (req, res) => {
  console.log('====== PATCH 요청 디버그 ======');
  console.log('1. 받은 ID:', req.params.id);
  console.log('2. 받은 body:', req.body);
  try {
    const db = await initializeDB();
    const { id } = req.params;
    const { reviewed } = req.body;


    const status = reviewed ? STATUS.APPROVED : STATUS.PENDING;

    const result = await db.collection('suggestions').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ message: '제안을 찾을 수 없습니다.' });
    }

    res.json(result.value);
  } catch (error) {
    console.error('Error updating suggestion:', error);
    res.status(400).json({ message: '제안 업데이트에 실패했습니다.' });
  }
});

// Suggestion 추가하는 부분
router.post('/', async (req, res) => {
  try {
    const { siteUrl, userDescription } = req.body;
    const userId = new ObjectId(req.user.id); // ObjectId로 변환

    const saasData = {
      type: 'site',
      siteUrl,
      userDescription,
      userId, // ObjectId 형태로 저장
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