// pages/AdminPage.js - 분석 데이터 보여주기
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';


function AdminPage() {
    const [analyticsData, setAnalyticsData] = useState(null);
  
    useEffect(() => {
      // GA4 API에서 데이터 가져오기
      const fetchAnalytics = async () => {
        const response = await axios.get('/api/analytics-data');
        setAnalyticsData(response.data);
      };
  
      fetchAnalytics();
    }, []);
  
    return (
      <div>
        <h1>사이트 분석</h1>
        
        {/* 방문자 수 차트 */}
        <div>
          <h2>일일 방문자 수</h2>
          <LineChart width={600} height={300} data={analyticsData?.visitors}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </div>
  
        {/* 페이지별 조회수 */}
        <div>
          <h2>많이 본 페이지</h2>
          {analyticsData?.topPages.map(page => (
            <div key={page.path}>
              {page.path}: {page.views}회
            </div>
          ))}
        </div>
  
        {/* 다른 분석 데이터들... */}
      </div>
    );
  }