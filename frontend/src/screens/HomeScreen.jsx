import React, { useState, useEffect, useRef } from 'react';
import {
  FiArrowRight,
  FiBookOpen,
  FiMic,
  FiUser,
  FiMessageSquare,
  FiZap,
} from 'react-icons/fi';
import { lessonService } from '../api/lesson.service';
import Button from '../components/common/Button';

/**
 * Trang Chủ SpeakAI riêng biệt (HomeScreen.jsx)
 */
export default function HomeScreen({
  user,
  onNavigate,
  onStartPractice,
  onOpenAuth,
}) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const workspaceRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const lessonList = await lessonService.getLessons();
        setLessons(lessonList);
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-page-enter">
      {/* 1. HERO SECTION SPEAKAI */}
      <section className="lexi-hero-section">
        <div className="lexi-powered-pill animate-float">
          <span className="lexi-mini-badge">S.</span>
          <span className="lexi-powered-brand">
            SpeakAI <FiZap className="react-icon" />
          </span>
          <span>|</span>
          <span>POWERED BY AI</span>
        </div>

        <h1 className="lexi-hero-title">
          Luyện IELTS Speaking với AI:
          <br />
          <span className="teal-highlight">Tương tác real-time</span>, tự tin nâng
          <br />
          cao trình độ Speaking của bạn!
        </h1>

        <p className="lexi-hero-subtitle">
          Tạm biệt phương pháp đọc câu hỏi rồi ghi âm độc thoại lỗi thời – Luyện
          Speaking real-time với SpeakAI. Nhận xét và chấm điểm chuẩn theo tiêu
          chí IDP &amp; BC.
        </p>

        <div className="lexi-hero-ctas">
          <button
            type="button"
            className="btn-lexi-primary"
            onClick={() => onNavigate?.('topics')}
          >
            Bắt đầu học ngay <FiArrowRight className="react-icon" />
          </button>
          <button
            type="button"
            className="btn-lexi-outline"
            onClick={() => onNavigate?.('vocabulary')}
          >
            Khám phá bộ từ
          </button>
        </div>
      </section>

      {/* 3 Ô TÍNH NĂNG: HỌC NHANH - NHỚ LÂU - TIỆN LỢI (CHIỀU DÀI KHỚP VỚI KHUNG BÊN DƯỚI) */}
      <div className="home-feature-cards-grid animate-card-up">
        {/* Card 1: Học nhanh */}
        <div className="home-feature-card">
          <div className="home-feature-img-wrap">
            <img
              src="/images/features/feature-hoc-nhanh.png"
              alt="Học nhanh"
              loading="lazy"
            />
          </div>
          <div className="home-feature-body">
            <h3 className="home-feature-title">Học nhanh</h3>
            <p className="home-feature-desc">
              Ghi nhớ nghĩa, phát âm và ngữ cảnh qua các hoạt động ngắn, dễ bắt đầu.
            </p>
            <div className="home-feature-pills">
              <span className="feature-pill">Flashcard</span>
              <span className="feature-pill">Trắc Nghiệm</span>
            </div>
          </div>
        </div>

        {/* Card 2: Nhớ lâu */}
        <div className="home-feature-card">
          <div className="home-feature-img-wrap">
            <img
              src="/images/features/feature-nho-lau.png"
              alt="Nhớ lâu"
              loading="lazy"
            />
          </div>
          <div className="home-feature-body">
            <h3 className="home-feature-title">Nhớ lâu</h3>
            <p className="home-feature-desc">
              SpeakAI nhắc bạn khi đến hạn và giúp bạn nhận ra từ trong ngữ cảnh thật.
            </p>
            <div className="home-feature-pills">
              <span className="feature-pill">SRS</span>
              <span className="feature-pill">Đọc</span>
              <span className="feature-pill">Nghe</span>
            </div>
          </div>
        </div>

        {/* Card 3: Tiện lợi */}
        <div className="home-feature-card">
          <div className="home-feature-img-wrap">
            <img
              src="/images/features/feature-tien-loi.png"
              alt="Tiện lợi"
              loading="lazy"
            />
          </div>
          <div className="home-feature-body">
            <h3 className="home-feature-title">Tiện lợi</h3>
            <p className="home-feature-desc">
              Luyện gợi lại và sử dụng từ trong câu, đoạn nói và bài viết của chính bạn mọi lúc mọi nơi.
            </p>
            <div className="home-feature-pills">
              <span className="feature-pill">Nói</span>
              <span className="feature-pill">Viết</span>
              <span className="feature-pill">Phản Hồi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KHUNG CỬA SỔ SPEAKAI WORKSPACE BÊN DƯỚI HERO */}
      <section
        className="lexispeak-window-frame animate-card-up"
        ref={workspaceRef}
      >
        <div className="lexispeak-window-topbar">
          <div className="lexispeak-brand-group">
            <span className="lexispeak-title">SpeakAI</span>
            <span className="lexispeak-slash">/</span>
            <span className="lexispeak-tagline">Speak Like a Native</span>
          </div>

          <div className="lexispeak-window-controls">
            {!user ? (
              <>
                <button
                  type="button"
                  className="header-link-btn"
                  onClick={() => onOpenAuth?.('register')}
                >
                  Đăng ký
                </button>
                <span className="header-divider">/</span>
                <button
                  type="button"
                  className="header-link-btn bold"
                  onClick={() => onOpenAuth?.('login')}
                >
                  Đăng nhập
                </button>
              </>
            ) : (
              <span
                className="badge-level"
                style={{ cursor: 'pointer' }}
                onClick={() => onNavigate?.('profile')}
              >
                <FiUser className="react-icon" /> Hồ sơ: {user.fullName}
              </span>
            )}
          </div>
        </div>

        <div className="lexispeak-window-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              padding: '0.5rem 0',
            }}
          >
            {/* HUB 1: CHỌN ĐỀ TÀI LUYỆN NÓI */}
            <div
              className="lesson-card animate-card-up"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
                border: '1.5px solid #99f6e4',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge-level" style={{ background: '#0f766e', color: '#ffffff' }}>
                    Level A1 – C2
                  </span>
                  <span className="dialogue-count" style={{ fontWeight: 700, color: '#0f766e' }}>
                    <FiMic className="react-icon" /> Đối thoại 1-1 với AI
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#0f172a', marginBottom: '0.65rem' }}>
                  Phòng Luyện Nói Tương Tác AI
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Luyện đối đáp phản xạ tiếng Anh trực tiếp với trợ lý AI. Hệ thống nhận dạng giọng nói, phát âm mẫu bản ngữ và chấm điểm phát âm tức thì theo tiêu chuẩn IELTS Speaking &amp; CEFR.
                </p>
              </div>

              <Button fullWidth onClick={() => onNavigate?.('topics')}>
                <FiMic className="react-icon" /> Mở Màn Hình Chọn Đề Tài Luyện Nói <FiArrowRight className="react-icon" />
              </Button>
            </div>

            {/* HUB 2: HỌC TỪ VỰNG CHUYÊN SÂU */}
            <div
              className="lesson-card animate-card-up"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
                border: '1.5px solid #bfdbfe',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge-level" style={{ background: '#2563eb', color: '#ffffff' }}>
                    24+ Chủ Đề
                  </span>
                  <span className="dialogue-count" style={{ fontWeight: 700, color: '#2563eb' }}>
                    <FiBookOpen className="react-icon" /> Flashcard &amp; Phát âm
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#0f172a', marginBottom: '0.65rem' }}>
                  Kho Từ Vựng &amp; Flashcard 3D
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Học từ vựng chuyên sâu theo chủ đề học thuật và đời sống. Trải nghiệm Thẻ lật 3D, luyện đọc mẫu AI với 2 giọng Anh-Mỹ &amp; Anh-Anh, luyện chính tả và trắc nghiệm ôn tập.
                </p>
              </div>

              <Button variant="outline" fullWidth onClick={() => onNavigate?.('vocabulary')}>
                <FiBookOpen className="react-icon" /> Mở Màn Hình Học Từ Vựng <FiArrowRight className="react-icon" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
