const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123456';
const OTP_EXPIRE_SECONDS = 300; // 5 phút

const sendOtpEmail = async (email, otp) => {
  console.log(`[EMAIL SIMULATION] Sending OTP ${otp} to ${email}`);
};

class AuthService {
  async register({ fullName, email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (existingUser && existingUser.isVerified) {
      const error = new Error('Email đã tồn tại và đã được kích hoạt.');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRE_SECONDS * 1000);

    if (existingUser && !existingUser.isVerified) {
      await prisma.user.update({
        where: { email: cleanEmail },
        data: {
          password: hashedPassword,
          fullName: fullName.trim(),
          verifyOtp: otp,
          otpExpiresAt: otpExpiresAt,
          role: 'USER',
        }
      });
    } else {
      await prisma.user.create({
        data: {
          email: cleanEmail,
          password: hashedPassword,
          fullName: fullName.trim(),
          verifyOtp: otp,
          otpExpiresAt: otpExpiresAt,
          role: 'USER',
          isVerified: false,
        }
      });
    }

    await sendOtpEmail(cleanEmail, otp);

    return {
      message: 'Mã xác thực OTP đã được gửi về email của bạn!',
      email: cleanEmail,
      expiresIn: OTP_EXPIRE_SECONDS
    };
  }

  async verifyOtp({ email, otp }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      const error = new Error('Không tìm thấy tài khoản với email này.');
      error.statusCode = 404;
      throw error;
    }

    if (user.isVerified) {
      const error = new Error('Tài khoản này đã được kích hoạt thành công từ trước.');
      error.statusCode = 400;
      throw error;
    }

    if (user.verifyOtp !== cleanOtp) {
      const error = new Error('Mã xác thực OTP không chính xác.');
      error.statusCode = 400;
      throw error;
    }

    if (!user.otpExpiresAt || new Date() > new Date(user.otpExpiresAt)) {
      const error = new Error('Mã OTP đã hết hiệu lực. Vui lòng bấm "Gửi lại mã mới".');
      error.statusCode = 400;
      error.isExpired = true;
      throw error;
    }

    const activatedUser = await prisma.user.update({
      where: { email: cleanEmail },
      data: {
        isVerified: true,
        verifyOtp: null,
        otpExpiresAt: null
      }
    });

    const token = jwt.sign(
      {
        userId: activatedUser.id,
        email: activatedUser.email,
        role: activatedUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      message: 'Kích hoạt tài khoản thành công!',
      token,
      user: {
        id: activatedUser.id,
        email: activatedUser.email,
        fullName: activatedUser.fullName,
        role: activatedUser.role
      }
    };
  }

  async resendOtp({ email }) {
    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      const error = new Error('Tài khoản không tồn tại.');
      error.statusCode = 404;
      throw error;
    }

    if (user.isVerified) {
      const error = new Error('Tài khoản này đã được xác thực rồi.');
      error.statusCode = 400;
      throw error;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtpExpiresAt = new Date(Date.now() + OTP_EXPIRE_SECONDS * 1000);

    await prisma.user.update({
      where: { email: cleanEmail },
      data: {
        verifyOtp: newOtp,
        otpExpiresAt: newOtpExpiresAt
      }
    });

    await sendOtpEmail(cleanEmail, newOtp);

    return {
      message: 'Mã OTP mới đã được gửi về email!',
      expiresIn: OTP_EXPIRE_SECONDS
    };
  }

  async login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      const error = new Error('Email hoặc mật khẩu không chính xác.');
      error.statusCode = 400;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Email hoặc mật khẩu không chính xác.');
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    };
  }

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    if (!user) {
      const error = new Error('Người dùng không tồn tại.');
      error.statusCode = 404;
      throw error;
    }

    return { user };
  }
}

module.exports = new AuthService();

