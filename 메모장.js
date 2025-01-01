import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    nickname: null
  });

  // 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        setAuthStatus(data);
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
      }
    };

    checkAuthStatus();
  }, []);

  // ... 기존 useEffect와 categories 배열 유지 ...

  return (
    <>
      {/* Blur Overlay - 기존 코드 유지 */}
      {hoveredSection === 'categories' && (
        <div className="fixed inset-0 z-40 transition-all duration-500 backdrop-blur-md bg-black/10"
          onMouseEnter={() => {
            if (!hoveredSection) {
              setIsHovered(false);
            }
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setHoveredSection(null);
          }}
        />
      )}

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 bg-white
        ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="relative w-full px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between py-4">
            <Link to="/" className="text-xl font-semibold">
              AllSaaS
            </Link>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-8">
              {/* 기존 NavItem들 유지 */}
              <div className="relative group">
                {/* 기존 카테고리 NavItem 코드 */}
              </div>

              <NavItem
                to="/add-site"
                label="사이트추가"
                hoveredSection={hoveredSection}
                setHoveredSection={setHoveredSection}
                setIsHovered={setIsHovered}
                noHoverEffect={true}
              />
              <NavItem
                to="/collaboration"
                label="협업"
                hoveredSection={hoveredSection}
                setHoveredSection={setHoveredSection}
                setIsHovered={setIsHovered}
                noHoverEffect={true}
              />
              <NavItem
                to="/mypage"
                label="마이페이지"
                hoveredSection={hoveredSection}
                setHoveredSection={setHoveredSection}
                setIsHovered={setIsHovered}
                noHoverEffect={true}
              />
              
              {/* 로그인 상태에 따른 조건부 렌더링 */}
              {authStatus.isAuthenticated ? (
                <span className="px-4 py-2 text-gray-600">
                  {authStatus.nickname}
                </span>
              ) : (
                <a 
                  href="http://localhost:8080/login/federated/google"
                  className="px-4 py-2 text-gray-600 hover:text-black transition-colors duration-200"
                >
                  Sign in with Google
                </a>
              )}
            </div>

            <div className="w-[100px]"></div>
          </div>

          <div className={`w-[1800px] h-[1px] mx-auto transition-opacity duration-300 
            ${hoveredSection === 'categories' ? 'opacity-0' : 'opacity-100'} bg-gray-400`}
          />
        </div>
      </nav>
    </>
  );
};

// NavItem 컴포넌트는 기존과 동일

export default Navbar;