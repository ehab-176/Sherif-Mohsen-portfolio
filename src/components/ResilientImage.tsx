import React, { useState } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  accentColor?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  accentColor = '#a1a1aa',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800/80 text-zinc-400 p-8 overflow-hidden ${className}`}
        role="img"
        aria-label={alt}
      >
        <div
          className="w-12 h-12 rounded-xl border border-zinc-700/60 flex items-center justify-center mb-3 bg-zinc-950/70"
          style={{ borderColor: accentColor }}
        >
          <Layers className="w-5 h-5 text-zinc-300" />
        </div>
        {fallbackTitle && (
          <span className="text-xs font-mono tracking-wider uppercase text-zinc-300 text-center">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
