import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Review = ({ appData, name }) => {
  const [reviewForm, setReviewForm] = useState({
    title: '',
    content: '',
    pros: '',
    cons: '',
    rating: 0  // 별점 추가
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setReviewForm(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (reviewForm.rating === 0) {
      alert('별점을 선택해주세요');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewForm)
      });

      if (!response.ok) {
        throw new Error('리뷰 등록에 실패했습니다');
      }

      setReviewForm({
        title: '',
        content: '',
        pros: '',
        cons: '',
        rating: 0
      });

      alert('리뷰가 등록되었습니다!');
    } catch (error) {
      console.error('Error:', error);
      alert('리뷰 등록에 실패했습니다.');
    }
  };

  return (
    <section className="mb-8">
      {/* 리뷰 작성 폼 */}
      <div className="bg-gray-50 p-6 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-4">리뷰 작성</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* 별점 선택 UI */}
          <div>
            <label className="block text-gray-700 mb-2">별점</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    size={24}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {reviewForm.rating > 0 ? `${reviewForm.rating}점` : '별점을 선택하세요'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">제목</label>
            <input
              type="text"
              name="title"
              value={reviewForm.title}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="리뷰 제목을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">내용</label>
            <textarea
              name="content"
              value={reviewForm.content}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 h-32"
              placeholder="리뷰 내용을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">장점</label>
            <input
              type="text"
              name="pros"
              value={reviewForm.pros}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="장점을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">단점</label>
            <input
              type="text"
              name="cons"
              value={reviewForm.cons}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="단점을 입력하세요"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            게시
          </button>
        </form>
      </div>
    </section>
  );
};

export default Review;