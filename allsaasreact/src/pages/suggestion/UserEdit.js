import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserEdit = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    saasName: '',
    suggestion: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/suggestion/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });


      if (!response.ok) {
        throw new Error('서버 에러');
      }

      alert('제안이 성공적으로 제출되었습니다!');
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
          <div>
            <label className="block text-base mb-2">SaaS 이름</label>
            <input
              type="text"
              name="saasName"
              value={formData.saasName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-base mb-2">제안 내용</label>
            <textarea
              name="suggestion"
              value={formData.suggestion}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            제안하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;