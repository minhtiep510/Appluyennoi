const Joi = require('joi');

// 1. DTO Thêm mới câu thoại
const createDialogueLineDto = Joi.object({
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

// 2. DTO Cập nhật câu thoại
const updateDialogueLineDto = Joi.object({
  speaker: Joi.string().valid('ai', 'user').optional().messages({
    'any.only': 'Người nói (speaker) chỉ có thể là "ai" hoặc "user"',
  }),
  characterName: Joi.string().trim().max(50).allow(null, '').optional(),
  text: Joi.string().trim().optional().messages({
    'string.empty': 'Nội dung câu thoại không được để trống',
  }),
  ipa: Joi.string().trim().allow(null, '').optional(),
  translation: Joi.string().trim().allow(null, '').optional(),
  orderIndex: Joi.number().integer().positive().optional(),
});

// 3. DTO Sắp xếp thứ tự danh sách câu thoại (reorder)
const reorderDialoguesDto = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().required().messages({
          'any.required': 'id của câu thoại là bắt buộc',
        }),
        orderIndex: Joi.number().integer().positive().required().messages({
          'any.required': 'orderIndex là bắt buộc',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Dữ liệu items phải là một mảng',
      'array.min': 'Mảng items phải có ít nhất {#limit} phần tử',
      'any.required': 'Trường items là bắt buộc',
    }),
});

module.exports = {
  createDialogueLineDto,
  updateDialogueLineDto,
  reorderDialoguesDto,
};

