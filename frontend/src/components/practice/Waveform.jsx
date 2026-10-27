import React from 'react';

/**
 * Hiệu ứng Sóng âm (Waveform) phong cách LexiSpeak khi học viên đang nói vào Micro
 */
export default function Waveform({ isRecording = false }) {
  if (!isRecording) return null;

  const bars = [12, 24, 32, 18, 36, 26, 38, 20, 30, 26, 16, 22];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        height: '40px',
        padding: '0 14px',
        background: '#e0f2f1',
        border: '1px solid #80cbc4',
        borderRadius: '99px',
      }}
      title="Đang thu sóng âm giọng nói Real-time..."
    >
      {bars.map((height, idx) => (
        <span
          key={idx}
          style={{
            width: '4px',
            height: `${height}px`,
            background: '#00897b',
            borderRadius: '99px',
            animation: `waveBar 0.55s ease-in-out ${idx * 0.06}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
