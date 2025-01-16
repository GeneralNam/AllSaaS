import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddSaasForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    siteUrl: '',
    userDescription: ''
  });
  const [photos, setPhotos] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length <= 3) {
      setPhotos(prev => [...prev, ...files]);
    } else {
      alert('최대 3개의 사진만 업로드할 수 있습니다.');
    }
  };

  const handleRemovePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    // Add basic data
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    // Add photos
    photos.forEach((photo, index) => {
      formDataToSend.append('userPhotos', photo);
    });
  
    try {
      const response = await fetch('/suggestion/site', {
        method: 'POST',
        body: formDataToSend
      });
  
      if (!response.ok) {
        throw new Error('서버 에러');
      }
  
      alert('성공적으로 추가되었습니다!');
      navigate('/');
      
    } catch (error) {
      console.error('Error:', error);
      alert('에러가 발생했습니다: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      
      
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Landing Page Link */}
          <div>
            <label className="block text-base mb-2">메인페이지 링크</label>
            <input
              type="url"
              name="siteUrl"
              value={formData.siteUrl}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-base mb-2">추가하고싶은 설명</label>
            <textarea
              name="userDescription"
              value={formData.userDescription}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-base mb-2">추가하고싶은 사진 (최대 3개)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label 
                htmlFor="photo-upload" 
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-gray-600">
                  사진을 선택하세요 ({photos.length}/3)
                </span>
              </label>

              {/* Selected Photos Preview */}
              {photos.length > 0 && (
                <div className="mt-4 space-y-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm truncate">{photo.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            추가하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSaasForm;