import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          404 - 頁面未找到
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          抱歉，您訪問的頁面不存在
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
}

export default NotFound; 