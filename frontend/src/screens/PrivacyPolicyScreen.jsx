import React from 'react';
import {
  FiShield,
  FiLock,
  FiEye,
  FiDatabase,
  FiUserCheck,
  FiArrowLeft,
  FiMail,
} from 'react-icons/fi';

/**
 * Trang Chính sách Bảo mật (PrivacyPolicyScreen.jsx)
 */
export default function PrivacyPolicyScreen({ onNavigate }) {
  return (
    <div className="policy-page-container animate-page-enter">
      <div className="policy-header-banner">
    
        <h1 className="policy-main-title">Chính Sách Bảo Mật</h1>
        <p className="policy-update-date">
          Cập nhật lần cuối: Tháng 10/2026 | Nền tảng SpeakAI &amp; Tuyensinh247.com
        </p>
      </div>

      <div className="policy-card-body">
        <section className="policy-section">
          <h3>
            <FiDatabase className="policy-sec-icon" /> 1. Thông Tin Thu Thập
          </h3>
          <p>
            Khi bạn sử dụng ứng dụng SpeakAI, chúng tôi có thể thu thập các thông
            tin sau để phục vụ mục đích học tập và cá nhân hóa trải nghiệm:
          </p>
          <ul>
            <li>
              <b>Thông tin định danh:</b> Họ tên, địa chỉ email, ảnh đại diện và
              mật khẩu đã được mã hóa một chiều (bcrypt hash).
            </li>
            <li>
              <b>Dữ liệu âm thanh &amp; Giọng nói:</b> Bản ghi âm câu trả lời khi
              bạn thực hiện luyện nói đối đáp AI hoặc luyện phát âm từ vựng. Dữ
              liệu này chỉ dùng để nhận diện phát âm (Speech-to-Text) và phân
              tích tiêu chí IELTS Speaking (Fluency, Lexical Resource,
              Grammar, Pronunciation).
            </li>
            <li>
              <b>Dữ liệu tiến độ học:</b> Danh sách từ vựng đã thuộc, cần ôn tập,
              lịch sử làm bài trắc nghiệm, bài viết chính tả và điểm số từng lượt
              luyện tập.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <h3>
            <FiUserCheck className="policy-sec-icon" /> 2. Mục Đích Sử Dụng
            Thông Tin
          </h3>
          <p>Dữ liệu của học viên chỉ được sử dụng cho các mục đích cụ thể:</p>
          <ul>
            <li>Cung cấp tính năng luyện đối đáp và chấm điểm AI tức thì.</li>
            <li>
              Áp dụng thuật toán lặp lại ngắt quãng (Spaced Repetition System -
              SRS) để nhắc bạn ôn lại từ vựng đúng thời điểm vàng ghi nhớ não bộ.
            </li>
            <li>
              Lưu trữ bảng xếp hạng, chuỗi ngày học liên tục (Streak) và hồ sơ
              tiến bộ của bạn.
            </li>
            <li>
              Gửi thông báo bảo mật, mã xác thực OTP khôi phục mật khẩu hoặc cập
              nhật quan trọng về bài học.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <h3>
            <FiLock className="policy-sec-icon" /> 3. Cam Kết Bảo Mật &amp; Chia
            Sẻ Dữ Liệu
          </h3>
          <p>
            Chúng tôi cam kết <b>không bao giờ bán, trao đổi hoặc cho thuê</b>{' '}
            thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích quảng
            cáo:
          </p>
          <ul>
            <li>
              Mọi kết nối dữ liệu giữa trình duyệt của bạn và máy chủ SpeakAI đều
              được mã hóa theo tiêu chuẩn <b>SSL/TLS 256-bit</b> cao nhất.
            </li>
            <li>
              Các mô hình trí tuệ nhân tạo (AI Engine) xử lý giọng nói trong môi
              trường sandbox an toàn và không lưu trữ bản ghi âm để tái huấn luyện
              công khai.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <h3>
            <FiEye className="policy-sec-icon" /> 4. Quyền Kiểm Soát Dữ Liệu Của
            Bạn
          </h3>
          <p>
            Bạn luôn có toàn quyền kiểm soát thông tin cá nhân của mình trên
            SpeakAI:
          </p>
          <ul>
            <li>
              Xem và chỉnh sửa họ tên, mục tiêu học tập, cấp độ tiếng Anh bất kỳ
              lúc nào trong trang <b>Hồ sơ cá nhân</b>.
            </li>
            <li>Đổi mật khẩu bảo mật định kỳ.</li>
            <li>
              Yêu cầu xóa toàn bộ lịch sử luyện nói hoặc xóa vĩnh viễn tài khoản
              khỏi hệ thống theo{' '}
              <a
                href="#delete-account"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('delete-account-policy');
                }}
              >
                Chính sách xoá tài khoản
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="policy-section contact-box">
          <h3>
            <FiMail className="policy-sec-icon" /> 5. Liên Hệ Bộ Phận Bảo Mật
          </h3>
          <p>
            Nếu bạn có bất kỳ câu hỏi, góp ý hoặc yêu cầu nào liên quan đến quyền
            riêng tư dữ liệu, vui lòng liên hệ:
          </p>
          <div className="policy-contact-details">
            <p>
              📧 <b>Email:</b> hotro@speakai.vn / cskh@tuyensinh247.com
            </p>
            <p>
              🏢 <b>Đơn vị phát triển:</b> Tuyensinh247 Education Platform
            </p>
            <p>
              🌐 <b>Website:</b> https://speakai.vn
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

