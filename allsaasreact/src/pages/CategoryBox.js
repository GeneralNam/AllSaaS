import React from 'react';
import { Star } from 'lucide-react';

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
    <div className="flex bg-[#F0FFF0] border border-gray-200 rounded-lg p-5 h-[600px] gap-5 cursor-pointer transition-all duration-200 hover:translate-y-[-4px] hover:shadow-lg">
      {/* 왼쪽 섹션 */}
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <img src={siteData.logo} alt={siteData.name} className="w-[50px] h-[50px] object-contain" />
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold m-0">{siteData.name}</h3>
            <div className="flex items-center gap-1">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.floor(siteData.rating))}
                {siteData.rating % 1 !== 0 && '☆'}
              </div>
              <span className="text-gray-500 text-sm">({siteData.reviewCount})</span>
              <div className="text-gray-900 font-semibold ml-1">{siteData.rating}</div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">{siteData.description}</p>
      </div>

      {/* 오른쪽 섹션 */}
      <div className="flex-1 flex flex-col gap-5">
        <div className="h-[150px] bg-gray-100 rounded flex items-center justify-center">
          <div className="video-placeholder">
            유튜브 영상넣기
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="text-base text-gray-900 font-medium mb-2">{siteData.userReview.title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{siteData.userReview.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryBox;