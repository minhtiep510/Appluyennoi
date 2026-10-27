const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123456';
const OTP_EXPIRE_SECONDS = 300; // 5 phút

/**
 * Gửi email mã xác thực OTP qua Nodemailer (Chuẩn cấu hình Name + Email như MailSettings trong .NET)
 */
const sendOtpEmail = async (email, otp, recipientName = 'Học viên', purpose = 'register') => {
  const isReset = purpose === 'reset';
  console.log(`\n========================================`);
  console.log(`📩 [SpeakAI ${isReset ? 'RESET PASSWORD' : 'OTP'}] Người nhận: ${recipientName} <${email}> | Mã OTP: ${otp}`);
  console.log(`========================================\n`);

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const senderName = process.env.SMTP_SENDER_NAME || 'SpeakAI - Hệ thống Luyện Nói AI';
  const smtpUser = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
  const fromEmail = (process.env.SMTP_FROM_EMAIL || smtpUser).trim();
  const smtpPass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  if (!smtpUser || !smtpPass || smtpPass === 'your_gmail_app_password_here') {
    console.warn(
      '⚠️ Chưa cấu hình SMTP_USER và SMTP_PASS trong file backend/.env nên chưa gửi mail thật. Hãy lấy mã OTP ở dòng log phía trên!'
    );
    return { sentRealEmail: false };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const subject = isReset
      ? `[SpeakAI] Mã xác thực đặt lại mật khẩu: ${otp}`
      : `[SpeakAI] Mã xác thực OTP của bạn là: ${otp}`;

    const bodyContent = isReset
      ? `<p>Bạn hoặc ai đó vừa gửi yêu cầu <b>đặt lại mật khẩu</b> cho tài khoản <b>${email}</b> trên nền tảng SpeakAI. Mã xác thực gồm 6 chữ số của bạn là:</p>`
      : `<p>Bạn vừa yêu cầu đăng ký tài khoản với email <b>${email}</b> trên hệ thống <b>SpeakAI</b>. Mã xác thực OTP (6 chữ số) của bạn là:</p>`;

    await transporter.sendMail({
      from: {
        name: senderName,
        address: fromEmail,
      },
      to: {
        name: recipientName,
        address: email,
      },
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 14px;">
          <h2 style="color: #00897b; margin-top: 0;">SpeakAI — ${isReset ? 'Đặt lại mật khẩu' : 'Xác thực tài khoản'}</h2>
          <p>Xin chào <b>${recipientName}</b>,</p>
          ${bodyContent}
          <div style="background: #e0f2f1; color: #00897b; font-size: 28px; font-weight: bold; letter-spacing: 6px; text-align: center; padding: 16px; border-radius: 10px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #6b7280; font-size: 13px;">Mã này có hiệu lực trong vòng 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
        </div>
      `,
    });

    console.log(`✅ Đã gửi email thành công tới: ${recipientName} <${email}>`);
    return { sentRealEmail: true };
  } catch (err) {
    console.error('❌ Lỗi gửi email qua Gmail SMTP:', err.message);
    return { sentRealEmail: false, error: err.message };
  }
};

class AuthService {
  async register({ fullName, email, password, targetLevel, learningGoal }) {
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
          targetLevel: targetLevel || 'B1',
          learningGoal: learningGoal || 'PHONG_VAN',
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
          targetLevel: targetLevel || 'B1',
          learningGoal: learningGoal || 'PHONG_VAN',
          verifyOtp: otp,
          otpExpiresAt: otpExpiresAt,
          role: 'USER',
          isVerified: false,
        }
      });
    }

    await sendOtpEmail(cleanEmail, otp, fullName.trim());

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
        role: activatedUser.role,
        targetLevel: activatedUser.targetLevel || 'B1',
        learningGoal: activatedUser.learningGoal || 'PHONG_VAN',
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

    await sendOtpEmail(cleanEmail, newOtp, user.fullName);

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
        role: user.role,
        targetLevel: user.targetLevel || 'B1',
        learningGoal: user.learningGoal || 'PHONG_VAN',
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
        targetLevel: true,
        learningGoal: true,
      },
    });

    if (!user) {
      const error = new Error('Người dùng không tồn tại.');
      error.statusCode = 404;
      throw error;
    }

    return { user };
  }

  async updateProfile(userId, { fullName, currentPassword, newPassword, targetLevel, learningGoal }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error('Người dùng không tồn tại.');
      error.statusCode = 404;
      throw error;
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName.trim();
    if (targetLevel) updateData.targetLevel = targetLevel.trim();
    if (learningGoal) updateData.learningGoal = learningGoal.trim();

    if (newPassword) {
      if (!currentPassword) {
        const error = new Error('Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu.');
        error.statusCode = 400;
        throw error;
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        const error = new Error('Mật khẩu hiện tại không chính xác.');
        error.statusCode = 400;
        throw error;
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        targetLevel: true,
        learningGoal: true,
      },
    });

    return {
      message: 'Cập nhật thông tin thành công!',
      user: updated,
    };
  }

  // 1. Quên mật khẩu: Gửi mã OTP xác thực qua email
  async forgotPassword({ email }) {
    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      const error = new Error('Không tìm thấy tài khoản tương ứng với email này.');
      error.statusCode = 404;
      throw error;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRE_SECONDS * 1000);

    await prisma.user.update({
      where: { email: cleanEmail },
      data: {
        verifyOtp: otp,
        otpExpiresAt: otpExpiresAt,
      },
    });

    await sendOtpEmail(cleanEmail, otp, user.fullName, 'reset');

    return {
      message: 'Mã xác thực OTP đã được gửi về email của bạn!',
      email: cleanEmail,
      expiresIn: OTP_EXPIRE_SECONDS,
    };
  }

  // 2. Đặt lại mật khẩu mới thông qua OTP
  async resetPassword({ email, otp, newPassword }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      const error = new Error('Tài khoản không tồn tại.');
      error.statusCode = 404;
      throw error;
    }

    if (user.verifyOtp !== cleanOtp) {
      const error = new Error('Mã OTP xác thực không chính xác.');
      error.statusCode = 400;
      throw error;
    }

    if (!user.otpExpiresAt || new Date() > new Date(user.otpExpiresAt)) {
      const error = new Error('Mã OTP đã hết hiệu lực. Vui lòng bấm "Gửi lại mã mới".');
      error.statusCode = 400;
      error.isExpired = true;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: cleanEmail },
      data: {
        password: hashedPassword,
        verifyOtp: null,
        otpExpiresAt: null,
        isVerified: true,
      },
    });

    return {
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bằng mật khẩu mới.',
    };
  }

  // 3. Đổi mật khẩu độc lập (Dành cho tài khoản đã đăng nhập)
  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error('Người dùng không tồn tại.');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const error = new Error('Mật khẩu hiện tại không chính xác.');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.',
    };
  }

  // 4. Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu người dùng
  async deleteAccount(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error('Người dùng không tồn tại.');
      error.statusCode = 404;
      throw error;
    }

    // Xóa cascade dữ liệu lịch sử luyện tập và từ vựng liên quan
    await prisma.practiceHistory.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.vocabularyPractice.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.user.delete({ where: { id: userId } });

    return {
      message: 'Tài khoản và toàn bộ dữ liệu của bạn đã được xóa vĩnh viễn khỏi hệ thống SpeakAI.',
    };
  }
}

module.exports = new AuthService();

