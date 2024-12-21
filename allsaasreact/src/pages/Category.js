// src/pages/Category.js
import React, { useState } from 'react';
import CategoryBox from './CategoryBox';
import './Category.css';

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
    <div className="category-page">
      <button className="add-category-btn" onClick={addCategory}>
        + 카테고리 추가
      </button>
      <div className="category-grid">
        {categories.map((category) => (
          <CategoryBox key={category.id} site={category} />
        ))}
      </div>
    </div>
  );
};

export default Category;