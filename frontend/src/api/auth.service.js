import { apiClient } from './client';

/**
 * Service Xác thực & Quản lý Người dùng
 */
export const authService = {
  async login({ email, password }) {
    return apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register({ fullName, email, password }) {
    return apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });
  },

  async verifyOtp({ email, otp }) {
    return apiClient('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  async resendOtp({ email }) {
    return apiClient('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async forgotPassword({ email }) {
    return apiClient('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword({ email, otp, newPassword }) {
    return apiClient('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },

  async changePassword({ currentPassword, newPassword }) {
    return apiClient('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  async getProfile() {
    return apiClient('/auth/me');
  },

  async updateProfile(data) {
    return apiClient('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAccount() {
    return apiClient('/auth/me', {
      method: 'DELETE',
    });
  },

  // Admin: Quản lý danh sách người dùng
  async getUsers({ page = 1, limit = 8, search = '', role = '' } = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      search,
      ...(role ? { role } : {}),
    });
    return apiClient(`/admin/users?${params.toString()}`);
  },

  async getUserDetail(userId) {
    const res = await apiClient(`/admin/users/${userId}`);
    return res.user;
  },

  async createUser(data) {
    return apiClient('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateUser(userId, data) {
    return apiClient(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteUser(userId) {
    return apiClient(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

