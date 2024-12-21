// App.js
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Category from './pages/Category';

// 페이지 컴포넌트들
const Home = () => {
  return <h1>카테고리</h1>;
};

const AddSite = () => {
  return <h1>사이트 추가</h1>;
};

const Collaboration = () => {
  return <h1>협업</h1>;
};

const MyPage = () => {
  return <h1>마이페이지</h1>;
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* 네비게이션 */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo">AllSaaS</div>
            <ul className="nav-links">
              <li><Link to="/categories">카테고리</Link></li>
              <li><Link to="/add-site">사이트추가</Link></li>
              <li><Link to="/collaboration">협업</Link></li>
              <li><Link to="/mypage">마이페이지</Link></li>
            </ul>
          </div>
        </nav>

        {/* 라우트 설정 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/add-site" element={<AddSite />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="*" element={<h1>페이지를 찾을 수 없습니다.</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;