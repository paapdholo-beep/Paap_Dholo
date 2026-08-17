import React from 'react';
import { formatCount } from '../utils/formatters.js';

const PaapDhulai = ({ leaderboard }) => {
  return (
    <div id="paap-dhulai" className="bg-[#111111] border-2 border-black shadow-[3px_3px_0_#F5C400]">
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-[#F5C400] flex items-center gap-2">
        <span className="text-xl">🧼</span>
        <div>
          <div className="font-ui font-900 text-sm text-[#F5C400] uppercase tracking-widest" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}>
            PAAP DHULAI
          </div>
          <div className="font-ui text-[10px] text-gray-400 tracking-widest" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Most forgiven paap this week.
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {leaderboard.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center gap-3 px-3 py-2.5 border border-gray-700 hover:border-[#F5C400] transition-colors"
          >
            <span className="font-ui font-900 text-base text-gray-500 w-5 flex-shrink-0" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}>
              {i + 1}.
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-ui font-700 text-xs text-white truncate" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>
                {c.displayName}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-sm">🙏</span>
              <span className="font-ui font-700 text-sm text-[#F5C400]" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>
                {formatCount(c.reactions.forgive)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-4">
        <button className="w-full border border-[#F5C400] text-[#F5C400] py-2 font-ui text-xs tracking-widest uppercase hover:bg-[#F5C400] hover:text-black transition-colors cursor-pointer"
          style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>
          VIEW FULL LEADERBOARD
        </button>
      </div>
    </div>
  );
};

export default PaapDhulai;
