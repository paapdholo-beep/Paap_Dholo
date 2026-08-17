import React, { useState, useEffect } from 'react';
import Avatar from './components/Avatar.jsx';
import { timeAgo, getSeverityInfo } from './utils/formatters.js';
import {
  getAllConfessions,
  getReportedConfessions,
  getAllComments,
  getBannedUsers,
  banUser,
  unbanUser,
  deleteConfession,
  dismissReports,
  deleteComment,
  initAdminFirestoreSync,
} from './services/adminService.js';

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || 'admin123';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('paap_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState('reported'); // 'reported' | 'comments' | 'all' | 'banned'
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [confessions, setConfessions] = useState([]);
  const [reportedList, setReportedList] = useState([]);
  const [comments, setComments] = useState([]);
  const [bannedList, setBannedList] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

  const loadData = () => {
    setConfessions(getAllConfessions());
    setReportedList(getReportedConfessions());
    setComments(getAllComments());
    setBannedList(getBannedUsers());
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      initAdminFirestoreSync(loadData);
    }
  }, [isAuthenticated]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      sessionStorage.setItem('paap_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('paap_admin_auth');
    setIsAuthenticated(false);
  };

  const handleDeleteConfession = (id) => {
    if (window.confirm('Delete this confession permanently?')) {
      deleteConfession(id);
      loadData();
      showToast('🗑️ Confession permanently deleted.');
    }
  };

  const handleDismissReports = (id) => {
    dismissReports(id);
    loadData();
    showToast('✅ Reports dismissed & confession restored.');
  };

  const handleBanUser = ({ uid, ip, reason }) => {
    const banReason = reason || prompt('Enter ban reason:', 'Repeated violations of IT Act & Community Guidelines');
    if (banReason) {
      banUser({ uid, ip, reason: banReason });
      loadData();
      showToast(`🚫 User banned (UID: ${uid || 'N/A'}, IP: ${ip || 'N/A'})`);
    }
  };

  const handleUnban = ({ uid, ip }) => {
    unbanUser({ uid, ip });
    loadData();
    showToast('🔓 User unbanned.');
  };

  const handleDeleteComment = ({ confessionId, commentId }) => {
    if (window.confirm('Delete this comment permanently?')) {
      deleteComment({ confessionId, commentId });
      loadData();
      showToast('🗑️ Comment deleted.');
    }
  };

  // ─────────────────────────────────────────────
  //  1. PIN Authentication Gate (Desi Brutalist Slip)
  // ─────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5EEDF] flex items-center justify-center p-4">
        <div
          className="bg-[#FFFDF7] border-3 border-black p-6 sm:p-8 max-w-md w-full shadow-[6px_6px_0_#111] relative"
          style={{ transform: 'rotate(-0.5deg)' }}
        >
          {/* Header Receipt Tag */}
          <div className="border-b-2 border-dashed border-black pb-4 mb-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img src="/Paap_Dholo_logo_black.webp" alt="logo" className="h-8 object-contain" />
            </div>
            <div
              className="font-ui font-900 text-lg sm:text-xl text-black uppercase tracking-wider"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
            >
              MODERATION DESK
            </div>
            <div className="font-ui text-[10px] text-gray-600 tracking-widest uppercase font-700">
              Grievance & Legal Compliance Cell
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                className="block text-xs font-ui font-800 text-black uppercase tracking-widest mb-1.5"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                ENTER ADMIN ACCESS PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FFF9E0] border-2 border-black px-4 py-3 text-black text-center tracking-widest text-lg font-mono font-bold shadow-[2px_2px_0_#111] outline-none"
                autoFocus
              />
              {pinError && (
                <div className="mt-2 p-2 bg-red-100 border border-red-500 text-red-700 text-xs font-ui font-bold text-center">
                  ⚠️ Galat PIN! Kripya sahi access code darj karein.
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-black hover:bg-[#F43F5E] text-[#F5C400] hover:text-white border-2 border-black font-ui font-900 text-xs uppercase tracking-widest shadow-[3px_3px_0_#111] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
            >
              <span>⚖️</span>
              <span>ENTER REGULATION DESK</span>
            </button>
          </form>

          <div className="mt-5 pt-3 border-t border-dashed border-gray-300 text-center">
            <span className="font-ui text-[10px] text-gray-500 font-600 uppercase tracking-wider">
              AUTHORISED PERSONS ONLY • IT ACT 2000 SEC 79
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  //  2. Filter queries
  // ─────────────────────────────────────────────
  const filteredConfessions = confessions.filter((c) =>
    c.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.authorUid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.authorIp?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComments = comments.filter((r) =>
    r.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.authorUid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.authorIp?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5EEDF] text-[#111111] pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111] text-[#F5C400] border-2 border-black px-4 py-3 shadow-[4px_4px_0_#F43F5E] font-ui font-800 text-xs tracking-wider uppercase animate-pop flex items-center gap-2">
          <span>⚡</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── Navbar ── */}
      <header className="bg-[#FFFDF7] border-b-3 border-black sticky top-0 z-40 shadow-[0_3px_0_#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <img src="/Paap_Dholo_logo_black.webp" alt="logo" className="h-8 sm:h-9 object-contain" />
            <div>
              <div
                className="font-ui font-900 text-sm sm:text-base text-black tracking-widest uppercase flex items-center gap-2"
                style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
              >
                PAAP DHOLO
                <span className="bg-[#F43F5E] text-white text-[9px] font-bold px-1.5 py-0.5 border border-black shadow-[1px_1px_0_#111]">
                  ADMIN
                </span>
              </div>
              <div className="font-ui text-[10px] text-gray-600 font-600 tracking-wider">
                IT Act 2000 & Community Moderation Console
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="font-ui font-700 text-xs bg-[#FFF9E0] hover:bg-[#F5C400] text-black border-2 border-black px-3 py-1.5 shadow-[2px_2px_0_#111] transition-all"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
            >
              ↗ Open Client Site
            </a>
            <button
              onClick={handleLogout}
              className="font-ui font-700 text-xs bg-black hover:bg-[#F43F5E] text-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0_#111] transition-all cursor-pointer"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
            >
              LOGOUT 🔒
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#FFFDF7] border-2 border-black p-4 shadow-[3px_3px_0_#111]">
            <div className="font-ui text-[10px] font-800 uppercase tracking-widest text-gray-500">
              TOTAL CONFESSIONS
            </div>
            <div
              className="font-ui font-900 text-2xl sm:text-3xl text-black mt-1"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
            >
              {confessions.length}
            </div>
          </div>

          <div className="bg-[#FFF9E0] border-2 border-black p-4 shadow-[3px_3px_0_#111] relative">
            <div className="font-ui text-[10px] font-800 uppercase tracking-widest text-[#F43F5E] flex items-center justify-between">
              <span>REPORTED QUEUE 🚩</span>
              {reportedList.length > 0 && (
                <span className="bg-[#F43F5E] text-white text-[8px] font-900 px-1 py-0.2 uppercase animate-pulse">
                  ALERT
                </span>
              )}
            </div>
            <div
              className="font-ui font-900 text-2xl sm:text-3xl text-[#F43F5E] mt-1"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
            >
              {reportedList.length}
            </div>
          </div>

          <div className="bg-[#FFFDF7] border-2 border-black p-4 shadow-[3px_3px_0_#111]">
            <div className="font-ui text-[10px] font-800 uppercase tracking-widest text-gray-500">
              TOTAL COMMENTS
            </div>
            <div
              className="font-ui font-900 text-2xl sm:text-3xl text-black mt-1"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
            >
              {comments.length}
            </div>
          </div>

          <div className="bg-[#FFFDF7] border-2 border-black p-4 shadow-[3px_3px_0_#111]">
            <div className="font-ui text-[10px] font-800 uppercase tracking-widest text-orange-600">
              BANNED USERS & IPS
            </div>
            <div
              className="font-ui font-900 text-2xl sm:text-3xl text-orange-600 mt-1"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
            >
              {bannedList.length}
            </div>
          </div>
        </div>

        {/* Tab Selection + Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('reported')}
              className={`px-3.5 sm:px-4 py-2 border-2 border-black font-ui text-xs font-800 tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'reported'
                  ? 'bg-[#F43F5E] text-white shadow-[3px_3px_0_#111]'
                  : 'bg-[#FFFDF7] text-gray-700 hover:bg-white'
              }`}
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}
            >
              🚨 Reported ({reportedList.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-3.5 sm:px-4 py-2 border-2 border-black font-ui text-xs font-800 tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'comments'
                  ? 'bg-[#F5C400] text-black shadow-[3px_3px_0_#111]'
                  : 'bg-[#FFFDF7] text-gray-700 hover:bg-white'
              }`}
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}
            >
              💬 Comments ({comments.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 sm:px-4 py-2 border-2 border-black font-ui text-xs font-800 tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-black text-white shadow-[3px_3px_0_#111]'
                  : 'bg-[#FFFDF7] text-gray-700 hover:bg-white'
              }`}
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}
            >
              📜 All Confessions ({confessions.length})
            </button>
            <button
              onClick={() => setActiveTab('banned')}
              className={`px-3.5 sm:px-4 py-2 border-2 border-black font-ui text-xs font-800 tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'banned'
                  ? 'bg-orange-500 text-white shadow-[3px_3px_0_#111]'
                  : 'bg-[#FFFDF7] text-gray-700 hover:bg-white'
              }`}
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}
            >
              🚫 Banned Users ({bannedList.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search text, UID or IP..."
              className="w-full lg:w-72 bg-[#FFFDF7] border-2 border-black px-3.5 py-2 text-xs font-ui font-600 text-black shadow-[2px_2px_0_#111] placeholder-gray-500 outline-none"
              style={{ fontFamily: 'Plus Jakarta Sans' }}
            />
          </div>
        </div>

        {/* ── TAB 1: Reported Confessions ── */}
        {activeTab === 'reported' && (
          <div className="space-y-4">
            {reportedList.length === 0 ? (
              <div className="bg-[#FFFDF7] border-2 border-black p-12 text-center shadow-[3px_3px_0_#111]">
                <div className="text-4xl mb-2">🎉</div>
                <div className="font-ui font-900 text-base text-black uppercase tracking-wider">
                  No Reported Confessions
                </div>
                <p className="font-ui text-xs text-gray-500 mt-1">
                  All user reports have been cleared or resolved.
                </p>
              </div>
            ) : (
              reportedList.map((c) => {
                const severityInfo = getSeverityInfo(c.severity);
                return (
                  <div
                    key={c.id}
                    className="bg-[#FFFDF7] border-2 border-black p-5 shadow-[4px_4px_0_#F43F5E] space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar avatarId={c.avatarId} size="sm" />
                        <div>
                          <div className="font-ui font-800 text-sm text-black">
                            {c.displayName}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] bg-gray-100 border border-black/30 px-1.5 py-0.5 text-gray-800">
                              UID: {c.authorUid || 'anon_uid'}
                            </span>
                            <span className="font-mono text-[10px] bg-amber-100 border border-amber-400 px-1.5 py-0.5 text-amber-900 font-bold">
                              IP: {c.authorIp || '127.0.0.1'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-[#F43F5E] text-white text-[10px] font-ui font-900 px-2 py-0.5 border border-black uppercase tracking-wider">
                          🚩 {c.reportsCount} User Reports
                        </span>
                        <span className={`text-[10px] font-ui font-700 px-2 py-0.5 ${severityInfo.cls}`}>
                          {severityInfo.shortLabel}
                        </span>
                      </div>
                    </div>

                    {/* Confession Text in Kalam */}
                    <div
                      className="bg-[#FFF9E0] p-4 border border-[#F5C400] text-gray-900 font-handwrite text-lg leading-snug"
                      style={{ fontFamily: "'Kalam', cursive, sans-serif" }}
                    >
                      "{c.text}"
                    </div>

                    {/* Reasons Submitted */}
                    {c.reportReasons?.length > 0 && (
                      <div className="bg-red-50 border border-red-300 p-3 text-xs">
                        <div className="font-ui font-800 text-red-700 uppercase text-[10px] tracking-wider mb-1.5">
                          Reports Filed by Community:
                        </div>
                        <div className="space-y-1">
                          {c.reportReasons.map((r, idx) => (
                            <div key={idx} className="text-gray-800 flex items-center justify-between text-xs font-ui">
                              <span className="font-600">• {r.reason}</span>
                              <span className="text-gray-500 font-mono text-[10px]">
                                Reporter IP: {r.reporterIp || '127.0.0.1'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-dashed border-gray-300">
                      <button
                        onClick={() => handleDismissReports(c.id)}
                        className="px-3 py-1.5 bg-white hover:bg-emerald-600 hover:text-white text-black border-2 border-black font-ui font-700 text-xs shadow-[2px_2px_0_#111] transition-all cursor-pointer"
                        style={{ fontFamily: 'Plus Jakarta Sans' }}
                      >
                        ✅ Dismiss Reports
                      </button>
                      <button
                        onClick={() => handleBanUser({ uid: c.authorUid, ip: c.authorIp })}
                        className="px-3 py-1.5 bg-orange-100 hover:bg-orange-500 hover:text-white text-orange-900 border-2 border-black font-ui font-800 text-xs shadow-[2px_2px_0_#111] transition-all cursor-pointer"
                        style={{ fontFamily: 'Plus Jakarta Sans' }}
                      >
                        🚫 Ban Author (UID & IP)
                      </button>
                      <button
                        onClick={() => handleDeleteConfession(c.id)}
                        className="px-3 py-1.5 bg-black hover:bg-[#F43F5E] text-white border-2 border-black font-ui font-800 text-xs shadow-[2px_2px_0_#111] transition-all cursor-pointer"
                        style={{ fontFamily: 'Plus Jakarta Sans' }}
                      >
                        🗑️ Delete Confession
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── TAB 2: Comments Regulation ── */}
        {activeTab === 'comments' && (
          <div className="space-y-3">
            {filteredComments.length === 0 ? (
              <div className="bg-[#FFFDF7] border-2 border-black p-12 text-center text-gray-500 shadow-[3px_3px_0_#111]">
                No comments found.
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-[#FFFDF7] border-2 border-black p-4 shadow-[3px_3px_0_#111] flex flex-col md:flex-row items-start justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Avatar avatarId={comment.avatarId} size="xs" />
                      <span className="font-ui font-800 text-xs text-black">{comment.displayName}</span>
                      <span className="font-mono text-[10px] bg-gray-100 border border-black/30 px-1.5 py-0.5 text-gray-700">
                        UID: {comment.authorUid || 'anon_uid'}
                      </span>
                      <span className="font-mono text-[10px] bg-amber-100 border border-amber-400 px-1.5 py-0.5 text-amber-900 font-bold">
                        IP: {comment.authorIp || '127.0.0.1'}
                      </span>
                      <span className="text-[10px] text-gray-500 font-ui">
                        on "{comment.confessionText?.slice(0, 35)}..."
                      </span>
                    </div>
                    <div
                      className="text-gray-900 text-base font-handwrite"
                      style={{ fontFamily: "'Kalam', cursive, sans-serif" }}
                    >
                      "{comment.text}"
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleBanUser({ uid: comment.authorUid, ip: comment.authorIp })}
                      className="px-2.5 py-1.5 bg-orange-100 hover:bg-orange-500 hover:text-white text-orange-900 border-2 border-black font-ui font-800 text-xs shadow-[2px_2px_0_#111] transition-all cursor-pointer"
                    >
                      🚫 Ban Commenter
                    </button>
                    <button
                      onClick={() => handleDeleteComment({ confessionId: comment.confessionId, commentId: comment.id })}
                      className="px-2.5 py-1.5 bg-black hover:bg-[#F43F5E] text-white border-2 border-black font-ui font-800 text-xs shadow-[2px_2px_0_#111] transition-all cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TAB 3: All Confessions ── */}
        {activeTab === 'all' && (
          <div className="space-y-3">
            {filteredConfessions.map((c) => {
              const severityInfo = getSeverityInfo(c.severity);
              return (
                <div
                  key={c.id}
                  className="bg-[#FFFDF7] border-2 border-black p-4 shadow-[3px_3px_0_#111] flex flex-col md:flex-row items-start justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Avatar avatarId={c.avatarId} size="xs" />
                      <span className="font-ui font-800 text-xs text-black">{c.displayName}</span>
                      <span className="font-mono text-[10px] bg-gray-100 border border-black/30 px-1.5 py-0.5 text-gray-700">
                        UID: {c.authorUid || 'anon_uid'}
                      </span>
                      <span className="font-mono text-[10px] bg-amber-100 border border-amber-400 px-1.5 py-0.5 text-amber-900 font-bold">
                        IP: {c.authorIp || '127.0.0.1'}
                      </span>
                      <span className={`text-[10px] font-ui font-700 px-1.5 py-0.5 ${severityInfo.cls}`}>
                        {severityInfo.shortLabel}
                      </span>
                      {c.reportsCount > 0 && (
                        <span className="bg-[#F43F5E] text-white text-[9px] font-ui font-900 px-1.5 py-0.5 border border-black">
                          🚩 {c.reportsCount} Reports
                        </span>
                      )}
                    </div>
                    <div
                      className="text-gray-900 text-base font-handwrite"
                      style={{ fontFamily: "'Kalam', cursive, sans-serif" }}
                    >
                      "{c.text}"
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleBanUser({ uid: c.authorUid, ip: c.authorIp })}
                      className="px-2.5 py-1.5 bg-orange-100 hover:bg-orange-500 hover:text-white text-orange-900 border-2 border-black font-ui font-800 text-xs shadow-[2px_2px_0_#111] transition-all cursor-pointer"
                    >
                      🚫 Ban Author
                    </button>
                    <button
                      onClick={() => handleDeleteConfession(c.id)}
                      className="px-2.5 py-1.5 bg-black hover:bg-[#F43F5E] text-white border-2 border-black font-ui font-800 text-xs shadow-[2px_2px_0_#111] transition-all cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB 4: Banned Users ── */}
        {activeTab === 'banned' && (
          <div className="space-y-3">
            {bannedList.length === 0 ? (
              <div className="bg-[#FFFDF7] border-2 border-black p-12 text-center text-gray-500 shadow-[3px_3px_0_#111]">
                No users or IP addresses are currently banned.
              </div>
            ) : (
              bannedList.map((b, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFFDF7] border-2 border-black p-4 shadow-[3px_3px_0_#F97316] flex items-center justify-between flex-wrap gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold bg-gray-900 text-white px-2 py-0.5">
                        UID: {b.uid}
                      </span>
                      <span className="font-mono text-xs font-bold bg-red-600 text-white px-2 py-0.5">
                        IP: {b.ip}
                      </span>
                    </div>
                    <div className="text-xs font-ui text-gray-700 mt-1">
                      Reason: <span className="font-700 text-black">{b.reason}</span> • Banned on: {new Date(b.bannedAt).toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnban({ uid: b.uid, ip: b.ip })}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-600 hover:text-white text-black border-2 border-black font-ui font-800 text-xs shadow-[2px_2px_0_#111] transition-all cursor-pointer"
                  >
                    🔓 Unban User
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
