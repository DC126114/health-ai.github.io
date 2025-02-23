import React, { useState } from 'react';
import { bodyParts } from './BodyPartMap';

// 症狀數據
const commonSymptoms = {
  head: {
    name: '頭部症狀',
    items: bodyParts.find(part => part.id === 'head')?.symptoms || []
  },
  chest: {
    name: '胸部症狀',
    items: bodyParts.find(part => part.id === 'chest')?.symptoms || []
  },
  stomach: {
    name: '腹部症狀',
    items: bodyParts.find(part => part.id === 'stomach')?.symptoms || []
  },
  limbs: {
    name: '四肢症狀',
    items: bodyParts.find(part => part.id === 'limbs')?.symptoms || []
  },
  throat: {
    name: '喉嚨症狀',
    items: bodyParts.find(part => part.id === 'throat')?.symptoms || []
  },
  skin: {
    name: '皮膚症狀',
    items: bodyParts.find(part => part.id === 'skin')?.symptoms || []
  },
  general: {
    name: '全身症狀',
    items: bodyParts.find(part => part.id === 'general')?.symptoms || []
  }
};

function SymptomSelector({ selectedBodyParts, selectedSymptoms, onSymptomSelect }) {
  const [otherSymptom, setOtherSymptom] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  // 處理其他症狀的提交
  const handleOtherSymptomSubmit = (e) => {
    e.preventDefault();
    if (otherSymptom.trim()) {
      onSymptomSelect(otherSymptom.trim());
      setOtherSymptom('');
      setShowOtherInput(false);
    }
  };

  // 根據選擇的身體部位過濾症狀
  const availableSymptoms = selectedBodyParts.length > 0
    ? selectedBodyParts.reduce((acc, partId) => {
        if (commonSymptoms[partId]) {
          acc[partId] = commonSymptoms[partId];
        }
        return acc;
      }, {})
    : commonSymptoms;

  return (
    <div className="symptom-selector">
      <h2 className="text-xl font-semibold mb-4">選擇症狀</h2>
      <p className="text-gray-600 mb-4">請選擇您目前遇到的症狀（可多選）</p>

      <div className="space-y-6">
        {Object.entries(availableSymptoms).map(([category, { name, items }]) => (
          <div key={category} className="symptom-category">
            <h3 className="font-medium text-lg mb-3">{name}</h3>
            <div className="flex flex-wrap gap-2">
              {items.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => onSymptomSelect(symptom)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm transition-colors
                    ${selectedSymptoms.includes(symptom)
                      ? 'bg-primary-color text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {symptom}
                  {selectedSymptoms.includes(symptom) && (
                    <span className="ml-1">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* 其他症狀區域 */}
        <div className="symptom-category">
          <h3 className="font-medium text-lg mb-3">其他症狀</h3>
          {showOtherInput ? (
            <form onSubmit={handleOtherSymptomSubmit} className="flex gap-2">
              <input
                type="text"
                value={otherSymptom}
                onChange={(e) => setOtherSymptom(e.target.value)}
                placeholder="請輸入其他症狀"
                className="flex-1 px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-primary-color text-white rounded-md hover:bg-blue-600"
              >
                添加
              </button>
              <button
                type="button"
                onClick={() => setShowOtherInput(false)}
                className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                取消
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowOtherInput(true)}
              className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              + 添加其他症狀
            </button>
          )}
        </div>
      </div>

      {/* 已選擇的症狀列表 */}
      {selectedSymptoms.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">已選擇的症狀：</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map(symptom => (
              <span
                key={symptom}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
              >
                {symptom}
                <button
                  onClick={() => onSymptomSelect(symptom)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SymptomSelector; 