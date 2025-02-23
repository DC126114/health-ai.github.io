import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const features = [
    {
      id: 'symptom-check',
      title: '症狀檢查',
      description: '輸入症狀，獲得專業的初步評估和建議',
      path: '/symptom-check',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'ai-consultation',
      title: 'AI 百科',
      description: '24小時在線，解答您的醫療知識問題',
      path: '/ask-ai',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          兒童健康助手
        </h1>
        <p className="text-xl text-gray-600">
          為您的孩子提供智能化的健康諮詢服務
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {features.map(feature => (
          <Link
            key={feature.id}
            to={feature.path}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="bg-primary-color text-white p-3 rounded-lg">
                {feature.icon}
              </div>
              <h2 className="text-xl font-semibold ml-4">{feature.title}</h2>
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500">
          注意：本服務僅提供初步建議，不能替代專業醫生的診斷
        </p>
      </div>
    </div>
  );
}

export default Home; 