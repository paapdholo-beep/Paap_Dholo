import React from 'react';
import { buildTornEdgePath, PAPER_GRAIN_URI, PAPER_SHADOW } from '../utils/TornPaper.js';

// Fixed seed (23) so this card's tear is stable but different in shape
// from the confession slip / feed cards sitting next to it.
const TORN_PATH = buildTornEdgePath(23, { topSteps: 31, sideSteps: 25 });

const BabaQuoteBanner = ({ onConfessClick }) => {
  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
        <defs>
          <clipPath id="baba-torn-paper-clip" clipPathUnits="objectBoundingBox">
            <path d={TORN_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        style={{
          transform: 'rotate(0.4deg)',
          filter: PAPER_SHADOW,
          position: 'relative',
        }}
      >
        <div
          style={{
            clipPath: 'url(#baba-torn-paper-clip)',
            backgroundColor: '#F5C400',
            backgroundImage: `
              radial-gradient(ellipse at center, transparent 55%, rgba(90,70,10,0.10) 100%),
              url("${PAPER_GRAIN_URI}")
            `,
            backgroundRepeat: 'no-repeat, repeat',
            backgroundSize: '100% 100%, 180px 180px',
            minHeight: '230px',
            padding: '20px 18px 0px 18px',
            position: 'relative',
          }}
        >
          {/* Top: Quote Mark & Text */}
          <div className="relative z-10 flex items-start gap-2.5">
            {/* Bold 66 quote mark */}
            <div
              style={{
                fontSize: '2.8rem',
                fontFamily: 'Rozha One, Georgia, serif',
                fontWeight: 900,
                color: '#111',
                lineHeight: 0.75,
                marginTop: '4px',
              }}
            >
              “
            </div>

            {/* Typography */}
            <div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  letterSpacing: '0.02em',
                  color: '#111',
                  lineHeight: 1.15,
                  textTransform: 'uppercase',
                }}
              >
                Ho Gaya hai paap,<br />chale aao hamare pass.
              </div>

              {/* Pink accent text with pink underline */}
              <div className="relative inline-block mt-0.5">
                <span
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 900,
                    fontSize: '1.2rem',
                    letterSpacing: '0.04em',
                    color: '#F43F5E',
                    textTransform: 'uppercase',
                  }}
                >
                  (SAB DHO DENGE!)
                </span>
                <div
                  style={{
                    height: '2.5px',
                    backgroundColor: '#F43F5E',
                    width: '100%',
                    marginTop: '-1px',
                    borderRadius: '2px',
                    transform: 'rotate(-0.5deg)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Row: Pandit & Trident Illustrations */}
          <div className="relative flex items-end justify-between mt-2" style={{ height: '140px' }}>
            {/* Pandit Baba illustration */}
            <div className="flex-shrink-0" style={{ marginBottom: '-6px', marginLeft: '-4px' }}>
              <img
                src="/Pandit.webp"
                alt="Paap Dholo Pandit"
                style={{
                  height: '138px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* High-visibility Trident illustration */}
            <div
              className="flex-shrink-0"
              style={{
                marginBottom: '-4px',
                marginRight: '2px',
                transform: 'rotate(8deg)',
              }}
            >
              <img
                src="/Trident_1.webp"
                alt="Trident"
                style={{
                  height: '136px',
                  width: 'auto',
                  objectFit: 'contain',
                  opacity: 0.95,
                  filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.15))',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BabaQuoteBanner;