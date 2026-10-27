import React from 'react';
import { FiGlobe } from 'react-icons/fi';

export default function Footer({ onNavigate }) {
  const handleNav = (e, screen) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(screen);
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        // ignore
      }
    }
  };

  return (
    <footer className="speakai-common-footer">
      <div className="footer-top-row">
        {/* Cột 1: Thương hiệu & Mô tả */}
        <div className="footer-brand-col">
          <div className="footer-brand-logo">
            <span className="brand-plus">+</span>
            <span className="brand-name">Peit</span>
          </div>
          <p className="footer-brand-desc">
            giúp bạn ghi nhớ lâu hơn và sử dụng hiệu quả hơn.
          </p>
        </div>

        {/* Cột 2: Hỗ trợ */}
        <div className="footer-links-col">
          <h4 className="footer-links-heading">Hỗ trợ</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#privacy" onClick={(e) => handleNav(e, 'privacy-policy')}>
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#terms" onClick={(e) => handleNav(e, 'terms-of-service')}>
                Điều khoản sử dụng
              </a>
            </li>
            <li>
              <a
                href="#delete-account"
                onClick={(e) => handleNav(e, 'delete-account-policy')}
              >
                Chính sách xoá tài khoản
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Đường phân cách & Dòng bản quyền dưới cùng */}
      <div className="footer-bottom-bar">
        <div className="footer-copyright">
         @MinhTiep 2026. All rights reserved.
        </div>
        <div className="footer-meta">
          <span>Mọi bản quyền được bảo lưu</span>
          <span className="footer-divider-dot">|</span>
          <span className="footer-lang">
            <FiGlobe className="footer-globe-icon" /> Tiếng Việt
          </span>
        </div>
      </div>
    </footer>
  );
}

