import React, { useState, useEffect } from 'react';
import SuggestionDetailModal from './SuggestionDetailModal';

const STATUS = {
  PENDING: 0,
  APPROVED: 1
};

const EmptyState = () => (
  <tr>
    <td colSpan="4" className="py-8 text-center text-gray-500">
      데이터가 없습니다
    </td>
  </tr>
);

const SuggestionTable = ({ suggestions, onReviewChange, onRowClick }) => (
  <div className="bg-white rounded-lg shadow">
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="py-3 px-4 text-left">번호</th>
          <th className="py-3 px-4 text-left">분류</th>
          <th className="py-3 px-4 text-left">작성자</th>
          <th className="py-3 px-4 text-left">상태</th>
        </tr>
      </thead>
      <tbody>
        {suggestions.length > 0 ? (
          suggestions.map((item, index) => (
            <tr
              key={item._id}
              className="border-b hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              onClick={() => onRowClick(item)}
            >
              <td className="py-3 px-4">{index + 1}</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded-full text-sm bg-gray-100">
                  {item.type === 'site' ? '사이트' : 
                   item.type === 'edit' ? '수정' : '문의'}
                </span>
              </td>
              <td className="py-3 px-4">{item.userId}</td>
              <td className="py-3 px-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReviewChange(item._id, item.status !== STATUS.APPROVED);
                  // 또는
                  // onReviewChange(item._id, item.status === STATUS.PENDING);
                }}
                className={`px-3 py-1 rounded text-sm ${
                  item.status === STATUS.APPROVED
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                {item.status === STATUS.APPROVED ? '검토완료' : '미검토'}
              </button>
              </td>
            </tr>
          ))
        ) : (
          <EmptyState />
        )}
      </tbody>
    </table>
  </div>
);

const AdminPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/admin');
      if (!response.ok) throw new Error('서버 응답에 문제가 있습니다');
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewChange = async (id, reviewed) => {
    try {
      await fetch(`/admin/suggestions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewed })
      });
  
      setSuggestions(prev => 
        prev.map(item => 
          item._id === id 
            ? { ...item, status: reviewed ? STATUS.APPROVED : STATUS.PENDING } 
            : item
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRowClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSuggestion(null);
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const pendingSuggestions = suggestions.filter(item => item.status === STATUS.PENDING);
  const approvedSuggestions = suggestions.filter(item => item.status === STATUS.APPROVED);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-6">미검토</h2>
        <SuggestionTable 
          suggestions={pendingSuggestions}
          onReviewChange={handleReviewChange}
          onRowClick={handleRowClick}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">검토완료</h2>
        <SuggestionTable 
          suggestions={approvedSuggestions}
          onReviewChange={handleReviewChange}
          onRowClick={handleRowClick}
        />
      </section>

      <SuggestionDetailModal
        isOpen={isModalOpen}
        suggestion={selectedSuggestion}
        onClose={handleCloseModal}
        onReviewChange={handleReviewChange}
      />
    </div>
  );
};

export default AdminPage;