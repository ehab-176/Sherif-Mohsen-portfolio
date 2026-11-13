import React, { useState } from 'react';
import { Globe, Menu, Smartphone, X } from 'lucide-react';
import { FragmentLogo } from './FragmentLogo';
import { SocialLinks } from './SocialLinks';
import { LanguageCode, SherifPortfolioData } from '../data/studioData';

interface NavbarProps {
  data: SherifPortfolioData;
  lang: LanguageCode;
  onToggleLang: () => void;
  onToggleNfcMode: () => void;
  isNfcMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  data,
  lang,
  onToggleLang,
  onToggleNfcMode,
  isNfcMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = lang === 'AR';

  const navItems = [
    {
      id: 'work',
      href: '#projects',
      label: isAr ? 'الأعمال المختارة' : 'Work',
    },
    {
      id: 'about',
      href: '#about',
      label: isAr ? 'عن شريف' : 'About',
    },
    {
      id: 'companies',
      href: '#companies',
      label: isAr ? 'الشركات' : 'Companies',
    },
    {
      id: 'press',
      href: '#press',
      label: isAr ? 'الصحافة والتكريم' : 'Press',
    },
    {
      id: 'contact',
      href: '#contact',
      label: isAr ? 'تواصل' : 'Contact',
    },
  ];

  const cleanPhone = data.personal.phone.replace(/\s+/g, '');

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-[#F4F0E8]/10 bg-[#0B0B0B]/80 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Emblem & Wordmark */}
        <a
          href="#hero"
          className="focus:outline-none"
          aria-label="Sherif Mohsen Home"
        >
          <FragmentLogo
            logoUrl={data.personal.logoUrl}
            nameEn={data.personal.nameEn}
            nameAr={data.personal.nameAr}
            lang={lang}
            accentColor={data.tokens.accent}
          />
        </a>

        {/* Zone 2: Desktop Primary Section Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-5 2xl:gap-8"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-xs uppercase tracking-[0.18em] text-[#F4F0E8]/80 hover:text-[#FFB629] transition-colors duration-200 font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Social profiles, NFC keychain and language */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <SocialLinks
            links={data.personal.socialLinks}
            lang={lang}
            className="hidden xl:flex gap-2.5 rounded-xl border border-[#FFB629]/30 bg-[#20190F]/80 p-1.5"
          />
          <button
            type="button"
            onClick={onToggleNfcMode}
            className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-mono-tech uppercase tracking-wider border transition-colors cursor-pointer ${
              isNfcMode
                ? 'bg-[#FFB629] text-[#0B0B0B] border-[#FFB629] font-semibold'
                : 'border-[#F4F0E8]/20 text-[#F4F0E8]/85 hover:border-[#FFB629] hover:text-[#FFB629]'
            }`}
            title={isAr ? 'وضع بطاقة NFC السريعة' : 'NFC Keychain Quick View (/nfc/sherif)'}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isAr ? 'بطاقة NFC' : 'NFC Card'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-mono-tech uppercase tracking-wider border border-[#F4F0E8]/20 text-[#F4F0E8] hover:border-[#FFB629] hover:text-[#FFB629] transition-colors cursor-pointer"
            aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-[#FFB629]" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden p-1.5 sm:p-2 rounded-lg border border-[#F4F0E8]/20 text-[#F4F0E8] hover:border-[#FFB629]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Keep the social profiles visible on mobile, even with the menu closed. */}
      <div className="xl:hidden flex items-center justify-center gap-4 border-t border-[#FFB629]/20 bg-[#13100C]/95 px-4 py-2">
        <span className="text-[11px] sm:text-xs font-semibold text-[#F4F0E8]/90 tracking-wide">
          {isAr ? 'تابع شريف محسن' : 'Follow Sherif Mohsen'}
        </span>
        <SocialLinks links={data.personal.socialLinks} lang={lang} className="gap-3" />
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden rounded-b-2xl border-t border-[#F4F0E8]/15 bg-[#0B0B0B]/98 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-base font-display uppercase tracking-wider text-white hover:text-[#FFB629] border-b border-[#F4F0E8]/10"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-[#F4F0E8]/10 pb-4">
            <span className="text-[11px] font-mono-tech tracking-[0.15em] text-[#B8B8B8] uppercase">
              {isAr ? 'حسابات التواصل' : 'Social Profiles'}
            </span>
            <SocialLinks links={data.personal.socialLinks} lang={lang} />
          </div>
          <div className="pt-2 flex items-center justify-between text-xs font-mono-tech text-[#B8B8B8]">
            <span>{isAr ? data.personal.location.ar : data.personal.location.en}</span>
            <a
              href={`tel:${cleanPhone}`}
              className="text-[#FFB629] underline"
            >
              {data.personal.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
