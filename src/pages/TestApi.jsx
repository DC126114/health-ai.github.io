import React, { useState } from 'react';
import { analyzeSymptoms, testApiConnection } from '../utils/aiService';

function TestApi() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [debug, setDebug] = useState(false);

  // API 連接測試
  const testConnection = async () => {
    setLoading(true);
    try {
      const isConnected = await testApiConnection();
      console.log('API Key:', process.env.REACT_APP_API2D_KEY);
      setApiStatus({
        success: isConnected,
        message: isConnected ? 'API 連接成功' : 'API 連接失敗'
      });
    } catch (err) {
      setApiStatus({
        success: false,
        message: `API 連接錯誤: ${err.message}${debug ? '\n\nDebug 信息:\n' + JSON.stringify(err, null, 2) : ''}`
      });
    } finally {
      setLoading(false);
    }
  };

  // 基本症狀測試
  const testBasicSymptoms = async () => {
    setLoading(true);
    setError(null);
    try {
      const testData = {
        symptoms: ['發燒', '咳嗽'],
        bodyParts: ['頭部', '胸部'],
        vitalSigns: {
          temperature: 38.5,
          duration: '1-3d'
        }
      };

      console.log('發送測試數據:', testData);
      const response = await analyzeSymptoms(testData);
      console.log('收到 AI 回應:', response);
      
      setResult({
        testName: '基本症狀測試',
        input: testData,
        output: response
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 測試未知體溫
  const testUnknownTemperature = async () => {
    setLoading(true);
    setError(null);
    try {
      const testData = {
        symptoms: ['頭痛', '噁心'],
        bodyParts: ['頭部'],
        vitalSigns: {
          temperature: '未知',
          duration: '0-24h'
        }
      };

      console.log('發送測試數據 (未知體溫):', testData);
      const response = await analyzeSymptoms(testData);
      console.log('收到 AI 回應:', response);

      setResult({
        testName: '未知體溫測試',
        input: testData,
        output: response
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 測試自定義症狀
  const testCustomSymptom = async () => {
    setLoading(true);
    setError(null);
    try {
      const testData = {
        symptoms: ['發燒', '自定義症狀：眼睛紅腫'],
        bodyParts: ['頭部', '其他'],
        vitalSigns: {
          temperature: 37.8,
          duration: '1-3d'
        }
      };

      console.log('發送測試數據 (自定義症狀):', testData);
      const response = await analyzeSymptoms(testData);
      console.log('收到 AI 回應:', response);

      setResult({
        testName: '自定義症狀測試',
        input: testData,
        output: response
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API 測試頁面</h1>
      
      {/* API 狀態測試 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">API 連接測試</h2>
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          測試 API 連接
        </button>
        {apiStatus && (
          <div className={`mt-2 p-2 rounded ${
            apiStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {apiStatus.message}
          </div>
        )}
      </div>

      {/* 功能測試按鈕 */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">功能測試：</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={testBasicSymptoms}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            測試基本症狀
          </button>
          <button
            onClick={testUnknownTemperature}
            disabled={loading}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-400"
          >
            測試未知體溫
          </button>
          <button
            onClick={testCustomSymptom}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
          >
            測試自定義症狀
          </button>
        </div>
      </div>

      {/* 載入指示器 */}
      {loading && (
        <div className="mb-4 flex items-center text-blue-600">
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          處理中...
        </div>
      )}

      {/* 錯誤信息 */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-300">
          <h3 className="font-semibold mb-2">錯誤：</h3>
          <p>{error}</p>
        </div>
      )}

      {/* 測試結果 */}
      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">測試結果：</h2>
          <div className="bg-gray-100 p-4 rounded overflow-auto">
            <h3 className="font-medium mb-2">{result.testName}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">請求數據：</h4>
                <pre className="bg-white p-2 rounded mt-1">
                  {JSON.stringify(result.input, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">AI 回應：</h4>
                <pre className="bg-white p-2 rounded mt-1">
                  {JSON.stringify(result.output, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={debug}
            onChange={(e) => setDebug(e.target.checked)}
            className="mr-2"
          />
          顯示調試信息
        </label>
      </div>
    </div>
  );
}

export default TestApi; 