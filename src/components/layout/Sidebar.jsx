import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg p-6">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/symptom-check" className="text-primary-color hover:text-blue-700">
              症状评估
            </Link>
          </li>
          <li>
            <Link to="/health-diary" className="text-primary-color hover:text-blue-700">
              健康日记
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar; 