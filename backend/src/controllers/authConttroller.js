const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    // req.body đã được validate & sanitize bởi registerDto
    const result = await authService.register(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Không thể xử lý đăng ký lúc này.',
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    // req.body đã được validate & sanitize bởi verifyOtpDto
    const result = await authService.verifyOtp(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi xác thực OTP:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi trong quá trình xác thực OTP.',
      isExpired: error.isExpired || false,
    });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    // req.body đã được validate & sanitize bởi resendOtpDto
    const result = await authService.resendOtp(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi gửi lại OTP:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Không thể gửi lại mã OTP lúc này.',
    });
  }
};

exports.login = async (req, res) => {
  try {
    // req.body đã được validate & sanitize bởi loginDto
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi đăng nhập trên hệ thống.',
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await authService.getProfile(req.user.userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi lấy profile:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi khi lấy thông tin người dùng.',
    });
  }
};
