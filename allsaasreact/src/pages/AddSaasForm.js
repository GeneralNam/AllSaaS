import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddSaasForm = () => {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: '',
    siteUrl: '',
    info: '',
    youtubeUrl: '',
    description: ''
  });
  const [logo, setLogo] = useState(null);
  const [pictures, setPictures] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e) => {
    if (e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handlePictureUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + pictures.length <= 3) {
      setPictures(prev => [...prev, ...files]);
    } else {
      alert('최대 3개의 사진만 업로드할 수 있습니다.');
    }
  };

  const handleRemovePicture = (index) => {
    setPictures(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    // 기본 데이터 추가
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    // 로고 추가
    if (logo) {
      formDataToSend.append('logo', logo);
    }
    
    // 사진들 추가
    pictures.forEach(pic => {
      formDataToSend.append('pictures', pic);
    });
  
    try {
      const response = await fetch('http://localhost:8080/addsaas', {
        method: 'POST',
        body: formDataToSend
      });
  
      if (!response.ok) {
        throw new Error('서버 에러');
      }
  
      const data = await response.json();
      alert('성공적으로 추가되었습니다!');
      // 성공 후 다른 페이지로 이동
      navigate('/category');  // 이동하고 싶은 경로
      // 폼 초기화나 리다이렉트 등 추가 처리
      
    } catch (error) {
      console.error('Error:', error);
      alert('에러가 발생했습니다: ' + error.message);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">새로운 SaaS 추가</h2>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">서비스 이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">사이트 URL</label>
              <input
                type="url"
                name="siteUrl"
                value={formData.siteUrl}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">서비스 소개</label>
              <textarea
                name="info"
                value={formData.info}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">YouTube URL</label>
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">상세 설명</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* 로고 업로드 */}
          <div>
            <label className="block text-sm font-medium mb-2">로고 이미지</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm text-gray-600">
                  {logo ? logo.name : '로고 이미지를 선택하세요'}
                </span>
              </label>
            </div>
          </div>

          {/* 사진 업로드 */}
          <div>
            <label className="block text-sm font-medium mb-2">서비스 사진 (최대 3개)</label>
            <div className="border-2 border-dashed rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePictureUpload}
                className="hidden"
                id="pictures-upload"
              />
              <label htmlFor="pictures-upload" className="cursor-pointer block text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm text-gray-600">
                  사진을 선택하세요 ({pictures.length}/3)
                </span>
              </label>
              {pictures.length > 0 && (
                <div className="mt-4 space-y-2">
                  {pictures.map((pic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{pic.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePicture(index)}
                        className="text-red-500 text-sm hover:text-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            SaaS 추가하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSaasForm;