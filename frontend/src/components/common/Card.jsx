import React from 'react';

/**
 * Component Card khung chứa nội dung phong cách LexiBot / LexiSpeak
 */
export default function Card({ children, className = '', style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`common-card ${className}`}
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        color: '#111827',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
