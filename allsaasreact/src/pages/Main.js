import { useState } from 'react';
import axios from 'axios';

const Main = () => {
  const [url, setUrl] = useState('');
  const [siteInfo, setSiteInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pricingInfo, setPricingInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSiteInfo(null);
    setPricingInfo(null);

    try {
      // 사이트 정보 요청
      const siteResponse = await axios.get(`/api/find-site-info?url=${encodeURIComponent(url)}`);
      if (siteResponse.data.success) {
        setSiteInfo(siteResponse.data.siteInfo);
      }

      // 가격 정보 요청 추가
      try {
        const pricingResponse = await axios.get(`/api/find-pricing?url=${encodeURIComponent(url)}`);
        if (pricingResponse.data.success) {
          setPricingInfo(pricingResponse.data.pricingInfo);
        }
      } catch (priceErr) {
        console.log('가격 정보를 찾을 수 없습니다:', priceErr);
        // 가격 정보 실패는 전체 요청을 실패시키지 않음
      }
    } catch (err) {
      setError(err.response?.data?.error || '정보를 찾는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">웹사이트 정보 찾기</h1>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="웹사이트 URL을 입력하세요"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? '검색 중...' : '정보 찾기'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {siteInfo && (
        <div className="border rounded p-4 space-y-4">
          {/* 로고 */}
          {siteInfo.logo && (
            <div>
              <p className="font-bold mb-2">로고:</p>
              {siteInfo.logo.type === 'svg' ? (
                <div dangerouslySetInnerHTML={{ __html: siteInfo.logo.content }} />
              ) : (
                <img src={siteInfo.logo.url} alt="Website Logo" className="max-w-full h-auto"/>
              )}
            </div>
          )}

          {/* 파비콘 */}
          {siteInfo.favicon && (
            <div>
              <p className="font-bold mb-2">파비콘:</p>
              <img src={siteInfo.favicon} alt="Favicon" className="w-6 h-6"/>
            </div>
          )}

          {/* 제목 */}
          {siteInfo.title && (
            <div>
              <p className="font-bold mb-1">제목:</p>
              <p>{siteInfo.title}</p>
            </div>
          )}

          {/* 설명 */}
          {siteInfo.description && (
            <div>
              <p className="font-bold mb-1">설명:</p>
              <p>{siteInfo.description}</p>
            </div>
          )}

          {/* 회사 정보 */}
          {siteInfo.company && (
            <div>
              <p className="font-bold mb-1">회사:</p>
              <p>{siteInfo.company}</p>
            </div>
          )}

          {/* 소셜 미디어 링크 */}
          {siteInfo.socialLinks && Object.values(siteInfo.socialLinks).some(link => link) && (
            <div>
              <p className="font-bold mb-2">소셜 미디어:</p>
              <div className="flex space-x-4">
                {siteInfo.socialLinks.twitter && (
                  <a href={siteInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Twitter
                  </a>
                )}
                {siteInfo.socialLinks.linkedin && (
                  <a href={siteInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    LinkedIn
                  </a>
                )}
                {siteInfo.socialLinks.facebook && (
                  <a href={siteInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Facebook
                  </a>
                )}
                {siteInfo.socialLinks.instagram && (
                  <a href={siteInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Instagram
                  </a>
                )}
              </div>
            </div>
          )}

          {/* 연락처 정보 */}
          {siteInfo.contact && (Object.values(siteInfo.contact).some(info => info)) && (
            <div>
              <p className="font-bold mb-2">연락처:</p>
              {siteInfo.contact.email && (
                <p>이메일: <a href={`mailto:${siteInfo.contact.email}`} className="text-blue-500 hover:underline">
                  {siteInfo.contact.email}
                </a></p>
              )}
              {siteInfo.contact.phone && (
                <p>전화번호: <a href={`tel:${siteInfo.contact.phone}`} className="text-blue-500 hover:underline">
                  {siteInfo.contact.phone}
                </a></p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 가격 정보 섹션 */}
      {pricingInfo && pricingInfo.plans.length > 0 && (
        <div className="border rounded p-4 space-y-4 mt-4">
          <h2 className="text-xl font-bold">가격 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricingInfo.plans.map((plan, index) => (
              <div key={index} className="border rounded p-4 shadow-sm">
                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <p className="text-xl font-bold text-blue-600 mb-2">
                  {plan.price}
                  {!plan.isContactRequired && (
                    <span className="text-sm text-gray-600 ml-1">/{plan.period}</span>
                  )}
                </p>
                
                {/* 기능 목록 추가 */}
                {plan.features && plan.features.length > 0 && (
                  <ul className="mt-4 space-y-2 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* 추가 정보 */}
          <div className="flex gap-4 text-sm text-gray-600">
            {pricingInfo.hasFreeplan && (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                무료 요금제 제공
              </span>
            )}
            <span>기본 통화: {pricingInfo.currency}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;