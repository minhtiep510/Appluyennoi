const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123456';


exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    // Header chuẩn gửi lên: "Bearer <chuỗi_token>"
    if (!authHeader) {
      return res.status(401).json({
        error: 'Không tìm thấy Token. Vui lòng đăng nhập để tiếp tục.'
      }); 
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Định dạng Authorization Header không hợp lệ. Phải là "Bearer <token>".'
      });
    }

    const token = parts[1];

    // Xác thực token bằng chữ ký JWT_SECRET
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            isExpired: true
          });
        }
        return res.status(403).json({
          error: 'Token không hợp lệ hoặc đã bị chỉnh sửa.'
        });
      }

      // Gán thông tin user giải mã được (userId, email, role) vào req để các controller sau dùng
      req.user = decoded;
      next(); // Cho phép request đi tiếp vào Controller
    });
  } catch (error) {
    console.error('Lỗi tại verifyToken middleware:', error);
    return res.status(500).json({ error: 'Lỗi xác thực máy chủ.' });
  }
};

/**
 * 2. Middleware phân quyền ADMIN
 * Phải đặt ĐỨNG SAU verifyToken để đảm bảo req.user đã tồn tại
 */
exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập trước.' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Truy cập bị từ chối: Bạn không có quyền Quản trị viên (ADMIN).'
    });
  }

  next(); // Là ADMIN thì cho đi tiếp
};