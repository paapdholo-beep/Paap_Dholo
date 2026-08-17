import React, { useState } from 'react';
import { reportConfession } from '../services/confessionService.js';
import {
  buildScrapEdgePath,
  SCRAP_SHADOW,
  PAPER_GRAIN_URI,
} from '../utils/TornPaperScrap.js';

const REPORT_REASONS = [
  { id: 'doxxing', label: '📞 Doxxing / Real Phone / Personal Identity' },
  { id: 'hate', label: '🤬 Communal Hate Speech / Violent Abuse' },
  { id: 'illegal', label: '⚖️ Severe Cyber Crime / Extortion / Threats' },
  { id: 'harassment', label: '🚫 Target Harassment / Non-Consensual Defamation' },
  { id: 'spam', label: '🗑️ Scam / Commercial Promotion' },
];

const ReportDialog = ({ isOpen, onClose, confession, user, onReportSuccess }) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0].label);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);

  const clipPathD = React.useMemo(
    () => buildScrapEdgePath(10, { top: 40, right: 40, bottom: 40, left: 40 }),
    []
  );

  if (!isOpen || !confession) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const res = reportConfession({
      confessionId: confession.id,
      userUid: user?.uid || user?.id,
      reason: selectedReason,
      customDetails: details,
    });

    setSubmitting(false);

    if (res.success) {
      setResultMessage({
        type: 'success',
        text: '🚩 Report submitted. Confession flagged for moderator inspection.',
      });
      if (onReportSuccess) onReportSuccess(confession.id);
      setTimeout(() => {
        setResultMessage(null);
        onClose();
      }, 1400);
    } else {
      setResultMessage({
        type: 'error',
        text: res.error || 'Unable to submit report.',
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
        <defs>
          <clipPath id="report-dialog-clip" clipPathUnits="objectBoundingBox">
            <path d={clipPathD} />
          </clipPath>
        </defs>
      </svg>

      <div
        className="w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-150"
        style={{
          filter: SCRAP_SHADOW,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          className="w-full text-black flex flex-col"
          style={{
            clipPath: 'url(#report-dialog-clip)',
            backgroundColor: '#FFFDF7',
            backgroundImage: `url("${PAPER_GRAIN_URI}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '180px 180px',
            maxHeight: '90vh',
          }}
        >
          {/* Header */}
          <div className="bg-[#F43F5E] px-6 py-4 border-b-2 border-black flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚩</span>
              <div>
                <h2
                  className="font-ui font-900 text-lg sm:text-xl text-white uppercase tracking-widest leading-none"
                  style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
                >
                  REPORT PAAP
                </h2>
                <span
                  className="font-ui text-[10px] text-pink-100 uppercase tracking-widest font-700"
                  style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
                >
                  Indian Cyber Law & Safety Violation
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white hover:bg-black hover:text-white font-ui font-900 text-sm shadow-[2px_2px_0_#111] transition-all cursor-pointer"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-left">
            <div className="p-3 bg-[#F5EEDF] border-2 border-dashed border-gray-400 rounded-sm">
              <span className="font-ui text-[10px] font-700 uppercase tracking-widest text-gray-500 block mb-1">
                FLAGGED PAAP #{confession.id}:
              </span>
              <p
                className="font-handwrite text-sm text-black line-clamp-2"
                style={{ fontFamily: "'Kalam', cursive, sans-serif" }}
              >
                "{confession.text}"
              </p>
            </div>

            {/* Radio Reasons */}
            <div>
              <label
                className="block font-ui font-800 text-xs text-gray-800 uppercase tracking-wider mb-2"
                style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}
              >
                Why are you reporting this confession?
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-center gap-2.5 p-2.5 border-2 cursor-pointer transition-all ${
                      selectedReason === r.label
                        ? 'border-black bg-[#FFF9E0] shadow-[2px_2px_0_#111]'
                        : 'border-gray-300 bg-white hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.label}
                      checked={selectedReason === r.label}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="accent-[#F43F5E]"
                    />
                    <span
                      className="font-ui text-xs font-700 text-gray-900"
                      style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
                    >
                      {r.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional text details */}
            <div>
              <label
                className="block font-ui font-800 text-xs text-gray-800 uppercase tracking-wider mb-1"
                style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}
              >
                Additional Details (Optional):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Mention specific timestamps, phone numbers, or context..."
                rows={2}
                maxLength={200}
                className="w-full p-2.5 text-xs font-ui border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#F43F5E]"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              />
            </div>

            {/* Feedback alert */}
            {resultMessage && (
              <div
                className={`p-3 text-xs font-ui font-700 border-2 ${
                  resultMessage.type === 'success'
                    ? 'bg-green-100 text-green-900 border-green-800'
                    : 'bg-red-100 text-red-900 border-red-800'
                }`}
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                {resultMessage.text}
              </div>
            )}

            {/* Submit / Cancel buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="font-ui font-700 text-xs tracking-wider uppercase border-2 border-gray-400 bg-white px-4 py-2 hover:bg-gray-100 cursor-pointer"
                style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="font-ui font-900 text-xs tracking-wider uppercase border-2 border-black bg-[#F43F5E] text-white px-5 py-2 hover:bg-black shadow-[2px_2px_0_#111] transition-all cursor-pointer disabled:opacity-50"
                style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
              >
                {submitting ? 'Submitting...' : 'Submit Report 🚩'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportDialog;
