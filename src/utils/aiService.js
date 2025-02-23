import axios from 'axios';
import axiosRetry from 'axios-retry';
import { API_CONFIG } from './apiConfig';

// 配置重試機制
const axiosInstance = axios.create();
axiosRetry(axiosInstance, { 
  retries: 1,  // 減少重試次數
  retryDelay: (retryCount) => {
    return 10000;  // 固定 10 秒重試延遲
  },
  retryCondition: (error) => {
    return error.response?.status === 429 || 
           error.code === 'ECONNABORTED';
  }
});

// API 端點
const API_ENDPOINTS = {
  chat: '/chat/completions',  // 使用標準的 chat completions 端點
  knowledge: '/v1/chat/completions'  // 知識庫問答端點
};

// 完整的 API URL
const API_URL = `${API_CONFIG.baseURL}${API_ENDPOINTS.chat}`;

// 添加請求限制和緩存
const CACHE_DURATION = 1000 * 60 * 120; // 2小時緩存
const REQUEST_LIMIT = 2; // 每分鐘請求限制
const REQUEST_INTERVAL = 30000; // 請求間隔 30 秒
let requestCount = 0;
let lastRequestTime = Date.now();
const responseCache = new Map();

// 添加重試配置
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

// 體溫範圍檢查
const TEMPERATURE_RANGE = {
  MIN: 35,    // 最低可接受體溫
  MAX: 42.5,  // 最高可接受體溫
  NORMAL_MIN: 36.3,  // 正常體溫下限
  NORMAL_MAX: 37.2   // 正常體溫上限
};

// 檢查體溫是否在合理範圍內
function validateTemperature(temp) {
  if (typeof temp === 'number') {
    if (temp < TEMPERATURE_RANGE.MIN || temp > TEMPERATURE_RANGE.MAX) {
      throw new Error(`體溫數值異常（${TEMPERATURE_RANGE.MIN}°C ~ ${TEMPERATURE_RANGE.MAX}°C 為合理範圍）`);
    }
  }
  return true;
}

// 延遲函數
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 檢查請求限制
function checkRequestLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_INTERVAL) {
    throw new Error(`請稍等 ${Math.ceil((REQUEST_INTERVAL - timeSinceLastRequest) / 1000)} 秒後再試`);
  }
  
  if (now - lastRequestTime > 60000) {
    requestCount = 0;
    lastRequestTime = now;
  }
  if (requestCount >= REQUEST_LIMIT) {
    const waitMinutes = Math.ceil((60000 - (now - lastRequestTime)) / 60000);
    throw new Error(`已達到請求限制，請等待 ${waitMinutes} 分鐘後再試`);
  }
  requestCount++;
  lastRequestTime = now;
}

// 檢查緩存
function checkCache(key) {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

// 設置緩存
function setCache(key, data) {
  responseCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// 將症狀數據轉換為提示文本
function generatePrompt(data) {
  const { symptoms, bodyParts, vitalSigns } = data;
  
  // 分析體溫嚴重程度
  let temperatureNote = '';
  if (typeof vitalSigns.temperature === 'number') {
    if (vitalSigns.temperature >= 41) {
      temperatureNote = '（極度高燒，非常危險）';
    } else if (vitalSigns.temperature >= 39) {
      temperatureNote = '（高燒）';
    } else if (vitalSigns.temperature >= 38) {
      temperatureNote = '（中度發燒）';
    } else if (vitalSigns.temperature >= 37.5) {
      temperatureNote = '（輕度發燒）';
    } else if (vitalSigns.temperature <= 35) {
      temperatureNote = '（體溫過低，需要注意）';
    } else if (vitalSigns.temperature >= TEMPERATURE_RANGE.NORMAL_MIN && 
               vitalSigns.temperature <= TEMPERATURE_RANGE.NORMAL_MAX) {
      temperatureNote = '（正常體溫範圍）';
    }
  }
  
  return `作為一位兒科醫生，請對以下症狀進行評估。請嚴格按照 JSON 格式回答，不要添加任何其他文字。

症狀資料：
- 症狀位置：${bodyParts.join('、')}
- 主要症狀：${symptoms.join('、')}
- 體溫：${vitalSigns.temperature}${typeof vitalSigns.temperature === 'number' ? '°C' : ''} ${temperatureNote}
- 持續時間：${vitalSigns.duration || '未知'}

評估指南：
1. 體溫評估標準：
   - 正常體溫範圍：36.3-37.2°C
   - 41°C 以上：極度危險，需要立即就醫
   - 39-41°C：重度發燒，建議立即就醫
   - 38-39°C：中度發燒，建議及時就醫
   - 37.5-38°C：輕度發燒，需要觀察
   - 35-36.3°C：體溫偏低，需要注意
   - 35°C 以下：體溫過低，需要就醫

2. 嚴重程度判定標準：
   - 嚴重：高燒（≥39°C）、呼吸困難、意識改變、嚴重脫水、持續劇烈疼痛等
   - 中度：中度發燒（38-39°C）、明顯不適但無危險徵象、疼痛但可忍受等
   - 輕度：輕微症狀、輕度發燒（37.5-38°C）、無明顯不適等

請回傳以下 JSON 格式（請確保是有效的 JSON）：
{
  "diagnosis": "初步診斷結果",
  "level": "嚴重程度（輕度/中度/嚴重）",
  "advice": "就醫建議",
  "urgency": "緊急程度（一般/較急/緊急/非常緊急）",
  "precautions": ["注意事項1", "注意事項2", "注意事項3"]
}`;
}

// AI 問答功能
export async function askAI(question) {
  try {
    if (!API_CONFIG.key) {
      throw new Error('API 金鑰未設置，請檢查環境變量');
    }
    
    // 檢查緩存
    const cacheKey = question;
    const cachedResult = checkCache(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // 檢查請求限制
    checkRequestLimit();

    const response = await axiosInstance({
      method: 'post',
      url: API_URL,
      data: {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一位專業的醫療助手，請用專業但容易理解的方式回答醫療相關問題。'
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.5,
        max_tokens: 1000,
      },
      headers: {
        ...API_CONFIG.headers,
      },
      timeout: 60000
    });

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('API 返回格式異常');
    }

    const content = response.data.choices[0].message.content;
    // 設置緩存
    setCache(cacheKey, content);

    return content;
  } catch (error) {
    console.error('AI問答錯誤:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 401) {
      throw new Error('API 驗證失敗，請檢查 API 金鑰');
    }
    if (error.response?.status === 429) {
      const waitTime = Math.floor(Math.random() * 10) + 5;
      throw new Error(`請求過於頻繁，請等待 ${waitTime} 秒後重試...`);
    }
    throw new Error('無法獲取回答，請稍後重試');
  }
}

export async function analyzeSymptoms(data, retryCount = 0) {
  try {
    // 檢查必要的數據
    if (!data.symptoms || data.symptoms.length === 0) {
      throw new Error('請選擇至少一個症狀');
    }

    // 檢查體溫
    if (data.vitalSigns.temperature !== 'unknown') {
      validateTemperature(parseFloat(data.vitalSigns.temperature));
    }

    // 檢查緩存
    const cacheKey = JSON.stringify(data);
    const cachedResult = checkCache(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // 檢查請求限制
    checkRequestLimit();

    const response = await axios({
      method: 'post',
      url: API_URL,
      data: {
        model: 'opai_o3-mini',  // 使用相同的備用模型
        messages: [
          {
            role: 'system',
            content: '你是一位經驗豐富的兒科醫生。請只返回 JSON 格式的回答，不要添加任何其他說明文字。確保 JSON 格式完全正確。'
          },
          {
            role: 'user',
            content: generatePrompt(data)
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      },
      headers: {
        ...API_CONFIG.headers,
        'X-API-Priority': 'low',
        'X-API-Version': '2024-01'
      },
      timeout: 60000
    });

    let aiResponse;
    const content = response.data.choices[0].message.content;
    
    try {
      // 嘗試提取和解析 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('無法找到 JSON 格式的回應');
      }
    } catch (parseError) {
      console.error('JSON 解析錯誤:', parseError);
      console.log('原始回應:', content);
      throw new Error('AI 回應格式錯誤');
    }

    // 驗證回應格式
    if (!aiResponse || typeof aiResponse !== 'object') {
      throw new Error('AI 回應格式無效');
    }

    // 驗證必要欄位
    const requiredFields = ['diagnosis', 'level', 'advice', 'urgency'];
    const missingFields = requiredFields.filter(field => !aiResponse[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`AI 回應缺少必要欄位: ${missingFields.join(', ')}`);
    }

    // 確保 precautions 是陣列
    if (!Array.isArray(aiResponse.precautions)) {
      aiResponse.precautions = [];
    }

    // 格式化結果
    const result = {
      diagnosis: aiResponse.diagnosis,
      level: aiResponse.level,
      advice: aiResponse.advice,
      urgency: aiResponse.urgency,
      precautions: aiResponse.precautions
    };

    // 設置緩存
    setCache(cacheKey, result);

    return result;

  } catch (error) {
    console.error('AI分析錯誤:', error);

    // 添加更詳細的錯誤日誌
    console.error('錯誤詳情:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });

    if (error.response?.status === 403) {
      throw new Error('API 訪問被拒絕，請檢查 API 金鑰和請求設置');
    }

    // 如果是網絡錯誤或超時，嘗試重試
    if ((error.code === 'ECONNABORTED' || error.response?.status >= 500) && retryCount < MAX_RETRIES) {
      console.log(`重試第 ${retryCount + 1} 次`);
      await delay(RETRY_DELAY * (retryCount + 1));
      return analyzeSymptoms(data, retryCount + 1);
    }

    // 根據錯誤類型返回具體錯誤信息
    if (error.response?.status === 429) {
      throw new Error('請求過於頻繁，請稍後再試');
    } else if (error.response?.status === 401) {
      throw new Error('API 驗證失敗，請檢查設置');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('請求超時，請檢查網絡連接');
    } else if (error.message.includes('JSON')) {
      throw new Error('AI 回應格式錯誤，請重試');
    }

    // 其他錯誤
    throw new Error(error.message || 'AI分析失敗，請稍後重試');
  }
}

// 測試連接
export async function testApiConnection() {
  try {
    console.log('Testing API connection with config:', {
      baseURL: API_CONFIG.baseURL,
      url: API_URL,
      headers: {
        ...API_CONFIG.headers,
        'Authorization': '***'
      }
    });
    
    if (!API_CONFIG.key) {
      throw new Error('API 金鑰未設置');
    }

    const response = await axios({
      method: 'post',
      url: API_URL,
      data: {
        model: 'opai_o3-mini',
        messages: [
          {
            role: 'user',
            content: '你好'
          }
        ],
        temperature: 0.5
      },
      headers: {
        ...API_CONFIG.headers,
        'X-API-Priority': 'low',
        'X-API-Version': '2024-01'
      },
      timeout: 10000
    });

    console.log('API test response:', response.data);
    return true;
  } catch (error) {
    // 添加更詳細的錯誤日誌
    console.error('API connection test details:', {
      error: error.message,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      },
      request: {
        url: error.config?.url,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });

    if (error.response?.status === 403) {
      throw new Error('API 訪問被拒絕，請檢查 API 金鑰和請求設置');
    }

    // 根據錯誤狀態返回具體信息
    if (error.response?.status === 402) {
      throw new Error('API 帳戶餘額不足，請充值後重試');
    } else if (error.response?.status === 401) {
      throw new Error('API 金鑰無效或已過期');
    } else if (error.response?.status === 429) {
      throw new Error('請求過於頻繁，請稍後重試');
    }

    throw new Error(`API 連接失敗: ${error.response?.data?.error?.message || error.message}`);
  }
}

// 在主要 API 失敗時使用備用 API
async function useBackupAPI(data) {
} 