import React from 'react';
import { FiCpu, FiMic, FiVolume2, FiGlobe } from 'react-icons/fi';
import WordFeedback from './WordFeedback';

/**
 * Hiển thị câu thoại mẫu, tên nhân vật, phiên âm IPA và dịch nghĩa
 */
export default function LessonCard({
  line,
  evalData,
  isRecording,
  onSpeakText,
}) {
  if (!line) return null;
  const isAI = line.speaker === 'ai';

  return (
    <div className="lesson-line-display">
      <div className="stage-top-row">
        <div className="stage-speaker-badge">
          {isAI ? (
            <span className="tag-ai">
              <FiCpu className="react-icon" /> Lượt của AI ({line.characterName})
            </span>
          ) : (
            <span className="tag-user">
              <FiMic className="react-icon" /> Lượt nói của BẠN ({line.characterName})
            </span>
          )}
        </div>

        {!isAI && evalData && (
          <div className="live-meter">
            <span>Độ chính xác Real-time:</span>
            <strong
              className={
                evalData.accuracyScore >= 80
                  ? 'text-green'
                  : evalData.accuracyScore >= 50
                  ? 'text-orange'
                  : 'text-red'
              }
            >
              {evalData.accuracyScore}%
            </strong>
          </div>
        )}
      </div>

      {/* Câu mẫu với bóc tách từ đúng/sai Real-time */}
      <WordFeedback
        originalText={line.text}
        evalData={evalData}
        isRecording={isRecording}
        onSpeakWord={onSpeakText}
      />

      {(line.ipa || line.phonetic) && (
        <div className="stage-ipa">{line.ipa || line.phonetic}</div>
      )}

      {line.translation && (
        <div className="stage-translation">
          <FiGlobe className="react-icon teal-text" /> Nghĩa: {line.translation}
        </div>
      )}

      <div className="stage-listen-row">
        <button
          type="button"
          className="btn-listen"
          onClick={() => onSpeakText(line.text)}
        >
          <FiVolume2 className="react-icon" /> Nghe phát âm mẫu
        </button>
      </div>
    </div>
  );
}
