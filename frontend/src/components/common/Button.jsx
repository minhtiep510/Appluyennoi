import React from 'react';

/**
 * Component Nút bấm dùng chung toàn ứng dụng
 * @param {{ variant?: 'primary' | 'outline' | 'danger' | 'success', size?: 'sm' | 'md' | 'lg', fullWidth?: boolean }} props
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) {
  const baseClass =
    variant === 'outline'
      ? 'btn-outline-sm'
      : variant === 'danger'
      ? 'btn-action red'
      : variant === 'success'
      ? 'btn-action green'
      : 'btn-primary';

  return (
    <button
      className={`${baseClass} ${fullWidth ? 'full-width' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

