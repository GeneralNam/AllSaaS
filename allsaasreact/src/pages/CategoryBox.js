// src/components/CategoryBox.js
import React from 'react';
import './CategoryBox.css';

const CategoryBox = ({ site }) => {
  // 예시 데이터 구조
  const siteData = {
    id: 1,
    name: 'Notion',
    logo: 'http://www.w3.org/2000/svg',
    link: 'https://notion.com',
    rating: 5.0,
    reviewCount: 23,
    description: 'Notion은 이러이러한 앱입니다.',
    videoUrl: '유튜브 영상넣기',
    userReview: {
      title: '"업무 방식의 혁신"',
      content: 'AI를 이용한 혁신적인 툴, 미래 작업 툴의 정점. 협업에도 유용하고 미리 만들어진 다양한 템플릿 홀 통해 시간 절약 가능'
    }
  };

  return (
    <div className="category-box">
      <div className="box-left">
        <div className="site-info">
          <img src={siteData.logo} alt={siteData.name} className="site-logo" />
          <div className="site-title">
            <h3>{siteData.name}</h3>
            <div className="rating">
              {'★'.repeat(Math.floor(siteData.rating))}
              {siteData.rating % 1 !== 0 && '☆'}
              <span className="review-count">({siteData.reviewCount})</span>
              <div className="rating-number">{siteData.rating}</div>
            </div>
          </div>
        </div>
        <div className="site-description">
          <p>{siteData.description}</p>
        </div>
      </div>
      
      <div className="box-right">
        <div className="video-section">
          <div className="video-placeholder">
            유튜브 영상넣기
          </div>
        </div>
        <div className="user-review">
          <h4>{siteData.userReview.title}</h4>
          <p>{siteData.userReview.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryBox;