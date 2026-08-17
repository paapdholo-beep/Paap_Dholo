import React, { useState } from 'react';
import ConfessionCard from './ConfessionCard.jsx';
import { getConfessions } from '../services/confessionService.js';

const SORT_OPTIONS = [
  { value: 'latest',        label: 'Latest First' },
  { value: 'most-judged',   label: 'Most Judged' },
  { value: 'most-forgiven', label: 'Most Forgiven' },
];

const SEVERITY_FILTERS = [
  { value: 'all',    label: 'All Paap' },
  { value: 'minor',  label: '😇 Minor Paap' },
  { value: 'medium', label: '🙂 Medium Paap' },
  { value: 'bada',   label: '😬 Bada Paap' },
  { value: 'maha',   label: '💀 Mahapaap' },
];

const PAGE_SIZE = 6;

const ConfessionFeed = ({ user, refreshKey }) => {
  const [sort, setSort] = useState('latest');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [page, setPage] = useState(1);

  const allConfessions = getConfessions({ sort, severityFilter });
  const visible = allConfessions.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < allConfessions.length;

  return (
    <div id="paap-register">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2
          className="font-ui font-900 text-xl sm:text-2xl text-black uppercase tracking-widest border-b-4 border-[#F5C400] pb-1"
          style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
        >
          LATEST PAAP
        </h2>

        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="font-ui text-xs font-600 border-2 border-black px-3 py-2 bg-white cursor-pointer uppercase tracking-widest"
          style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Severity filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {SEVERITY_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setSeverityFilter(f.value); setPage(1); }}
            className={`font-ui text-xs font-600 px-3 py-1.5 border-2 cursor-pointer transition-all ${
              severityFilter === f.value
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-600'
            }`}
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {visible.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300">
            <div className="text-4xl mb-3">😶</div>
            <p className="font-ui text-gray-500 text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Is category mein koi paap nahi mila. Tumhara paap likho!
            </p>
          </div>
        ) : (
          visible.map((confession, i) => (
            <ConfessionCard
              key={`${confession.id}-${refreshKey}`}
              confession={confession}
              user={user}
              index={i}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="font-ui font-700 text-sm tracking-widest uppercase border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-2 mx-auto"
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
          >
            LOAD MORE PAAP
            <span className="animate-pulse">○</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfessionFeed;

