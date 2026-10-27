// Cấu hình kết nối chung tới Backend SpeakAI (Express + Prisma + Socket.IO)
// Khi chạy trên máy ảo Android dùng 10.0.2.2:5000, trên iOS Simulator / Web dùng localhost:5000
export const API_BASE_URL = 'http://localhost:5000/api';
export const SOCKET_URL = 'http://localhost:5000';

let authToken = null;

export const setMobileToken = (token) => {
  authToken = token;
};

export async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Lỗi kết nối máy chủ SpeakAI');
  }
  return data;
}

