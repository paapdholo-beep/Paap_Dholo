import React, { useEffect, useMemo } from 'react';
import {
  buildScrapEdgePath,
  SCRAP_SHADOW,
  SCRAP_EDGE_TINT,
  PAPER_GRAIN_URI,
} from '../utils/TornPaperScrap.js';

const AboutDialog = ({ isOpen, onClose, onConfessClick }) => {
  // Stable torn edge path generated with seed 7 for a distinct scrap profile
  const scrapPath = useMemo(
    () => buildScrapEdgePath(7, { top: 48, right: 58, bottom: 48, left: 52 }),
    []
  );

  // Close on Escape key and prevent body scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: 'rgba(17, 17, 17, 0.65)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
      onClick={onClose}
    >
      {/* SVG Clip Path Definition */}
      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
        <defs>
          <clipPath id="about-scrap-clip" clipPathUnits="objectBoundingBox">
            <path d={scrapPath} />
          </clipPath>
        </defs>
      </svg>

      {/* Modal Container */}
      <div
        className="w-full max-w-xl relative animate-scale-in"
        style={{
          filter: SCRAP_SHADOW,
          transform: 'rotate(-0.4deg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Paper Scrap Body */}
        <div
          style={{
            clipPath: 'url(#about-scrap-clip)',
            backgroundColor: '#FFFDF4',
            backgroundImage: `
              ${SCRAP_EDGE_TINT},
              radial-gradient(ellipse at center, transparent 60%, rgba(90,70,40,0.08) 100%),
              url("${PAPER_GRAIN_URI}"),
              repeating-linear-gradient(
                transparent,
                transparent 27px,
                rgba(180,155,90,0.12) 27px,
                rgba(180,155,90,0.12) 28px
              )
            `,
            backgroundRepeat: 'no-repeat, no-repeat, no-repeat, repeat, repeat',
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 180px 180px, auto',
            padding: '36px 30px 36px 36px',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              borderBottom: '2px dashed #c8b88a',
              paddingBottom: '14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            {/* Logo & Department */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/Paap_Dholo_logo_black.webp"
                alt="Paap Dholo"
                style={{ height: '32px', objectFit: 'contain' }}
              />
              <div>
                <div
                  id="about-dialog-title"
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontWeight: 900,
                    fontSize: '13px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#111',
                  }}
                >
                  PAAP DHOLO
                </div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '8px',
                    color: '#888',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  CONFESSION & REDEMPTION DEPARTMENT
                </div>
              </div>
            </div>

            {/* Stamp + Close Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                className="stamp hidden sm:inline-block"
                style={{
                  borderColor: '#F43F5E',
                  color: '#F43F5E',
                  fontSize: '8px',
                  padding: '2px 6px',
                  opacity: 0.85,
                }}
              >
                PUBLIC NOTICE
              </div>

              {/* Close Button (X) */}
              <button
                onClick={onClose}
                aria-label="Close About dialog"
                className="reaction-btn"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFFDF7',
                  border: '2px solid #111',
                  boxShadow: '2px 2px 0px #111',
                  cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 900,
                  fontSize: '14px',
                  color: '#111',
                  lineHeight: 1,
                  padding: 0,
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F43F5E';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFDF7';
                  e.currentTarget.style.color = '#111';
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4 text-[#222]">
            {/* Tagline / Introduction */}
            <div>
              <div
                style={{
                  fontFamily: 'Rozha One, serif',
                  fontSize: '1.4rem',
                  lineHeight: 1.25,
                  color: '#111',
                  marginBottom: '4px',
                }}
              >
                जो किया, यहाँ लिख दो. नाम नहीं पूछेंगे.
              </div>
              <p
                style={{
                  fontFamily: "'Kalam', cursive, sans-serif",
                  fontSize: '1rem',
                  color: '#444',
                  lineHeight: 1.4,
                }}
              >
                Paap Dholo is India's anonymous confession department — a safe, humorous corner of the internet to unburden your guilty secrets.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '10px',
                marginTop: '12px',
              }}
            >
              {/* Feature 1 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.65)',
                  border: '1.5px solid #d4c090',
                  padding: '10px 12px',
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '2px' }}>💀 100% Anonymous</div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '10.5px',
                    color: '#666',
                    lineHeight: 1.4,
                  }}
                >
                  No login, no name, no tracking. Sins are assigned a funny anonymous identity automatically.
                </div>
              </div>

              {/* Feature 2 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.65)',
                  border: '1.5px solid #d4c090',
                  padding: '10px 12px',
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '2px' }}>⚖️ Karma Court</div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '10.5px',
                    color: '#666',
                    lineHeight: 1.4,
                  }}
                >
                  Read confessions, react with judgements (Sharam Kar, Relatable, Wah), and vote for daily top paaps.
                </div>
              </div>

              {/* Feature 3 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.65)',
                  border: '1.5px solid #d4c090',
                  padding: '10px 12px',
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '2px' }}>🧼 Paap Dhulai</div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '10.5px',
                    color: '#666',
                    lineHeight: 1.4,
                  }}
                >
                  Soap reactions wash sins away. Top forgiven paaps climb the holy Dhulai Leaderboard.
                </div>
              </div>

              {/* Feature 4 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.65)',
                  border: '1.5px solid #d4c090',
                  padding: '10px 12px',
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '2px' }}>🕊️ Feel Lighter</div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '10.5px',
                    color: '#666',
                    lineHeight: 1.4,
                  }}
                >
                  Har harmless paap (Netflix binge, fries chori, fake "on the way") deserve a laugh and redemption!
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              style={{
                marginTop: '18px',
                paddingTop: '14px',
                borderTop: '2px dashed #c8b88a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#999',
                }}
              >
                KARO PAAP, PAAO SHAANTI (YA JUDGEMENT) 🙏
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    onClose();
                    if (onConfessClick) onConfessClick();
                  }}
                  style={{
                    backgroundColor: '#111',
                    color: '#fff',
                    border: '2px solid #111',
                    padding: '8px 16px',
                    fontFamily: 'Plus Jakarta Sans',
                    fontWeight: 800,
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F43F5E';
                    e.currentTarget.style.borderColor = '#F43F5E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#111';
                    e.currentTarget.style.borderColor = '#111';
                  }}
                >
                  CONFESS NOW
                  <img
                    src="/Soap_bar.webp"
                    alt="soap"
                    style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDialog;
