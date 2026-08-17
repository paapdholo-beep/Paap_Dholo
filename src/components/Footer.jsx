import React, { useMemo } from 'react';
import {
  buildNormalizedStripPath,
  STRIP_TORN_SHADOW,
  PAPER_GRAIN_URI,
} from '../utils/TornPaperStrip.js';

const Footer = () => {
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
          paddingBottom: '16px',
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">

            {/* Left: Bigger Logo + PAAP DHOLO name */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <img
                src="/Paap_Dholo_logo_white.webp"
                alt="Paap Dholo"
                style={{ height: '60px', width: 'auto', objectFit: 'contain' }}
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
                    fontFamily: 'Caveat, cursive',
                    fontSize: '13px',
                    color: '#F5C400',
                    lineHeight: 1.2,
                    marginTop: '2px',
                  }}
                >
                  Confession Department 🧼
                </span>
              </div>
            </div>

            {/* Center: Tagline in fun Caveat font */}
            <div className="text-center">
              <p
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: '1.2rem',
                  color: '#e0d8c3',
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Internet ka confession box. <span style={{ color: '#F5C400' }}>Confess.</span> Get judged. <span style={{ color: '#F43F5E' }}>Feel lighter.</span>
              </p>
            </div>

            {/* Right: Fun microcopy */}
            <div className="flex items-center flex-shrink-0">
              <span
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '10.5px',
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