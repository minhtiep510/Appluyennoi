const Joi = require('joi');

const singleDialogueSchema = Joi.object({
  speaker: Joi.string().valid('ai', 'user').default('ai').messages({
    'any.only': 'Người nói (speaker) chỉ có thể là "ai" hoặc "user"',
  }),
  characterName: Joi.string().trim().max(50).allow(null, '').optional(),
  text: Joi.string().trim().required().messages({
    'string.empty': 'Nội dung câu thoại không được để trống',
    'any.required': 'Nội dung câu thoại (text) là bắt buộc',
  }),
  ipa: Joi.string().trim().allow(null, '').optional(),
  translation: Joi.string().trim().allow(null, '').optional(),
  orderIndex: Joi.number().integer().positive().optional(),
});

// 1. DTO Tạo bài học mới
const createLessonDto = Joi.object({
  title: Joi.string().trim().min(3).max(255).required().messages({
    'string.empty': 'Tiêu đề bài học không được để trống',
    'string.min': 'Tiêu đề bài học tối thiểu {#limit} ký tự',
    'any.required': 'Tiêu đề bài học là bắt buộc',
  }),
  level: Joi.string().trim().required().messages({
    'string.empty': 'Cấp độ bài học (level) không được để trống',
    'any.required': 'Cấp độ bài học là bắt buộc',
  }),
  description: Joi.string().trim().allow(null, '').optional(),
  dialogues: Joi.array().items(singleDialogueSchema).optional(),
});

// 2. DTO Cập nhật bài học
const updateLessonDto = Joi.object({
  title: Joi.string().trim().min(3).max(255).optional().messages({
    'string.empty': 'Tiêu đề bài học không được để trống',
    'string.min': 'Tiêu đề bài học tối thiểu {#limit} ký tự',
  }),
  level: Joi.string().trim().optional(),
  description: Joi.string().trim().allow(null, '').optional(),
});

module.exports = {
  createLessonDto,
  updateLessonDto,
};

