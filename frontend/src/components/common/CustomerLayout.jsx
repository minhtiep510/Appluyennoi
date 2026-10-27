import React, { useState, useEffect, useRef } from 'react';
import {
  FiHome,
  FiBookOpen,
  FiBook,
  FiUser,
  FiLogIn,
  FiShield,
  FiLogOut,
  FiChevronDown,
  FiSmartphone,
  FiKey,
  FiMic,
} from 'react-icons/fi';
import Footer from './Footer';

/**
 * Layout dùng chung cho Học viên / Khách hàng (CustomerLayout.jsx)
 * Giữ cố định Thanh Icon bên trái (Sidebar Rail) và Thanh Header trên cùng (kèm Menu dưới tên người dùng)
 * khi chuyển đổi giữa các trang: Trang chủ, Đề tài, Profile, Đăng nhập/Đăng ký.
 */
export default function CustomerLayout({
  user,
  activeScreen,
  authMode,
  onNavigate,
  onOpenAuth,
  onLogout,
  onSwitchToApp,
  children,
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = user?.role === 'ADMIN';
  const avatarLetter = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : 'S';

  // Đóng menu dưới tên người dùng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMenu = (screen) => {
    setUserMenuOpen(false);
    onNavigate(screen);
  };

  const handleLogoutClick = () => {
    setUserMenuOpen(false);
    onLogout();
  };

  return (
    <div className="lexi-shell">
      {/* 1. THANH ICON BÊN TRÁI SPEAKAI (CỐ ĐỊNH DÙNG CHUNG CHO CUSTOMER) */}
      <aside className="lexi-icon-rail">
        <div
          className="rail-avatar-circle"
          title={user ? user.fullName : 'Trang chủ SpeakAI'}
          onClick={() => onNavigate('home')}
        >
          {avatarLetter}
        </div>

        <nav className="rail-nav-icons">
          {/* Icon 1: Trang chủ */}
          <button
            className={`rail-icon-btn ${activeScreen === 'home' ? 'active' : ''}`}
            title="Trang chủ SpeakAI"
            onClick={() => onNavigate('home')}
          >
            <FiHome />
          </button>

          {/* Icon 2: Chọn Đề tài Luyện nói */}
          <button
            className={`rail-icon-btn ${activeScreen === 'topics' || activeScreen === 'practice' ? 'active' : ''}`}
            title="Chọn Đề tài Luyện nói"
            onClick={() => onNavigate('topics')}
          >
            <FiMic />
          </button>

          {/* Icon 3: Học Từ vựng */}
          <button
            className={`rail-icon-btn ${
              activeScreen === 'vocabulary' ? 'active' : ''
            }`}
            title="Học Từ vựng IELTS"
            onClick={() => onNavigate('vocabulary')}
          >
            <FiBook />
          </button>

          {/* Icon 4: Chuyển sang Giao diện Mobile App */}
          {onSwitchToApp && (
            <button
              className="rail-icon-btn"
              title="Chuyển sang Giao diện Mobile App"
              onClick={onSwitchToApp}
            >
              <FiSmartphone />
            </button>
          )}

          {/* Icon 4: Trang Đăng nhập / Đăng ký (Chỉ hiện khi chưa đăng nhập) */}
          {!user && (
            <button
              className={`rail-icon-btn ${activeScreen === 'auth' ? 'active' : ''}`}
              title="Trang Đăng nhập / Đăng ký"
              onClick={() => onOpenAuth('login')}
            >
              <FiLogIn />
            </button>
          )}
        </nav>
      </aside>

      {/* 2. VÙNG NỘI DUNG BÊN PHẢI (TOP HEADER CỐ ĐỊNH + NỘI DUNG TRANG) */}
      <div className="lexi-body-wrap">
        <header className="lexi-top-header">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              className="lexi-brand-title"
              onClick={() => onNavigate('home')}
            >
              SpeakAI
            </div>

            {/* Thanh điều hướng chính */}
            <nav className="top-page-nav">
              <button
                type="button"
                className={activeScreen === 'home' ? 'active' : ''}
                onClick={() => onNavigate('home')}
              >
                <FiHome className="react-icon" /> Trang chủ
              </button>
              <button
                type="button"
                className={activeScreen === 'topics' || activeScreen === 'practice' ? 'active' : ''}
                onClick={() => onNavigate('topics')}
              >
                <FiMic className="react-icon" /> Luyện nói
              </button>
              <button
                type="button"
                className={activeScreen === 'vocabulary' ? 'active' : ''}
                onClick={() => onNavigate('vocabulary')}
              >
                <FiBook className="react-icon" /> Từ vựng
              </button>
            </nav>
          </div>

          {/* Góc phải Header: Nút chuyển Giao diện App + Đăng nhập/Đăng ký hoặc Menu dưới Tên Người Dùng */}
          <div className="lexi-header-auth">
            {onSwitchToApp && (
              <button
                type="button"
                className="switch-app-pill-btn"
                onClick={onSwitchToApp}
                title="Mở Giao diện Mobile App"
              >
                <FiSmartphone className="react-icon" /> Giao diện App
              </button>
            )}
            {!user ? (
              <>
                <button
                  type="button"
                  className={`header-link-btn ${
                    activeScreen === 'auth' && authMode === 'register'
                      ? 'bold'
                      : ''
                  }`}
                  onClick={() => onOpenAuth('register')}
                >
                  Đăng ký
                </button>
                <span className="header-divider">/</span>
                <button
                  type="button"
                  className="header-link-btn bold"
                  onClick={() => onOpenAuth('login')}
                >
                  Đăng nhập
                </button>
              </>
            ) : (
              <div className="user-menu-container" ref={dropdownRef}>
                <button
                  type="button"
                  className={`user-menu-trigger ${userMenuOpen ? 'open' : ''}`}
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                >
                  <span className="user-mini-avatar">{avatarLetter}</span>
                  <span className="user-trigger-name">{user.fullName}</span>
                  <FiChevronDown
                    className={`user-chevron ${userMenuOpen ? 'rotated' : ''}`}
                  />
                </button>

                {/* MENU XỔ XUỐNG ẨN DƯỚI TÊN NGƯỜI DÙNG (CHỨA PROFILE & TRANG QUẢN TRỊ VIÊN) */}
                {userMenuOpen && (
                  <div className="user-dropdown-menu animate-modal-pop">
                    <div className="user-dropdown-header">
                      <strong>{user.fullName}</strong>
                      <span>{user.email}</span>
                      <div style={{ marginTop: '0.35rem' }}>
                        <span className="badge-level">
                          {isAdmin ? (
                            <>
                              <FiShield className="react-icon" /> Quản trị viên (ADMIN)
                            </>
                          ) : (
                            <>
                              <FiUser className="react-icon" /> Học viên (USER)
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="user-dropdown-divider" />

                    {/* Trang Profile cá nhân */}
                    <button
                      type="button"
                      className={`user-dropdown-item ${
                        activeScreen === 'profile' ? 'active' : ''
                      }`}
                      onClick={() => handleSelectMenu('profile')}
                    >
                      <FiUser className="react-icon" /> Trang  Cá nhân
                    </button>

                    {/* Trang Đổi mật khẩu riêng */}
                    <button
                      type="button"
                      className={`user-dropdown-item ${
                        activeScreen === 'change-password' ? 'active' : ''
                      }`}
                      onClick={() => handleSelectMenu('change-password')}
                    >
                      <FiKey className="react-icon" /> Đổi Mật Khẩu
                    </button>

                    {/* Trang Quản trị viên (Chỉ hiện khi đăng nhập là ADMIN) */}
                    {isAdmin && (
                      <button
                        type="button"
                        className="user-dropdown-item admin-item"
                        onClick={() => handleSelectMenu('admin-dashboard')}
                      >
                        <FiShield className="react-icon" /> Trang Quản trị viên
                      </button>
                    )}

                    <div className="user-dropdown-divider" />

                    <button
                      type="button"
                      className="user-dropdown-item logout-item"
                      onClick={handleLogoutClick}
                    >
                      <FiLogOut className="react-icon" /> Đăng xuất tài khoản
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* NỘI DUNG TỪNG TRANG CUSTOMER THAY ĐỔI TẠI ĐÂY */}
        <main style={{ flex: 1 }}>{children}</main>

        {/* FOOTER DÙNG CHUNG CHO TOÀN BỘ TRANG */}
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
}

