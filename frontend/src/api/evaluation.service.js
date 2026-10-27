import { apiClient } from './client';
import { createSubmitPracticePayload, mapEvaluationResponse } from '../types/evaluation.dto';

/**
 * Service gửi text/audio sang server chấm điểm phát âm & lấy thống kê tiến độ
 */
export const evaluationService = {
  // Gửi câu nói để chấm điểm và lưu DB
  async submitPractice(payload) {
    const dto = createSubmitPracticePayload(payload);
    const res = await apiClient('/practice/submit', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return mapEvaluationResponse(res.result);
  },

  // Lấy lịch sử luyện nói cá nhân
  async getHistory({ page = 1, limit = 20, lessonId } = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(lessonId ? { lessonId } : {}),
    });
    return apiClient(`/practice/history?${params.toString()}`);
  },

  // Lấy thống kê tổng số câu đã luyện & điểm trung bình
  async getProgress() {
    const res = await apiClient('/practice/progress');
    return res.progress || { totalPracticed: 0, averageScore: 0 };
  },
};

