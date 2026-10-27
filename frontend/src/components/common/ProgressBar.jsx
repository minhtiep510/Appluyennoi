import React from 'react';

/**
 * Thanh tiến trình bài học phong cách LexiSpeak Teal
 */
export default function ProgressBar({ current = 0, total = 1, label = '' }) {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#4b5563',
            marginBottom: '0.35rem',
          }}
        >
          <span>{label}</span>
          <span style={{ color: '#00897b', fontWeight: 800 }}>
            {percent}%
          </span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: '8px',
          background: '#e5e7eb',
          borderRadius: '99px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00897b, #26a69a)',
            borderRadius: '99px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}
