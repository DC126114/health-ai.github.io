import React, { useState } from 'react';
import { askAI } from '../utils/aiService';

function AskAI() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 格式化 AI 回答
  const formatAnswer = (text) => {
    // 分段處理
    const paragraphs = text.split(/\n+/);
    
    return paragraphs.map((paragraph, index) => {
      // 處理編號列表
      if (paragraph.match(/^\d+\./)) {
        const items = paragraph.split(/(?=\d+\.)/);
        return (
          <ul key={index} className="list-none space-y-2 my-4">
            {items.filter(Boolean).map((item, i) => (
              <li key={i} className="flex">
                <span className="text-blue-600 font-semibold mr-2">{item.match(/^\d+/)?.[0]}.</span>
                <span>{item.replace(/^\d+\./, '').trim()}</span>
              </li>
            ))}
          </ul>
        );
      }
      
      // 處理普通段落
      return <p key={index} className="mb-4">{paragraph.trim()}</p>;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await askAI(question);
      setAnswer(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">AI 醫療百科</h1>
      
      {/* 問題輸入區 */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="question" className="block text-sm font-medium mb-2">
            請輸入您想了解的醫療知識問題
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="例如：感冒發燒要如何處理？"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            loading || !question.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在思考中...
            </span>
          ) : '提交問題'}
        </button>
      </form>

      {/* 錯誤提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* 回答區域 */}
      {answer && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">AI 回答：</h2>
          <div className="prose prose-blue max-w-none">
            {formatAnswer(answer)}
          </div>
        </div>
      )}

      {/* 知識庫快速訪問 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">常見問題</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonQuestions.map((q, index) => (
            <button
              key={index}
              onClick={() => setQuestion(q)}
              className="p-3 text-left border rounded-lg hover:bg-gray-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const commonQuestions = [
  "發燒的處理方法有哪些？",
  "如何判斷是否需要就醫？",
  "兒童感冒的注意事項有哪些？",
  "如何預防流感？"
];

export default AskAI; 