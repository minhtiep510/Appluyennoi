import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiVolume2 } from 'react-icons/fi';

/**
 * Vòng tròn / Biểu đồ điểm AI & Nhận xét phát âm
 */
export default function ScoreRadar({
  evalData,
  isSaved = false,
  isRecording = false,
  onSpeakWord,
}) {
  if (!evalData) return null;

  const score = evalData.accuracyScore ?? 0;
  const levelClass = score >= 80 ? 'high' : score >= 50 ? 'med' : 'low';

  return (
    <div className="score-result-card animate-card-up">
      <div className="score-circle-wrap">
        <div className={`score-circle ${levelClass}`}>
          <span>{score}%</span>
        </div>
        <div className="score-feedback">
          <h4>
            {evalData.feedback}
            {isSaved && (
              <span className="saved-tag">
                <FiCheckCircle className="react-icon" /> Đã lưu lịch sử
              </span>
            )}
          </h4>
        </div>
      </div>

      {!isRecording && evalData.mispronouncedWords?.length > 0 && (
        <div className="mispronounced-box">
          <span>
            <FiAlertCircle className="react-icon text-red" /> Các từ phát âm chưa chuẩn hoặc còn thiếu (Bấm vào từ để nghe lại):
          </span>
          <div className="wrong-word-tags">
            {evalData.mispronouncedWords.map((word, idx) => (
              <span
                key={idx}
                className="wrong-tag"
                onClick={() => onSpeakWord?.(word)}
              >
                <FiVolume2 className="react-icon" /> {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
