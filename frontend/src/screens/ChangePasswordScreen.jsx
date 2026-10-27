import React, { useState } from 'react';
import {
  FiKey,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowLeft,
  FiShield,
  FiUser,
} from 'react-icons/fi';
import { authService } from '../api/auth.service';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

/**
 * Trang Đổi Mật Khẩu riêng biệt (ChangePasswordScreen.jsx)
 */
export default function ChangePasswordScreen({ user, onNavigate, onLogout }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!currentPassword) {
      setError('Vui lòng nhập mật khẩu hiện tại.');
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

    if (currentPassword === newPassword) {
      setError('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.changePassword({
        currentPassword,
        newPassword,
      });
      setSuccessMsg(res.message || 'Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="lexispeak-window-frame animate-page-enter" style={{ marginTop: '2rem' }}>
      <div className="lexispeak-window-topbar">
        <div className="lexispeak-brand-group">
          <span className="lexispeak-title">SpeakAI</span>
          <span className="lexispeak-slash">/</span>
          <span className="lexispeak-tagline">Trang Đổi Mật Khẩu Tài Khoản</span>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <Button variant="outline" onClick={() => onNavigate?.('profile')}>
            <FiUser className="react-icon" /> Trang Profile
          </Button>
          <Button variant="ghost" onClick={() => onNavigate?.('home')}>
            <FiArrowLeft className="react-icon" /> Trang Chủ
          </Button>
        </div>
      </div>

      <div className="lexispeak-window-body">
        <div className="profile-layout-grid" style={{ maxWidth: '780px', margin: '0 auto', gridTemplateColumns: '1fr' }}>
          <div className="profile-card-box animate-card-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: '#f0fdfa',
                  color: '#0f766e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  border: '1.5px solid #ccfbf1',
                }}
              >
                <FiKey />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
                  Đổi Mật Khẩu Đăng Nhập
                </h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
                  Thiết lập mật khẩu mới an toàn cho tài khoản <b>{user?.email || ''}</b>
                </p>
              </div>
            </div>

            <hr className="divider" style={{ margin: '0.5rem 0 1.25rem 0' }} />

            {error && <div className="alert-error animate-card-up">{error}</div>}
            {successMsg && (
              <div className="alert-success animate-card-up" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FiCheckCircle className="react-icon" style={{ fontSize: '1.2rem', flexShrink: 0 }} />
                <div>
                  <strong>{successMsg}</strong>
                  <div style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
                    Mật khẩu tài khoản của bạn đã được cập nhật an toàn.
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: '0.85rem' }}>
              {/* MẬT KHẨU HIỆN TẠI */}
              <div className="form-group">
                <label>
                  <FiLock className="react-icon teal-text" /> Mật khẩu hiện tại *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    placeholder="Nhập mật khẩu bạn đang sử dụng..."
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((prev) => !prev)}
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
                    title={showCurrent ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showCurrent ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* MẬT KHẨU MỚI */}
              <div className="form-group">
                <label>
                  <FiKey className="react-icon teal-text" /> Mật khẩu mới * (Tối thiểu 6 ký tự)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Tạo mật khẩu mới bảo mật..."
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

              {/* XÁC NHẬN MẬT KHẨU MỚI */}
              <div className="form-group">
                <label>
                  <FiShield className="react-icon teal-text" /> Xác nhận mật khẩu mới *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Nhập lại chính xác mật khẩu mới..."
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

              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Button type="submit" disabled={loading} style={{ flex: 1, minWidth: '180px' }}>
                  <FiKey className="react-icon" /> {loading ? 'Đang cập nhật...' : 'Xác nhận Đổi Mật Khẩu'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onNavigate?.('profile')}
                >
                  Hủy / Quay lại
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

