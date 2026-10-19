const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123456';
const OTP_EXPIRE_SECONDS = 300; // 5 phút

// Giả lập hàm gửi email OTP (hoặc tích hợp nodemailer khi cần)
const sendOtpEmail = async (email, otp) => {
  console.log(`[EMAIL SIMULATION] Sending OTP ${otp} to ${email}`);
};

/**
 * 1. ĐĂNG KÝ TÀI KHOẢN (REGISTER)
 */
exports.register = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    const finalFullName = fullName || username;

    if (!finalFullName || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin (họ tên, email, mật khẩu).' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'Email đã tồn tại và đã kích hoạt.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRE_SECONDS * 1000);

    if (existingUser && !existingUser.isVerified) {
      await prisma.user.update({
        where: { email: cleanEmail },
        data: {
          password: hashedPassword,
          fullName: finalFullName.trim(),
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
          fullName: finalFullName.trim(),
          verifyOtp: otp,
          otpExpiresAt: otpExpiresAt,
          role: 'USER',
          isVerified: false,
        }
      });
    }

    await sendOtpEmail(cleanEmail, otp);

    return res.status(200).json({
      message: 'Mã xác thực OTP đã được gửi về email của bạn!',
      email: cleanEmail,
      expiresIn: OTP_EXPIRE_SECONDS
    });

  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return res.status(500).json({ error: 'Không thể xử lý đăng ký lúc này. Vui lòng thử lại sau.' });
  }
};

/**
 * 2. XÁC THỰC OTP
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Vui lòng cung cấp email và mã OTP.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản với email này.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Tài khoản này đã được kích hoạt thành công từ trước.' });
    }

    if (user.verifyOtp !== cleanOtp) {
      return res.status(400).json({ error: 'Mã xác thực OTP không chính xác.' });
    }

    if (!user.otpExpiresAt || new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({
        error: 'Mã OTP đã hết hiệu lực. Vui lòng bấm "Gửi lại mã mới".',
        isExpired: true
      });
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

    return res.status(200).json({
      message: 'Kích hoạt tài khoản thành công!',
      token,
      user: {
        id: activatedUser.id,
        email: activatedUser.email,
        fullName: activatedUser.fullName,
        role: activatedUser.role
      }
    });

  } catch (error) {
    console.error('Lỗi xác thực OTP:', error);
    return res.status(500).json({ error: 'Lỗi trong quá trình xác thực OTP.' });
  }
};

/**
 * 3. GỬI LẠI MÃ OTP
 */
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Vui lòng cung cấp email.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      return res.status(404).json({ error: 'Tài khoản không tồn tại.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Tài khoản này đã được xác thực rồi.' });
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

    return res.status(200).json({
      message: 'Mã OTP mới đã được gửi về email!',
      expiresIn: OTP_EXPIRE_SECONDS
    });

  } catch (error) {
    console.error('Lỗi gửi lại OTP:', error);
    return res.status(500).json({ error: 'Không thể gửi lại mã OTP lúc này.' });
  }
};

/**
 * 4. ĐĂNG NHẬP (LOGIN)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ email và mật khẩu.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
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

    return res.status(200).json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return res.status(500).json({ message: 'Lỗi đăng nhập trên hệ thống.' });
  }
};

/**
 * 5. LẤY PROFILE NGƯỜI DÙNG HIỆN TẠI
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
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
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Lỗi lấy profile:', error);
    return res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng.' });
  }
};
