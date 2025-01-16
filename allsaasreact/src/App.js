import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import Category from './pages/Category';
import AppInfo from './pages/AppInfo';
import AddSaasForm from './pages/suggestion/AddSaasForm';
import Main from './pages/Main';
import Navbar from './Navbar';
import MyPage from './pages/sections/MyPage';
import { AuthContext } from './pages/context/AuthContext';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ReactGA from 'react-ga4';
import Suggestion from './pages/Suggestion';
import AdminPage from './pages/sections/AdminPage';



// 새로운 컴포넌트 - BrowserRouter 안에서 useLocation 사용
function AppContent() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log('location.pathname', location.pathname);
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return (
    <div className="App" style={{
      backgroundColor: '#f3f3f1',
      minHeight: '100vh'
    }}>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/appinfo/:name" element={<AppInfo />} />
          <Route path="/suggestion" element={<Suggestion />} />
          <Route path="/mypage" element={user ? <MyPage /> : <Navigate to="/" />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<h1>페이지를 찾을 수 없습니다.</h1>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  // 페이지 로드될 때 로그인 상태 체크
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/check-auth');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      }
    };

    checkLoginStatus();
  }, []);

  // GA4 초기화
  useEffect(() => {
    console.log('GA4 초기화');
    ReactGA.initialize('G-YETZMH3GLE', {debug_mode: true});
    console.log('GA4 초기화 완료');
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;