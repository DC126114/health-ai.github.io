import React, { useEffect } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { testApiConnection } from './utils/aiService';
import NotFound from './pages/NotFound';

// 页面组件
import Home from './pages/Home';
import SymptomCheck from './pages/SymptomCheck';
import AskAI from './pages/AskAI';
import TestApi from './pages/TestApi';

function App() {
  useEffect(() => {
    async function checkApiConnection() {
      try {
        const isConnected = await testApiConnection();
        if (!isConnected) {
          console.error('無法連接到 AI 服務');
        }
      } catch (error) {
        console.error('API 連接測試失敗:', error);
      }
    }
    checkApiConnection();
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        {/* 页面头部 */}
        <Header />
        
        <main className="flex-1 bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/symptom-check" element={<SymptomCheck />} />
            <Route path="/ask-ai" element={<AskAI />} />
            <Route path="/test-api" element={<TestApi />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* 页面底部 */}
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App; 