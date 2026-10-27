import React, { useState, useEffect } from 'react';
import {
  FiHome,
  FiBookOpen,
  FiBook,
  FiMic,
  FiUser,
  FiLogIn,
  FiShield,
  FiMonitor,
  FiSmartphone,
  FiWifi,
  FiBatteryCharging,
  FiLogOut,
} from 'react-icons/fi';

/**
 * Giao diện Mobile App (MobileAppLayout.jsx)
 * - Khi mở trên máy tính: Hiển thị khung giả lập điện thoại iPhone 16 Pro (có Dynamic Island, Status Bar, Bottom Tab Bar)
 *   và nút chuyển đổi antara "Khung iPhone" <-> "Toàn màn hình" hoặc quay về "Giao diện Web".
 * - Khi mở trên điện thoại thật: Tự động hiển thị full màn hình chuẩn Native Mobile App.
 */
export default function MobileAppLayout({
  user,
  activeScreen,
  onNavigate,
  onStartPractice,
  onOpenAuth,
  onLogout,
  onSwitchToWeb,
  children,
}) {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [phoneFrameMode, setPhoneFrameMode] = useState(true);

  const isAdmin = user?.role === 'ADMIN';
  const avatarLetter = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : 'S';

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hh}:${mm}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`mobile-app-stage ${
        phoneFrameMode ? 'framed-phone-mode' : 'fullscreen-mobile-mode'
      }`}
    >
      {/* THANH CÔNG CỤ CHUYỂN ĐỔI NHANH WEB <-> APP TRÊN DESKTOP */}
      <div className="platform-switcher-bar">
        <div className="platform-switcher-left">
          <span className="platform-badge">
            <FiSmartphone className="react-icon" /> SpeakAI Mobile App
          </span>
          <span className="platform-hint">
            Chế độ Giao diện Ứng dụng Di động (iOS / Android)
          </span>
        </div>

        <div className="platform-switcher-actions">
          <button
            type="button"
            className={`platform-mode-btn ${phoneFrameMode ? 'active' : ''}`}
            onClick={() => setPhoneFrameMode(true)}
          >
            <FiSmartphone className="react-icon" /> Khung Điện Thoại
          </button>
          <button
            type="button"
            className={`platform-mode-btn ${!phoneFrameMode ? 'active' : ''}`}
            onClick={() => setPhoneFrameMode(false)}
          >
            Rộng Mobile
          </button>
          <button
            type="button"
            className="platform-web-btn"
            onClick={onSwitchToWeb}
          >
            <FiMonitor className="react-icon" /> Chuyển sang Giao diện Web
          </button>
        </div>
      </div>

      {/* KHUNG ĐIỆN THOẠI DI ĐỘNG */}
      <div className="mobile-device-shell">
        {/* 1. THANH TRẠNG THÁI ĐIỆN THOẠI (STATUS BAR + DYNAMIC ISLAND) */}
        <div className="mobile-status-bar">
          <span className="status-time">{currentTime}</span>
          <div className="dynamic-island">
            <span className="island-camera" />
            <span className="island-mic-dot" />
          </div>
          <div className="status-icons">
            <span>5G</span>
            <FiWifi />
            <FiBatteryCharging />
          </div>
        </div>

        {/* 2. TOP HEADER CỦA MOBILE APP */}
        <header className="mobile-app-topbar">
          <div
            className="mobile-brand-row"
            onClick={() => onNavigate('home')}
          >
            <span className="mobile-logo-box">S</span>
            <div>
              <strong>SpeakAI</strong>
              <span>IELTS Speaking AI</span>
            </div>
          </div>

          <div className="mobile-topbar-right">
            {!user ? (
              <button
                type="button"
                className="mobile-login-pill"
                onClick={() => onOpenAuth('login')}
              >
                <FiLogIn className="react-icon" /> Đăng nhập
              </button>
            ) : (
              <div className="mobile-user-pills">
                <button
                  type="button"
                  className="mobile-user-chip"
                  onClick={() => onNavigate('profile')}
                  title={user.fullName}
                >
                  <span className="mobile-avatar-sm">{avatarLetter}</span>
                  <span className="mobile-user-short">
                    {user.fullName.split(' ').slice(-1)[0]}
                  </span>
                </button>
                <button
                  type="button"
                  className="mobile-logout-icon-btn"
                  title="Đăng xuất"
                  onClick={onLogout}
                >
                  <FiLogOut />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* 3. VÙNG NỘI DUNG CUỘN CỦA APP */}
        <div className="mobile-app-scroll-body">{children}</div>

        {/* 4. THANH ĐIỀU HƯỚNG ĐÁY (BOTTOM TAB NAVIGATION BAR CHUẨN APP) */}
        <nav className="mobile-bottom-tabbar">
          <button
            type="button"
            className={`mobile-tab-item ${
              activeScreen === 'home' ? 'active' : ''
            }`}
            onClick={() => onNavigate('home')}
          >
            <FiHome className="tab-icon" />
            <span>Trang chủ</span>
          </button>

          <button
            type="button"
            className={`mobile-tab-item ${
              activeScreen === 'topics' ? 'active' : ''
            }`}
            onClick={() => onNavigate('topics')}
          >
            <FiBookOpen className="tab-icon" />
            <span>Đề tài</span>
          </button>

          {/* Nút Mic nổi bật ở giữa Bottom Bar */}
          <button
            type="button"
            className={`mobile-tab-item center-mic-tab ${
              activeScreen === 'topics' || activeScreen === 'practice' ? 'active' : ''
            }`}
            onClick={() => onNavigate('topics')}
          >
            <div className="center-mic-circle">
              <FiMic />
            </div>
            <span>Luyện nói</span>
          </button>

          <button
            type="button"
            className={`mobile-tab-item ${
              activeScreen === 'vocabulary' ? 'active' : ''
            }`}
            onClick={() => onNavigate('vocabulary')}
          >
            <FiBook className="tab-icon" />
            <span>Từ vựng</span>
          </button>

          {user ? (
            <button
              type="button"
              className={`mobile-tab-item ${
                activeScreen === 'profile' ? 'active' : ''
              }`}
              onClick={() => onNavigate('profile')}
            >
              <FiUser className="tab-icon" />
              <span>Cá nhân</span>
            </button>
          ) : (
            <button
              type="button"
              className={`mobile-tab-item ${
                activeScreen === 'auth' ? 'active' : ''
              }`}
              onClick={() => onOpenAuth('login')}
            >
              <FiLogIn className="tab-icon" />
              <span>Tài khoản</span>
            </button>
          )}

          {isAdmin && (
            <button
              type="button"
              className={`mobile-tab-item ${
                activeScreen.startsWith('admin-') ? 'active' : ''
              }`}
              onClick={() => onNavigate('admin-dashboard')}
            >
              <FiShield className="tab-icon" />
              <span>Quản trị</span>
            </button>
          )}
        </nav>

        {/* Thanh Home Indicator chuẩn iOS */}
        <div className="mobile-home-indicator">
          <span />
        </div>
      </div>
    </div>
  );
}

