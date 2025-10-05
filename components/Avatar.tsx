import React from 'react';
import type { AvatarCustomization } from '../types';

interface AvatarProps {
  avatar: AvatarCustomization;
  level: number;
}

const Avatar: React.FC<AvatarProps> = ({ avatar, level }) => {
  return (
    <div className="w-16 h-16 flex-shrink-0">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Base Character */}
        <circle cx="50" cy="50" r="40" fill="var(--color-primary-400-val)" />
        <circle cx="38" cy="45" r="5" fill="white" />
        <circle cx="62" cy="45" r="5" fill="white" />
        <path d="M 35 65 Q 50 75 65 65" stroke="white" strokeWidth="3" fill="none" />

        {/* Hat accessory - unlocked at level 2 */}
        {avatar.hat && (
            <g>
                <path d="M 25 35 Q 50 20 75 35 L 80 40 L 20 40 Z" fill="#A52A2A" />
                <rect x="15" y="40" width="70" height="8" fill="#A52A2A" rx="2" />
            </g>
        )}
      </svg>
    </div>
  );
};

export default Avatar;