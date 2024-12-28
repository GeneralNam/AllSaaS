
// CategoryBox.js
import React from 'react';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';

const CategoryBox = ({ siteData, reviews = [] }) => {
 const firstReview = reviews && reviews.length > 0 ? reviews[0] : null;

 return (
   <Link to={`/appinfo/${siteData.name}`} className="category-box-link block">
     <div className="category-box grid grid-cols-2 bg-white border border-gray-200 rounded-lg p-8 gap-12 min-h-[600px]">
       {/* 왼쪽 섹션 */}
       <div className="category-content-left flex flex-col gap-0">
         {/* 로고와 이름 */}
         <div className="flex flex-col gap-2">
           <img 
             src={siteData.logo}
             alt={siteData.name}
             className="w-24 h-24 object-contain"
           />
           <h3 className="text-xl font-semibold">{siteData.name}</h3>
         </div>
         
         {/* 별점 */}
         <div className="rating flex items-center gap-2">
           <div className="stars-wrapper flex text-yellow-400 text-2xl">
             {'★'.repeat(Math.floor(siteData.averageRating || 0))}
             {'☆'.repeat(5 - Math.floor(siteData.averageRating || 0))}
           </div>
           <span className="text-lg">{siteData.averageRating}</span>
           <span className="text-gray-500">({siteData.ratingCount})</span>
         </div>
         
         {/* 자동화 아이콘과 설명 */}
         <div className="mt-4 space-y-4">
           <div className="automation-icon w-8 h-8 bg-gray-200 rounded-full" />
           <p className="text-lg font-medium">{siteData.description}</p>
           <p className="text-gray-600 leading-relaxed">
             AI를 이용한 혁신적인 툴. 미래 작업 들의 전환.
             협업에도 유용하고 미래 만들어진 다양한 템플릿
             을 통해 시간 절약 가능
           </p>
         </div>
       </div>

       {/* 오른쪽 섹션 */}
       <div className="category-content-right flex flex-col gap-8">
         {/* 유튜브 비디오 */}
         <div className="video-container bg-gray-100 rounded-lg">
           <YouTube 
             videoId={siteData.videoId}
             opts={{
               width: '100%',
               height: '300',
               playerVars: {
                 autoplay: 0,
               },
             }}
           />
         </div>
         
         {/* 리뷰 섹션 */}
        <div className="review-section bg-gray-50 p-6 rounded-lg">
          {firstReview ? (
            <div className="flex gap-4">
              <div className="flex flex-col items-center w-24">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-2" />
                <span className="text-sm font-medium mb-1">{firstReview.name || '익명'}</span>
                {firstReview.rating && (
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(Math.floor(firstReview.rating))}
                    {'☆'.repeat(5 - Math.floor(firstReview.rating))}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-lg mb-2">{firstReview.title || '제목 없음'}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {firstReview.content || '내용 없음'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">리뷰가 없습니다.</p>
            </div>
          )}
        </div>
       </div>
     </div>
   </Link>
 );
};

export default CategoryBox;