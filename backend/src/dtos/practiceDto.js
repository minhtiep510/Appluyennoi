const Joi = require('joi');

// 1. DTO nộp kết quả phát âm luyện nói
const submitPracticeDto = Joi.object({
  dialogueLineId: Joi.number().integer().required().messages({
    'any.required': 'dialogueLineId là bắt buộc',
  }),
  spokenText: Joi.string().trim().allow('').default('').messages({
    'string.base': 'spokenText phải là chuỗi văn bản',
  }),
  audioUrl: Joi.string().trim().allow(null, '').optional(),
});

// 2. DTO query lịch sử luyện tập
const queryPracticeHistoryDto = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  lessonId: Joi.string().trim().optional(),
});

module.exports = {
  submitPracticeDto,
  queryPracticeHistoryDto,
};

