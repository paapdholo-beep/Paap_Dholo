import React, { useState } from 'react';
import Avatar from './Avatar.jsx';
import { timeAgo, formatCount, getSeverityInfo } from '../utils/formatters.js';
import { addReaction, getUserReactions, addReply } from '../services/confessionService.js';

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

const ReplySection = ({ confession, user, onReplyAdded }) => {
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    const reply = addReply({
      confessionId: confession.id,
      text: replyText,
      avatarId: user.avatarId,
      displayName: user.displayName,
    });
    setReplyText('');
    onReplyAdded(reply);
  };

  return (
    <div className="mt-3 pt-3 border-t border-dashed border-gray-300 animate-slide-up">
      {confession.replies?.length > 0 && (
        <div className="space-y-2 mb-3">
          {confession.replies.map((reply) => (
            <div key={reply.id} className="flex gap-2 items-start">
              <Avatar avatarId={reply.avatarId} size="xs" />
              <div className="flex-1 bg-[#F5EEDF] px-3 py-2 border border-gray-200">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-ui text-xs font-600 text-gray-700" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>{reply.displayName}</span>
                  <span className="font-ui text-[10px] text-gray-400" style={{ fontFamily: 'Plus Jakarta Sans' }}>{timeAgo(reply.createdAt)}</span>
                </div>
                <div className="font-handwrite text-sm text-gray-800" style={{ fontFamily: 'Caveat', fontSize: '0.95rem' }}>{reply.text}</div>
              </div>
            </div>
          ))}
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
            className="flex-1 bg-[#F5EEDF] border border-gray-300 px-3 py-2 font-handwrite text-sm text-gray-800 placeholder-gray-400"
            style={{ fontFamily: 'Caveat', fontSize: '0.95rem' }}
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

const ConfessionCard = ({ confession: initialConfession, user, index }) => {
  const [confession, setConfession] = useState(initialConfession);
  const [userReactions, setUserReactions] = useState(
    () => getUserReactions({ confessionId: initialConfession.id, userId: user.id })
  );
  const [showReplies, setShowReplies] = useState(false);
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
      userId: user.id,
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

  const totalReactions = Object.values(confession.reactions).reduce((s, v) => s + v, 0);
  const topReply = confession.replies?.[0];

  return (
    <div
      className="card-tilt border-2 border-black p-4 sm:p-5 animate-slide-up"
      style={{
        backgroundColor: variant.bg,
        transform: tilt,
        boxShadow: '3px 3px 0 #111',
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar avatarId={confession.avatarId} size="sm" />
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

      {/* Confession Text + Top Judgement — side by side on larger screens */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3 items-start">
        <div
          className="font-handwrite text-base sm:text-lg leading-snug text-gray-900 flex-1"
          style={{ fontFamily: 'Caveat', fontSize: '1.1rem', lineHeight: 1.4 }}
        >
          {confession.text}
        </div>

        {topReply && (
          <div className="bg-[#FFF9E0] border border-[#F5C400] px-3 py-2 sm:w-56 flex-shrink-0 w-full">
            <div className="font-ui text-[9px] tracking-widest uppercase text-[#F43F5E] mb-1"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>
              TOP JUDGEMENT
            </div>
            <div className="font-ui text-xs font-700 text-black mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>
              {topReply.displayName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </div>
            <div className="font-handwrite text-sm text-gray-700 italic" style={{ fontFamily: 'Caveat', fontSize: '0.95rem' }}>
              "{topReply.text}"
            </div>
            <div className="font-ui text-[10px] text-gray-400 mt-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              — {topReply.displayName}
            </div>
          </div>
        )}
      </div>

      {/* Reaction Bar */}
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
      </div>

      {/* Expandable replies */}
      {showReplies && (
        <ReplySection
          confession={confession}
          user={user}
          onReplyAdded={handleReplyAdded}
        />
      )}
    </div>
  );
};

export default ConfessionCard;