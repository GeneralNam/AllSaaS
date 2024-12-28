// routes/review.js
const express = require('express');
const router = express.Router();
const initializeDB = require("./db.js");

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
    
    const db = await initializeDB();
    const { title, content, pros, cons, rating } = req.body;
    const name = req.params.name;

    const review = {
      name,
      title,
      content, 
      pros,
      cons,
      rating,
      createdAt: new Date(),
    };

    const result = await db.collection('reviews').insertOne(review);

    if (!result.insertedId) {
      return res.status(500).json({ error: "리뷰 저장에 실패했습니다" });
    }

    // 여기서 addRating 호출, 이미 초기화된 db 전달
    await addRating(db, name, rating);

    res.status(201).json({ message: "리뷰가 등록되었습니다", review });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: "리뷰 등록에 실패했습니다" });
  }
});

module.exports = router;