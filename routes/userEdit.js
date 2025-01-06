import express from 'express';
import { initializeDB } from './db.js';

const router = express.Router();

router.post('/edit-suggestion', async (req, res) => {
  try {
    const { saasName, suggestion } = req.body;
    if (!saasName || !suggestion) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    const db = await initializeDB();
    const result = await db.collection('editSuggestions').insertOne({
      saasName,
      suggestion,
      createdAt: new Date()
    });

    res.status(201).json({
      message: '제안이 성공적으로 등록되었습니다.',
      suggestion: result
    });

  } catch (error) {
    console.error('Edit suggestion error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

export default router;