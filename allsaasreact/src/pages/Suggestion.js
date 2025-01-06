import React, { useState } from 'react';
import AddSaasForm from './suggestion/AddSaasForm';
import UserEdit from './suggestion/UserEdit';
import UserInquiry from './suggestion/UserInquiry';

const Suggestion = () => {
  const [activeForm, setActiveForm] = useState('site');

  const navItems = [
    { id: 'site', text: '사이트 추가' },
    { id: 'edit', text: '정보수정제안' },
    { id: 'inquiry', text: '건의사항/문의' }
  ];

  const renderForm = () => {
    switch (activeForm) {
      case 'site':
        return (
          <AddSaasForm />
        );
      case 'edit':
        return (
          <UserEdit />
        );
      case 'inquiry':
        return (
          <UserInquiry />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <nav className="flex justify-center space-x-12 border-b">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveForm(item.id)}
            className="py-4 px-2 text-gray-600 hover:text-gray-900"
          >
            {item.text}
          </button>
        ))}
      </nav>
      {renderForm()}
    </div>
  );
};

export default Suggestion;