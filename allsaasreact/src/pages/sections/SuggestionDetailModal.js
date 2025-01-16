// SuggestionDetailModal.js
import React from 'react';

const SuggestionDetailModal = ({ isOpen, suggestion, onClose, onReviewChange }) => {
  if (!isOpen || !suggestion) return null;

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <span className="px-2 py-1 bg-green-500 text-white rounded-full text-sm">
        검토완료
      </span>
    ) : (
      <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-sm">
        미검토
      </span>
    );
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'site': return '사이트';
      case 'edit': return '수정';
      default: return '문의';
    }
  };
  console.log('suggestion:', suggestion);  // suggestion 전체 객체 확인
  console.log('createdAt:', suggestion.createdAt);  // createdAt 값만 확인
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">상세 정보</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">분류</p>
              <p className="font-medium">{getTypeText(suggestion.type)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">작성자</p>
              <p className="font-medium">{suggestion.userId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">상태</p>
              <div className="mt-1">
                {getStatusBadge(suggestion.status)}
              </div>
            </div>
            <div>
            <p className="text-sm text-gray-500">작성일</p>
            <p className="font-medium">
              {new Date(suggestion.createdAt).toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">내용</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="whitespace-pre-wrap">{suggestion.content}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            닫기
          </button>
          <button
            onClick={() => onReviewChange(suggestion._id, !suggestion.reviewed)}
            className={`px-4 py-2 rounded-lg text-white ${
              suggestion.status === 1
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {suggestion.status === 1 ? '미검토로 변경' : '검토완료로 변경'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionDetailModal;