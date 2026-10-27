import React, { useState } from 'react';
import {
  FiTrash2,
  FiAlertOctagon,
  FiCheck,
  FiArrowLeft,
  FiInfo,
  FiUserX,
  FiLogIn,
} from 'react-icons/fi';
import { authService } from '../api/auth.service';

/**
 * Trang Chính sách Xoá Tài khoản & Dữ liệu (DeleteAccountPolicyScreen.jsx)
 */
export default function DeleteAccountPolicyScreen({
  user,
  onNavigate,
  onOpenAuth,
  onLogout,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDeleteAccount = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await authService.deleteAccount();
      setSuccessMsg(
        'Tài khoản và toàn bộ dữ liệu của bạn đã được xóa vĩnh viễn khỏi hệ thống!'
      );
      setTimeout(() => {
        onLogout?.();
        onNavigate?.('home');
      }, 2500);
    } catch (err) {
      setErrorMsg(
        err.message ||
          'Không thể xử lý yêu cầu xóa tài khoản lúc này. Vui lòng liên hệ hỗ trợ.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="policy-page-container animate-page-enter">
      <div className="policy-header-banner">
      
        <div className="policy-icon-badge" style={{ background: '#dc2626' }}>
          <FiUserX />
        </div>
        <h1 className="policy-main-title">Chính Sách Xoá Tài Khoản</h1>
        <p className="policy-update-date">
          Quyền bảo vệ dữ liệu cá nhân &amp; Tuân thủ chính sách App Store /
          Google Play / GDPR
        </p>
      </div>

      <div className="policy-card-body">
        {/* KHỐI CẢNH BÁO QUAN TRỌNG */}
        <div className="policy-warning-banner">
          <FiAlertOctagon className="warning-big-icon" />
          <div>
            <h4>Hành động không thể hoàn tác</h4>
            <p>
              Khi bạn thực hiện xóa tài khoản, toàn bộ hồ sơ, dữ liệu học tập và
              bản ghi âm của bạn sẽ bị xóa vĩnh viễn khỏi máy chủ và không thể
              khôi phục lại dưới bất kỳ hình thức nào.
            </p>
          </div>
        </div>

        <section className="policy-section">
          <h3>
            <FiInfo className="policy-sec-icon" /> 1. Dữ Liệu Bị Xoá Vĩnh Viễn
          </h3>
          <p>
            Khi yêu cầu xóa tài khoản được phê duyệt, hệ thống SpeakAI sẽ thực
            hiện xóa ngay lập tức toàn bộ các dữ liệu sau:
          </p>
          <ul>
            <li>
              <b>Thông tin cá nhân:</b> Họ tên, email, mật khẩu mã hóa, mục tiêu
              học tập và ảnh đại diện.
            </li>
            <li>
              <b>Lịch sử Luyện nói AI:</b> Toàn bộ đoạn hội thoại đối đáp, kết quả
              chấm điểm phát âm IPA, điểm ngữ pháp và độ lưu loát.
            </li>
            <li>
              <b>Tiến độ Từ vựng:</b> Các từ đã thuộc, từ đánh dấu cần ôn tập,
              lịch sử lật thẻ Flashcard, bài viết chính tả và bài trắc nghiệm.
            </li>
            <li>
              <b>Dữ liệu thiết bị &amp; Phiên đăng nhập:</b> Token xác thực và
              thông tin lưu trữ trên các thiết bị đăng nhập.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <h3>
            <FiCheck className="policy-sec-icon" /> 2. Cách Thức Yêu Cầu Xoá
            Tài Khoản
          </h3>
          <p>Học viên có thể lựa chọn một trong hai phương thức sau:</p>
          <ol style={{ paddingLeft: '1.25rem', lineHeight: 1.7, color: '#374151' }}>
            <li>
              <b>Tự thực hiện trực tiếp:</b> Nếu bạn đang đăng nhập, bạn có thể
              bấm vào nút <b>"Xóa tài khoản của tôi"</b> ngay tại khung chức năng
              bên dưới trang này.
            </li>
            <li>
              <b>Gửi yêu cầu qua Email:</b> Bạn có thể gửi thư từ chính địa chỉ
              email đã đăng ký tài khoản tới <b>hotro@speakai.vn</b> hoặc{' '}
              <b>cskh@tuyensinh247.com</b> với tiêu đề{' '}
              <i>"Yêu cầu xóa tài khoản SpeakAI"</i>. Đội ngũ kỹ thuật sẽ xử lý
              và phản hồi trong vòng tối đa <b>24–48 giờ làm việc</b>.
            </li>
          </ol>
        </section>

        {/* KHU VỰC THAO TÁC XÓA TÀI KHOẢN TRỰC TIẾP */}
        <section className="policy-delete-action-card">
          <h3>Thao tác Xóa tài khoản Trực tuyến</h3>

          {successMsg && (
            <div className="alert-success" style={{ margin: '1rem 0' }}>
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="alert-error" style={{ margin: '1rem 0' }}>
              {errorMsg}
            </div>
          )}

          {user ? (
            <div>
              <p>
                Bạn đang đăng nhập với tài khoản: <b>{user.fullName}</b> (
                {user.email}).
              </p>

              {!showConfirm ? (
                <button
                  type="button"
                  className="btn-danger-delete"
                  onClick={() => setShowConfirm(true)}
                >
                  <FiTrash2 className="react-icon" /> Yêu cầu Xóa vĩnh viễn Tài
                  khoản của tôi
                </button>
              ) : (
                <div className="confirm-delete-box animate-card-up">
                  <p>
                    ⚠️ <b>Bạn có chắc chắn muốn xóa tài khoản này không?</b> Mọi
                    dữ liệu luyện tập của bạn sẽ mất hoàn toàn!
                  </p>
                  <div className="confirm-btn-group">
                    <button
                      type="button"
                      className="btn-danger-confirm"
                      disabled={loading}
                      onClick={handleDeleteAccount}
                    >
                      {loading ? 'Đang xóa dữ liệu...' : 'Xác nhận Xóa Ngay'}
                    </button>
                    <button
                      type="button"
                      className="btn-cancel-confirm"
                      disabled={loading}
                      onClick={() => setShowConfirm(false)}
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p>
                Để xóa tài khoản trực tiếp trên giao diện web, vui lòng đăng nhập
                vào tài khoản của bạn trước:
              </p>
              <button
                type="button"
                className="btn-login-redirect"
                onClick={() => onOpenAuth?.('login')}
              >
                <FiLogIn className="react-icon" /> Đăng nhập để Quản lý &amp;
                Xóa tài khoản
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

