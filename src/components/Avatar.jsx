import React from 'react';
import { getAvatarById } from '../data/avatars.js';

const Avatar = ({ avatarId, size = 'md', className = '' }) => {
  const avatar = getAvatarById(avatarId);

  const sizes = {
    xs:  'w-7 h-7 text-sm',
    sm:  'w-9 h-9 text-base',
    md:  'w-12 h-12 text-xl',
    lg:  'w-16 h-16 text-3xl',
    xl:  'w-20 h-20 text-4xl',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold border-2 border-black flex-shrink-0 ${className}`}
      style={{ backgroundColor: avatar.bg, color: avatar.color }}
      title={avatar.name}
    >
      {avatar.emoji}
    </div>
  );
};

export default Avatar;
