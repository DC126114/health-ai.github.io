import React from 'react';

// 身體部位數據
export const bodyParts = [
  { 
    id: 'head', 
    name: '頭部', 
    symptoms: ['頭痛', '頭暈', '發燒', '噁心']
  },
  { 
    id: 'chest', 
    name: '胸部', 
    symptoms: ['咳嗽', '胸痛', '呼吸困難', '心悸']
  },
  { 
    id: 'stomach', 
    name: '腹部', 
    symptoms: ['腹痛', '嘔吐', '腹瀉', '食慾不振']
  },
  { 
    id: 'limbs', 
    name: '四肢', 
    symptoms: ['關節痛', '肌肉酸痛', '疲勞', '手腳冰冷']
  },
  { 
    id: 'throat', 
    name: '喉嚨', 
    symptoms: ['喉嚨痛', '吞嚥困難', '聲音嘶啞']
  },
  { 
    id: 'skin', 
    name: '皮膚', 
    symptoms: ['發疹', '搔癢', '出汗', '發紅']
  }
];

function BodyPartMap({ selectedParts, onPartSelect }) {
  const handleClick = (partId) => {
    if (selectedParts.includes(partId)) {
      // 如果已選中，則移除
      onPartSelect(selectedParts.filter(id => id !== partId));
    } else {
      // 如果未選中，則添加
      onPartSelect([...selectedParts, partId]);
    }
  };

  return (
    <div className="body-part-map">
      <h2 className="text-xl font-semibold mb-4">選擇身體部位</h2>
      <p className="text-gray-600 mb-4">可以選擇多個部位</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {bodyParts.map(part => (
          <button
            key={part.id}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${selectedParts.includes(part.id)
                ? 'border-primary-color bg-blue-50'
                : 'border-gray-200 hover:border-primary-color'
              }
            `}
            onClick={() => handleClick(part.id)}
          >
            <span className="block text-lg font-medium">{part.name}</span>
            <span className="text-sm text-gray-500">
              {part.symptoms.join('、')}
            </span>
            {selectedParts.includes(part.id) && (
              <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                已選擇
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BodyPartMap; 