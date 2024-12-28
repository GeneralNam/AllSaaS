// App.js
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Category from './pages/Category';
import AppInfo from './pages/AppInfo';
import AddSaasForm from './pages/AddSaasForm';
import Main from './pages/Main';
import Navbar from './Navbar';

// 페이지 컴포넌트들
// const Home = () => {
//   return <h1>카테고리</h1>;
// };

// const AddSite = () => {
//   return <h1>사이트 추가</h1>;
// };

// const Collaboration = () => {
//   return <h1>협업</h1>;
// };

// const MyPage = () => {
//   return <h1>마이페이지</h1>;
// };

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
        <Navbar />
        <div className="pt-16"> {/* Navbar 높이만큼 패딩 추가 */}
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/appinfo/:name" element={<AppInfo />} />
            <Route path="/add-site" element={<AddSaasForm />} />
            <Route path="/collaboration" element={<Collaboration />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="*" element={<h1>페이지를 찾을 수 없습니다.</h1>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;