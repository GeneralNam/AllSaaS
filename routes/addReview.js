// routes/review.js
import express from 'express';
const router = express.Router();
import initializeDB from './db.js';

// db 파라미터 필요
async function addRating(db, appName, rating) {
    const app = await db.collection('appinfo').findOne({ name: appName });
    const currentTotal = app.totalRating || 0;
    const currentCount = app.ratingCount || 0;
    
    const newAverage = (currentTotal + rating) / (currentCount + 1);

    await db.collection('ratings').insertOne({
        appName,
        rating,
        createdAt: new Date()
    });

    await db.collection('appinfo').updateOne(
        { name: appName },
        {
            $inc: {
                totalRating: rating,
                ratingCount: 1
            },
            $set: {
                averageRating: newAverage
            }
        }
    );
}

router.post('/:name', async (req, res) => {
  try {
    console.log('요청 도착');
    console.log(`요청된이름 : ${req.params.name}`);
    
    // 로그인 체크
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "로그인이 필요합니다" });
    }

    const db = await initializeDB();
    const { title, content, pros, cons, rating } = req.body;
    const name = req.params.name;
    console.log('전체 user 정보:', req.user);
    const review = {
      name,
      title,
      content,
      pros,
      cons,
      rating,
      createdAt: new Date(),
      // 작성자 정보 추가
      authorId: req.user.id,
      // authorNickname: req.user.nickname
    };

    const result = await db.collection('reviews').insertOne(review);

    if (!result.insertedId) {
      return res.status(500).json({ error: "리뷰 저장에 실패했습니다" });
    }

    await addRating(db, name, rating);

    res.status(201).json({ message: "리뷰가 등록되었습니다", review });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: "리뷰 등록에 실패했습니다" });
  }
});

export default router;