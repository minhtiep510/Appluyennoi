/**
 * DTOs & cấu trúc dữ liệu cho chấm điểm phát âm (Evaluation)
 */

/**
 * Tạo payload gửi lên server để chấm điểm phát âm
 * @param {{ dialogueLineId: number, spokenText: string, audioUrl?: string }} params
 */
export const createSubmitPracticePayload = ({ dialogueLineId, spokenText, audioUrl = null }) => ({
  dialogueLineId: Number(dialogueLineId),
  spokenText: (spokenText || '').trim(),
  audioUrl,
});

/**
 * Chuẩn hóa dữ liệu kết quả trả về từ AI / Backend
 */
export const mapEvaluationResponse = (raw = {}) => ({
  id: raw.id || null,
  dialogueLineId: raw.dialogueLineId,
  accuracyScore: Number(raw.accuracyScore ?? 0),
  feedback: raw.feedback || '',
  matchedWords: Array.isArray(raw.matchedWords) ? raw.matchedWords : [],
  mispronouncedWords: Array.isArray(raw.mispronouncedWords) ? raw.mispronouncedWords : [],
  wordStatuses: Array.isArray(raw.wordStatuses) ? raw.wordStatuses : [],
  expectedText: raw.expectedText || '',
  spokenText: raw.spokenText || '',
  createdAt: raw.createdAt || new Date().toISOString(),
});

