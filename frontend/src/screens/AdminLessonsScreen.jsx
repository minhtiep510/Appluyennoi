import React, { useState, useEffect } from 'react';
import {
  FiGrid,
  FiBookOpen,
  FiUsers,
  FiUser,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMessageSquare,
  FiArrowLeft,
  FiChevronUp,
  FiChevronDown,
  FiCpu,
  FiGlobe,
} from 'react-icons/fi';
import { lessonService } from '../api/lesson.service';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';

/**
 * Nội dung Trang Quản lý Bài học & Kịch bản câu thoại (AdminLessonsScreen.jsx)
 * (Sidebar đã được giữ cố định trong AdminLayout.jsx)
 */
export default function AdminLessonsScreen({ onNavigateAdmin }) {
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Phân trang danh sách Bài học Admin (8 bài học / trang)
  const [lessonPage, setLessonPage] = useState(1);
  const LESSONS_PER_PAGE = 8;

  // Modal Bài học
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    level: 'B1',
    description: '',
  });
  const [lessonError, setLessonError] = useState('');

  // State & Modal Câu thoại
  const [dialogues, setDialogues] = useState([]);
  const [loadingDialogues, setLoadingDialogues] = useState(false);
  const [showDialogueModal, setShowDialogueModal] = useState(false);
  const [editingDialogue, setEditingDialogue] = useState(null);
  const [dialogueForm, setDialogueForm] = useState({
    speaker: 'ai',
    characterName: 'Examiner (IDP)',
    text: '',
    ipa: '',
    translation: '',
    orderIndex: 1,
  });
  const [dialogueError, setDialogueError] = useState('');

  const fetchLessons = async () => {
    setLoadingLessons(true);
    try {
      const data = await lessonService.getLessons();
      setLessons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLessons(false);
    }
  };

  const fetchDialogues = async (lessonId) => {
    setLoadingDialogues(true);
    try {
      const data = await lessonService.getDialoguesByLesson(lessonId);
      setDialogues(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDialogues(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    setLessonError('');
    try {
      if (editingLesson) {
        await lessonService.updateLesson(editingLesson.id, lessonForm);
      } else {
        await lessonService.createLesson(lessonForm);
      }
      setShowLessonModal(false);
      fetchLessons();
    } catch (err) {
      setLessonError(err.message || 'Không thể lưu bài học.');
    }
  };

  const handleDeleteLesson = async (id, title) => {
    if (!window.confirm(`Xóa bài học "${title}"?`)) return;
    try {
      await lessonService.deleteLesson(id);
      fetchLessons();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveDialogue = async (e) => {
    e.preventDefault();
    setDialogueError('');
    try {
      if (editingDialogue) {
        await lessonService.updateDialogueLine(editingDialogue.id, dialogueForm);
      } else {
        await lessonService.createDialogueLine(selectedLesson.id, dialogueForm);
      }
      setShowDialogueModal(false);
      fetchDialogues(selectedLesson.id);
    } catch (err) {
      setDialogueError(err.message || 'Không thể lưu câu thoại.');
    }
  };

  const handleDeleteDialogue = async (id, text) => {
    if (!window.confirm(`Xóa câu thoại "${text}"?`)) return;
    try {
      await lessonService.deleteDialogueLine(id);
      fetchDialogues(selectedLesson.id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMoveDialogue = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= dialogues.length) return;

    const newItems = [...dialogues];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const reordered = newItems.map((item, idx) => ({
      ...item,
      orderIndex: idx + 1,
    }));
    setDialogues(reordered);

    try {
      await lessonService.reorderDialogues(
        selectedLesson.id,
        reordered.map((item) => ({ id: item.id, orderIndex: item.orderIndex }))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="animate-page-enter">
      <header className="admin-topbar">
        <div>
          <span className="admin-breadcrumb">
            SpeakAI Admin / Quản lý Bài học
          </span>
          <h2 className="admin-page-heading">
            <FiBookOpen className="react-icon teal-text" />{' '}
            {selectedLesson
              ? `Kịch bản bài học: ${selectedLesson.title}`
              : 'Quản Lý Bài Học & Kịch Bản Speaking'}
          </h2>
        </div>

        <div className="admin-topbar-actions">
          <button
            className="btn-outline-sm"
            onClick={() => onNavigateAdmin('admin-dashboard')}
          >
            <FiGrid className="react-icon" /> Trang chủ Admin
          </button>
          <button
            className="btn-outline-sm"
            onClick={() => onNavigateAdmin('admin-users')}
          >
            <FiUsers className="react-icon" /> Quản lý Người dùng
          </button>
        </div>
      </header>

      {!selectedLesson ? (
        <div className="admin-content-panel animate-card-up">
          <div className="section-header-row">
            <div>
              <h3>Danh sách Bài học / Đề tài Luyện nói ({lessons.length})</h3>
              <p>
                Thêm mới, chỉnh sửa thông tin bài học hoặc bấm "Kịch bản" để thiết lập các câu thoại của AI &amp; Học viên
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingLesson(null);
                setLessonForm({
                  title: '',
                  level: 'B1',
                  description: '',
                });
                setLessonError('');
                setShowLessonModal(true);
              }}
            >
              <FiPlus className="react-icon" /> Thêm Bài học mới
            </Button>
          </div>

          {loadingLessons ? (
            <div className="loading-state">Đang tải danh sách bài học...</div>
          ) : (
            <>
              <div className="table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tiêu đề Bài học</th>
                      <th>Cấp độ</th>
                      <th>Mô tả chi tiết</th>
                      <th style={{ textAlign: 'center' }}>Số câu thoại</th>
                      <th style={{ textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons
                      .slice(
                        (lessonPage - 1) * LESSONS_PER_PAGE,
                        lessonPage * LESSONS_PER_PAGE
                      )
                      .map((lesson, idx) => {
                        const globalIdx =
                          (lessonPage - 1) * LESSONS_PER_PAGE + idx;
                        const count =
                          lesson._count?.dialogues ?? lesson.dialogues?.length ?? 0;
                        return (
                          <tr key={lesson.id}>
                            <td className="col-id">#{globalIdx + 1}</td>
                            <td className="col-title">{lesson.title}</td>
                            <td>
                              <span className="badge-level">{lesson.level}</span>
                            </td>
                            <td className="col-desc">{lesson.description || '—'}</td>
                            <td style={{ textAlign: 'center' }}>
                              <span className="count-pill">{count} câu</span>
                            </td>
                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button
                                onClick={() => {
                                  setSelectedLesson(lesson);
                                  fetchDialogues(lesson.id);
                                }}
                                className="btn-action green"
                              >
                                <FiMessageSquare className="react-icon" /> Kịch bản ({count})
                              </button>
                              <button
                                onClick={() => {
                                  setEditingLesson(lesson);
                                  setLessonForm({
                                    title: lesson.title,
                                    level: lesson.level,
                                    description: lesson.description || '',
                                  });
                                  setLessonError('');
                                  setShowLessonModal(true);
                                }}
                                className="btn-action"
                              >
                                <FiEdit2 className="react-icon" /> Sửa
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteLesson(lesson.id, lesson.title)
                                }
                                className="btn-action red"
                              >
                                <FiTrash2 className="react-icon" /> Xóa
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* THANH PHÂN TRANG BÀI HỌC */}
              <Pagination
                currentPage={lessonPage}
                totalPages={Math.max(
                  1,
                  Math.ceil(lessons.length / LESSONS_PER_PAGE)
                )}
                totalItems={lessons.length}
                itemsPerPage={LESSONS_PER_PAGE}
                itemLabel="bài học"
                onPageChange={(page) => setLessonPage(page)}
              />
            </>
          )}
        </div>
      ) : (
        <div className="admin-content-panel animate-card-up">
          <div className="section-header-row">
            <div>
              <button
                className="btn-back"
                onClick={() => setSelectedLesson(null)}
              >
                <FiArrowLeft className="react-icon" /> Quay lại Danh sách Bài học
              </button>
              <h3 style={{ marginTop: '0.35rem' }}>
                Quản lý Kịch bản Câu thoại: {selectedLesson.title}
              </h3>
              <p>
                Sắp xếp thứ tự lượt nói của AI và Học viên, chỉnh sửa câu tiếng Anh, IPA và dịch nghĩa
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingDialogue(null);
                const nextOrder =
                  dialogues.length > 0
                    ? Math.max(...dialogues.map((d) => d.orderIndex || 1)) + 1
                    : 1;
                setDialogueForm({
                  speaker: 'ai',
                  characterName: 'Examiner (IDP)',
                  text: '',
                  ipa: '',
                  translation: '',
                  orderIndex: nextOrder,
                });
                setDialogueError('');
                setShowDialogueModal(true);
              }}
            >
              <FiPlus className="react-icon" /> Thêm câu thoại mới
            </Button>
          </div>

          {loadingDialogues ? (
            <div className="loading-state">Đang tải danh sách câu thoại...</div>
          ) : (
            <div className="dialogue-admin-list">
              {dialogues.map((item, idx) => (
                <div key={item.id} className="dialogue-admin-card">
                  <div className="order-controls">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveDialogue(idx, 'up')}
                      title="Đẩy lên"
                    >
                      <FiChevronUp />
                    </button>
                    <span>#{item.orderIndex || idx + 1}</span>
                    <button
                      disabled={idx === dialogues.length - 1}
                      onClick={() => handleMoveDialogue(idx, 'down')}
                      title="Đẩy xuống"
                    >
                      <FiChevronDown />
                    </button>
                  </div>

                  <div className="dialogue-admin-body">
                    <div className="dialogue-speaker-row">
                      <span
                        className={item.speaker === 'ai' ? 'tag-ai' : 'tag-user'}
                      >
                        {item.speaker === 'ai' ? (
                          <>
                            <FiCpu className="react-icon" /> AI HỎI / NÓI
                          </>
                        ) : (
                          <>
                            <FiUser className="react-icon" /> HỌC VIÊN ĐÁP
                          </>
                        )}
                      </span>
                      <strong>{item.characterName}</strong>
                    </div>
                    <div className="dialogue-admin-text">"{item.text}"</div>
                    {(item.ipa || item.phonetic) && (
                      <div className="dialogue-admin-ipa">
                        IPA: {item.ipa || item.phonetic}
                      </div>
                    )}
                    {item.translation && (
                      <div className="dialogue-admin-trans">
                        <FiGlobe className="react-icon" /> {item.translation}
                      </div>
                    )}
                  </div>

                  <div className="dialogue-admin-actions">
                    <button
                      onClick={() => {
                        setEditingDialogue(item);
                        setDialogueForm({
                          speaker: item.speaker,
                          characterName: item.characterName,
                          text: item.text,
                          ipa: item.ipa || item.phonetic || '',
                          translation: item.translation || '',
                          orderIndex: item.orderIndex || idx + 1,
                        });
                        setDialogueError('');
                        setShowDialogueModal(true);
                      }}
                      className="btn-action"
                    >
                      <FiEdit2 className="react-icon" /> Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteDialogue(item.id, item.text)}
                      className="btn-action red"
                    >
                      <FiTrash2 className="react-icon" /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL THÊM / SỬA BÀI HỌC */}
      {showLessonModal && (
        <div className="modal-backdrop">
          <div className="modal-card animate-modal-pop">
            <h3>
              {editingLesson ? (
                <>
                  <FiEdit2 className="react-icon teal-text" /> Chỉnh sửa Bài học
                </>
              ) : (
                <>
                  <FiPlus className="react-icon teal-text" /> Thêm Bài học mới
                </>
              )}
            </h3>
            {lessonError && <div className="alert-error">{lessonError}</div>}
            <form onSubmit={handleSaveLesson} className="auth-form">
              <div className="form-group">
                <label>Tiêu đề bài học *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: IELTS Speaking Part 1: Hometown & Accommodation"
                  value={lessonForm.title}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Cấp độ (Level) *</label>
                <select
                  value={lessonForm.level}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, level: e.target.value })
                  }
                >
                  <option value="B1">B1 (Intermediate)</option>
                  <option value="B2">B2 (Upper-Intermediate)</option>
                  <option value="C1">C1 (Advanced)</option>
                  <option value="C2">C2 (Proficiency)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Mô tả bài học</label>
                <textarea
                  rows="3"
                  placeholder="Mô tả tóm tắt nội dung và mục tiêu phát âm..."
                  value={lessonForm.description}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, description: e.target.value })
                  }
                />
              </div>
              <div className="modal-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLessonModal(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Lưu bài học</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM / SỬA CÂU THOẠI */}
      {showDialogueModal && (
        <div className="modal-backdrop">
          <div className="modal-card animate-modal-pop">
            <h3>
              {editingDialogue ? (
                <>
                  <FiEdit2 className="react-icon teal-text" /> Chỉnh sửa câu thoại
                </>
              ) : (
                <>
                  <FiPlus className="react-icon teal-text" /> Thêm câu thoại mới
                </>
              )}
            </h3>
            {dialogueError && <div className="alert-error">{dialogueError}</div>}
            <form onSubmit={handleSaveDialogue} className="auth-form">
              <div className="form-group">
                <label>Vai người nói</label>
                <select
                  value={dialogueForm.speaker}
                  onChange={(e) => {
                    const spk = e.target.value;
                    setDialogueForm({
                      ...dialogueForm,
                      speaker: spk,
                      characterName: spk === 'user' ? 'Candidate' : 'Examiner (IDP)',
                    });
                  }}
                >
                  <option value="ai">AI nói (Giám khảo / Nhân vật)</option>
                  <option value="user">Học viên nói (Hệ thống chấm điểm)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tên nhân vật hiển thị</label>
                <input
                  type="text"
                  required
                  value={dialogueForm.characterName}
                  onChange={(e) =>
                    setDialogueForm({
                      ...dialogueForm,
                      characterName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Câu tiếng Anh mẫu *</label>
                <textarea
                  rows="2"
                  required
                  value={dialogueForm.text}
                  onChange={(e) =>
                    setDialogueForm({ ...dialogueForm, text: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Phiên âm quốc tế IPA</label>
                <input
                  type="text"
                  placeholder="/ɡʊd ˈmɔːrnɪŋ.../"
                  value={dialogueForm.ipa}
                  onChange={(e) =>
                    setDialogueForm({ ...dialogueForm, ipa: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Dịch nghĩa Tiếng Việt</label>
                <input
                  type="text"
                  value={dialogueForm.translation}
                  onChange={(e) =>
                    setDialogueForm({
                      ...dialogueForm,
                      translation: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialogueModal(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Lưu câu thoại</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
