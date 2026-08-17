import React, { useEffect, useState, useMemo } from 'react';
import { formatIndian } from '../utils/formatters.js';
import {
  buildNormalizedStripPath,
  STRIP_TORN_SHADOW,
  PAPER_GRAIN_URI,
} from '../utils/TornPaperStrip.js';

// Smooth counting animation hook for dynamic stats numbers
const useAnimatedNumber = (targetValue, duration = 1000) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue;
    const diff = targetValue - startValue;

    if (diff === 0) return;

    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + diff * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, duration]);

  return displayValue;
};

const StatItem = ({ icon, rawValue, label, isLast }) => {
  const animatedValue = useAnimatedNumber(rawValue, 800);

  return (
    <>
      <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left transition-transform duration-200 hover:scale-105">
        <span className="text-2xl sm:text-3xl select-none">{icon}</span>
        <div>
          <div
            className="font-ui font-900 text-2xl sm:text-3xl text-[#F5C400] leading-none tracking-tight"
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
          >
            {formatIndian(animatedValue)}
          </div>
          <div
            className="font-ui text-[10px] tracking-widest text-gray-400 uppercase mt-1 font-semibold"
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}
          >
            {label}
          </div>
        </div>
      </div>
      {!isLast && (
        <div className="hidden sm:block w-px h-12 bg-gray-700/80" />
      )}
    </>
  );
};

const StatsStrip = ({ stats }) => {
  // Stable procedural torn strip path
  const stripPath = useMemo(
    () => buildNormalizedStripPath(8, { toothCount: 56, maxDepth: 0.14, minDepth: 0.015 }),
    []
  );

  const items = [
    {
      icon: '📄',
      rawValue: stats.totalConfessions,
      label: 'PAAP CONFESSED',
    },
    {
      icon: '💬',
      rawValue: stats.totalJudgements,
      label: 'JUDGEMENTS PASSED',
    },
    {
      icon: '🔱',
      rawValue: stats.totalForgiven,
      label: 'MAAF KIYA GAYA',
    },
  ];

  return (
    <div
      className="relative select-none w-full"
      style={{
        filter: STRIP_TORN_SHADOW,
        marginTop: '-12px',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
        <defs>
          <clipPath id="stats-strip-clip" clipPathUnits="objectBoundingBox">
            <path d={stripPath} />
          </clipPath>
        </defs>
      </svg>

      <div
        className="w-full"
        style={{
          clipPath: 'url(#stats-strip-clip)',
          backgroundColor: '#111111',
          backgroundImage: `url("${PAPER_GRAIN_URI}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
          paddingTop: '32px',
          paddingBottom: '22px',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 lg:gap-20">
            {items.map((item, i) => (
              <StatItem
                key={item.label}
                icon={item.icon}
                rawValue={item.rawValue}
                label={item.label}
                isLast={i === items.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsStrip;
