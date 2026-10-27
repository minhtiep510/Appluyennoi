import React, { useState, useEffect } from 'react';
import {
  FiGrid,
  FiBookOpen,
  FiUsers,
  FiMessageSquare,
  FiShield,
  FiArrowRight,
  FiExternalLink,
  FiActivity,
} from 'react-icons/fi';
import { lessonService } from '../api/lesson.service';
import { authService } from '../api/auth.service';
import Button from '../components/common/Button';

/**
 * Nội dung Trang chủ Quản trị (AdminDashboardScreen.jsx)
 * (Sidebar đã được giữ cố định trong AdminLayout.jsx)
 */
export default function AdminDashboardScreen({
  onNavigateAdmin,
  onSwitchToUserScreen,
}) {
  const [lessons, setLessons] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    lessonService.getLessons().then(setLessons).catch(console.error);
    authService
      .getUsers({ page: 1, limit: 6 })
      .then((res) => setUsers(res.data || []))
      .catch(() => setUsers([]));
  }, []);

  const totalDialoguesCount = lessons.reduce(
    (sum, item) => sum + (item._count?.dialogues ?? item.dialogues?.length ?? 0),
    0
  );

  return (
    <div className="animate-page-enter">
      <header className="admin-topbar">
        <div>
          <span className="admin-breadcrumb">
            SpeakAI Portal / Trang Quản trị / Dashboard
          </span>
          <h2 className="admin-page-heading">
            <FiGrid className="react-icon teal-text" /> Bảng Điều Khiển Tổng Quan (Admin Dashboard)
          </h2>
        </div>

        <div className="admin-topbar-actions">
          <span className="socket-badge connected">
            <span className="pulse-dot" />
            SpeakAI Engine: Online
          </span>
          <button className="btn-outline-sm" onClick={onSwitchToUserScreen}>
            <FiExternalLink className="react-icon" /> Giao diện User
          </button>
        </div>
      </header>

      {/* Dải thẻ KPI Thống kê tổng quan */}
      <section className="admin-kpi-grid">
        <div
          className="admin-kpi-card animate-card-up"
          style={{ cursor: 'pointer', animationDelay: '0.05s' }}
          onClick={() => onNavigateAdmin('admin-lessons')}
        >
          <div className="kpi-icon teal">
            <FiBookOpen />
          </div>
          <div>
            <span className="kpi-label">Tổng Bài học Speaking</span>
            <strong className="kpi-value">{lessons.length}</strong>
          </div>
        </div>

        <div
          className="admin-kpi-card animate-card-up"
          style={{ cursor: 'pointer', animationDelay: '0.1s' }}
          onClick={() => onNavigateAdmin('admin-lessons')}
        >
          <div className="kpi-icon blue">
            <FiMessageSquare />
          </div>
          <div>
            <span className="kpi-label">Tổng Câu thoại Kịch bản</span>
            <strong className="kpi-value">{totalDialoguesCount}</strong>
          </div>
        </div>

        <div
          className="admin-kpi-card animate-card-up"
          style={{ cursor: 'pointer', animationDelay: '0.15s' }}
          onClick={() => onNavigateAdmin('admin-users')}
        >
          <div className="kpi-icon purple">
            <FiUsers />
          </div>
          <div>
            <span className="kpi-label">Tổng Người dùng</span>
            <strong className="kpi-value">{users.length}</strong>
          </div>
        </div>

        <div
          className="admin-kpi-card animate-card-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="kpi-icon amber">
            <FiShield />
          </div>
          <div>
            <span className="kpi-label">Tiêu chuẩn chấm AI</span>
            <strong className="kpi-value">IDP &amp; BC</strong>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Tóm tắt Bài học */}
        <div className="admin-content-panel animate-card-up">
          <div className="section-header-row">
            <div>
              <h3>
                <FiBookOpen className="react-icon teal-text" /> Tổng quan Bài học &amp; Đề tài Speaking
              </h3>
              <p>
                Danh sách các đề tài đang hoạt động — bấm nút bên phải để sang Trang Quản lý Bài học
              </p>
            </div>
            <Button onClick={() => onNavigateAdmin('admin-lessons')}>
              Mở Quản lý Bài học <FiArrowRight className="react-icon" />
            </Button>
          </div>

          <div className="table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Đề tài / Bài học</th>
                  <th>Cấp độ</th>
                  <th style={{ textAlign: 'center' }}>Số câu thoại</th>
                  <th style={{ textAlign: 'right' }}>Điều hướng</th>
                </tr>
              </thead>
              <tbody>
                {lessons.slice(0, 5).map((lesson) => {
                  const count =
                    lesson._count?.dialogues ?? lesson.dialogues?.length ?? 0;
                  return (
                    <tr key={lesson.id}>
                      <td className="col-title">{lesson.title}</td>
                      <td>
                        <span className="badge-level">{lesson.level}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="count-pill">{count} câu</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-action green"
                          onClick={() => onNavigateAdmin('admin-lessons')}
                        >
                          <FiBookOpen className="react-icon" /> Quản lý bài học này
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tóm tắt Người dùng */}
        <div className="admin-content-panel animate-card-up">
          <div className="section-header-row">
            <div>
              <h3>
                <FiActivity className="react-icon teal-text" /> Người dùng mới nhất trên Hệ thống
              </h3>
              <p>
                Bấm nút bên phải để sang Trang Quản lý Người dùng (Thêm, sửa, xóa và xem lịch sử nói)
              </p>
            </div>
            <Button onClick={() => onNavigateAdmin('admin-users')}>
              Mở Quản lý Người dùng <FiArrowRight className="react-icon" />
            </Button>
          </div>

          <div className="table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Họ và Tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th style={{ textAlign: 'center' }}>Số câu đã luyện</th>
                  <th style={{ textAlign: 'right' }}>Điều hướng</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((u) => (
                  <tr key={u.id}>
                    <td className="col-title">{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={u.role === 'ADMIN' ? 'tag-ai' : 'badge-level'}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="count-pill">
                        {u._count?.histories ?? 0} lượt
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-action green"
                        onClick={() => onNavigateAdmin('admin-users')}
                      >
                        <FiUsers className="react-icon" /> Quản lý tài khoản
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
