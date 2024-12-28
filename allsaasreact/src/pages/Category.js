import React, { useState, useEffect } from 'react';
import CategoryBox from './CategoryBox';

const Category = () => {
 const [siteData, setSiteData] = useState([]);
 const [reviews, setReviews] = useState([]);

 useEffect(() => {
   const fetchSites = async () => {
     try {
       const response = await fetch('http://localhost:8080/api/sites');
       const {sites, reviews} = await response.json();
       setSiteData(sites);
       setReviews(reviews);
     } catch (error) {
       console.error('Error:', error);
       setSiteData([]);
       setReviews([]);
     }
   };

   fetchSites();
 }, []);

 return (
   <div className="category-page max-w-[1200px] mx-auto px-6">
     <div className="breadcrumb py-8 text-sm">
       <span className="text-gray-600">카테고리 &gt; 생산성 및 시간관리</span>
     </div>
     
     <div className="category-grid space-y-16">
       {siteData && siteData.length > 0 ? (
         siteData.map((site, index) => {
           const siteReviews = reviews.filter(review => review.name === site.name);
           
           return (
             <CategoryBox 
               key={index}
               siteData={site}
               reviews={siteReviews}
             />
           );
         })
       ) : (
         <div className="text-center py-8">데이터를 불러오는 중...</div>
       )}
     </div>
   </div>
 );
};

export default Category;