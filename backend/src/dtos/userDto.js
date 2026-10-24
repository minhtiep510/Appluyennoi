const Joi = require('joi');

// 1. DTO Query danh sách người dùng
const queryUsersDto = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow('').optional(),
  role: Joi.string().valid('ADMIN', 'USER').optional(),
});

// 2. DTO Admin tạo người dùng mới
const createUserDto = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là trường bắt buộc',
  }),
  password: Joi.string().min(6).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({
    'string.empty': 'Mật khẩu không được để trống',
    'string.min': 'Mật khẩu phải tối thiểu {#limit} ký tự',
    'string.pattern.base': 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số',
    'any.required': 'Mật khẩu là trường bắt buộc',
  }),
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Họ và tên không được để trống',
    'any.required': 'Họ và tên là trường bắt buộc',
  }),
  role: Joi.string().valid('ADMIN', 'USER').default('USER').messages({
    'any.only': 'Vai trò chỉ có thể là ADMIN hoặc USER',
  }),
  isVerified: Joi.boolean().default(true),
});

// 3. DTO Admin cập nhật thông tin người dùng
const updateUserDto = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).optional(),
  role: Joi.string().valid('ADMIN', 'USER').optional().messages({
    'any.only': 'Vai trò chỉ có thể là ADMIN hoặc USER',
  }),
  isVerified: Joi.boolean().optional(),
  password: Joi.string().min(6).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).optional().messages({
    'string.min': 'Mật khẩu mới phải tối thiểu {#limit} ký tự',
    'string.pattern.base': 'Mật khẩu mới phải chứa ít nhất một chữ hoa, một chữ thường và một số',
  }),
});

module.exports = {
  queryUsersDto,
  createUserDto,
  updateUserDto,
};

