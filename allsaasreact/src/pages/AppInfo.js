// src/components/AppInfo/AppInfo.js
import React, {useState, useEffect} from 'react';
import { Star } from 'lucide-react';
import YouTube from 'react-youtube';
import { useParams } from 'react-router-dom';
import Review from './sections/addReview';

const AppInfo = () => {
  const [appData, setAppData] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name } = useParams();  // URL에서 id 파라미터 가져오기

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        setLoading(true);
        console.log(name)
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
  }, [name]);  // id가 변경될 때마다 다시 fetch

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!appData) return <div>앱 정보를 찾을 수 없습니다</div>;



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
            <a 
              href={appData?.siteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg inline-block"
            >
              바로가기
            </a>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={i < Math.floor(appData.averageRating?.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  size={20}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{appData?.averageRating}</span>
            <span className="text-gray-500">({appData?.ratingCount})</span>
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
            <p>{appData?.company}</p>
          </div>
          <div>
            <p className="text-gray-500">출시일</p>
            <p>{appData?.info}</p>
          </div>
          {/* 추가 정보 필드들 */}
        </div>
      </section>

      {/* 비디오 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">소개 영상</h2>
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <YouTube 
            videoId={appData.videoId}  // 예: "dQw4w9WgXcQ"
            opts={{
              width: '800',
              height: '450',
              playerVars: {
                autoplay: 0,
              },
            }}
          />
        </div>
      </section>

      {/* 스크린샷 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">스크린샷</h2>
        <div className="grid grid-cols-3 gap-4">
          {Array.isArray(appData?.pictures) ? (
            appData.pictures.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`Screenshot ${index + 1}`}
                className="w-full rounded-lg"
              />
            ))
          ) : (
            <p>스크린샷이 없습니다.</p>
          )}
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">사용자 리뷰</h2>

        {/* 리뷰 목록 표시 */}
        <div className="space-y-6">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <h4 className="font-medium mb-2">{reviews.title}</h4>
                <p className="text-gray-700 mb-3">{review.content}</p>
                
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="font-medium">장점:</span>
                    <span className="text-gray-700">{review.pros}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium">단점:</span>
                    <span className="text-gray-700">{review.cons}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              아직 작성된 리뷰가 없습니다.
            </div>
          )}
          
        </div>

        {/* 리뷰 작성 폼 */}
        <Review name={appData.name}/>
      </section>
    </div>
  );
};

export default AppInfo;