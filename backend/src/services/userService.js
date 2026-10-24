const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

class UserService {
  async getAllUsers({ page = 1, limit = 10, search = '', roleFilter }) {
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

    return {
      data: users,
      pagination: {
        totalItems: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        limit
      }
    };
  }

  async getUserById(userId) {
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
      const error = new Error('Không tìm thấy người dùng.');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  async createUser({ email, password, fullName, role, isVerified }) {
    if (!email || !password || !fullName) {
      const error = new Error('Vui lòng cung cấp email, họ tên và mật khẩu.');
      error.statusCode = 400;
      throw error;
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      const error = new Error('Email này đã tồn tại trên hệ thống.');
      error.statusCode = 400;
      throw error;
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

    return newUser;
  }

  async updateUser(userId, { fullName, role, isVerified, password }) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      const error = new Error('Không tìm thấy người dùng cần sửa.');
      error.statusCode = 404;
      throw error;
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

    return updatedUser;
  }

  async deleteUser(userId, currentAdminId) {
    if (userId === currentAdminId) {
      const error = new Error('Bạn không thể tự xóa tài khoản admin của chính mình.');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      const error = new Error('Không tìm thấy người dùng cần xóa.');
      error.statusCode = 404;
      throw error;
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    return true;
  }
}

module.exports = new UserService();

