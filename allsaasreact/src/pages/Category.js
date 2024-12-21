import React, { useState } from 'react';
import CategoryBox from './CategoryBox';

const Category = () => {
  const [categories, setCategories] = useState([
    { id: 1 },
    { id: 2 }
  ]);

  const addCategory = () => {
    const newCategory = {
      id: categories.length + 1
    };
    setCategories([...categories, newCategory]);
  };

  return (
    <div className="px-6 py-6 max-w-[1000px] mx-auto">
      <button 
        onClick={addCategory}
        className="px-4 py-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-sm mb-6 transition-all duration-200"
      >
        + 카테고리 추가
      </button>
      <div className="grid grid-cols-1 gap-20">
        {categories.map((category) => (
          <CategoryBox key={category.id} site={category} />
        ))}
      </div>
    </div>
  );
};

export default Category;