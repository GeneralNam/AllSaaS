// src/components/AppInfo/AppInfo.js
import React from 'react';
import { Star } from 'lucide-react';

const AppInfo = ({ appData }) => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* 상단 헤더 섹션 */}
      <header className="flex items-start gap-6 mb-8">
        <img 
          src={appData?.logo} 
          alt={appData?.name} 
          className="w-24 h-24 object-contain"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{appData?.name}</h1>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              바로가기
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={i < Math.floor(appData?.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  size={20}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{appData?.rating}</span>
            <span className="text-gray-500">({appData?.reviewCount})</span>
          </div>
        </div>
      </header>

      {/* 앱 설명 섹션 */}
      <section className="mb-8">
        <p className="text-gray-700 leading-relaxed">{appData?.description}</p>
      </section>

      {/* 앱 정보 섹션 */}
      <section className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">앱 정보</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">개발사</p>
            <p>{appData?.developer}</p>
          </div>
          <div>
            <p className="text-gray-500">출시일</p>
            <p>{appData?.releaseDate}</p>
          </div>
          {/* 추가 정보 필드들 */}
        </div>
      </section>

      {/* 비디오 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">소개 영상</h2>
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          유튜브 영상이 들어갈 자리
        </div>
      </section>

      {/* 스크린샷 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">스크린샷</h2>
        <div className="grid grid-cols-3 gap-4">
          {appData?.screenshots?.map((screenshot, index) => (
            <img
              key={index}
              src={screenshot}
              alt={`Screenshot ${index + 1}`}
              className="w-full rounded-lg"
            />
          ))}
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">사용자 리뷰</h2>
        {/* 기존 리뷰들 */}
        <div className="space-y-6 mb-8">
          {appData?.reviews?.map((review, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div>
                  <h3 className="font-semibold">{review.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          size={16}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))}
        </div>

        {/* 리뷰 작성 폼 */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">리뷰 작성</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">제목</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                placeholder="리뷰 제목을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">내용</label>
              <textarea
                className="w-full border rounded-lg p-2 h-32"
                placeholder="리뷰 내용을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">장점</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                placeholder="장점을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">단점</label>
              <input
                type="text"
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
    </div>
  );
};

export default AppInfo;