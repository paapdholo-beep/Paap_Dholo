import React from 'react';
import { getAvatarById } from '../data/avatars.js';

const Avatar = ({ avatarId, size = 'md', className = '' }) => {
  const avatar = getAvatarById(avatarId);

  const sizes = {
    xs:  'w-8 h-8 min-w-[2rem] text-xs',
    sm:  'w-11 h-11 min-w-[2.75rem] text-sm',
    md:  'w-14 h-14 min-w-[3.5rem] text-base',
    lg:  'w-18 h-18 min-w-[4.5rem] text-xl',
    xl:  'w-24 h-24 min-w-[6rem] text-2xl',
  };

  return (
    <div
      className={`${sizes[size] || sizes.md} rounded-full overflow-hidden flex items-center justify-center font-bold border-2 border-black flex-shrink-0 shadow-[2px_2px_0_#000] ${className}`}
      style={{ backgroundColor: avatar.bg || '#FFFDF7' }}
      title={avatar.name}
    >
      {avatar.image ? (
        <img
          src={avatar.image}
          alt={avatar.name}
          className="w-full h-full object-cover select-none pointer-events-none"
          loading="lazy"
        />
      ) : (
        <span style={{ color: avatar.color }}>{avatar.emoji}</span>
      )}
    </div>
  );
};

export default Avatar;
