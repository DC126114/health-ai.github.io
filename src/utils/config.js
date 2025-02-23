export const API_CONFIG = {
  // 優先使用環境變量，如果沒有則使用備用值
  key: process.env.REACT_APP_API2D_KEY || 'fk230956-rPFzZjnkv4f5G9LApSiqBainrfZD2bqB',
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api2d.net/openai'
}; 