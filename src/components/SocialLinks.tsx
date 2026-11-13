import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import type { LanguageCode, SocialProfileLinks } from '../data/studioData';

interface SocialLinksProps {
  links: SocialProfileLinks;
  lang: LanguageCode;
  className?: string;
}

type Platform = keyof SocialProfileLinks;

const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook', Icon: Facebook, domain: 'facebook.com' },
  { key: 'instagram', label: 'Instagram', Icon: Instagram, domain: 'instagram.com' },
] as const;

export function verifiedSocialUrl(value: string, platform: Platform): string | null {
  if (!value.trim()) return null;

  const domain = SOCIAL_PLATFORMS.find((item) => item.key === platform)?.domain;
  if (!domain) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    if (url.hostname !== domain && !url.hostname.endsWith(`.${domain}`)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ links, lang, className = '' }) => {
  const isAr = lang === 'AR';

  return (
    <div className={`flex items-center gap-1.5 ${className}`} role="group" aria-label={isAr ? 'حسابات التواصل الاجتماعي' : 'Social media profiles'}>
      {SOCIAL_PLATFORMS.map(({ key, label, Icon }) => {
        const href = verifiedSocialUrl(links[key], key);
        const baseClass = 'w-11 h-11 xl:w-12 xl:h-12 inline-flex items-center justify-center rounded-xl border shadow-[0_0_0_1px_rgba(255,182,41,0.06)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB629]';

        return href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer me"
            title={label}
            aria-label={`${label} — Sherif Mohsen`}
            className={`${baseClass} border-[#FFB629]/70 bg-[#FFB629]/10 text-[#FFB629] hover:bg-[#FFB629] hover:text-[#0B0B0B]`}
          >
            <Icon className="w-6 h-6" strokeWidth={2.25} />
          </a>
        ) : (
          <span
            key={key}
            title={isAr ? `رابط ${label} لم يُضاف بعد` : `${label} profile link not added yet`}
            aria-label={isAr ? `${label}: الرابط غير متاح حاليًا` : `${label}: link not available yet`}
            aria-disabled="true"
            className={`${baseClass} border-[#F4F0E8]/10 text-[#858585]/60 cursor-not-allowed`}
          >
            <Icon className="w-6 h-6" strokeWidth={2.25} />
          </span>
        );
      })}
    </div>
  );
};
