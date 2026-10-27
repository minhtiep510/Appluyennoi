import React, { useState, useEffect } from 'react';
import {
  FiBookOpen,
  FiMic,
  FiSearch,
  FiMessageSquare,
  FiArrowRight,
  FiArrowLeft,
  FiLayers,
  FiX,
} from 'react-icons/fi';
import { lessonService } from '../api/lesson.service';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

/**
 * Trang Xem các Đề tài Luyện nói dành cho User (UserTopicsScreen.jsx)
 */
export default function UserTopicsScreen({ onStartPractice, onNavigate }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const list = await lessonService.getLessons();
        setLessons(list);
      } catch (err) {
        console.error('Lỗi tải danh sách đề tài:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // Phân trang đoạn hội thoại / đề tài luyện nói: đúng 9 đề tài 1 trang theo yêu cầu
  const [currentPage, setCurrentPage] = useState(1);
  const LESSONS_PER_PAGE = 9;

  const totalPages = Math.max(
    1,
    Math.ceil(lessons.length / LESSONS_PER_PAGE)
  );
  const validPage = Math.min(currentPage, totalPages);
  const startIdx = (validPage - 1) * LESSONS_PER_PAGE;
  const paginatedLessons = lessons.slice(
    startIdx,
    startIdx + LESSONS_PER_PAGE
  );

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
            Đề Tài Luyện Nói
          </span>
        </div>
        <Button onClick={() => onStartPractice(lessons[0]?.id || 1)}>
          <FiMic className="react-icon" /> Vào Phòng Luyện Nói Ngay
        </Button>
      </div>

      <div className="lexispeak-window-body">
        <div className="lexi-stats-strip">
          <div className="stats-strip-left">
            <h3>
              <FiBookOpen className="react-icon teal-text" /> Kho Đề Tài Luyện Giao Tiếp 
            </h3>
        
          
          </div>
          <div className="stats-strip-right">
            <div className="lexi-stat-pill">
              <strong>{paginatedLessons.length}</strong>
              <span>Đề tài hiển thị</span>
            </div>
            <div className="lexi-stat-pill">
              <strong>{lessons.length}</strong>
              <span>Tổng số đề tài</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Đang tải danh sách đề tài...</div>
        ) : lessons.length === 0 ? (
          <Card>Không có đề tài nào trong hệ thống.</Card>
        ) : (
          /* DANH SÁCH ĐỀ TÀI HÀNG DỌC (PHÂN TRANG 9 ĐỀ TÀI / TRANG) */
          <>
            <div className="vocab-catalog-grid">
              {paginatedLessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="vocab-catalog-card animate-card-up"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                  onClick={() => onStartPractice(lesson.id)}
                >
                  <div
                    className="vocab-catalog-content"
                    style={{ padding: '1.35rem 1.6rem' }}
                  >
                    <div className="vocab-catalog-header-row">
                      <h3 className="vocab-catalog-title">{lesson.title}</h3>
                      <span
                        className={`badge-level level-${(
                          lesson.level || 'B1'
                        ).toLowerCase()}`}
                      >
                        Level {lesson.level || 'B1'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#0f766e',
                        }}
                      >
                        •{' '}
                        {lesson._count?.dialogues ??
                          lesson.dialogues?.length ??
                          0}{' '}
                        câu thoại đối đáp AI
                      </span>
                    </div>
                    <p className="vocab-catalog-desc" style={{ marginBottom: 0 }}>
                      {lesson.description}
                    </p>
                  </div>

                  <div
                    className="vocab-catalog-cta-wrap"
                    style={{ width: '230px' }}
                  >
                    <Button
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartPractice(lesson.id);
                      }}
                    >
                      <FiMic className="react-icon" /> Vào Luyện Nói Ngay{' '}
                      <FiArrowRight className="react-icon" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* THANH PHÂN TRANG: 9 ĐỀ TÀI / TRANG */}
            {totalPages > 1 && (
              <div className="speakai-pagination-wrap animate-card-up">
                <div className="pagination-info">
                  Hiển thị <b>{startIdx + 1}</b> –{' '}
                  <b>
                    {Math.min(
                      startIdx + LESSONS_PER_PAGE,
                      lessons.length
                    )}
                  </b>{' '}
                  trên tổng số <b>{lessons.length}</b> đề tài hội thoại
                </div>

                <div className="speakai-pagination">
                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={validPage <= 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 320, behavior: 'smooth' });
                    }}
                  >
                    <FiArrowLeft className="react-icon" /> Trang trước
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (num) => (
                        <button
                          key={num}
                          type="button"
                          className={`pagination-number ${
                            validPage === num ? 'active' : ''
                          }`}
                          onClick={() => {
                            setCurrentPage(num);
                            window.scrollTo({ top: 320, behavior: 'smooth' });
                          }}
                        >
                          {num}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={validPage >= totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 320, behavior: 'smooth' });
                    }}
                  >
                    Trang sau <FiArrowRight className="react-icon" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
