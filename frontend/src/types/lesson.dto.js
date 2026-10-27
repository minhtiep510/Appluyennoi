/**
 * DTOs & cấu trúc dữ liệu cho Bài học (Lesson) và Câu thoại (DialogueLine)
 */

export const createLessonPayload = ({ title, level, description = '', dialogues = [] }) => ({
  title: (title || '').trim(),
  level: (level || 'A1 - Beginner').trim(),
  description: (description || '').trim(),
  ...(dialogues.length > 0 ? { dialogues } : {}),
});

export const createDialogueLinePayload = ({
  speaker = 'ai',
  characterName = 'Barista',
  text = '',
  ipa = '',
  translation = '',
  orderIndex = 1,
}) => ({
  speaker,
  characterName: (characterName || '').trim(),
  text: (text || '').trim(),
  ipa: (ipa || '').trim() || null,
  translation: (translation || '').trim() || null,
  orderIndex: Number(orderIndex),
});

