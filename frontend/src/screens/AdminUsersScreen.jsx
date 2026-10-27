import React, { useState, useEffect } from 'react';
import {
  FiGrid,
  FiBookOpen,
  FiUsers,
  FiUser,
  FiHome,
  FiLogOut,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiX,
} from 'react-icons/fi';
import { authService } from '../api/auth.service';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';

const FALLBACK_USERS = [
  {
    id: 1,
    fullName: 'Quản trị viên Hệ thống',
    email: 'admin@speakai.vn',
    role: 'ADMIN',
    isVerified: true,
    _count: { histories: 12 },
    histories: [],
  },
  {
    id: 2,
    fullName: 'Nguyễn Minh Học Viên',
    email: 'minh.nguyen@speakai.vn',
    role: 'USER',
    isVerified: true,
    _count: { histories: 28 },
    histories: [
      {
        id: 502,
        accuracyScore: 89,
        spokenText:
          'I am currently a final year university student majoring in software engineering.',
        dialogue: {
          text: 'I am currently a final year university student majoring in software engineering.',
          lesson: { title: 'IELTS Speaking Part 1: Work, Study & Hometown' },
        },
      },
    ],
  },
  {
    id: 3,
    fullName: 'Trần Thảo Linh',
    email: 'thaolinh@speakai.vn',
    role: 'USER',
    isVerified: true,
    _count: { histories: 45 },
    histories: [],
  },
];

/**
 * Trang Quản lý Người dùng riêng biệt (AdminUsersScreen.jsx)
 * Thanh Sidebar quản trị được dùng chung cố định từ AdminLayout.jsx
 */
export default function AdminUsersScreen({ onNavigateAdmin }) {
  const [users, setUsers] = useState(FALLBACK_USERS);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: FALLBACK_USERS.length,
  });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    email: '',
    fullName: '',
    password: '',
    role: 'USER',
    isVerified: true,
  });
  const [userError, setUserError] = useState('');
  const [detailUser, setDetailUser] = useState(null);

  const fetchUsers = async (page = 1) => {
    setLoadingUsers(true);
    try {
      const res = await authService.getUsers({
        page,
        limit: 8,
        search,
        role: roleFilter,
      });
      if (res.data && res.data.length > 0) {
        setUsers(res.data);
        setPagination(
          res.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: res.data.length,
          }
        );
      } else {
        setUsers(FALLBACK_USERS);
      }
    } catch {
      const filtered = FALLBACK_USERS.filter((u) => {
        const matchRole = !roleFilter || u.role === roleFilter;
        const matchSearch =
          !search ||
          u.fullName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase());
        return matchRole && matchSearch;
      });
      setUsers(filtered);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: filtered.length,
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter]);

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setUserError('');
    try {
      if (editingUser) {
        const payload = {
          fullName: userForm.fullName,
          role: userForm.role,
          isVerified: userForm.isVerified,
          ...(userForm.password ? { password: userForm.password } : {}),
        };
        await authService.updateUser(editingUser.id, payload);
      } else {
        await authService.createUser(userForm);
      }
      setShowUserModal(false);
      fetchUsers(pagination.currentPage);
    } catch (err) {
      setUserError(err.message || 'Không thể lưu người dùng.');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Xóa người dùng "${name}"?`)) return;
    try {
      await authService.deleteUser(id);
      fetchUsers(pagination.currentPage);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewUserDetail = async (userObj) => {
    try {
      const detail = await authService.getUserDetail(userObj.id);
      setDetailUser(detail);
    } catch {
      setDetailUser(userObj);
    }
  };

  return (
    <div className="animate-page-enter">
      {/* VÙNG CHÍNH TRANG QUẢN LÝ NGƯỜI DÙNG */}
      <header className="admin-topbar">
        <div>
          <span className="admin-breadcrumb">
            SpeakAI Admin / Quản lý Người dùng
          </span>
          <h2 className="admin-page-heading">
            <FiUsers className="react-icon teal-text" /> Trang Quản Lý Tài Khoản Người Dùng
          </h2>
        </div>

        <div className="admin-topbar-actions">
          <button
            className="btn-outline-sm"
            onClick={() => onNavigateAdmin('admin-dashboard')}
          >
            <FiGrid className="react-icon" /> Trang chủ
          </button>
          <button
            className="btn-outline-sm"
            onClick={() => onNavigateAdmin('admin-lessons')}
          >
            <FiBookOpen className="react-icon" /> Quản lý Bài học
          </button>
        </div>
      </header>

      <div className="admin-content-panel animate-card-up">
          <div className="section-header-row">
            <div>
              <h3>Danh sách Người dùng Hệ thống ({pagination.totalItems})</h3>
              <p>
                Tìm kiếm, phân quyền vai trò (USER / ADMIN) và xem lịch sử luyện nói của từng học viên
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingUser(null);
                setUserForm({
                  email: '',
                  fullName: '',
                  password: '',
                  role: 'USER',
                  isVerified: true,
                });
                setUserError('');
                setShowUserModal(true);
              }}
            >
              <FiPlus className="react-icon" /> Thêm Người dùng mới
            </Button>
          </div>

          <div className="filter-bar">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchUsers(1);
              }}
              className="search-form"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm người dùng theo email hoặc họ tên..."
              />
              <Button type="submit">
                <FiSearch className="react-icon" /> Tìm kiếm
              </Button>
            </form>

            <div className="filter-group">
              <span>Vai trò:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Tất cả vai trò</option>
                <option value="ADMIN">ADMIN (Quản trị viên)</option>
                <option value="USER">USER (Học viên)</option>
              </select>
            </div>
          </div>

          {loadingUsers ? (
            <div className="loading-state">Đang tải danh sách người dùng...</div>
          ) : (
            <>
              <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Họ và Tên</th>
                    <th>Email đăng nhập</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: 'center' }}>Số câu đã luyện</th>
                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="col-title">{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={u.role === 'ADMIN' ? 'tag-ai' : 'badge-level'}
                        >
                          <FiShield className="react-icon" /> {u.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-dot ${
                            u.isVerified ? 'verified' : 'unverified'
                          }`}
                        >
                          {u.isVerified ? (
                            <>
                              <FiCheckCircle className="react-icon" /> Đã kích hoạt
                            </>
                          ) : (
                            <>
                              <FiClock className="react-icon" /> Chưa kích hoạt
                            </>
                          )}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="count-pill">
                          {u._count?.histories ?? 0} lượt
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => handleViewUserDetail(u)}
                          className="btn-action green"
                        >
                          <FiBarChart2 className="react-icon" /> Lịch sử nói
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setUserForm({
                              email: u.email,
                              fullName: u.fullName,
                              password: '',
                              role: u.role,
                              isVerified: u.isVerified,
                            });
                            setUserError('');
                            setShowUserModal(true);
                          }}
                          className="btn-action"
                        >
                          <FiEdit2 className="react-icon" /> Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.fullName)}
                          className="btn-action red"
                        >
                          <FiTrash2 className="react-icon" /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* THANH PHÂN TRANG NGƯỜI DÙNG */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.limit || 8}
              itemLabel="người dùng"
              onPageChange={(page) => fetchUsers(page)}
            />
          </>
        )}
        </div>

      {/* MODAL THÊM / SỬA NGƯỜI DÙNG */}
      {showUserModal && (
        <div className="modal-backdrop">
          <div className="modal-card animate-modal-pop">
            <h3>
              {editingUser ? (
                <>
                  <FiEdit2 className="react-icon teal-text" /> Chỉnh sửa Người dùng
                </>
              ) : (
                <>
                  <FiPlus className="react-icon teal-text" /> Thêm Người dùng mới
                </>
              )}
            </h3>
            {userError && <div className="alert-error">{userError}</div>}
            <form onSubmit={handleSaveUser} className="auth-form">
              <div className="form-group">
                <label>Họ và Tên *</label>
                <input
                  type="text"
                  required
                  value={userForm.fullName}
                  onChange={(e) =>
                    setUserForm({ ...userForm, fullName: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>
                  {editingUser
                    ? 'Mật khẩu mới (Để trống nếu giữ nguyên)'
                    : 'Mật khẩu *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Vai trò</label>
                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                >
                  <option value="USER">USER (Học viên)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên)</option>
                </select>
              </div>
              <div className="modal-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUserModal(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Lưu tài khoản</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT HỌC VIÊN */}
      {detailUser && (
        <div className="modal-backdrop" onClick={() => setDetailUser(null)}>
          <div
            className="modal-card animate-modal-pop"
            style={{ maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ margin: 0 }}>
                <FiBarChart2 className="react-icon teal-text" /> Hồ sơ Học viên:{' '}
                {detailUser.fullName}
              </h3>
              <Button variant="outline" onClick={() => setDetailUser(null)}>
                <FiX className="react-icon" /> Đóng
              </Button>
            </div>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Email: <b>{detailUser.email}</b> | Tổng câu đã luyện:{' '}
              <b>
                {detailUser._count?.histories ?? detailUser.histories?.length ?? 0}
              </b>
            </p>
            {!detailUser.histories?.length ? (
              <div className="empty-card">
                Học viên này chưa có lượt luyện nói nào.
              </div>
            ) : (
              detailUser.histories.map((h) => (
                <div
                  key={h.id}
                  style={{
                    padding: '0.9rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    marginBottom: '0.65rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#00897b',
                        fontWeight: 700,
                        marginBottom: '0.2rem',
                      }}
                    >
                      {h.dialogue?.lesson?.title}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                      Mẫu: "{h.dialogue?.text}"
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Đã nói: "{h.spokenText}"
                    </div>
                  </div>
                  <span
                    className="score-pill good"
                    style={{ fontSize: '0.9rem', padding: '0.35rem 0.7rem' }}
                  >
                    {h.accuracyScore}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

