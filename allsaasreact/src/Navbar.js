import React, { useState, useEffect, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './pages/context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate(); 
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    nickname: null
  });

  // 카테고리 목록
  const categories = [
    '생산성 및 시간관리',
    '프로젝트 관리',
    'AI 도구',
    '협업 도구',
    '디자인 도구',
    '마케팅 도구'
  ];

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

  // 스크롤 방향 따라 Navbar 숨김/보임
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
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
      {/* Blur Overlay - 카테고리 hover시에만 작동 */}
      {hoveredSection === 'categories' && (
        <div
          className="fixed inset-0 z-40 transition-all duration-500 backdrop-blur-md bg-black/10"
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
 
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 bg-gray-100
          ${visible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="relative w-full px-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between py-4">
            {/* 로고 */}
            <Link to="/" className="text-xl font-semibold">
              AllSaaS
            </Link>
 
            {/* 중앙 정렬된 메뉴들 */}
            <div className="flex-1 flex justify-center items-center space-x-2">
              {/* 카테고리 NavItem */}
              <div 
                className="relative group"
                onMouseEnter={() => {
                  setHoveredSection('categories');
                  setIsHovered(true);
                }}
                onMouseLeave={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const isInDropdown = e.clientY >= rect.bottom;
                  
                  if (!isInDropdown) {
                    setHoveredSection(null);
                    setIsHovered(false);
                  }
                }}
              >
                <Link
                  to="/categories"
                  className={`px-4 py-2 transition-colors duration-200
                    ${hoveredSection === 'categories' ? 'text-black' : 'text-gray-600 hover:text-black'}`}
                >
                  카테고리
                </Link>
 
                {/* 드롭다운 (카테고리 목록) */}
                {hoveredSection === 'categories' && (
                  <div
                    className="absolute top-full left-0 mt-8 z-50 w-[200px] bg-transparent border-none shadow-none transition-all duration-300"
                    onMouseLeave={() => {
                      setHoveredSection(null);
                      setIsHovered(false);
                    }}
                  >
                    {categories.map((category) => (
                      <Link
                        key={category}
                        to={`/categories/${category}`}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
 
              {/* 다른 NavItem들 */}
              <NavItem
                to="/suggestion"
                label="제안"
                hoveredSection={hoveredSection}
                setHoveredSection={setHoveredSection}
                setIsHovered={setIsHovered}
                noHoverEffect={true}
              />

              {authStatus.isAuthenticated && (
              <NavItem
                to="/mypage"
                label="마이페이지"
                hoveredSection={hoveredSection}
                setHoveredSection={setHoveredSection}
                setIsHovered={setIsHovered}
                noHoverEffect={true}
              />
            )}
            </div>
 
            {/* 우측 로그인/로그아웃 */}
            <div className="flex items-center">
            {authStatus.isAuthenticated ? (
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch('/logout', {
                      method: 'POST',
                      credentials: 'include'  // 쿠키 전송을 위해 필요
                    });
                    if (response.ok) {
                      // 로그아웃 성공시 상태 업데이트
                      setAuthStatus({
                        isAuthenticated: false,
                        nickname: null
                      });
                      navigate('/'); 
                    }
                  } catch (error) {
                    console.error('로그아웃 실패:', error);
                  }
                }}
                className="px-4 py-2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                로그아웃
              </button>
            ) : (
              <a 
                href="http://localhost:8080/login/federated/google"
                className="px-4 py-2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                Sign in with Google
              </a>
            )}
            </div>
 
          </div>
 
          {/* <div
            className={`w-[1400px] h-[1px] mx-auto transition-opacity duration-300 
              ${hoveredSection === 'categories' ? 'opacity-0' : 'opacity-100'} bg-gray-400`}
          /> */}
        </div>
      </nav>
    </>
  );
};

const NavItem = ({ to, label, hoveredSection, setHoveredSection, setIsHovered, noHoverEffect }) => {
  const sectionId = to.replace('/', '');

  if (noHoverEffect) {
    return (
      <Link
        to={to}
        className="px-4 py-2 text-gray-600 hover:text-black transition-colors duration-200"
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`relative px-4 py-2 transition-colors duration-200
        ${hoveredSection === sectionId ? 'text-black' : 'text-gray-600 hover:text-black'}`}
      onMouseEnter={() => {
        setHoveredSection(sectionId);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setHoveredSection(null);
      }}
    >
      {label}
      {hoveredSection === sectionId && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black transition-all duration-200" />
      )}
    </Link>
  );
};

export default Navbar;