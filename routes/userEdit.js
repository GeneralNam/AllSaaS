import express from 'express';
import initializeDB from './db.js';

const router = express.Router();

const STATUS = {
  PENDING: 0,    // 검토미완료
  APPROVED: 1,   // 검토완료
}

router.post('/edit', async (req, res) => {
  try {
    const { saasName, suggestion } = req.body;
    const userId = req.user.id;
    console.log(userId);
    if (!saasName || !suggestion) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    const db = await initializeDB();
    const result = await db.collection('suggestions').insertOne({
      saasName,
      suggestion,
      userId,
      type: 'edit',
      status: STATUS.PENDING,
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: '제안이 성공적으로 등록되었습니다.',
      suggestion: result
    });

  } catch (error) {
    console.error('Edit suggestion error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
      error: error.message
    });
  }
});

export default router;