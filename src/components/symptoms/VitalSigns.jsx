import React from 'react';

function VitalSigns({ values, onChange }) {
  return (
    <div className="vital-signs p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">體徵錄入</h2>

      <div className="space-y-4">
        {/* 體溫輸入 */}
        <div className="form-group">
          <label 
            htmlFor="temperature" 
            className="block text-sm font-medium mb-2"
          >
            體溫 (°C)
          </label>
          <div className="flex gap-2 items-center">
            <input
              id="temperature"
              type="number"
              step="0.1"
              className="flex-1 p-2 border rounded"
              value={values.temperature}
              onChange={(e) => onChange({ temperature: e.target.value })}
              placeholder="36.5"
              disabled={values.temperature === 'unknown'}
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={values.temperature === 'unknown'}
                onChange={(e) => onChange({ 
                  temperature: e.target.checked ? 'unknown' : ''
                })}
                className="mr-2"
              />
              未知
            </label>
          </div>
        </div>

        {/* 持續時間 */}
        <div className="form-group">
          <label 
            htmlFor="duration"
            className="block text-sm font-medium mb-2"
          >
            症狀持續時間
          </label>
          <select
            id="duration"
            className="w-full p-2 border rounded"
            value={values.duration}
            onChange={(e) => onChange({ duration: e.target.value })}
          >
            <option value="">請選擇</option>
            <option value="0-24h">24小時內</option>
            <option value="1-3d">1-3天</option>
            <option value="3-7d">3-7天</option>
            <option value="7d+">超過一週</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default VitalSigns; 