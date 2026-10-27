const Joi = require('joi');

// 1. DTO Đăng ký
const registerDto = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Họ và tên không được để trống',
    'string.min': 'Họ và tên tối thiểu {#limit} ký tự',
    'string.max': 'Họ và tên tối đa {#limit} ký tự',
    'any.required': 'Họ và tên là trường bắt buộc',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Định dạng email không hợp lệ',
    'any.required': 'Email là trường bắt buộc',
  }),
  password: Joi.string().min(6).max(50).required().messages({
    'string.empty': 'Mật khẩu không được để trống',
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
    'string.max': 'Mật khẩu tối đa {#limit} ký tự',
    'any.required': 'Mật khẩu là trường bắt buộc',
  }),
  targetLevel: Joi.string().trim().default('B1').allow('', null),
  learningGoal: Joi.string().trim().default('PHONG_VAN').allow('', null),
});

// 2. DTO Đăng nhập
const loginDto = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Định dạng email không hợp lệ',
    'any.required': 'Email là trường bắt buộc',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là trường bắt buộc',
  }),
});

// 3. DTO Xác thực OTP
const verifyOtpDto = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không đúng định dạng',
    'any.required': 'Email là trường bắt buộc',
  }),
  otp: Joi.string().trim().pattern(/^[0-9]{6}$/).required().messages({
    'string.empty': 'Mã OTP không được để trống',
    'string.pattern.base': 'Mã OTP phải gồm đúng 6 chữ số',
    'any.required': 'Mã OTP là trường bắt buộc',
  }),
});

// 4. DTO Gửi lại OTP
const resendOtpDto = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không đúng định dạng',
    'any.required': 'Email là trường bắt buộc',
  }),
});

// 5. DTO Quên mật khẩu (Yêu cầu gửi OTP)
const forgotPasswordDto = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không đúng định dạng',
    'any.required': 'Email là trường bắt buộc',
  }),
});

// 6. DTO Đặt lại mật khẩu với OTP
const resetPasswordDto = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không đúng định dạng',
    'any.required': 'Email là trường bắt buộc',
  }),
  otp: Joi.string().trim().pattern(/^[0-9]{6}$/).required().messages({
    'string.empty': 'Mã OTP không được để trống',
    'string.pattern.base': 'Mã OTP phải gồm đúng 6 chữ số',
    'any.required': 'Mã OTP là trường bắt buộc',
  }),
  newPassword: Joi.string().min(6).max(50).required().messages({
    'string.empty': 'Mật khẩu mới không được để trống',
    'string.min': 'Mật khẩu mới phải có ít nhất {#limit} ký tự',
    'string.max': 'Mật khẩu mới tối đa {#limit} ký tự',
    'any.required': 'Mật khẩu mới là trường bắt buộc',
  }),
});

// 7. DTO Đổi mật khẩu (Cho người dùng đã đăng nhập)
const changePasswordDto = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Vui lòng nhập mật khẩu hiện tại',
    'any.required': 'Mật khẩu hiện tại là bắt buộc',
  }),
  newPassword: Joi.string().min(6).max(50).required().messages({
    'string.empty': 'Vui lòng nhập mật khẩu mới',
    'string.min': 'Mật khẩu mới phải có ít nhất {#limit} ký tự',
    'string.max': 'Mật khẩu mới tối đa {#limit} ký tự',
    'any.required': 'Mật khẩu mới là bắt buộc',
  }),
});

module.exports = {
  registerDto,
  loginDto,
  verifyOtpDto,
  resendOtpDto,
  forgotPasswordDto,
  resetPasswordDto,
  changePasswordDto,
};

