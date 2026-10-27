import React from 'react';

/**
 * Bóc tách từ đúng/sai (Tô màu xanh/đỏ từng từ theo thời gian thực ngay khi đang nói)
 */
export default function WordFeedback({
  originalText = '',
  evalData = null,
  isRecording = false,
  onSpeakWord,
}) {
  const words = originalText.split(/\s+/);

  if (
    !evalData ||
    (!evalData.matchedWords?.length &&
      !evalData.mispronouncedWords?.length &&
      !evalData.wordAnalysis?.length)
  ) {
    return (
      <div className="stage-sentence">
        {words.map((w, i) => (
          <span key={i} className="word-neutral">
            {w}{' '}
          </span>
        ))}
      </div>
    );
  }

  const matchedSet = new Set(
    (
      evalData.matchedWords ||
      (evalData.wordAnalysis || [])
        .filter((item) => item.status === 'correct')
        .map((item) => item.word.replace(/[^a-zA-Z0-9']/g, ''))
    ).map((w) => w.toLowerCase())
  );

  return (
    <div className="stage-sentence">
      {words.map((word, idx) => {
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isMatched = cleanWord && matchedSet.has(cleanWord);

        if (isRecording) {
          return (
            <span
              key={idx}
              className={isMatched ? 'word-correct live-pop' : 'word-neutral'}
            >
              {word}{' '}
            </span>
          );
        }

        return (
          <span
            key={idx}
            onClick={() => onSpeakWord?.(cleanWord)}
            className={isMatched ? 'word-correct' : 'word-wrong'}
            title={isMatched ? 'Phát âm chuẩn!' : 'Bấm để nghe phát âm từ này'}
          >
            {word}{' '}
          </span>
        );
      })}
    </div>
  );
}

