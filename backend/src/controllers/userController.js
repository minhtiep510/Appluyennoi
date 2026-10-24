const userService = require('../services/userService');

// 1. Lấy danh sách người dùng (kèm phân trang, lọc, tìm kiếm)
exports.getAllUsers = async (req, res) => {
  try {
    // req.query đã được validate & convert type mặc định qua queryUsersDto
    const { page, limit, search, role } = req.query;
    const result = await userService.getAllUsers({
      page,
      limit,
      search,
      roleFilter: role,
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi lấy danh sách người dùng.',
    });
  }
};

// 2. Lấy chi tiết một người dùng theo ID
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Lỗi lấy chi tiết người dùng:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi lấy chi tiết người dùng.',
    });
  }
};

// 3. Tạo mới tài khoản người dùng từ Admin
exports.createUser = async (req, res) => {
  try {
    // req.body đã được validate qua createUserDto
    const newUser = await userService.createUser(req.body);
    return res.status(201).json({
      message: 'Tạo tài khoản người dùng thành công!',
      user: newUser,
    });
  } catch (error) {
    console.error('Lỗi tạo người dùng mới:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi tạo người dùng mới.',
    });
  }
};

// 4. Cập nhật thông tin / Phân quyền / Kích hoạt tài khoản
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // req.body đã được validate qua updateUserDto
    const updatedUser = await userService.updateUser(userId, req.body);

    return res.status(200).json({
      message: 'Cập nhật người dùng thành công!',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Lỗi cập nhật người dùng:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi cập nhật người dùng.',
    });
  }
};

// 5. Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentAdminId = req.user.userId;

    await userService.deleteUser(userId, currentAdminId);
    return res.status(200).json({ message: 'Xóa tài khoản người dùng thành công!' });
  } catch (error) {
    console.error('Lỗi xóa người dùng:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi xóa người dùng.',
    });
  }
};
