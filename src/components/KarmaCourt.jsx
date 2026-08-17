import React from 'react';
import Avatar from './Avatar.jsx';
import { formatCount } from '../utils/formatters.js';

// Visual left-to-right order on the podium: 2nd, 1st, 3rd
const PODIUM_ORDER = [1, 0, 2];
const RANK_LABELS = ['2', '1', '3'];
const BAR_COLORS = ['bg-[#F5EEDF]', 'bg-[#F5C400]', 'bg-[#F5EEDF]'];
const AVATAR_SIZES = ['sm', 'md', 'sm'];
const TAG_LABELS = ['PAAP STARS', 'TOP JUDGED', 'TOP JUDGED'];

const KarmaCourt = ({ topConfessions }) => {
  const totalJudgements = (c) =>
    Object.values(c.reactions).reduce((s, v) => s + v, 0);

  const podium = PODIUM_ORDER
    .map((idx) => topConfessions[idx])
    .map((c, i) => (c ? { c, i } : null))
    .filter(Boolean);

  return (
    <div id="karma-court" className="bg-[#FFFDF7] border-2 border-black shadow-[3px_3px_0_#111]">
      {/* Header */}
      <div className="bg-[#F43F5E] px-4 py-3 border-b-2 border-black flex items-center gap-2">
        <span className="text-xl">⚖️</span>
        <div>
          <div className="font-ui font-900 text-sm text-white uppercase tracking-widest" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}>
            KARMA COURT
          </div>
          <div className="font-ui text-[10px] text-pink-100 tracking-widest" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Top judged paap of the week.
          </div>
        </div>
      </div>

      {/* Podium */}
      <div className="px-3 pt-6 pb-3">
        <div className="flex items-end justify-center gap-2">
          {podium.map(({ c, i }) => (
            <div key={c.id} className="flex-1 flex flex-col items-center min-w-0">
              {/* Avatar overlapping the top of the bar */}
              <div className="-mb-3.5 z-10 flex flex-col items-center">
                {RANK_LABELS[i] === '1' && (
                  <span className="text-xs -mb-1 select-none animate-pulse">👑</span>
                )}
                <Avatar avatarId={c.avatarId} size={AVATAR_SIZES[i]} className="border-2 border-black bg-white shadow-sm" />
              </div>

              {/* Podium bar */}
              <div
                className={`w-full ${BAR_COLORS[i]} border-2 border-black flex flex-col items-center justify-between pt-5 pb-2 px-1 relative`}
                style={{
                  minHeight: RANK_LABELS[i] === '1' ? '170px' : RANK_LABELS[i] === '2' ? '150px' : '140px',
                }}
              >
                {/* Tag & Rank */}
                <div className="flex flex-col items-center w-full">
                  <span
                    className="font-ui text-[6.5px] font-800 tracking-wider uppercase px-1 py-0.5 border border-black/20 bg-black/5 text-gray-700 rounded-sm mb-1 leading-none text-center"
                    style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}
                  >
                    {TAG_LABELS[i]}
                  </span>
                  <span
                    className="font-ui font-900 text-xl text-black leading-none"
                    style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
                  >
                    {RANK_LABELS[i]}
                  </span>
                </div>

                {/* Confession Text */}
                <div
                  className="font-handwrite text-black text-center leading-tight line-clamp-3 px-0.5 my-1"
                  style={{ fontFamily: 'Caveat', fontSize: '0.82rem' }}
                >
                  {c.text}
                </div>

                {/* Judgements count inside bar */}
                <div className="w-full text-center border-t border-black/10 pt-1">
                  <span
                    className="font-ui font-700 text-[8.5px] text-gray-700 whitespace-nowrap block"
                    style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
                  >
                    {formatCount(totalJudgements(c))} Judgements
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Display names, in rank order */}
      <div className="px-4 pb-4 pt-1 space-y-1 border-t border-dashed border-gray-200 mt-1">
        {PODIUM_ORDER.slice()
          .sort((a, b) => a - b)
          .map((idx) => topConfessions[idx])
          .filter(Boolean)
          .map((c, rank) => (
            <div key={c.id} className="flex items-center gap-2 text-[11px] font-ui" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              <span className="font-700 text-gray-400">{rank + 1}.</span>
              <span className="font-600 text-black truncate">{c.displayName}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default KarmaCourt;