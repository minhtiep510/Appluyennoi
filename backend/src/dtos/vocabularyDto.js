const Joi = require('joi');

// 1. DTO Tạo / Cập nhật Chủ đề Từ vựng (VocabularyTopic)
const createVocabularyTopicDto = Joi.object({
  name: Joi.string().trim().min(2).max(120).required().messages({
    'string.empty': 'Tên chủ đề từ vựng không được để trống',
    'any.required': 'Tên chủ đề từ vựng là bắt buộc',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  imageUrl: Joi.string().trim().allow('', null).optional(),
  level: Joi.string().trim().valid('B1', 'B2', 'C1', 'C2').default('B1'),
});

const updateVocabularyTopicDto = Joi.object({
  name: Joi.string().trim().min(2).max(120).optional(),
  description: Joi.string().trim().allow('', null).optional(),
  imageUrl: Joi.string().trim().allow('', null).optional(),
  level: Joi.string().trim().valid('B1', 'B2', 'C1', 'C2').optional(),
});

// 2. DTO Tạo / Cập nhật Từ vựng (Vocabulary)
const createVocabularyDto = Joi.object({
  topicId: Joi.string().trim().required().messages({
    'any.required': 'Chủ đề từ vựng (topicId) là bắt buộc',
  }),
  word: Joi.string().trim().min(1).max(150).required().messages({
    'string.empty': 'Từ vựng không được để trống',
    'any.required': 'Từ vựng là bắt buộc',
  }),
  pos: Joi.string().trim().default('Noun'),
  ipa: Joi.string().trim().allow('', null).optional(),
  meaning: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Nghĩa tiếng Việt không được để trống',
    'any.required': 'Nghĩa tiếng Việt là bắt buộc',
  }),
  level: Joi.string().trim().valid('B1', 'B2', 'C1', 'C2').default('B1'),
  synonyms: Joi.string().trim().allow('', null).optional(),
  example: Joi.string().trim().allow('', null).optional(),
  exampleTrans: Joi.string().trim().allow('', null).optional(),
});

const updateVocabularyDto = Joi.object({
  topicId: Joi.string().trim().optional(),
  word: Joi.string().trim().min(1).max(150).optional(),
  pos: Joi.string().trim().optional(),
  ipa: Joi.string().trim().allow('', null).optional(),
  meaning: Joi.string().trim().min(1).optional(),
  level: Joi.string().trim().valid('B1', 'B2', 'C1', 'C2').optional(),
  synonyms: Joi.string().trim().allow('', null).optional(),
  example: Joi.string().trim().allow('', null).optional(),
  exampleTrans: Joi.string().trim().allow('', null).optional(),
});

module.exports = {
  createVocabularyTopicDto,
  updateVocabularyTopicDto,
  createVocabularyDto,
  updateVocabularyDto,
};
