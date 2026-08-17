import React, { useState } from 'react';
import Avatar from './Avatar.jsx';
import { timeAgo, formatCount, getSeverityInfo } from '../utils/formatters.js';
import {
  addReaction,
  getUserReactions,
  addReply,
  reportConfession,
  reportComment,
  hasUserReportedConfession,
  hasUserReportedComment,
} from '../services/confessionService.js';
import { getUserIp } from '../utils/anonymousUser.js';

const REACTIONS = [
  { key: 'forgive',     emoji: '🙏', label: 'Maaf Kiya' },
  { key: 'funny',       emoji: '😂', label: 'Paap Bhari Comedy' },
  { key: 'shame',       emoji: '😡', label: 'Sharam Kar' },
  { key: 'interesting', emoji: '👀', label: 'Interesting' },
  { key: 'dead',        emoji: '💀', label: 'Bhai Kya Kar' },
];

const CARD_VARIANTS = [
  { bg: '#FFFDF7', border: '#111' },
  { bg: '#FFF9E0', border: '#111' },
  { bg: '#F5EEDF', border: '#111' },
];

const REPORT_REASONS = [
  { key: 'doxxing', label: '📱 Phone number / Personal info / Doxxing' },
  { key: 'hate', label: '⚔️ Communal hate speech / Harassment' },
  { key: 'illegal', label: '⚠️ Threat / Extortion / Illegal activity' },
  { key: 'other', label: '🛑 Severe Community guideline violation' },
];

const ReplySection = ({ confession, user, onReplyAdded }) => {
  const [replyText, setReplyText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [reportedReplies, setReportedReplies] = useState({});

  const isReplyReported = (replyId) => {
    if (reportedReplies[replyId]) return true;
    return hasUserReportedComment({ replyId, userId: user.uid || user.id });
  };

  const handleReportCommentSubmit = async (reply) => {
    if (isReplyReported(reply.id)) {
      alert('Aap pehle hi is comment ko report kar chuke hain.');
      return;
    }
    const reason = prompt('Reason for reporting comment (optional):', 'Inappropriate or abusive content') || 'Inappropriate or abusive content';
    const ip = await getUserIp();
    const res = reportComment({
      confessionId: confession.id,
      replyId: reply.id,
      reason,
      reporterUid: user.uid || user.id,
      reporterIp: ip,
    });
    if (res?.alreadyReported) {
      alert('Aap pehle hi is comment ko report kar chuke hain.');
    } else {
      setReportedReplies((prev) => ({ ...prev, [reply.id]: true }));
      alert('🚩 Comment reported to moderation.');
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    try {
      const ip = await getUserIp();
      const reply = addReply({
        confessionId: confession.id,
        text: replyText,
        avatarId: user.avatarId,
        displayName: user.displayName,
        authorUid: user.uid || user.id,
        authorIp: ip,
      });
      setReplyText('');
      setErrorMsg('');
      onReplyAdded(reply);
    } catch (err) {
      setErrorMsg(err.message || 'Comment submit nahi ho paya.');
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-dashed border-gray-300 animate-slide-up">
      {errorMsg && (
        <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 text-xs font-ui font-700">
          {errorMsg}
        </div>
      )}
      {confession.replies?.length > 0 && (
        <div className="space-y-2 mb-3">
          {confession.replies.map((reply) => {
            const alreadyReported = isReplyReported(reply.id);
            return (
              <div key={reply.id} className="flex gap-2 items-start group">
                <Avatar avatarId={reply.avatarId} size="xs" />
                <div className="flex-1 bg-[#F5EEDF] px-3 py-2 border border-gray-200 relative">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-ui text-xs font-600 text-gray-700" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>{reply.displayName}</span>
                      <span className="font-ui text-[10px] text-gray-400" style={{ fontFamily: 'Plus Jakarta Sans' }}>{timeAgo(reply.createdAt)}</span>
                    </div>
                    {/* Report comment button */}
                    <button
                      onClick={() => handleReportCommentSubmit(reply)}
                      disabled={alreadyReported}
                      title={alreadyReported ? 'Comment already reported' : 'Report comment'}
                      className={`text-[10px] font-ui transition-colors cursor-pointer px-1 py-0.5 ${
                        alreadyReported
                          ? 'text-red-500 font-bold opacity-80 cursor-default'
                          : 'text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {alreadyReported ? '🚩 Reported' : '🚩 Report'}
                    </button>
                  </div>
                  <div className="font-handwrite text-gray-900" style={{ fontFamily: "'Kalam', cursive, sans-serif", fontSize: 'clamp(0.92rem, 1.02vw, 1.05rem)', lineHeight: 1.4 }}>{reply.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply input */}
      <div className="flex gap-2 items-start">
        <Avatar avatarId={user.avatarId} size="xs" />
        <div className="flex-1 flex gap-2">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
            placeholder="Apni judgement do..."
            className="flex-1 bg-[#F5EEDF] border border-gray-300 px-3 py-2 font-handwrite text-sm text-gray-900 placeholder-gray-500"
            style={{ fontFamily: "'Kalam', cursive, sans-serif", fontSize: '0.95rem' }}
          />
          <button
            onClick={handleSubmitReply}
            disabled={!replyText.trim()}
            className="px-3 py-2 bg-black text-white font-ui text-xs tracking-widest uppercase hover:bg-[#F43F5E] transition-colors disabled:opacity-40 cursor-pointer border-2 border-black"
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
          >
            BHEJO
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfessionCard = ({ confession: initialConfession, user, index, isHighlighted, onClearHighlight }) => {
  const [confession, setConfession] = useState(initialConfession);
  const [userReactions, setUserReactions] = useState(
    () => getUserReactions({ confessionId: initialConfession.id, userId: user.id || user.uid })
  );
  const [showReplies, setShowReplies] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportedState, setReportedState] = useState(() => {
    return hasUserReportedConfession({
      confessionId: initialConfession.id,
      userId: user?.id || user?.uid,
    });
  });
  const [animatingReaction, setAnimatingReaction] = useState(null);

  const severityInfo = getSeverityInfo(confession.severity);
  const variant = CARD_VARIANTS[index % CARD_VARIANTS.length];
  const tilt = index % 3 === 1 ? 'rotate(-0.4deg)' : index % 3 === 2 ? 'rotate(0.3deg)' : 'rotate(0deg)';

  const handleReaction = (reactionKey) => {
    setAnimatingReaction(reactionKey);
    setTimeout(() => setAnimatingReaction(null), 400);

    const result = addReaction({
      confessionId: confession.id,
      reactionType: reactionKey,
      userId: user.id || user.uid,
    });
    setConfession((prev) => ({ ...prev, reactions: result.reactions }));
    setUserReactions((prev) => ({ ...prev, [reactionKey]: result.updated }));
  };

  const handleReplyAdded = (reply) => {
    setConfession((prev) => ({
      ...prev,
      replies: [...(prev.replies || []), reply],
    }));
  };

  const handleReportSubmit = async (reason) => {
    const ip = await getUserIp();
    const res = reportConfession({
      confessionId: confession.id,
      reason,
      reporterUid: user.uid || user.id,
      reporterIp: ip,
    });
    if (res?.alreadyReported) {
      alert('Aap pehle hi is confession ko report kar chuke hain.');
    }
    setReportedState(true);
    setShowReportModal(false);
  };

  const topReply = confession.replies?.[0];

  return (
    <div
      id={`confession-${confession.id}`}
      className={`card-tilt border-2 ${isHighlighted ? 'border-[#F43F5E] ring-2 ring-[#F43F5E]/30' : 'border-black'} p-4 sm:p-5 animate-slide-up transition-all relative`}
      style={{
        backgroundColor: isHighlighted ? '#FFF9E0' : variant.bg,
        transform: tilt,
        boxShadow: isHighlighted ? '4px 4px 0 #F43F5E' : '3px 3px 0 #111',
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Pinned from Karma Court Notice */}
      {isHighlighted && (
        <div className="mb-3 pb-2 border-b border-dashed border-[#F43F5E]/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#F43F5E] font-ui font-800 text-[10.5px] uppercase tracking-wider">
            <span>⚖️</span>
            <span>PINNED FROM KARMA COURT</span>
          </div>
          {onClearHighlight && (
            <button
              onClick={onClearHighlight}
              className="text-[10px] text-gray-500 hover:text-black font-ui font-600 underline cursor-pointer"
            >
              Show Normal Feed
            </button>
          )}
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar avatarId={confession.avatarId} size="md" />
          <div>
            <div className="font-ui font-700 text-sm text-black" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>
              {confession.displayName}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-ui text-[10px] text-gray-500 uppercase tracking-widest" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                {timeAgo(confession.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className="font-ui text-[9px] font-700 text-[#F43F5E] tracking-widest uppercase"
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
          >
            PAAP #{confession.id.replace('paap-', '')}
          </span>
          <span className={`text-[10px] font-ui font-600 px-2 py-0.5 ${severityInfo.cls}`}
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
            {severityInfo.shortLabel}
          </span>
        </div>
      </div>

      {/* Confession Text + Top Judgement */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3 items-start">
        <div
          className="font-handwrite text-gray-900 flex-1"
          style={{ fontFamily: "'Kalam', cursive, sans-serif", fontSize: 'clamp(1.05rem, 1.3vw, 1.3rem)', lineHeight: 1.5, fontWeight: 400 }}
        >
          {confession.text}
        </div>

        {topReply && (
          <div className="bg-[#FFF9E0] border border-[#F5C400] px-3 py-2 sm:w-60 flex-shrink-0 w-full">
            <div className="font-ui text-[9px] sm:text-[10px] tracking-widest uppercase text-[#F43F5E] mb-1"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>
              TOP JUDGEMENT
            </div>
            <div className="font-ui text-xs sm:text-sm font-700 text-black mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>
              {topReply.displayName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </div>
            <div className="font-handwrite text-gray-900" style={{ fontFamily: "'Kalam', cursive, sans-serif", fontSize: 'clamp(0.95rem, 1.05vw, 1.1rem)', lineHeight: 1.4 }}>
              "{topReply.text}"
            </div>
            <div className="font-ui text-[10px] sm:text-xs text-gray-500 mt-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              — {topReply.displayName}
            </div>
          </div>
        )}
      </div>

      {/* Reaction Bar + Report Button */}
      <div className="flex items-center gap-1 flex-wrap mt-1">
        {REACTIONS.map(({ key, emoji, label }) => (
          <button
            key={key}
            onClick={() => handleReaction(key)}
            title={label}
            className={`reaction-btn flex items-center gap-1 px-2 py-1.5 border text-xs font-ui cursor-pointer transition-all ${
              userReactions[key]
                ? 'bg-[#F5C400] border-black text-black shadow-[1px_1px_0_#111]'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-600'
            } ${animatingReaction === key ? 'animate-wiggle' : ''}`}
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}
          >
            <span className="text-sm">{emoji}</span>
            <span className={`text-[10px] ${userReactions[key] ? 'text-black' : 'text-gray-500'}`}>
              {formatCount(confession.reactions[key] || 0)}
            </span>
          </button>
        ))}

        {/* Reply toggle */}
        <button
          onClick={() => setShowReplies((v) => !v)}
          className={`reaction-btn flex items-center gap-1 px-2 py-1.5 border text-xs font-ui cursor-pointer transition-all ml-auto ${
            showReplies
              ? 'bg-black border-black text-white'
              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-600'
          }`}
          style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}
        >
          <span className="text-sm">💬</span>
          <span className="text-[10px]">{confession.replies?.length || 0}</span>
        </button>

        {/* 🚩 Report Button */}
        <button
          onClick={() => setShowReportModal(true)}
          disabled={reportedState}
          title="Report illegal content or doxxing"
          className={`reaction-btn flex items-center gap-1 px-2 py-1.5 border text-[11px] font-ui transition-all ${
            reportedState
              ? 'bg-red-100 border-red-300 text-red-600 cursor-default'
              : 'bg-white border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-400 cursor-pointer'
          }`}
          style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}
        >
          <span>🚩</span>
          <span>{reportedState ? 'Reported' : 'Report'}</span>
        </button>
      </div>

      {/* Expandable replies */}
      {showReplies && (
        <ReplySection
          confession={confession}
          user={user}
          onReplyAdded={handleReplyAdded}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF7] border-3 border-black shadow-[6px_6px_0_#111] max-w-sm w-full p-5 relative animate-pop">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-3">
              <div className="font-ui font-900 text-sm uppercase tracking-wider text-black flex items-center gap-1.5">
                <span>🚩</span> Report Confession
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-500 hover:text-black font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-600 font-ui mb-3 leading-relaxed">
              Why are you reporting this confession? Our admin moderation will review and take down violations:
            </p>
            <div className="space-y-2 mb-4">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => handleReportSubmit(r.label)}
                  className="w-full text-left p-2.5 bg-[#F5EEDF] border-2 border-black text-xs font-ui font-700 hover:bg-[#F43F5E] hover:text-white transition-colors cursor-pointer"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full py-2 bg-gray-200 text-black border-2 border-black font-ui text-xs font-700 uppercase tracking-widest hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfessionCard;