import React from 'react';
import {
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
  FiAward,
  FiArrowLeft,
  FiHelpCircle,
} from 'react-icons/fi';

/**
 * Trang Điều khoản Sử dụng (TermsOfServiceScreen.jsx)
 */
export default function TermsOfServiceScreen({ onNavigate }) {
  return (
    <div className="policy-page-container animate-page-enter">
      <div className="policy-header-banner">
        <h1 className="policy-main-title">Điều Khoản Sử Dụng</h1>
        <p className="policy-update-date">
          Áp dụng cho mọi học viên &amp; người dùng nền tảng SpeakAI (2026)
        </p>
      </div>

      <div className="policy-card-body">
        <section className="policy-section">
          <h3>
            <FiCheckCircle className="policy-sec-icon" /> 1. Chấp Thuận Điều
            Khoản
          </h3>
          <p>
            Bằng việc tạo tài khoản, đăng nhập hoặc sử dụng bất kỳ tính năng nào
            của nền tảng <b>SpeakAI</b>, bạn xác nhận đã đọc, hiểu và đồng ý
            tuân thủ toàn bộ các điều khoản và điều kiện được nêu tại văn bản
            này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngưng
            sử dụng dịch vụ.
          </p>
        </section>

        <section className="policy-section">
          <h3>
            <FiAward className="policy-sec-icon" /> 2. Quyền Sở Hữu Trí Tuệ
          </h3>
          <p>
            Toàn bộ nội dung trên nền tảng SpeakAI bao gồm nhưng không giới hạn ở:
          </p>
          <ul>
            <li>
              Các kịch bản đề tài luyện nói IELTS Speaking (Part 1, 2, 3), câu
              thoại mẫu và phiên âm IPA.
            </li>
            <li>
              Hệ thống kho từ vựng chuyên sâu, định nghĩa, ví dụ minh họa và âm
              thanh bản ngữ.
            </li>
            <li>
              Giao diện người dùng, mã nguồn, logo thương hiệu <b>SpeakAI</b> và{' '}
              <b>Jupi</b>.
            </li>
          </ul>
          <p>
            Đều thuộc quyền sở hữu trí tuệ của <b>Tuyensinh247.com</b>. Mọi hành
            vi sao chép, phân phối lại hoặc khai thác thương mại mà không có sự
            cho phép bằng văn bản đều là vi phạm pháp luật.
          </p>
        </section>

        <section className="policy-section">
          <h3>
            <FiAlertTriangle className="policy-sec-icon" /> 3. Trách Nhiệm Của
            Người Dùng
          </h3>
          <p>Khi tham gia học tập trên SpeakAI, bạn cam kết:</p>
          <ul>
            <li>
              Cung cấp địa chỉ email chính chủ và bảo mật thông tin mật khẩu tài
              khoản của mình.
            </li>
            <li>
              Không sử dụng các công cụ tự động (bot, crawl, script) để can thiệp
              vào hệ thống máy chủ hoặc dữ liệu bài học.
            </li>
            <li>
              Không sử dụng chức năng Microphone để ghi âm, phát tán ngôn từ thù
              địch, xúc phạm hoặc vi phạm thuần phong mỹ tục.
            </li>
            <li>
              Mỗi tài khoản được cấp quyền sử dụng cho một cá nhân học tập, không
              chia sẻ dùng chung hàng loạt.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <h3>
            <FiHelpCircle className="policy-sec-icon" /> 4. Giới Hạn Trách Nhiệm
          </h3>
          <p>
            SpeakAI là hệ thống trợ lý học tập ứng dụng trí tuệ nhân tạo nhằm hỗ
            trợ bạn rèn luyện phản xạ và tự tin nâng cao trình độ phát âm, từ
            vựng. Điểm số đánh giá trong ứng dụng mang tính chất tham khảo chuẩn
            hóa theo khung CEFR và IELTS band descriptors, không thay thế cho
            chứng chỉ thực tế do IDP hoặc British Council cấp.
          </p>
        </section>

        <section className="policy-section">
          <h3>
            <FiCheckCircle className="policy-sec-icon" /> 5. Thay Đổi Điều Khoản
          </h3>
          <p>
            SpeakAI có quyền cập nhật, điều chỉnh các điều khoản này khi nâng cấp
            tính năng mới. Chúng tôi sẽ thông báo trên website hoặc gửi thông báo
            đến email đăng ký của bạn. Việc tiếp tục sử dụng dịch vụ sau khi điều
            khoản được sửa đổi đồng nghĩa với việc bạn chấp thuận các thay đổi
            đó.
          </p>
        </section>
      </div>
    </div>
  );
}

