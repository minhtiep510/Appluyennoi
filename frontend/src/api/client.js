/**
 * Tầng HTTP Client cấu hình chung (tương đương Axios instance)
 */
export const API_BASE_URL = 'http://localhost:5000/api';
export const SOCKET_BASE_URL = 'http://localhost:5000';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('speakai_unauthorized'));
    }

    const errorMsg = data?.details
      ? data.details.map((d) => (typeof d === 'string' ? d : d.message)).join('; ')
      : data?.error || data?.message || 'Có lỗi xảy ra khi kết nối máy chủ';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

