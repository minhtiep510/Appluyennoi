const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

/**
 * 1. Lấy danh sách người dùng (kèm phân trang, tìm kiếm email/họ tên, lọc theo role)
 * GET /api/admin/users?page=1&limit=10&search=keyword&role=USER
 */
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search ? req.query.search.trim() : '';
    const roleFilter = req.query.role ? req.query.role.trim().toUpperCase() : undefined;

    const skip = (page - 1) * limit;

    const where = {};
    if (roleFilter && (roleFilter === 'ADMIN' || roleFilter === 'USER')) {
      where.role = roleFilter;
    }

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { fullName: { contains: search } }
      ];
    }

    const [totalUsers, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isVerified: true,
          createdAt: true,
          _count: {
            select: { histories: true }
          }
        }
      })
    ]);

    return res.status(200).json({
      data: users,
      pagination: {
        totalItems: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    return res.status(500).json({ error: 'Lỗi server khi lấy danh sách người dùng.' });
  }
};

/**
 * 2. Lấy chi tiết một người dùng theo ID (kèm lịch sử luyện tập gần nhất)
 * GET /api/admin/users/:userId
 */
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        histories: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            dialogue: {
              select: {
                text: true,
                lesson: { select: { id: true, title: true } }
              }
            }
          }
        },
        _count: {
          select: { histories: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Lỗi lấy chi tiết người dùng:', error);
    return res.status(500).json({ error: 'Lỗi server khi lấy chi tiết người dùng.' });
  }
};

/**
 * 3. Tạo mới tài khoản người dùng từ Admin
 * POST /api/admin/users
 * Body: { email, password, fullName, role, isVerified }
 */
exports.createUser = async (req, res) => {
  try {
    const { email, password, fullName, role, isVerified } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Vui lòng cung cấp email, họ tên và mật khẩu.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email này đã tồn tại trên hệ thống.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        fullName: fullName.trim(),
        password: hashedPassword,
        role: userRole,
        isVerified: isVerified !== undefined ? Boolean(isVerified) : true
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      message: 'Tạo tài khoản người dùng thành công!',
      user: newUser
    });
  } catch (error) {
    console.error('Lỗi tạo người dùng mới:', error);
    return res.status(500).json({ error: 'Lỗi server khi tạo người dùng mới.' });
  }
};

/**
 * 4. Cập nhật thông tin / Phân quyền / Kích hoạt tài khoản
 * PUT /api/admin/users/:userId
 * Body: { fullName, role, isVerified, password }
 */
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, role, isVerified, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng cần sửa.' });
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName.trim();
    if (role && (role === 'ADMIN' || role === 'USER')) updateData.role = role;
    if (isVerified !== undefined) updateData.isVerified = Boolean(isVerified);
    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password.trim(), 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    });

    return res.status(200).json({
      message: 'Cập nhật người dùng thành công!',
      user: updatedUser
    });
  } catch (error) {
    console.error('Lỗi cập nhật người dùng:', error);
    return res.status(500).json({ error: 'Lỗi server khi cập nhật người dùng.' });
  }
};

/**
 * 5. Xóa người dùng (kèm kiểm tra không cho tự xóa tài khoản của chính mình)
 * DELETE /api/admin/users/:userId
 */
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentAdminId = req.user.userId;

    // Không cho phép tự xóa chính mình
    if (userId === currentAdminId) {
      return res.status(400).json({ error: 'Bạn không thể tự xóa tài khoản admin của chính mình.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng cần xóa.' });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    return res.status(200).json({ message: 'Xóa tài khoản người dùng thành công!' });
  } catch (error) {
    console.error('Lỗi xóa người dùng:', error);
    return res.status(500).json({ error: 'Lỗi server khi xóa người dùng.' });
  }
};

