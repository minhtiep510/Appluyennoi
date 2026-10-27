import React, { useState, useEffect, useCallback } from 'react';
import {
  FiArrowLeft,
  FiArrowRight,
  FiMic,
  FiMicOff,
  FiVolume2,
  FiZap,
  FiCpu,
  FiUser,
  FiMessageSquare,
} from 'react-icons/fi';
import { lessonService } from '../api/lesson.service';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useSpeechToText } from '../hooks/useSpeechToText';
import LessonCard from '../components/practice/LessonCard';
import ScoreRadar from '../components/practice/ScoreRadar';
import Waveform from '../components/practice/Waveform';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

/**
 * Màn hình Luyện nói Real-time (SpeakAI Interactive Room)
 */
export default function PracticeScreen({ lessonId, onSelectLesson, onBack }) {
  const [allLessons, setAllLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resultsByLine, setResultsByLine] = useState({});
  const [autoAdvance, setAutoAdvance] = useState(true);

  const dialogues = lesson?.dialogues || [];
  const activeLine = dialogues[currentIndex];

  const { audioUrl, setAudioUrl, speakText, startAudioCapture, stopAudioCapture } =
    useAudioRecorder();

  const handleCompletedScore = useCallback(
    (result) => {
      setResultsByLine((prev) => ({
        ...prev,
        [result.dialogueLineId]: result,
      }));
      if (autoAdvance && result.accuracyScore >= 70 && currentIndex < dialogues.length - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => Math.min(dialogues.length - 1, prev + 1));
        }, 1500);
      }
    },
    [autoAdvance, currentIndex, dialogues.length]
  );

  const {
    socketConnected,
    isRecording,
    spokenText,
    setSpokenText,
    liveEval,
    speechError,
    toggleRecording,
    streamText,
    finalizePractice,
    resetLineSpeech,
  } = useSpeechToText({
    activeLine,
    onCompletedScore: handleCompletedScore,
  });

  useEffect(() => {
    const loadLessonData = async () => {
      setLoading(true);
      try {
        const list = await lessonService.getLessons();
        setAllLessons(list);
        const targetId = lessonId || list[0]?.id || 1;
        const data = await lessonService.getLessonById(targetId);
        setLesson(data);
        setCurrentIndex(0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLessonData();
  }, [lessonId]);

  useEffect(() => {
    if (!lesson || !dialogues.length) return;
    const currentLine = dialogues[currentIndex];
    if (!currentLine) return;

    setAudioUrl(null);
    resetLineSpeech(resultsByLine[currentLine.id] || null);

    if (currentLine.speaker === 'ai') {
      speakText(currentLine.text);
    }
  }, [currentIndex, lesson]);

  if (loading) {
    return (
      <div className="loading-state" style={{ padding: '3rem', textAlign: 'center' }}>
        Đang tải phòng luyện nói SpeakAI...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="practice-container">
        <Card>
          <p>Không tìm thấy bài học.</p>
          <Button onClick={onBack}>Quay lại</Button>
        </Card>
      </div>
    );
  }

  const currentSavedResult = activeLine ? resultsByLine[activeLine.id] : null;
  const displayEval = liveEval || currentSavedResult;

  return (
    <div className="practice-container animate-page-enter">
      {/* Header & Thanh đổi nhanh Chủ đề */}
      <div className="practice-header">
        <button className="btn-back" onClick={onBack}>
          <FiArrowLeft className="react-icon" /> Danh sách Đề tài
        </button>

        <div className="practice-title-box">
          <span className="badge-level">{lesson.level}</span>
          <h2>{lesson.title}</h2>
        </div>

        <div className="realtime-status-bar">
          <span className="socket-badge connected">
            <span className="pulse-dot" />
            {socketConnected ? 'Socket.IO Real-time' : 'SpeakAI Live'}
          </span>

          <label className="auto-advance-toggle">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
            />
            Tự chuyển câu (≥70%)
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <ProgressBar
          current={dialogues.length ? currentIndex + 1 : 0}
          total={dialogues.length}
          label="Tiến độ kịch bản Speaking"
        />
      </div>

      {dialogues.length === 0 ? (
        <Card>Bài học này chưa có câu thoại nào.</Card>
      ) : (
        <div className="practice-grid">
          {/* Cột trái: Danh sách kịch bản câu thoại */}
          <div className="conversation-timeline animate-card-up">
            <div className="timeline-header">
              <h3>
                <FiMessageSquare className="react-icon teal-text" /> Kịch bản ({currentIndex + 1}/{dialogues.length})
              </h3>
            </div>
            <div className="timeline-list">
              {dialogues.map((line, idx) => {
                const isAI = line.speaker === 'ai';
                const isActive = idx === currentIndex;
                const doneResult = resultsByLine[line.id];

                return (
                  <div
                    key={line.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`timeline-item ${isAI ? 'ai-bubble' : 'user-bubble'} ${
                      isActive ? 'active-bubble' : ''
                    }`}
                  >
                    <div className="bubble-meta">
                      <span className="speaker-tag">
                        {isAI ? (
                          <>
                            <FiCpu className="react-icon" /> {line.characterName}
                          </>
                        ) : (
                          <>
                            <FiUser className="react-icon" /> {line.characterName} (Bạn)
                          </>
                        )}
                      </span>
                      <div className="bubble-actions">
                        {doneResult && (
                          <span
                            className={`score-pill ${
                              doneResult.accuracyScore >= 80
                                ? 'good'
                                : doneResult.accuracyScore >= 50
                                ? 'medium'
                                : 'low'
                            }`}
                          >
                            {doneResult.accuracyScore}%
                          </span>
                        )}
                        <button
                          type="button"
                          className="btn-icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(line.text);
                          }}
                          title="Nghe câu thoại"
                        >
                          <FiVolume2 />
                        </button>
                      </div>
                    </div>
                    <div className="bubble-text">{line.text}</div>
                    {line.translation && (
                      <div className="bubble-trans">{line.translation}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cột phải: Sân khấu Luyện nói Real-time */}
          {activeLine && (
            <div className="speaking-stage animate-card-up">
              <div className="stage-card">
                <LessonCard
                  line={activeLine}
                  evalData={displayEval}
                  isRecording={isRecording}
                  onSpeakText={speakText}
                />

                <hr className="divider" />

                {activeLine.speaker === 'ai' ? (
                  <div className="ai-turn-box">
                    <p>
                      AI <b>{activeLine.characterName}</b> vừa hỏi bạn câu trên. Hãy nghe
                      kỹ phát âm mẫu hoặc bấm nút bên dưới để đến lượt bạn trả lời!
                    </p>
                    {currentIndex < dialogues.length - 1 && (
                      <Button onClick={() => setCurrentIndex(currentIndex + 1)}>
                        <FiMic className="react-icon" /> Đến lượt bạn nói{' '}
                        <FiArrowRight className="react-icon" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="user-turn-box">
                    <div className="mic-section">
                      <button
                        type="button"
                        onClick={() =>
                          toggleRecording({
                            onStartAudio: startAudioCapture,
                            onStopAudio: stopAudioCapture,
                          })
                        }
                        className={`btn-mic ${isRecording ? 'recording' : ''}`}
                      >
                        {isRecording ? (
                          <>
                            <FiMicOff className="react-icon" /> Đang nghe Real-time... (Nói xong tự chấm)
                          </>
                        ) : (
                          <>
                            <FiMic className="react-icon" /> Bấm để Bắt đầu Nói
                          </>
                        )}
                      </button>

                      <Waveform isRecording={isRecording} />

                      <Button
                        variant="outline"
                        onClick={() => {
                          setSpokenText(activeLine.text);
                          streamText(activeLine.text, activeLine);
                          finalizePractice(activeLine.text, activeLine);
                        }}
                      >
                        <FiZap className="react-icon" /> Giả lập đọc chuẩn 100%
                      </Button>
                    </div>

                    {audioUrl && !isRecording && (
                      <div style={{ marginBottom: '1rem' }}>
                        <audio controls src={audioUrl} style={{ height: '34px' }} />
                      </div>
                    )}

                    {speechError && <div className="alert-error">{speechError}</div>}

                    <ScoreRadar
                      evalData={displayEval}
                      isSaved={!!currentSavedResult}
                      isRecording={isRecording}
                      onSpeakWord={speakText}
                    />
                  </div>
                )}

                <div className="stage-nav-footer">
                  <Button
                    variant="outline"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  >
                    <FiArrowLeft className="react-icon" /> Câu trước
                  </Button>
                  <Button
                    variant="outline"
                    disabled={currentIndex === dialogues.length - 1}
                    onClick={() =>
                      setCurrentIndex((i) => Math.min(dialogues.length - 1, i + 1))
                    }
                  >
                    Câu tiếp theo <FiArrowRight className="react-icon" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
