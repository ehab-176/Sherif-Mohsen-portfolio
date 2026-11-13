import React from 'react';
import { LanguageCode } from '../data/studioData';

interface FragmentLogoProps {
  logoUrl: string;
  nameEn: string;
  nameAr: string;
  lang: LanguageCode;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FragmentLogo: React.FC<FragmentLogoProps> = ({
  logoUrl,
  nameEn,
  nameAr,
  lang,
  accentColor = '#FFB629',
  size = 'md',
}) => {
  const imgSize =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const isAr = lang === 'AR';

  return (
    <div className="inline-flex items-center gap-2 sm:gap-3 group select-none">
      <div
        className={`relative ${imgSize} shrink-0 rounded-full overflow-hidden border border-[#F4F0E8]/25 bg-[#080808] flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
        style={{
          boxShadow: `0 0 20px -6px ${accentColor}55`,
        }}
      >
        <img
          src={logoUrl}
          alt={`${nameEn} (${nameAr}) Calligraphic Emblem`}
          className="w-full h-full object-cover object-top p-0.5"
        />
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <span className={`${isAr ? 'font-arabic-display' : 'font-display'} font-extrabold tracking-[0.01em] text-white text-[14px] min-[390px]:text-[17px] sm:text-[21px] xl:text-[23px] leading-[1.2] uppercase whitespace-nowrap`}>
          {isAr ? nameAr : nameEn}
        </span>
        <span className={`${isAr ? 'font-display' : 'font-arabic-display'} font-extrabold text-[12px] min-[390px]:text-[13px] sm:text-[14px] tracking-[0.02em] text-[#F4F0E8]/90 uppercase mt-1 leading-[1.35]`}>
          {isAr ? nameEn : nameAr}
        </span>
      </div>
    </div>
  );
};
