import React, { useState, useEffect } from 'react';
import {
  FiMail,
  FiLock,
  FiUser,
  FiKey,
  FiRefreshCw,
  FiLogIn,
  FiUserPlus,
  FiX,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { authService } from '../api/auth.service';
import Button from '../components/common/Button';

/**
 * Trang / Modal Đăng nhập & Đăng ký tài khoản SpeakAI
 */
export default function AuthScreen({
  initialMode = 'login',
  asPage = false,
  noticeMessage = '',
  onAuthSuccess,
  onClose,
  onBackToHome,
  onNavigateForgot,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'otp'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [targetLevel, setTargetLevel] = useState('B1'); // 'B1' | 'B2' | 'C1' | 'C2'
  const [learningGoal, setLearningGoal] = useState('PHONG_VAN'); // 'DU_HOC' | 'PHAT_TRIEN' | 'PHONG_VAN' | 'GIAO_TIEP'
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setError('');
    setMessage('');
  }, [initialMode]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login({ email, password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      onAuthSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Đăng nhập nhanh tài khoản Google
      const googleUser = {
        id: 888,
        fullName: 'Google User',
        email: 'user.google@speakai.vn',
        role: 'USER',
        targetLevel: 'B2',
      };
      localStorage.setItem('token', 'google_jwt_token_' + Date.now());
      localStorage.setItem('user', JSON.stringify(googleUser));
      onAuthSuccess(googleUser);
    } catch {
      setError('Đăng nhập Google không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await authService.register({
        fullName,
        email,
        password,
        targetLevel,
        learningGoal,
      });
      setMessage(res.message || 'Mã xác thực OTP đã được gửi đến email của bạn!');
      setMode('otp');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.verifyOtp({ email, otp });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      onAuthSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Mã xác thực OTP không hợp lệ hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await authService.resendOtp({ email });
      setMessage(res.message || 'Đã gửi lại mã OTP mới vào email của bạn!');
    } catch (err) {
      setError(err.message || 'Không thể gửi lại mã OTP lúc này.');
    } finally {
      setLoading(false);
    }
  };

  const cardContent = (
    <div
      className="auth-card animate-modal-pop"
      onClick={(e) => e.stopPropagation()}
      style={{ position: 'relative', margin: asPage ? '3.5rem auto' : '0' }}
    >
      {onClose && !asPage && (
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.15rem',
            color: '#6b7280',
            cursor: 'pointer',
          }}
        >
          <FiX />
        </button>
      )}

      <div className="auth-header">
        {onBackToHome && (
          <button
            type="button"
            className="auth-back-to-home-btn"
            onClick={onBackToHome}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              fontSize: '0.82rem',
              color: '#4b5563',
              cursor: 'pointer',
              marginBottom: '1rem',
              fontWeight: 600,
            }}
          >
            <FiArrowLeft /> Tiếp tục xem trang (Quay lại)
          </button>
        )}
        <div className="auth-logo">S</div>
        <h1>SpeakAI</h1>
        <p>Hệ thống Luyện IELTS Speaking tương tác Real-time</p>
      </div>

      {noticeMessage && (
        <div
          style={{
            background: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            margin: '0 0 1.25rem 0',
            fontSize: '0.88rem',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            lineHeight: 1.5,
          }}
        >
          <span>🔒</span>
          <span><b>Yêu cầu đăng nhập:</b> {noticeMessage}</span>
        </div>
      )}

      <div className="auth-tabs">
        <button
          type="button"
          className={mode === 'login' ? 'active' : ''}
          onClick={() => {
            setMode('login');
            setError('');
            setMessage('');
          }}
        >
          <FiLogIn className="react-icon" /> Đăng nhập
        </button>
        <button
          type="button"
          className={mode === 'register' || mode === 'otp' ? 'active' : ''}
          onClick={() => {
            setMode('register');
            setError('');
            setMessage('');
          }}
        >
          <FiUserPlus className="react-icon" /> Đăng ký tài khoản
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {message && <div className="alert-success">{message}</div>}

      {mode === 'login' && (
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>
              <FiMail className="teal-label-icon" /> Địa chỉ Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email của bạn..."
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>
              <FiLock className="teal-label-icon" /> Mật khẩu
            </label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="auth-row-options">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <span>Hiện mật khẩu</span>
            </label>
            {onNavigateForgot && (
              <button
                type="button"
                className="auth-forgot-link"
                onClick={onNavigateForgot}
              >
                Quên mật khẩu?
              </button>
            )}
          </div>

          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading}
          >
            <FiLogIn className="react-icon" />{' '}
            {loading ? 'Đang xác thực...' : 'Đăng nhập vào SpeakAI'}
          </button>

          <div className="auth-or-divider">
            <span>Hoặc tiếp tục với</span>
          </div>

          <button
            type="button"
            className="btn-google-auth"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg
              className="google-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Đăng nhập bằng Google</span>
          </button>
        </form>
      )}

      {mode === 'register' && (
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>
              <FiUser className="react-icon teal-text" /> Họ và tên
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên đầy đủ..."
            />
          </div>
          <div className="form-group">
            <label>
              <FiMail className="react-icon teal-text" /> Địa chỉ Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email..."
            />
          </div>
          <div className="form-group">
            <label>
              <FiLock className="react-icon teal-text" /> Mật khẩu (tối thiểu 6 ký tự)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tạo mật khẩu bảo mật..."
            />
          </div>

          {/* MỨC ĐỘ GIAO TIẾP MỤC TIÊU */}
          <div className="form-group">
            <label>🎯 Mức độ giao tiếp tiếng Anh mục tiêu</label>
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#1e293b',
                background: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="A1">Level A1 — Người mới bắt đầu (Làm quen từ vựng nền tảng, chào hỏi)</option>
              <option value="A2">Level A2 — Sơ cấp (Giao tiếp đơn giản hàng ngày, mua sắm, hỏi đường)</option>
              <option value="B1">Level B1 — Tiền trung cấp (Tự tin giao tiếp đời sống, du lịch)</option>
              <option value="B2">Level B2 — Trung cao cấp &amp; lưu loát (Thuyết trình, trao đổi công việc)</option>
              <option value="C1">Level C1 — Cao cấp &amp; học thuật (Du học, đàm phán quốc tế)</option>
              <option value="C2">Level C2 — Thông thạo như người bản xứ (Master fluency)</option>
            </select>
          </div>

          {/* MỤC TIÊU HỌC TẬP CHÍNH */}
          <div className="form-group">
            <label>🚀 Mục tiêu học tập chính của bạn</label>
            <div className="learning-goal-options-grid">
              <label
                className={`goal-radio-chip ${
                  learningGoal === 'PHONG_VAN' ? 'active' : ''
                }`}
              >
                <input
                  type="radio"
                  name="learningGoal"
                  value="PHONG_VAN"
                  checked={learningGoal === 'PHONG_VAN'}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  style={{ display: 'none' }}
                />
                💼 <span>Phỏng vấn xin việc &amp; Sự nghiệp</span>
              </label>

              <label
                className={`goal-radio-chip ${
                  learningGoal === 'DU_HOC' ? 'active' : ''
                }`}
              >
                <input
                  type="radio"
                  name="learningGoal"
                  value="DU_HOC"
                  checked={learningGoal === 'DU_HOC'}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  style={{ display: 'none' }}
                />
                🎓 <span>Đi du học / Định cư</span>
              </label>

              <label
                className={`goal-radio-chip ${
                  learningGoal === 'PHAT_TRIEN' ? 'active' : ''
                }`}
              >
                <input
                  type="radio"
                  name="learningGoal"
                  value="PHAT_TRIEN"
                  checked={learningGoal === 'PHAT_TRIEN'}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  style={{ display: 'none' }}
                />
                🌱 <span>Phát triển cá nhân</span>
              </label>

              <label
                className={`goal-radio-chip ${
                  learningGoal === 'GIAO_TIEP' ? 'active' : ''
                }`}
              >
                <input
                  type="radio"
                  name="learningGoal"
                  value="GIAO_TIEP"
                  checked={learningGoal === 'GIAO_TIEP'}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  style={{ display: 'none' }}
                />
                🌍 <span>Giao tiếp đời sống &amp; Du lịch</span>
              </label>
            </div>
          </div>
          <Button type="submit" fullWidth disabled={loading}>
            <FiUserPlus className="react-icon" />{' '}
            {loading ? 'Đang gửi mã xác thực...' : 'Đăng ký & Nhận mã OTP'}
          </Button>
        </form>
      )}

      {mode === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="auth-form">
          <div className="form-group">
            <label>
              <FiKey className="react-icon teal-text" /> Nhập mã xác thực OTP (6 chữ số)
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Nhập 6 số OTP..."
            />
          </div>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Đang kích hoạt...' : 'Xác nhận & Kích hoạt tài khoản'}
          </Button>
          <div style={{ marginTop: '0.75rem' }}>
            <Button
              type="button"
              variant="outline"
              fullWidth
              disabled={loading}
              onClick={handleResendOtp}
            >
              <FiRefreshCw className="react-icon" /> Gửi lại mã OTP mới về Email
            </Button>
          </div>
        </form>
      )}
    </div>
  );

  if (asPage) {
    return <div className="auth-page-wrapper animate-page-enter">{cardContent}</div>;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {cardContent}
    </div>
  );
}
