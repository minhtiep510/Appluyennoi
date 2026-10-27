import React, { useState, useEffect } from 'react';
import {
  FiMail,
  FiLock,
  FiKey,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheckCircle,
  FiArrowLeft,
  FiRefreshCw,
  FiLogIn,
} from 'react-icons/fi';
import { authService } from '../api/auth.service';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

/**
 * Trang Quên Mật Khẩu & Đặt Lại Mật Khẩu riêng biệt (ForgotPasswordScreen.jsx)
 */
export default function ForgotPasswordScreen({ onNavigate, onOpenAuth }) {
  // step: 'request' (nhập email) | 'verify' (nhập otp & mật khẩu mới) | 'completed' (thành công)
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Countdown timer cho OTP
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // 1. Gửi yêu cầu lấy mã OTP đặt lại mật khẩu
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword({ email });
      setMessage(res.message || 'Mã xác thực OTP đã được gửi về email của bạn!');
      setStep('verify');
      setCountdown(res.expiresIn || 300);
    } catch (err) {
      setError(err.message || 'Không tìm thấy tài khoản tương ứng với email này.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Gửi lại mã OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await authService.forgotPassword({ email });
      setMessage('Mã OTP mới đã được gửi lại vào email của bạn!');
      setCountdown(res.expiresIn || 300);
    } catch (err) {
      setError(err.message || 'Không thể gửi lại mã OTP lúc này.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Xác thực OTP và đặt lại mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otp || otp.trim().length !== 6) {
      setError('Mã xác thực OTP phải gồm 6 chữ số.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword({
        email,
        otp: otp.trim(),
        newPassword,
      });
      setMessage(res.message || 'Đặt lại mật khẩu thành công!');
      setStep('completed');
    } catch (err) {
      setError(err.message || 'Mã OTP không chính xác hoặc đã hết hiệu lực.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    if (onOpenAuth) {
      onOpenAuth('login');
    } else if (onNavigate) {
      onNavigate('auth');
    }
  };

  return (
    <section className="lexispeak-window-frame animate-page-enter" style={{ marginTop: '2rem' }}>
      <div className="lexispeak-window-topbar">
        <div className="lexispeak-brand-group">
          <span className="lexispeak-title">SpeakAI</span>
          <span className="lexispeak-slash">/</span>
          <span className="lexispeak-tagline">Trang Quên Mật Khẩu</span>
        </div>
        <Button variant="ghost" onClick={handleGoToLogin}>
          <FiArrowLeft className="react-icon" /> Quay lại Đăng nhập
        </Button>
      </div>

      <div className="lexispeak-window-body">
        <div style={{ maxWidth: '540px', margin: '1rem auto' }}>
          <div className="profile-card-box animate-card-up">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#f0fdfa',
                  color: '#0f766e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  margin: '0 auto 0.85rem auto',
                  border: '2px solid #ccfbf1',
                }}
              >
                <FiLock />
              </div>
              <h2 style={{ margin: '0 0 0.35rem 0', fontSize: '1.45rem', color: '#0f172a', fontWeight: 800 }}>
                {step === 'completed'
                  ? 'Đặt Lại Mật Khẩu Thành Công'
                  : step === 'verify'
                  ? 'Xác Thực OTP & Tạo Mật Khẩu'
                  : 'Quên Mật Khẩu?'}
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {step === 'completed'
                  ? 'Mật khẩu tài khoản của bạn đã được thay đổi an toàn.'
                  : step === 'verify'
                  ? `Nhập mã 6 số đã gửi tới email ${email} cùng mật khẩu mới của bạn.`
                  : 'Nhập địa chỉ email đăng ký tài khoản SpeakAI của bạn để nhận mã xác thực đặt lại mật khẩu.'}
              </p>
            </div>

            {error && <div className="alert-error animate-card-up">{error}</div>}
            {message && <div className="alert-success animate-card-up">{message}</div>}

            {/* BƯỚC 1: NHẬP EMAIL */}
            {step === 'request' && (
              <form onSubmit={handleRequestOtp} className="auth-form" style={{ marginTop: '1.15rem' }}>
                <div className="form-group">
                  <label>
                    <FiMail className="react-icon teal-text" /> Địa chỉ Email tài khoản
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="VD: user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <Button type="submit" fullWidth disabled={loading} style={{ marginTop: '0.5rem' }}>
                  <FiKey className="react-icon" /> {loading ? 'Đang gửi mã...' : 'Gửi mã xác thực OTP qua Email'}
                </Button>

                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={handleGoToLogin}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0f766e',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <FiArrowLeft /> Nhớ mật khẩu rồi? Đăng nhập ngay
                  </button>
                </div>
              </form>
            )}

            {/* BƯỚC 2: NHẬP OTP VÀ MẬT KHẨU MỚI */}
            {step === 'verify' && (
              <form onSubmit={handleResetPassword} className="auth-form" style={{ marginTop: '1.15rem' }}>
                <div className="form-group">
                  <label>
                    <FiKey className="react-icon teal-text" /> Mã xác thực OTP (6 chữ số)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Nhập 6 số OTP (VD: 123456)..."
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{
                      letterSpacing: '4px',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      textAlign: 'center',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '0.45rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    <span style={{ color: countdown > 0 ? '#0f766e' : '#ef4444', fontWeight: 700 }}>
                      {countdown > 0
                        ? `⏱️ Mã có hiệu lực trong: ${Math.floor(countdown / 60)}:${String(
                            countdown % 60
                          ).padStart(2, '0')}`
                        : '⚠️ Mã OTP đã hết hạn'}
                    </span>
                    <button
                      type="button"
                      disabled={countdown > 0 || loading}
                      onClick={handleResendOtp}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: countdown > 0 ? '#94a3b8' : '#0f766e',
                        fontWeight: 700,
                        cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <FiRefreshCw className={loading ? 'spin' : ''} /> Gửi lại mã
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <FiLock className="react-icon teal-text" /> Mật khẩu mới * (Tối thiểu 6 ký tự)
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showNew ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Nhập mật khẩu mới..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ paddingRight: '2.75rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((prev) => !prev)}
                      style={{
                        position: 'absolute',
                        right: '0.85rem',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px',
                      }}
                      title={showNew ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <FiShield className="react-icon teal-text" /> Xác nhận mật khẩu mới *
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Nhập lại mật khẩu mới..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ paddingRight: '2.75rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      style={{
                        position: 'absolute',
                        right: '0.85rem',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px',
                      }}
                      title={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" fullWidth disabled={loading} style={{ marginTop: '0.65rem' }}>
                  <FiKey className="react-icon" /> {loading ? 'Đang xác thực...' : 'Xác Nhận Đặt Lại Mật Khẩu'}
                </Button>

                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep('request')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <FiArrowLeft /> Nhập lại địa chỉ email khác
                  </button>
                </div>
              </form>
            )}

            {/* BƯỚC 3: HOÀN TẤT THÀNH CÔNG */}
            {step === 'completed' && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    margin: '0 auto 1.25rem auto',
                  }}
                >
                  <FiCheckCircle />
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#166534', fontWeight: 800 }}>
                  Thành Công!
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', marginBottom: '1.75rem' }}>
                  Mật khẩu tài khoản của bạn đã được cập nhật. Bạn có thể sử dụng mật khẩu mới để đăng nhập ngay bây giờ.
                </p>

                <Button fullWidth onClick={handleGoToLogin}>
                  <FiLogIn className="react-icon" /> Đi tới Trang Đăng Nhập
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

