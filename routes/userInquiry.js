import express from 'express';
import initializeDB from './db.js';
const router = express.Router();

router.post('/inquiry', async (req, res) => {

    const STATUS = {
        PENDING: 0,    // 검토미완료
        APPROVED: 1,   // 검토완료
        }

  try {
    const { title, content } = req.body;
    const userId = req.user.id;
    if (!title || !content) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    const db = await initializeDB();
    const result = await db.collection('suggestions').insertOne({
      title,
      content,
      userId,
      type: 'inquiry',
      status: STATUS.PENDING,
      createdAt: new Date()
    });

    res.status(201).json({
      message: '문의가 성공적으로 등록되었습니다.',
      inquiry: result
    });

  } catch (error) {
    console.error('Inquiry error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

export default router;