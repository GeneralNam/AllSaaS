import React, { useState, useEffect } from 'react';
import { Star, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import YouTube from 'react-youtube';
import { useParams } from 'react-router-dom';
import Review from './sections/addReview';

const AppInfo = () => {
  const [appData, setAppData] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name } = useParams();

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/appinfo/${name}`);
        
        if (!response.ok) {
          throw new Error('앱 정보를 가져오는데 실패했습니다');
        }

        const {result, reviews} = await response.json();
        setAppData(result);
        setReviews(reviews || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppData();
  }, [name]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!appData) return <div>앱 정보를 찾을 수 없습니다</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* 앱 정보 왼쪽 섹션 */}
        <div className="bg-white rounded-3xl p-6 shadow">
          <div className="flex items-start gap-4">
            <img 
              src={appData?.logo} 
              alt={appData?.name} 
              className="w-16 h-16 object-contain"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">{appData?.name}</h1>
                <a 
                  href={appData?.siteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                >
                  바로가기
                </a>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={i < Math.floor(appData.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      size={16}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{appData?.averageRating}</span>
                <span className="text-sm text-gray-500">({appData?.ratingCount})</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            {appData?.sns?.facebook && <Facebook className="text-gray-600" size={20} />}
            {appData?.sns?.twitter && <Twitter className="text-gray-600" size={20} />}
            {appData?.sns?.linkedin && <Linkedin className="text-gray-600" size={20} />}
            {appData?.sns?.instagram && <Instagram className="text-gray-600" size={20} />}
          </div>
        </div>

        {/* 앱 정보 오른쪽 섹션 */}
        <div className="bg-white rounded-3xl p-6 shadow">
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">개발사</p>
              <p className="font-medium">{appData?.company}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">정보</p>
              <p className="font-medium">{appData?.info}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">설명</p>
              <p className="text-sm">{appData?.description}</p>
            </div>
          </div>
        </div>
      </div>
      {/* 유튜브 섹션 */}
      <YouTube 
        videoId={appData.videoId}
        opts={{
          width: '100%',
          height: '468',
          playerVars: {
            autoplay: 0,
          },
        }}
        className="rounded-3xl overflow-hidden"
      />
      {/* 스크린샷 섹션 */}
      <div className="grid grid-cols-1 gap-4">
        {Array.isArray(appData?.pictures) && appData.pictures.map((screenshot, index) => (
          <img
            key={index}
            src={screenshot}
            alt={`Screenshot ${index + 1}`}
            className="w-full h-[480px] object-cover rounded-3xl"
          />
        ))}
      </div>
      {/* 리뷰 섹션 */}
      {reviews && reviews.map((review) => (
        <div key={review._id} className="flex gap-4">
          <div className="w-1/6 bg-white rounded-3xl p-6 shadow">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2" />
              <p className="text-sm font-medium">{review.nickname}</p>
              <p className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={14}
                    fill={index < review.rating ? "#FFD700" : "none"}
                    stroke={index < review.rating ? "#FFD700" : "#D1D5DB"}
                  />
                ))}
                <span className="ml-1 text-sm text-gray-600">{review.rating}</span>
              </div>
            </div>
          </div>
          <div className="w-5/6 bg-white rounded-3xl p-6 shadow">
            <div className="space-y-4">
              <h3 className="font-medium">제목:  {review.title}</h3>
              <p className="text-sm text-gray-700">내용:  {review.content}</p>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">장점:  </span>
                  <span className="text-sm text-gray-700">{review.pros}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">단점:  </span>
                  <span className="text-sm text-gray-700">{review.cons}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 리뷰 작성 폼 */}
      <Review name={appData.name} />
    </div>
  );
};

export default AppInfo;