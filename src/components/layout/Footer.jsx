import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-50 py-4 mt-auto">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center text-sm text-gray-500">
          <p>兒童疾病健康小助手 © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 