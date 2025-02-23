import React, { useState } from 'react';
import SymptomSelector from '../components/symptoms/SymptomSelector';
import BodyPartMap, { bodyParts } from '../components/symptoms/BodyPartMap';
import VitalSigns from '../components/symptoms/VitalSigns';
import { analyzeSymptoms } from '../utils/aiService';

function SymptomCheck() {
  // 狀態管理
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [vitalSigns, setVitalSigns] = useState({
    temperature: '',
    duration: '',
  });
  const [assessmentResult, setAssessmentResult] = useState(null);

  // 新增分析狀態
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // 處理症狀選擇
  const handleSymptomSelect = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  // 處理身體部位選擇
  const handleBodyPartSelect = (parts) => {
    setSelectedBodyParts(parts);
    // 修改過濾邏輯，保留自定義症狀
    setSelectedSymptoms(prev => 
      prev.filter(symptom => {
        // 檢查症狀是否屬於預定義症狀列表
        const isPreDefinedSymptom = bodyParts.some(part => 
          part.symptoms.includes(symptom)
        );
        
        // 如果是預定義症狀，檢查是否屬於選中的部位
        // 如果不是預定義症狀（即自定義症狀），則保留
        return !isPreDefinedSymptom || parts.some(partId => 
          bodyParts.find(part => part.id === partId)
            ?.symptoms.includes(symptom)
        );
      })
    );
  };

  // 處理體徵數據更新
  const handleVitalSignsChange = (data) => {
    setVitalSigns(prev => ({ ...prev, ...data }));
  };

  // 提交評估
  const handleSubmit = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const analysisData = {
        symptoms: selectedSymptoms,
        bodyParts: selectedBodyParts.map(partId => 
          bodyParts.find(part => part.id === partId)?.name
        ),
        vitalSigns: {
          temperature: vitalSigns.temperature === 'unknown' ? '未知' : 
            (parseFloat(vitalSigns.temperature) || 36.5),
          duration: vitalSigns.duration,
        }
      };

      const result = await analyzeSymptoms(analysisData);
      setAssessmentResult(result);
    } catch (err) {
      setError('分析過程中發生錯誤，請稍後重試');
      console.error('評估錯誤:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">症狀評估</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：身體部位和症狀選擇 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <BodyPartMap 
                selectedParts={selectedBodyParts}
                onPartSelect={handleBodyPartSelect}
              />
            </div>

            {selectedBodyParts.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <SymptomSelector
                  selectedBodyParts={selectedBodyParts}
                  selectedSymptoms={selectedSymptoms}
                  onSymptomSelect={handleSymptomSelect}
                />
              </div>
            )}
          </div>

          {/* 右側：體徵錄入和評估結果 */}
          <div className="space-y-6">
            <VitalSigns
              values={vitalSigns}
              onChange={handleVitalSignsChange}
            />

            {/* 評估結果區域 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">AI 評估結果</h2>
              {selectedSymptoms.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">已選症狀：</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map(symptom => (
                        <span 
                          key={symptom}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                      {error}
                    </div>
                  )}

                  {assessmentResult && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">AI 評估等級：</span>
                        <span className={`px-2 py-1 rounded ${
                          assessmentResult.level === '嚴重' ? 'bg-red-100 text-red-800' :
                          assessmentResult.level === '中度' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {assessmentResult.level}
                        </span>
                      </div>
                      <div className="text-gray-600 space-y-2">
                        <p><span className="font-medium">初步診斷：</span>{assessmentResult.diagnosis}</p>
                        <p><span className="font-medium">建議：</span>{assessmentResult.advice}</p>
                        <p><span className="font-medium">緊急程度：</span>{assessmentResult.urgency}</p>
                        {assessmentResult.precautions && (
                          <div className="mt-4">
                            <p className="font-medium">注意事項：</p>
                            <ul className="list-disc list-inside pl-4 mt-2">
                              {assessmentResult.precautions.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={isAnalyzing}
                    className={`w-full py-2 px-4 rounded-md transition-colors ${
                      isAnalyzing 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-primary-color hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        正在分析中...
                      </span>
                    ) : '開始 AI 評估'}
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">
                  請先選擇症狀進行評估
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SymptomCheck; 