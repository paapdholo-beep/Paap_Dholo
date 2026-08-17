import React, { useMemo } from 'react';
import {
  buildNormalizedStripPath,
  STRIP_TORN_SHADOW,
  PAPER_GRAIN_URI,
} from '../utils/TornPaperStrip.js';

const Footer = ({ onTermsClick, onAboutClick }) => {
  // Low-profile, tight procedural torn top edge for a sleek, compact footer
  const footerStripPath = useMemo(
    () => buildNormalizedStripPath(31, { toothCount: 64, maxDepth: 0.07, minDepth: 0.008 }),
    []
  );

  return (
    <footer
      className="relative w-full select-none"
      style={{
        filter: STRIP_TORN_SHADOW,
        marginTop: '12px',
      }}
    >
      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
        <defs>
          <clipPath id="footer-strip-clip" clipPathUnits="objectBoundingBox">
            <path d={footerStripPath} />
          </clipPath>
        </defs>
      </svg>

      <div
        style={{
          clipPath: 'url(#footer-strip-clip)',
          backgroundColor: '#111111',
          backgroundImage: `url("${PAPER_GRAIN_URI}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
          paddingTop: '26px',
          paddingBottom: '18px',
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">

            {/* Left: Bigger Logo + PAAP DHOLO name */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <img
                src="/Paap_Dholo_logo_white.webp"
                alt="Paap Dholo"
                style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
              />
              <div className="flex flex-col">
                <span
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 900,
                    fontSize: '16px',
                    letterSpacing: '0.14em',
                    color: '#FFFDF7',
                    lineHeight: 1,
                  }}
                >
                  PAAP <br /> DHOLO
                </span>
                <span
                  style={{
                    fontFamily: "'Kalam', cursive, sans-serif",
                    fontSize: '12px',
                    color: '#F5C400',
                    lineHeight: 1.2,
                    marginTop: '2px',
                  }}
                >
                  Confession Department 🧼
                </span>
              </div>
            </div>

            {/* Center: Tagline in fun Kalam font */}
            <div className="text-center">
              <p
                style={{
                  fontFamily: "'Kalam', cursive, sans-serif",
                  fontSize: '1.05rem',
                  color: '#e0d8c3',
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                Internet ka confession box. <span style={{ color: '#F5C400' }}>Confess.</span> Get judged. <span style={{ color: '#F43F5E' }}>Feel lighter.</span>
              </p>
            </div>

            {/* Right: Terms & Rules button + Made with love */}
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
              <button
                onClick={onTermsClick}
                type="button"
                className="reaction-btn"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#F5C400',
                  border: '1px solid #F5C400',
                  padding: '6px 12px',
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 700,
                  fontSize: '10.5px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5C400';
                  e.currentTarget.style.color = '#111';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#F5C400';
                }}
              >
                ⚖️ TERMS & RULES
              </button>

              <span
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: '#888',
                }}
              >
                Made with ❤️ & thoda sa paap
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;