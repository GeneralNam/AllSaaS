import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [categories] = useState([
    '생산성 및 시간관리',
    '프로젝트 관리',
    'AI 도구',
    '협업 도구',
    '디자인 도구',
    '마케팅 도구'
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 스크롤 다운할 때는 navbar 숨기기
      // 스크롤 업할 때는 navbar 보여주기
      if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Blur Overlay */}
      <div
        className={"fixed inset-0 transition-all duration-500 " + 
          (isHovered ? 'backdrop-blur-md bg-black/10' : 'backdrop-blur-none')}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredSection(null);
        }}
      >
        {/* 카테고리 드롭다운 메뉴 */}
        {hoveredSection === 'categories' && (
          <div className="max-w-7xl mx-auto px-6 pt-16">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/categories/${category}`}
                className="block px-4 py-2 text-gray-800 hover:text-black transition-colors duration-200"
              >
                {category}
              </Link>
            ))}
          </div>
        )}
      </div>
  
      {/* Navigation Bar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 bg-white
          ${visible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div 
          className="w-full px-6"
          onMouseEnter={() => setIsHovered(true)}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="text-xl font-semibold">
              AllSaaS
            </Link>
  
            {/* Navigation Links */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center space-x-8">
                <NavItem
                  to="/categories"
                  label="카테고리"
                  setHoveredSection={setHoveredSection}
                  isActive={hoveredSection === 'categories'}
                />
                <NavItem
                  to="/add-site"
                  label="사이트추가"
                  setHoveredSection={setHoveredSection}
                  isActive={hoveredSection === 'add-site'}
                />
                <NavItem
                  to="/collaboration"
                  label="협업"
                  setHoveredSection={setHoveredSection}
                  isActive={hoveredSection === 'collaboration'}
                />
                <NavItem
                  to="/mypage"
                  label="마이페이지"
                  setHoveredSection={setHoveredSection}
                  isActive={hoveredSection === 'mypage'}
                />
              </div>
            </div>
          </div>
  
          {/* 구분선 */}
          <div className={`w-[1800px] h-[1px] mx-auto transition-opacity duration-300 
            ${isHovered ? 'opacity-0' : 'opacity-100'} bg-gray-400`} 
          />
        </div>
      </nav>
    </>
  );
};

const NavItem = ({ to, label, setHoveredSection, isActive }) => {
 const sectionId = to.replace('/', '');
 
 return (
   <Link
     to={to}
     className={`relative px-4 py-2 transition-colors duration-200
       ${isActive ? 'text-black' : 'text-gray-600 hover:text-black'}`}
     onMouseEnter={() => setHoveredSection(sectionId)}
     onMouseLeave={() => setHoveredSection(null)}
   >
     {label}
     {isActive && (
       <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black transition-all duration-200" />
     )}
   </Link>
 );
};

export default Navbar;