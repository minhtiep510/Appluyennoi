import React, { useState, useEffect } from 'react';
import {
  FiBookOpen,
  FiUser,
  FiSettings,
  FiSave,
  FiBarChart2,
  FiList,
  FiMessageSquare,
  FiShield,
  FiArrowRight,
  FiKey,
  FiLock,
} from 'react-icons/fi';
import { evaluationService } from '../api/evaluation.service';
import { authService } from '../api/auth.service';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

/**
 * Trang Profile & Quản lý Cá nhân riêng biệt (ProfileScreen.jsx)
 */
export default function ProfileScreen({
  user,
  onUserUpdate,
  onNavigate,
  onOpenAuth,
}) {
  const [progress, setProgress] = useState({ totalPracticed: 0, averageScore: 0 });
  const [histories, setHistories] = useState([]);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    targetLevel: user?.targetLevel || 'B1',
    learningGoal: user?.learningGoal || 'PHONG_VAN',
  });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setProfileForm((prev) => ({
      ...prev,
      fullName: user?.fullName || '',
      targetLevel: user?.targetLevel || 'B1',
      learningGoal: user?.learningGoal || 'PHONG_VAN',
    }));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchUserProgress = async () => {
      try {
        const [progData, histRes] = await Promise.all([
          evaluationService.getProgress(),
          evaluationService.getHistory({ page: 1, limit: 20 }),
        ]);
        setProgress(progData);
        setHistories(histRes.data || []);
      } catch (err) {
        console.error('Lỗi tải thống kê cá nhân:', err);
      }
    };
    fetchUserProgress();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileErr('');
    setSavingProfile(true);

    try {
      const res = await authService.updateProfile({
        fullName: profileForm.fullName,
        targetLevel: profileForm.targetLevel,
        learningGoal: profileForm.learningGoal,
      });
      const updatedUser = { ...user, ...res.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUserUpdate?.(updatedUser);
      setProfileMsg('Cập nhật thông tin cá nhân thành công!');
      setProfileMsg('Cập nhật thông tin cá nhân thành công!');
    } catch (err) {
      setProfileErr(err.message || 'Không thể cập nhật thông tin cá nhân.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <section
      className="lexispeak-window-frame animate-page-enter"
      style={{ marginTop: '2rem' }}
    >
      <div className="lexispeak-window-topbar">
        <div className="lexispeak-brand-group">
          <span className="lexispeak-title">SpeakAI</span>
          <span className="lexispeak-slash">/</span>
          <span className="lexispeak-tagline">
            Trang Profile &amp; Quản Lý Cá Nhân
          </span>
        </div>
        <Button onClick={() => onNavigate?.('topics')}>
          <FiBookOpen className="react-icon" /> Xem các Đề tài Luyện nói
        </Button>
      </div>

      <div className="lexispeak-window-body">
        {!user ? (
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '0.5rem 0',
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 0.4rem 0', color: '#111827' }}>
                  Bạn chưa đăng nhập tài khoản
                </h3>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  Vui lòng đăng nhập hoặc đăng ký tài khoản để quản lý hồ sơ cá nhân và xem lịch sử chấm điểm phát âm.
                </p>
              </div>
              <Button onClick={() => onOpenAuth?.('login')}>
                Đi tới Trang Đăng nhập <FiArrowRight className="react-icon" />
              </Button>
            </div>
          </Card>
        ) : (
          <div className="profile-layout-grid">
            {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN & CẬP NHẬT TÀI KHOẢN */}
            <div className="profile-card-box animate-card-up">
              <div className="profile-avatar-header">
                <div className="profile-avatar-lg">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3>{user.fullName}</h3>
                  <p>{user.email}</p>
                  <span className="badge-level">
                    {user.role === 'ADMIN' ? (
                      <>
                        <FiShield className="react-icon" /> Quản trị viên
                      </>
                    ) : (
                      <>
                        <FiUser className="react-icon" /> Học viên SpeakAI
                      </>
                    )}
                  </span>
                </div>
              </div>

              <hr className="divider" />

              <h4 style={{ margin: '0 0 1rem 0', color: '#111827' }}>
                <FiSettings className="react-icon teal-text" /> Quản lý thông tin cá nhân
              </h4>

              {profileMsg && <div className="alert-success">{profileMsg}</div>}
              {profileErr && <div className="alert-error">{profileErr}</div>}

              <form onSubmit={handleSaveProfile} className="auth-form">
                <div className="form-group">
                  <label>Email đăng nhập (Cố định)</label>
                  <input type="email" value={user.email} disabled />
                </div>

                <div className="form-group">
                  <label>Họ và tên hiển thị *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>🎯 Mức độ giao tiếp tiếng Anh mục tiêu</label>
                  <select
                    value={profileForm.targetLevel}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        targetLevel: e.target.value,
                      })
                    }
                  >
                    <option value="A1">Level A1 — Người mới bắt đầu (Làm quen từ vựng nền tảng, chào hỏi)</option>
                    <option value="A2">Level A2 — Sơ cấp (Giao tiếp đơn giản hàng ngày, mua sắm)</option>
                    <option value="B1">Level B1 — Tiền trung cấp (Tự tin đời sống, du lịch)</option>
                    <option value="B2">Level B2 — Trung cao cấp &amp; lưu loát (Thuyết trình, công sở)</option>
                    <option value="C1">Level C1 — Cao cấp &amp; học thuật (Du học, đàm phán)</option>
                    <option value="C2">Level C2 — Thông thạo như người bản ngữ (Master fluency)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>🚀 Mục tiêu học tập chính của bạn</label>
                  <select
                    value={profileForm.learningGoal}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        learningGoal: e.target.value,
                      })
                    }
                  >
                    <option value="PHONG_VAN">💼 Phỏng vấn xin việc &amp; Phát triển sự nghiệp</option>
                    <option value="DU_HOC">🎓 Đi du học / Định cư nước ngoài</option>
                    <option value="PHAT_TRIEN">🌱 Phát triển cá nhân &amp; Tự tin giao tiếp</option>
                    <option value="GIAO_TIEP">🌍 Giao tiếp đời sống hàng ngày &amp; Du lịch</option>
                  </select>
                </div>

                <Button type="submit" fullWidth disabled={savingProfile} style={{ marginTop: '0.5rem' }}>
                  <FiSave className="react-icon" />{' '}
                  {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi hồ sơ'}
                </Button>
              </form>

              {/* KHỐI BẢO MẬT & ĐỔI MẬT KHẨU TÁCH RIÊNG */}
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1.15rem 1.25rem',
                  borderRadius: '14px',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem' }}>
                  <FiKey className="teal-text" style={{ fontSize: '1.2rem' }} />
                  <strong style={{ fontSize: '0.96rem', color: '#0f172a' }}>
                    Bảo mật &amp; Mật khẩu
                  </strong>
                </div>
                <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                  Bạn muốn thay đổi mật khẩu định kỳ để nâng cao tính bảo mật cho tài khoản?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => onNavigate?.('change-password')}
                >
                  <FiLock className="react-icon" /> Đi tới Trang Đổi Mật Khẩu Riêng <FiArrowRight className="react-icon" />
                </Button>
              </div>
            </div>

            {/* CỘT PHẢI: THỐNG KÊ TIẾN ĐỘ & LỊCH SỬ LUYỆN NÓI CÁ NHÂN */}
            <div className="profile-history-panel animate-card-up">
              <div className="lexi-stats-strip" style={{ marginBottom: '1.25rem' }}>
                <div className="stats-strip-left">
                  <h3>
                    <FiBarChart2 className="react-icon teal-text" /> Thống Kê Kết Quả Luyện Tập Cá Nhân
                  </h3>
                  <p>
                    Tổng hợp điểm phát âm và lịch sử các câu bạn đã thực hành
                  </p>
                </div>
                <div className="stats-strip-right">
                  <div className="lexi-stat-pill">
                    <strong>{progress.totalPracticed}</strong>
                    <span>Câu đã luyện</span>
                  </div>
                  <div className="lexi-stat-pill">
                    <strong>{progress.averageScore}%</strong>
                    <span>Độ chính xác</span>
                  </div>
                  <div className="lexi-stat-pill">
                    <strong>Level {profileForm.targetLevel || user?.targetLevel || 'B1'}</strong>
                    <span>Mục tiêu Level</span>
                  </div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 0.85rem 0', color: '#111827' }}>
                <FiList className="react-icon teal-text" /> Lịch sử chấm điểm gần đây ({histories.length})
              </h4>

              <div className="history-list">
                {histories.length === 0 ? (
                  <Card>
                    Bạn chưa có lượt chấm điểm nào được lưu. Hãy chọn một đề tài để bắt đầu luyện nói nhé!
                  </Card>
                ) : (
                  histories.map((item) => (
                    <div key={item.id} className="history-item-card">
                      <div className="history-left">
                        <div className="history-lesson-tag">
                          <FiBookOpen className="react-icon" />{' '}
                          {item.dialogue?.lesson?.title || 'Đề tài Speaking'} (
                          {item.dialogue?.lesson?.level})
                        </div>
                        <div className="history-target">
                          Câu mẫu: <b>"{item.dialogue?.text}"</b>
                        </div>
                        <div className="history-feedback">
                          <FiMessageSquare className="react-icon" /> {item.feedback}
                        </div>
                        {item.mispronouncedWords?.length > 0 && (
                          <div className="history-wrong-words">
                            Từ cần sửa:{' '}
                            {item.mispronouncedWords.map((w, idx) => (
                              <span key={idx} className="wrong-chip">
                                {w}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="history-right">
                        <div
                          className={`score-badge-lg ${
                            item.accuracyScore >= 80
                              ? 'good'
                              : item.accuracyScore >= 50
                              ? 'medium'
                              : 'low'
                          }`}
                        >
                          {item.accuracyScore}%
                        </div>
                        <span className="history-date">
                          {new Date(item.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
