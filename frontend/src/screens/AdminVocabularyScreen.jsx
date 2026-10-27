import React, { useState, useEffect } from 'react';
import {
  FiBook,
  FiGrid,
  FiBookOpen,
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiArrowLeft,
  FiVolume2,
  FiLayers,
} from 'react-icons/fi';
import { vocabularyService } from '../api/vocabulary.service';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';

/**
 * Trang Quản trị Chủ đề Từ vựng (VocabularyTopic) & Từ vựng (Vocabulary)
 * Dùng chung Sidebar cố định từ AdminLayout.jsx
 */
export default function AdminVocabularyScreen({ onNavigateAdmin }) {
  const [topics, setTopics] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Phân trang Chủ đề Admin (8 chủ đề / trang)
  const [topicPage, setTopicPage] = useState(1);
  const TOPICS_PER_PAGE = 8;

  // Phân trang Từ vựng Admin (15 từ vựng / trang)
  const [vocabPage, setVocabPage] = useState(1);
  const VOCABS_PER_PAGE = 15;

  useEffect(() => {
    setVocabPage(1);
  }, [selectedTopic]);

  // Modal Chủ đề Từ vựng (VocabularyTopic)
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicForm, setTopicForm] = useState({
    name: '',
    level: 'B1',
    imageUrl: '',
    description: '',
  });
  const [topicError, setTopicError] = useState('');

  // Hỗ trợ chọn file ảnh từ máy tính chuyển sang Base64 cho Chủ đề
  const handleTopicImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setTopicForm((prev) => ({ ...prev, imageUrl: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  // Modal Từ vựng (Vocabulary)
  const [showVocabModal, setShowVocabModal] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null);
  const [vocabForm, setVocabForm] = useState({
    topicId: '',
    word: '',
    pos: 'Noun',
    ipa: '',
    meaning: '',
    level: 'B1',
    synonyms: '',
    example: '',
    exampleTrans: '',
  });
  const [vocabError, setVocabError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [topicList, vocabList] = await Promise.all([
        vocabularyService.getTopics(),
        vocabularyService.getVocabularies(),
      ]);
      setTopics(topicList);
      setVocabularies(vocabList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const speakWord = (text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  // Lưu Chủ đề Từ vựng
  const handleSaveTopic = async (e) => {
    e.preventDefault();
    setTopicError('');
    try {
      if (editingTopic) {
        await vocabularyService.updateTopic(editingTopic.id, topicForm);
      } else {
        await vocabularyService.createTopic(topicForm);
      }
      setShowTopicModal(false);
      fetchData();
    } catch (err) {
      setTopicError(err.message || 'Không thể lưu chủ đề từ vựng.');
    }
  };

  const handleDeleteTopic = async (id, name) => {
    if (
      !window.confirm(
        `Xóa chủ đề "${name}" sẽ xóa các từ vựng thuộc chủ đề này. Bạn chắc chắn chứ?`
      )
    )
      return;
    try {
      await vocabularyService.deleteTopic(id);
      if (selectedTopic?.id === id) setSelectedTopic(null);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Lưu Từ vựng
  const handleSaveVocab = async (e) => {
    e.preventDefault();
    setVocabError('');
    try {
      if (editingVocab) {
        await vocabularyService.updateVocabulary(editingVocab.id, vocabForm);
      } else {
        await vocabularyService.createVocabulary(vocabForm);
      }
      setShowVocabModal(false);
      fetchData();
    } catch (err) {
      setVocabError(err.message || 'Không thể lưu từ vựng.');
    }
  };

  const handleDeleteVocab = async (id, word) => {
    if (!window.confirm(`Xóa từ vựng "${word}"?`)) return;
    try {
      await vocabularyService.deleteVocabulary(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const displayedVocabs = selectedTopic
    ? vocabularies.filter(
        (v) =>
          v.topicId === selectedTopic.id ||
          v.topic?.name === selectedTopic.name
      )
    : vocabularies;

  return (
    <div className="animate-page-enter">
      <header className="admin-topbar">
        <div>
          <span className="admin-breadcrumb">
            SpeakAI Admin / {selectedTopic ? `Chủ đề: ${selectedTopic.name} / Danh sách Từ vựng` : 'Quản lý Chủ đề Từ vựng'}
          </span>
          <h2 className="admin-page-heading">
            <FiLayers className="react-icon teal-text" />{' '}
            {selectedTopic
              ? `Từ vựng Chủ đề: ${selectedTopic.name}`
              : 'Quản Lý Chủ Đề Từ Vựng'}
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
          <button
            className="btn-outline-sm"
            onClick={() => onNavigateAdmin('admin-users')}
          >
            <FiUsers className="react-icon" /> Quản lý Người dùng
          </button>
        </div>
      </header>

      {/* 1. BẢNG QUẢN LÝ CHỦ ĐỀ TỪ VỰNG (MODEL VOCABULARY TOPIC) */}
      {!selectedTopic && (
        <div
          className="admin-content-panel animate-card-up"
          style={{ marginBottom: '1.5rem' }}
        >
          <div className="section-header-row">
            <div>
              <h3>
                <FiLayers className="react-icon teal-text" /> Danh sách Chủ đề Từ vựng ({topics.length})
              </h3>
              <p>
                Quản lý bảng <b>VocabularyTopic</b> — Bấm "Xem từ vựng" để lọc riêng các từ thuộc chủ đề đó
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingTopic(null);
                setTopicForm({
                  name: '',
                  level: 'B1',
                  imageUrl: '',
                  description: '',
                });
                setTopicError('');
                setShowTopicModal(true);
              }}
            >
              <FiPlus className="react-icon" /> Thêm Chủ đề Từ vựng
            </Button>
          </div>

          <div className="table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ảnh Chủ đề</th>
                  <th>Tên Chủ đề</th>
                  <th>Level</th>
                  <th>Mô tả chi tiết</th>
                  <th style={{ textAlign: 'center' }}>Số từ vựng</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {topics
                  .slice(
                    (topicPage - 1) * TOPICS_PER_PAGE,
                    topicPage * TOPICS_PER_PAGE
                  )
                  .map((t) => {
                    const count =
                      t._count?.vocabularies ??
                      vocabularies.filter(
                        (v) => v.topicId === t.id || v.topic?.name === t.name
                      ).length;

                    return (
                      <tr key={t.id}>
                        <td style={{ width: '88px' }}>
                          <img
                            src={
                              t.imageUrl ||
                              'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80'
                            }
                            alt={t.name}
                            style={{
                              width: '68px',
                              height: '46px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                            }}
                          />
                        </td>
                        <td className="col-title">{t.name}</td>
                        <td>
                          <span className="badge-level">{t.level}</span>
                        </td>
                        <td className="col-desc">{t.description}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="count-pill">{count} từ</span>
                        </td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => setSelectedTopic(t)}
                            className="btn-action green"
                          >
                            <FiBook className="react-icon" /> Xem từ vựng ({count})
                          </button>
                          <button
                            onClick={() => {
                              setEditingTopic(t);
                              setTopicForm({
                                name: t.name,
                                level: t.level || 'B1',
                                imageUrl: t.imageUrl || '',
                                description: t.description || '',
                              });
                              setTopicError('');
                              setShowTopicModal(true);
                            }}
                            className="btn-action"
                          >
                            <FiEdit2 className="react-icon" /> Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteTopic(t.id, t.name)}
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

          {/* THANH PHÂN TRANG CHỦ ĐỀ TỪ VỰNG */}
          <Pagination
            currentPage={topicPage}
            totalPages={Math.max(
              1,
              Math.ceil(topics.length / TOPICS_PER_PAGE)
            )}
            totalItems={topics.length}
            itemsPerPage={TOPICS_PER_PAGE}
            itemLabel="chủ đề"
            onPageChange={(page) => setTopicPage(page)}
          />
        </div>
      )}

      {/* 2. BẢNG QUẢN LÝ TỪ VỰNG (CHỈ HIỂN THỊ KHI ĐÃ CHỌN XEM TRONG 1 CHỦ ĐỀ CỤ THỂ) */}
      {selectedTopic && (
        <div className="admin-content-panel animate-card-up">
          <div className="section-header-row">
            <div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="btn-back"
                style={{ marginBottom: '0.45rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <FiArrowLeft className="react-icon" /> Quay lại Danh sách Chủ đề Từ vựng
              </button>
              <h3 style={{ marginTop: '0.35rem' }}>
                Danh sách Từ vựng thuộc Chủ đề: {selectedTopic.name} ({displayedVocabs.length} từ)
              </h3>
              <p>
                Quản lý các từ vựng thuộc chủ đề <b>{selectedTopic.name}</b> (Level {selectedTopic.level || 'B1'})
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingVocab(null);
                setVocabForm({
                  topicId: selectedTopic.id,
                  word: '',
                  pos: 'Noun',
                  ipa: '',
                  meaning: '',
                  level: selectedTopic.level || 'B1',
                  synonyms: '',
                  example: '',
                  exampleTrans: '',
                });
                setVocabError('');
                setShowVocabModal(true);
              }}
            >
              <FiPlus className="react-icon" /> Thêm Từ vựng vào Chủ đề này
            </Button>
          </div>

        {loading ? (
          <div className="loading-state">Đang tải danh sách từ vựng...</div>
        ) : (
          <>
            <div className="table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Từ vựng &amp; IPA</th>
                  <th>Chủ đề</th>
                  <th>Từ loại / Level</th>
                  <th>Nghĩa tiếng Việt &amp; Ví dụ</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {displayedVocabs
                  .slice(
                    (vocabPage - 1) * VOCABS_PER_PAGE,
                    vocabPage * VOCABS_PER_PAGE
                  )
                  .map((v) => (
                    <tr key={v.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>
                            {v.word}
                          </strong>
                          <button
                            type="button"
                            className="btn-icon-sm"
                            onClick={() => speakWord(v.word)}
                            title="Nghe phát âm"
                          >
                            <FiVolume2 />
                          </button>
                        </div>
                        <div className="dialogue-admin-ipa">{v.ipa}</div>
                      </td>
                      <td>
                        <span className="vocab-topic-tag">
                          {v.topic?.name || 'General'}
                        </span>
                      </td>
                      <td>
                        <span className="vocab-pos-tag">{v.pos}</span>{' '}
                        <span className="badge-level">{v.level || v.band || 'B1'}</span>
                      </td>
                      <td className="col-desc" style={{ maxWidth: '420px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          {v.meaning}
                        </div>
                        {v.example && (
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                            VD: “{v.example}”
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => {
                            setEditingVocab(v);
                            setVocabForm({
                              topicId: v.topicId || topics[0]?.id || '',
                              word: v.word,
                              pos: v.pos || 'Noun',
                              ipa: v.ipa || '',
                              meaning: v.meaning,
                              level: v.level || v.band || 'B1',
                              synonyms: v.synonyms || '',
                              example: v.example || '',
                              exampleTrans: v.exampleTrans || '',
                            });
                            setVocabError('');
                            setShowVocabModal(true);
                          }}
                          className="btn-action"
                        >
                          <FiEdit2 className="react-icon" /> Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteVocab(v.id, v.word)}
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

          {/* THANH PHÂN TRANG TỪ VỰNG */}
          <Pagination
            currentPage={vocabPage}
            totalPages={Math.max(
              1,
              Math.ceil(displayedVocabs.length / VOCABS_PER_PAGE)
            )}
            totalItems={displayedVocabs.length}
            itemsPerPage={VOCABS_PER_PAGE}
            itemLabel="từ vựng"
            onPageChange={(page) => setVocabPage(page)}
          />
        </>
      )}
      </div>
      )}

      {/* MODAL THÊM / SỬA CHỦ ĐỀ TỪ VỰNG */}
      {showTopicModal && (
        <div className="modal-backdrop">
          <div className="modal-card animate-modal-pop">
            <h3>
              {editingTopic ? 'Chỉnh sửa Chủ đề Từ vựng' : 'Thêm Chủ đề Từ vựng mới'}
            </h3>
            {topicError && <div className="alert-error">{topicError}</div>}
            <form onSubmit={handleSaveTopic} className="auth-form">
              <div className="form-group">
                <label>Tên Chủ đề Từ vựng *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Environment & Climate, Healthcare..."
                  value={topicForm.name}
                  onChange={(e) =>
                    setTopicForm({ ...topicForm, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Cấp độ (Level)</label>
                <select
                  value={topicForm.level}
                  onChange={(e) =>
                    setTopicForm({ ...topicForm, level: e.target.value })
                  }
                >
                  <option value="B1">B1 (Intermediate)</option>
                  <option value="B2">B2 (Upper-Intermediate)</option>
                  <option value="C1">C1 (Advanced)</option>
                  <option value="C2">C2 (Proficiency)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Link Ảnh đại diện Chủ đề (URL) hoặc tải ảnh lên</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={topicForm.imageUrl}
                  onChange={(e) =>
                    setTopicForm({ ...topicForm, imageUrl: e.target.value })
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTopicImageUpload}
                  style={{ marginTop: '0.45rem', fontSize: '0.82rem' }}
                />
                {topicForm.imageUrl && (
                  <div style={{ marginTop: '0.55rem' }}>
                    <img
                      src={topicForm.imageUrl}
                      alt="Preview"
                      style={{
                        width: '100%',
                        maxHeight: '130px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Mô tả chủ đề</label>
                <textarea
                  rows="3"
                  value={topicForm.description}
                  onChange={(e) =>
                    setTopicForm({ ...topicForm, description: e.target.value })
                  }
                />
              </div>
              <div className="modal-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTopicModal(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Lưu Chủ đề</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM / SỬA TỪ VỰNG */}
      {showVocabModal && (
        <div className="modal-backdrop">
          <div
            className="modal-card animate-modal-pop"
            style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h3>
              {editingVocab ? 'Chỉnh sửa Từ vựng' : 'Thêm Từ vựng mới'}
            </h3>
            {vocabError && <div className="alert-error">{vocabError}</div>}
            <form onSubmit={handleSaveVocab} className="auth-form">
              <div className="form-group">
                <label>Thuộc Chủ đề Từ vựng *</label>
                <select
                  required
                  value={vocabForm.topicId}
                  onChange={(e) =>
                    setVocabForm({ ...vocabForm, topicId: e.target.value })
                  }
                >
                  <option value="">-- Chọn chủ đề --</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.level})
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}
              >
                <div className="form-group">
                  <label>Từ vựng / Cụm từ *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Artificial Intelligence"
                    value={vocabForm.word}
                    onChange={(e) =>
                      setVocabForm({ ...vocabForm, word: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Phiên âm IPA</label>
                  <input
                    type="text"
                    placeholder="VD: /ˌɑːrtɪˈfɪʃl ɪnˈtelɪdʒəns/"
                    value={vocabForm.ipa}
                    onChange={(e) =>
                      setVocabForm({ ...vocabForm, ipa: e.target.value })
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}
              >
                <div className="form-group">
                  <label>Từ loại</label>
                  <input
                    type="text"
                    placeholder="Noun, Verb, Phrasal Verb..."
                    value={vocabForm.pos}
                    onChange={(e) =>
                      setVocabForm({ ...vocabForm, pos: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Cấp độ (Level)</label>
                  <select
                    value={vocabForm.level}
                    onChange={(e) =>
                      setVocabForm({ ...vocabForm, level: e.target.value })
                    }
                  >
                    <option value="B1">B1 (Intermediate)</option>
                    <option value="B2">B2 (Upper-Intermediate)</option>
                    <option value="C1">C1 (Advanced)</option>
                    <option value="C2">C2 (Proficiency)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Nghĩa tiếng Việt *</label>
                <input
                  type="text"
                  required
                  placeholder="Giải nghĩa tiếng Việt..."
                  value={vocabForm.meaning}
                  onChange={(e) =>
                    setVocabForm({ ...vocabForm, meaning: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Từ đồng nghĩa (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  placeholder="VD: Machine intelligence, AI systems"
                  value={vocabForm.synonyms}
                  onChange={(e) =>
                    setVocabForm({ ...vocabForm, synonyms: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Câu ví dụ tiếng Anh</label>
                <textarea
                  rows="2"
                  value={vocabForm.example}
                  onChange={(e) =>
                    setVocabForm({ ...vocabForm, example: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Bản dịch câu ví dụ</label>
                <input
                  type="text"
                  value={vocabForm.exampleTrans}
                  onChange={(e) =>
                    setVocabForm({
                      ...vocabForm,
                      exampleTrans: e.target.value,
                    })
                  }
                />
              </div>

              <div className="modal-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowVocabModal(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Lưu Từ vựng</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

