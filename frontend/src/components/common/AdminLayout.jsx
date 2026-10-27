import React from 'react';
import {
  FiGrid,
  FiBookOpen,
  FiBook,
  FiUsers,
  FiHome,
  FiLogOut,
  FiSmartphone,
  FiLayers,
} from 'react-icons/fi';

/**
 * Khung Layout dùng chung cho toàn bộ các trang Quản trị (AdminLayout)
 * Giữ nguyên Sidebar cố định, chỉ thay đổi vùng nội dung bên phải khi chuyển trang
 */
export default function AdminLayout({
  user,
  activeScreen,
  onNavigateAdmin,
  onSwitchToUserScreen,
  onSwitchToApp,
  onLogout,
  children,
}) {
  return (
    <div className="admin-portal-layout">
      {/* SIDEBAR QUẢN TRỊ DÙNG CHUNG CHO TẤT CẢ CÁC TRANG ADMIN */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="brand-icon">S</span>
          <div>
            <h1>SpeakAI Admin</h1>
            <span>Hệ thống Quản trị IELTS AI</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-label">CÁC TRANG QUẢN TRỊ</div>

          <button
            className={activeScreen === 'admin-dashboard' ? 'active' : ''}
            onClick={() => onNavigateAdmin('admin-dashboard')}
          >
            <FiGrid className="react-icon" /> Trang chủ
          </button>

          <button
            className={activeScreen === 'admin-lessons' ? 'active' : ''}
            onClick={() => onNavigateAdmin('admin-lessons')}
          >
            <FiBookOpen className="react-icon" /> Quản lý Bài học
          </button>

          <button
            className={activeScreen === 'admin-vocabulary' ? 'active' : ''}
            onClick={() => onNavigateAdmin('admin-vocabulary')}
          >
            <FiLayers className="react-icon" /> Quản lý Chủ đề Từ vựng
          </button>

          <button
            className={activeScreen === 'admin-users' ? 'active' : ''}
            onClick={() => onNavigateAdmin('admin-users')}
          >
            <FiUsers className="react-icon" /> Quản lý Người dùng
          </button>

          <div className="sidebar-divider" />
          <div className="admin-nav-label">CHUYỂN GIAO DIỆN</div>

          <button className="switch-portal-btn" onClick={onSwitchToUserScreen}>
            <FiHome className="react-icon" /> Về Trang Chủ Học Viên
          </button>

          {onSwitchToApp && (
            <button onClick={onSwitchToApp}>
              <FiSmartphone className="react-icon" /> Giao diện Mobile App
            </button>
          )}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <strong>{user?.fullName || 'Quản trị viên SpeakAI'}</strong>
            <span>{user?.email || 'admin@speakai.vn'}</span>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            <FiLogOut className="react-icon" /> Thoát
          </button>
        </div>
      </aside>

      {/* VÙNG NỘI DUNG THAY ĐỔI THEO TỪNG TRANG */}
      <main className="admin-main-area animate-page-enter">{children}</main>
    </div>
  );
}

