import React from 'react';
import { buildTornEdgePath, PAPER_GRAIN_URI, PAPER_SHADOW } from '../utils/TornPaper.js';

// Fixed seed (23) so this card's tear is stable but different in shape
// from the confession slip / feed cards sitting next to it.
const TORN_PATH = buildTornEdgePath(23, { topSteps: 36, sideSteps: 30 });

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
          className="relative overflow-hidden"
          style={{
            clipPath: 'url(#baba-torn-paper-clip)',
            backgroundColor: '#F5C400',
            backgroundImage: `
              radial-gradient(ellipse at center, transparent 55%, rgba(90,70,10,0.10) 100%),
              url("${PAPER_GRAIN_URI}")
            `,
            backgroundRepeat: 'no-repeat, repeat',
            backgroundSize: '100% 100%, 180px 180px',
          }}
        >
          {/* Decorative trident */}
          <div className="absolute -right-3 top-0 opacity-20 h-full flex items-center">
            <img src="/Trident_2.webp" alt="" className="h-24 object-contain" />
          </div>

          <div className="flex items-end gap-3 p-4">
            {/* Pandit illustration */}
            <div className="flex-shrink-0">
              <img
                src="/Pandit.webp"
                alt="Paap Dholo Pandit"
                className="h-20 w-auto object-contain"
              />
            </div>

            {/* Quote */}
            <div className="flex-1 min-w-0">
              <div className="text-2xl text-black mb-1 font-bold opacity-60">"</div>
              <div className="font-ui font-900 text-base text-black leading-tight uppercase" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}>
                KARO PAAP,<br />PAAO SHAANTI.
              </div>
              <div className="font-hindi text-sm text-[#F43F5E]" style={{ fontFamily: 'Rozha One' }}>
                (YA JUDGEMENT)
              </div>
            </div>
          </div>

          <div className="border-t-2 border-black px-4 py-2 flex items-center justify-between">
            <span className="font-ui text-xs text-black font-600 tracking-widest uppercase" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
              CONFESS NOW
            </span>
            <button
              onClick={onConfessClick}
              className="flex items-center justify-center w-10 h-10 bg-[#F43F5E] border-2 border-black cursor-pointer hover:bg-black transition-colors"
            >
              <img src="/Soap_bar.webp" alt="soap" className="w-6 h-6 object-contain" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BabaQuoteBanner;