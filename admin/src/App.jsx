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

  const [activeTab, setActiveTab] = useState('reported'); // 'reported' | 'all' | 'comments' | 'banned'
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all'); // 'all' | 'minor' | 'medium' | 'bada' | 'maha'
  const [reportFilter, setReportFilter] = useState('all'); // 'all' | 'reported' | 'clean'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'reports' | 'reactions'

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
  //  2. Filter & Sort Logic
  // ─────────────────────────────────────────────
  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      if (sortBy === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
      if (sortBy === 'oldest') return (a.createdAt || 0) - (b.createdAt || 0);
      if (sortBy === 'reports') return (b.reportsCount || 0) - (a.reportsCount || 0);
      if (sortBy === 'reactions') {
        const totalReactionsA = Object.values(a.reactions || {}).reduce((s, v) => s + (v || 0), 0);
        const totalReactionsB = Object.values(b.reactions || {}).reduce((s, v) => s + (v || 0), 0);
        return totalReactionsB - totalReactionsA;
      }
      return 0;
    });
  };

  const matchesSearch = (item, fields = []) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return fields.some((field) => (field ? String(field).toLowerCase().includes(q) : false));
  };

  // Filtered Reported Confessions
  const filteredReported = sortItems(
    reportedList.filter((c) => {
      const matchText = matchesSearch(c, [
        c.text,
        c.displayName,
        c.authorUid,
        c.authorIp,
        ...(c.reportReasons?.map((r) => r.reason) || []),
      ]);
      const matchSeverity = severityFilter === 'all' || c.severity === severityFilter;
      return matchText && matchSeverity;
    })
  );

  // Filtered All Confessions
  const filteredConfessions = sortItems(
    confessions.filter((c) => {
      const matchText = matchesSearch(c, [c.text, c.displayName, c.authorUid, c.authorIp]);
      const matchSeverity = severityFilter === 'all' || c.severity === severityFilter;
      const matchReportStatus =
        reportFilter === 'all' ||
        (reportFilter === 'reported' && (c.reportsCount || 0) > 0) ||
        (reportFilter === 'clean' && (!c.reportsCount || c.reportsCount === 0));
      return matchText && matchSeverity && matchReportStatus;
    })
  );

  // Filtered Comments
  const filteredComments = sortItems(
    comments.filter((r) => {
      return matchesSearch(r, [
        r.text,
        r.displayName,
        r.authorUid,
        r.authorIp,
        r.confessionText,
        r.parentDisplayName,
      ]);
    })
  );

  // Filtered Banned Users
  const filteredBanned = bannedList.filter((b) => {
    return matchesSearch(b, [b.uid, b.ip, b.reason]);
  });

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    severityFilter !== 'all' ||
    reportFilter !== 'all' ||
    sortBy !== 'newest';

  const resetFilters = () => {
    setSearchQuery('');
    setSeverityFilter('all');
    setReportFilter('all');
    setSortBy('newest');
  };

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
        {/* Metric Cards Row (Sequence: Reported -> All Confessions -> Comments -> Banned) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => setActiveTab('reported')}
            className={`cursor-pointer transition-all border-2 border-black p-4 shadow-[3px_3px_0_#111] relative ${
              activeTab === 'reported' ? 'bg-[#FFEBEF] ring-2 ring-[#F43F5E]' : 'bg-[#FFF9E0] hover:bg-[#FFF4C8]'
            }`}
          >
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

          <div
            onClick={() => setActiveTab('all')}
            className={`cursor-pointer transition-all border-2 border-black p-4 shadow-[3px_3px_0_#111] ${
              activeTab === 'all' ? 'bg-[#FFF5D6] ring-2 ring-black' : 'bg-[#FFFDF7] hover:bg-white'
            }`}
          >
            <div className="font-ui text-[10px] font-800 uppercase tracking-widest text-gray-600 flex items-center justify-between">
              <span>ALL CONFESSIONS 📜</span>
            </div>
            <div
              className="font-ui font-900 text-2xl sm:text-3xl text-black mt-1"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
            >
              {confessions.length}
            </div>
          </div>

          <div
            onClick={() => setActiveTab('comments')}
            className={`cursor-pointer transition-all border-2 border-black p-4 shadow-[3px_3px_0_#111] ${
              activeTab === 'comments' ? 'bg-[#FFF8CC] ring-2 ring-[#F5C400]' : 'bg-[#FFFDF7] hover:bg-white'
            }`}
          >
            <div className="font-ui text-[10px] font-800 uppercase tracking-widest text-gray-600 flex items-center justify-between">
              <span>TOTAL COMMENTS 💬</span>
            </div>
            <div
              className="font-ui font-900 text-2xl sm:text-3xl text-black mt-1"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
            >
              {comments.length}
            </div>
          </div>

          <div
            onClick={() => setActiveTab('banned')}
            className={`cursor-pointer transition-all border-2 border-black p-4 shadow-[3px_3px_0_#111] ${
              activeTab === 'banned' ? 'bg-[#FFEDD5] ring-2 ring-orange-500' : 'bg-[#FFFDF7] hover:bg-white'
            }`}
          >
            <div className="font-ui text-[10px] font-800 uppercase tracking-widest text-orange-600 flex items-center justify-between">
              <span>BANNED USERS 🚫</span>
            </div>
            <div
              className="font-ui font-900 text-2xl sm:text-3xl text-orange-600 mt-1"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
            >
              {bannedList.length}
            </div>
          </div>
        </div>

        {/* ── Tabs (Sequence: 1. Reported -> 2. All Confessions -> 3. Comments -> 4. Banned) ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 border-b-2 border-dashed border-black/30">
          {/* 1. REPORTED */}
          <button
            onClick={() => setActiveTab('reported')}
            className={`px-3.5 sm:px-4 py-2 border-2 border-black font-ui text-xs font-800 tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reported'
                ? 'bg-[#F43F5E] text-white shadow-[3px_3px_0_#111]'
                : 'bg-[#FFFDF7] text-gray-700 hover:bg-white'
            }`}
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}
          >
            <span>🚨</span>
            <span>REPORTED ({reportedList.length})</span>
          </button>

          {/* 2. ALL CONFESSIONS */}
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 sm:px-4 py-2 border-2 border-black font-ui text-xs font-800 tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-black text-white shadow-[3px_3px_0_#111]'
                : 'bg-[#FFFDF7] text-gray-700 hover:bg-white'
            }`}
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}
          >
            <span>📜</span>
            <span>ALL CONFESSIONS ({confessions.length})</span>
          </button>

          {/* 3. COMMENTS */}
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-3.5 sm:px-4 py-2 border-2 border-black font-ui text-xs font-800 tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'comments'
                ? 'bg-[#F5C400] text-black shadow-[3px_3px_0_#111]'
                : 'bg-[#FFFDF7] text-gray-700 hover:bg-white'
            }`}
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}
          >
            <span>💬</span>
            <span>COMMENTS ({comments.length})</span>
          </button>

          {/* 4. BANNED USERS */}
          <button
            onClick={() => setActiveTab('banned')}
            className={`px-3.5 sm:px-4 py-2 border-2 border-black font-ui text-xs font-800 tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'banned'
                ? 'bg-orange-500 text-white shadow-[3px_3px_0_#111]'
                : 'bg-[#FFFDF7] text-gray-700 hover:bg-white'
            }`}
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}
          >
            <span>🚫</span>
            <span>BANNED USERS ({bannedList.length})</span>
          </button>
        </div>

        {/* ── Search & Easy Filter Control Bar ── */}
        <div className="bg-[#FFFDF7] border-2 border-black p-3.5 shadow-[3px_3px_0_#111] mb-6 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input with quick clear */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search confession text, commenter name, UID, IP, or reason..."
                className="w-full bg-[#FFF9E0] border-2 border-black pl-8 pr-8 py-2 text-xs font-ui font-600 text-black shadow-[1px_1px_0_#111] placeholder-gray-500 outline-none focus:bg-white transition-colors"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black font-bold text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Severity Filter (visible on Reported and All Confessions tabs) */}
              {(activeTab === 'all' || activeTab === 'reported') && (
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="bg-white border-2 border-black px-2.5 py-2 text-xs font-ui font-700 text-black shadow-[1px_1px_0_#111] outline-none cursor-pointer"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  <option value="all">⚡ All Severities</option>
                  <option value="minor">🟡 Minor Paap</option>
                  <option value="medium">🟠 Medium Paap</option>
                  <option value="bada">🔴 Bada Paap</option>
                  <option value="maha">💀 Mahapaap</option>
                </select>
              )}

              {/* Report Status Filter (visible on All Confessions tab) */}
              {activeTab === 'all' && (
                <select
                  value={reportFilter}
                  onChange={(e) => setReportFilter(e.target.value)}
                  className="bg-white border-2 border-black px-2.5 py-2 text-xs font-ui font-700 text-black shadow-[1px_1px_0_#111] outline-none cursor-pointer"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  <option value="all">📑 All Status</option>
                  <option value="reported">🚩 Reported Only</option>
                  <option value="clean">✅ Clean Only</option>
                </select>
              )}

              {/* Sort Order */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border-2 border-black px-2.5 py-2 text-xs font-ui font-700 text-black shadow-[1px_1px_0_#111] outline-none cursor-pointer"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                <option value="newest">🕒 Newest First</option>
                <option value="oldest">⏳ Oldest First</option>
                <option value="reports">🚩 Most Reports</option>
                <option value="reactions">🔥 Most Reactions</option>
              </select>

              {/* Reset Filters button if any active */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="bg-[#F43F5E] hover:bg-black text-white border-2 border-black px-3 py-2 text-xs font-ui font-800 shadow-[1px_1px_0_#111] transition-all cursor-pointer whitespace-nowrap"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  Reset ✕
                </button>
              )}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-[11px] font-ui font-700 text-gray-600 pt-1 border-t border-dashed border-gray-200">
            <div>
              {activeTab === 'reported' && (
                <span>Showing <strong className="text-black">{filteredReported.length}</strong> of {reportedList.length} reported confessions</span>
              )}
              {activeTab === 'all' && (
                <span>Showing <strong className="text-black">{filteredConfessions.length}</strong> of {confessions.length} confessions</span>
              )}
              {activeTab === 'comments' && (
                <span>Showing <strong className="text-black">{filteredComments.length}</strong> of {comments.length} comments</span>
              )}
              {activeTab === 'banned' && (
                <span>Showing <strong className="text-black">{filteredBanned.length}</strong> of {bannedList.length} banned entries</span>
              )}
            </div>
            {hasActiveFilters && (
              <span className="text-[#F43F5E] text-[10px] uppercase font-800">
                ● Filters Active
              </span>
            )}
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* ── TAB 1: REPORTED CONFESSIONS (First in sequence) ── */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === 'reported' && (
          <div className="space-y-4">
            {filteredReported.length === 0 ? (
              <div className="bg-[#FFFDF7] border-2 border-black p-12 text-center shadow-[3px_3px_0_#111]">
                <div className="text-4xl mb-2">{hasActiveFilters ? '🔍' : '🎉'}</div>
                <div className="font-ui font-900 text-base text-black uppercase tracking-wider">
                  {hasActiveFilters ? 'No Matching Reported Confessions' : 'No Reported Confessions'}
                </div>
                <p className="font-ui text-xs text-gray-500 mt-1">
                  {hasActiveFilters
                    ? 'Try adjusting your search query or severity filter.'
                    : 'All user reports have been cleared or resolved.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-3 px-3 py-1.5 bg-black text-white text-xs font-ui font-700 border-2 border-black cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              filteredReported.map((c) => {
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
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="font-mono text-[10px] bg-gray-100 border border-black/30 px-1.5 py-0.5 text-gray-800">
                              UID: {c.authorUid || 'anon_uid'}
                            </span>
                            <span className="font-mono text-[10px] bg-amber-100 border border-amber-400 px-1.5 py-0.5 text-amber-900 font-bold">
                              IP: {c.authorIp || '127.0.0.1'}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">
                              {timeAgo(c.createdAt || Date.now())}
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
                            <div key={idx} className="text-gray-800 flex items-center justify-between text-xs font-ui flex-wrap gap-1">
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
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-dashed border-gray-300 flex-wrap">
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

        {/* ────────────────────────────────────────────────────────── */}
        {/* ── TAB 2: ALL CONFESSIONS (Second in sequence) ── */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === 'all' && (
          <div className="space-y-3">
            {filteredConfessions.length === 0 ? (
              <div className="bg-[#FFFDF7] border-2 border-black p-12 text-center text-gray-500 shadow-[3px_3px_0_#111]">
                <div className="text-4xl mb-2">🔍</div>
                <div className="font-ui font-900 text-base text-black uppercase tracking-wider">
                  No Confessions Found
                </div>
                <p className="font-ui text-xs text-gray-500 mt-1">
                  Try adjusting your search terms or filter selections.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-3 px-3 py-1.5 bg-black text-white text-xs font-ui font-700 border-2 border-black cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              filteredConfessions.map((c) => {
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
                          <span className="bg-[#F43F5E] text-white text-[9px] font-ui font-900 px-1.5 py-0.5 border border-black animate-pulse">
                            🚩 {c.reportsCount} Reports
                          </span>
                        )}
                        <span className="text-[10px] text-gray-500 font-mono">
                          {timeAgo(c.createdAt || Date.now())}
                        </span>
                      </div>
                      <div
                        className="text-gray-900 text-base font-handwrite"
                        style={{ fontFamily: "'Kalam', cursive, sans-serif" }}
                      >
                        "{c.text}"
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
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
              })
            )}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* ── TAB 3: COMMENTS REGULATION (Third in sequence) ── */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === 'comments' && (
          <div className="space-y-3">
            {filteredComments.length === 0 ? (
              <div className="bg-[#FFFDF7] border-2 border-black p-12 text-center text-gray-500 shadow-[3px_3px_0_#111]">
                <div className="text-4xl mb-2">💬</div>
                <div className="font-ui font-900 text-base text-black uppercase tracking-wider">
                  No Comments Found
                </div>
                <p className="font-ui text-xs text-gray-500 mt-1">
                  {hasActiveFilters ? 'No comments matched your search criteria.' : 'No user comments on confessions yet.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-3 px-3 py-1.5 bg-black text-white text-xs font-ui font-700 border-2 border-black cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
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
                      <span className="text-[10px] text-gray-500 font-mono">
                        {timeAgo(comment.createdAt || Date.now())}
                      </span>
                    </div>
                    <div
                      className="text-gray-900 text-base font-handwrite"
                      style={{ fontFamily: "'Kalam', cursive, sans-serif" }}
                    >
                      "{comment.text}"
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
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

        {/* ────────────────────────────────────────────────────────── */}
        {/* ── TAB 4: BANNED USERS (Fourth in sequence) ── */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === 'banned' && (
          <div className="space-y-3">
            {filteredBanned.length === 0 ? (
              <div className="bg-[#FFFDF7] border-2 border-black p-12 text-center text-gray-500 shadow-[3px_3px_0_#111]">
                <div className="text-4xl mb-2">🚫</div>
                <div className="font-ui font-900 text-base text-black uppercase tracking-wider">
                  {hasActiveFilters ? 'No Matching Banned Users' : 'No Banned Users'}
                </div>
                <p className="font-ui text-xs text-gray-500 mt-1">
                  {hasActiveFilters
                    ? 'No banned entries matched your search query.'
                    : 'No users or IP addresses are currently banned.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-3 px-3 py-1.5 bg-black text-white text-xs font-ui font-700 border-2 border-black cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              filteredBanned.map((b, idx) => (
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
