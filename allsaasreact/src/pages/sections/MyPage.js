import React, { useState, useEffect } from 'react';

const MyPage = () => {
  const [currentNickname, setCurrentNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await fetch('/api/user/nickname');
        const data = await response.json();
        if (data.nickname) {
          setCurrentNickname(data.nickname);
        }
      } catch (error) {
        console.error('닉네임 가져오기 실패:', error);
      }
    };

    fetchNickname();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNickname.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/change-nickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: newNickname }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setCurrentNickname(newNickname);
        setNewNickname('');
        setMessage('닉네임이 변경되었습니다.');
      } else {
        throw new Error(data.error || '닉네임 변경 실패');
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">닉네임 변경</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          현재 닉네임
        </label>
        <p className="text-lg font-semibold text-gray-800">
          {currentNickname}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="newNickname" 
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            새로운 닉네임
          </label>
          <input
            id="newNickname"
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            placeholder="새로운 닉네임을 입력하세요"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading || !newNickname.trim()}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? '변경 중...' : '닉네임 변경'}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
};

export default MyPage;