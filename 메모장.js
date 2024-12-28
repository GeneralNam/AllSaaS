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
    />

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
              <div className="relative">
                <NavItem
                  to="/categories"
                  label="카테고리"
                  setHoveredSection={setHoveredSection}
                  isActive={hoveredSection === 'categories'}
                />
                
                {/* 카테고리 드롭다운 메뉴 */}
                {hoveredSection === 'categories' && (
                  <div className="absolute top-full left-0 pt-2 w-48">
                    <div className="bg-transparent rounded-md py-2">
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
                  </div>
                )}
              </div>
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