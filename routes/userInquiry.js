const express = require('express');
const router = express.Router();
const initializeDB = require('../db');

router.post('/inquiry', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    const db = await initializeDB();
    const result = await db.collection('userInquiries').insertOne({
      title,
      content,
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

module.exports = router;