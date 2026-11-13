import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Building2,
  Download,
  ExternalLink,
  MapPin,
  MessageCircle,
  Newspaper,
  Phone,
  Search,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import {
  CompanyCode,
  DEFAULT_SHERIF_PORTFOLIO,
  DocumentedProject,
  LanguageCode,
  SherifPortfolioData,
} from './data/studioData';
import { filterSherifProjects, generateSherifVcf, orderSherifProjectsForDisplay } from './utils/studioLogic';
import { FragmentCanvas3D } from './components/FragmentCanvas3D';
import { Navbar } from './components/Navbar';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ProjectInquirySection } from './components/ProjectInquirySection';
import { FragmentLogo } from './components/FragmentLogo';
import { NfcWelcomeIntro } from './components/NfcWelcomeIntro';

function openedFromNfcLink(): boolean {
  const isNfcPath = window.location.pathname.startsWith('/nfc/sherif');
  const hasNfcQuery = new URLSearchParams(window.location.search).get('nfc') === '1';
  return isNfcPath || hasNfcQuery;
}

export default function App() {
  // Read-only public portfolio. All editorial changes are made in source code,
  // never through a browser-accessible CMS or persisted browser overrides.
  const data: SherifPortfolioData = DEFAULT_SHERIF_PORTFOLIO;

  const [lang, setLang] = useState<LanguageCode>('EN');
  const [companyFilter, setCompanyFilter] = useState<CompanyCode>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<DocumentedProject | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [arrivedFromNfc] = useState(openedFromNfcLink);
  const [isNfcMode, setIsNfcMode] = useState(arrivedFromNfc);
  const [showNfcWelcome, setShowNfcWelcome] = useState(
    () => arrivedFromNfc && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [nfcWelcomeFinished, setNfcWelcomeFinished] = useState(false);

  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  const isAr = lang === 'AR';
  const cleanPhone = data.personal.phone.replace(/\s+/g, '');
  const whatsappUrl = `https://wa.me/${data.personal.whatsappNumber}`;

  const finishNfcWelcome = useCallback(() => {
    setShowNfcWelcome(false);
    setNfcWelcomeFinished(true);
  }, []);

  // This standalone public page reads embedded, version-controlled content.

  // Sync RTL / LTR document direction and CSS variables
  useEffect(() => {
    document.documentElement.lang = isAr ? 'ar' : 'en';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  }, [isAr]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', data.tokens.background || '#0B0B0B');
    root.style.setProperty('--surface-light', data.tokens.lightSurface || '#F4F0E8');
    root.style.setProperty('--accent-gold', data.tokens.accent || '#FFB629');
  }, [data.tokens]);

  // GSAP Hero Entrance & Scroll Progress listener
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && !showNfcWelcome && heroTitleRef.current) {
      gsap.fromTo(
        heroTitleRef.current,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }
      );
    }

    const handleScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showNfcWelcome]);

  const handleDownloadVcf = () => {
    try {
      const vcf = generateSherifVcf(data);
      const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Sherif_Mohsen_SH_AHMOS.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.alert(isAr ? 'تعذر تنزيل جهة الاتصال.' : 'Unable to download contact card.');
    }
  };

  const handleToggleNfcMode = () => {
    setIsNfcMode((prev) => {
      const next = !prev;
      try {
        window.history.replaceState({}, '', next ? '/nfc/sherif' : '/');
      } catch {
        // Ignore history state error
      }
      return next;
    });
  };

  const filteredProjects = useMemo(
    () => orderSherifProjectsForDisplay(filterSherifProjects(data.projects, companyFilter, searchQuery)),
    [data.projects, companyFilter, searchQuery]
  );

  return (
    <div
      className={`min-h-screen relative text-white selection:bg-[#FFB629] selection:text-[#0B0B0B] ${
        showNfcWelcome ? 'nfc-ceremony-active' : nfcWelcomeFinished ? 'nfc-ceremony-complete' : ''
      }`}
      style={{ backgroundColor: data.tokens.background }}
      aria-busy={showNfcWelcome}
    >
      {showNfcWelcome && (
        <NfcWelcomeIntro onComplete={finishNfcWelcome} />
      )}

      {/* Subtle Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-[3px] z-50 transition-all duration-150"
        style={{
          width: `${scrollProgress * 100}%`,
          backgroundColor: data.tokens.accent,
        }}
      />

      {/* Constantly Animated True Three.js 3D WebGL Scene */}
      <FragmentCanvas3D
        sceneSettings={data.scene}
        tokens={data.tokens}
        logoUrl={data.personal.logoUrl}
        scrollProgress={scrollProgress}
        introActive={showNfcWelcome}
      />

      {/* Architectural Grid Overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-architectural-grid pointer-events-none z-[1]"
      />

      {/* Top Navigation */}
      <Navbar
        data={data}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'EN' ? 'AR' : 'EN'))}
        onToggleNfcMode={handleToggleNfcMode}
        isNfcMode={isNfcMode}
      />

      {/* NFC Keychain Quick-Access Bar (Automatically active on /nfc/sherif or when toggled) */}
      {isNfcMode && (
        <div className="relative z-30 pt-24 pb-4 px-4 sm:px-8 bg-[#1C1C1C]/95 border-b border-[#FFB629]/40 backdrop-blur-xl">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#FFB629] text-[#0B0B0B]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono-tech text-[11px] uppercase tracking-widest text-[#FFB629]">
                  {isAr
                    ? 'وضع ميدالية NFC الذكية الفوري (/nfc/sherif)'
                    : 'NFC KEYCHAIN INSTANT CARD (/nfc/sherif)'}
                </div>
                <p className="text-xs sm:text-sm text-[#F4F0E8]">
                  {isAr
                    ? 'شريف محسن — صاحب شركة SH للدعاية والإعلان · المدير السابق لشركة أحمس للدعاية والإعلان'
                    : 'Sherif Mohsen — Owner & Chairman at SH Advertising · Former Manager at AHMOS Advertising'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={handleDownloadVcf}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#FFB629] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'حفظ جهة الاتصال' : 'Save VCF Contact'}</span>
              </button>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#0B0B0B] border border-[#F4F0E8]/25 text-xs font-mono-tech text-white hover:border-[#FFB629]"
              >
                <Phone className="w-3.5 h-3.5 text-[#FFB629]" />
                <span dir="ltr">{data.personal.phone}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#0B0B0B] border border-[#F4F0E8]/25 text-xs font-mono-tech text-white hover:border-[#FFB629]"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#FFB629]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="relative z-10">
        {/* =========================================================
            SECTION 1: CINEMATIC HERO
            ========================================================= */}
        <section
          id="hero"
          className={`min-h-screen flex flex-col justify-between ${
            isNfcMode ? 'pt-12' : 'pt-40 sm:pt-44 xl:pt-32'
          } pb-16 px-4 sm:px-8 max-w-[1440px] mx-auto`}
        >
          {/* Top Editorial Metadata Strip */}
          <div className="hidden lg:flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#F4F0E8]/15 text-xs font-mono-tech text-[#B8B8B8]">
            <div className="flex items-center gap-3">
              <span className="text-[#FFB629] font-semibold">
                {isAr ? 'ملف الأعمال التفاعلي الثلاثي الأبعاد' : '3D WEBGL EXECUTIVE PORTFOLIO'}
              </span>
              <span>·</span>
              <span>{isAr ? data.personal.location.ar : data.personal.location.en}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>SH ADVERTISING</span>
              <span>◦</span>
              <span>AHMOS ADVERTISING</span>
            </div>
          </div>

          {/* Core Asymmetric Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-0 lg:my-auto py-4 lg:py-12">
            {/* Hero Left: Oversized Typography, Roles & CTAs */}
            <div className={`order-2 lg:order-1 lg:col-span-7 space-y-8 p-6 sm:p-8 rounded-2xl bg-[#0B0B0B]/65 backdrop-blur-sm border border-[#F4F0E8]/10 ${nfcWelcomeFinished ? 'nfc-reveal-profile' : ''}`}>
              <div className="inline-flex items-center gap-3 text-xs font-mono-tech uppercase tracking-[0.22em] text-[#FFB629]">
                <span>{isAr ? data.personal.industry.ar : data.personal.industry.en}</span>
                <span className="text-[#B8B8B8]">—</span>
                <span className={isAr ? 'font-arabic-display font-extrabold text-sm sm:text-base text-[#F4F0E8]' : 'text-[#F4F0E8]'}>
                  {isAr ? data.personal.nameAr : data.personal.nameEn}
                </span>
              </div>

              <h1
                ref={heroTitleRef}
                className="font-display font-extrabold text-5xl sm:text-7xl xl:text-[5.4rem] leading-[0.96] tracking-tight text-white uppercase"
              >
                {isAr ? (
                  <>
                    {data.personal.nameAr}
                    <span className="block text-2xl sm:text-4xl text-[#F4F0E8]/85 font-semibold mt-4">
                      {data.hero.subtext.ar}
                    </span>
                  </>
                ) : (
                  <>
                    SHERIF <span className="text-[#FFB629]">MOHSEN</span>
                    <span className="block text-xl sm:text-3xl text-[#F4F0E8]/85 font-normal tracking-normal mt-4 normal-case">
                      Owner &amp; Chairman of{' '}
                      <strong className="text-white font-semibold">SH Advertising</strong>{' '}
                      {' '}· Former Manager of{' '}
                      <strong className="text-white font-semibold">
                        AHMOS Advertising
                      </strong>
                    </span>
                  </>
                )}
              </h1>

              {/* Verified Role Attribution Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 max-w-3xl">
                <div className="p-4 rounded-xl bg-[#121212]/90 border-l-2 border-[#FFB629] backdrop-blur-md">
                  <div className="font-mono-tech text-[11px] uppercase tracking-widest text-[#FFB629]">
                    SH ADVERTISING
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-white mt-1">
                    {isAr ? data.personal.shRole.ar : data.personal.shRole.en}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#121212]/90 border-l-2 border-[#F4F0E8] backdrop-blur-md">
                  <div className="font-mono-tech text-[11px] uppercase tracking-widest text-[#F4F0E8]">
                    AHMOS ADVERTISING
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-white mt-1">
                    {isAr ? data.personal.ahmosRole.ar : data.personal.ahmosRole.en}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#121212]/90 border-l-2 border-[#FFB629]/60 backdrop-blur-md">
                  <div className="font-mono-tech text-[11px] uppercase tracking-widest text-[#FFB629]">
                    {isAr ? 'المشاركة العامة' : 'PUBLIC ROLE'}
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-white mt-1">
                    {isAr ? data.personal.communityRole.ar : data.personal.communityRole.en}
                  </div>
                </div>
              </div>

              {/* Three Primary Hero CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#FFB629] text-[#0B0B0B] font-bold text-xs uppercase tracking-[0.18em] hover:bg-[#F4F0E8] transition-colors"
                >
                  <span>{isAr ? data.hero.ctaExplore.ar : data.hero.ctaExplore.en}</span>
                  <ArrowDownRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={handleDownloadVcf}
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#F4F0E8] text-[#0B0B0B] font-bold text-xs uppercase tracking-[0.18em] hover:bg-[#FFB629] transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isAr ? data.hero.ctaSaveContact.ar : data.hero.ctaSaveContact.en}</span>
                </button>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl border border-[#F4F0E8]/30 bg-[#0B0B0B]/80 text-white font-semibold text-xs uppercase tracking-[0.18em] hover:border-[#FFB629] hover:text-[#FFB629] transition-colors"
                >
                  <span>{isAr ? data.hero.ctaGetInTouch.ar : data.hero.ctaGetInTouch.en}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Hero Right: Executive Portrait & 3D Calligraphic Emblem Framing */}
            <div className={`order-1 lg:order-2 lg:col-span-5 flex flex-col items-center lg:items-end ${nfcWelcomeFinished ? 'nfc-reveal-portrait' : ''}`}>
              <div className="relative w-full max-w-md rounded-2xl bg-[#121212]/90 border border-[#F4F0E8]/20 p-4 backdrop-blur-md shadow-2xl">
                {/* Floating Calligraphic Crest Badge */}
                <div className="absolute -top-7 -left-4 sm:-left-7 z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#080808] border-2 border-[#FFB629] p-1.5 shadow-xl flex items-center justify-center">
                  <img
                    src={data.personal.logoUrl}
                    alt="Sherif Mohsen Calligraphic Logo"
                    className="w-full h-full object-cover object-top rounded-full"
                  />
                </div>

                <div className="relative aspect-[4/4.3] rounded-xl overflow-hidden bg-[#111111]">
                  <img
                    src={data.personal.portraitUrl}
                    alt={`${data.personal.nameEn} (${data.personal.nameAr}) Portrait`}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-65" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-xs font-mono-tech">
                    <div>
                      <div className="font-arabic-display text-base sm:text-lg text-[#FFB629] font-extrabold leading-snug">
                        {data.personal.nameAr}
                      </div>
                      <div className="font-display text-white/90 text-xs sm:text-sm font-semibold">
                        {data.personal.nameEn}
                      </div>
                    </div>
                    <span className="text-[#F4F0E8]/80 text-[11px]">
                      MINYA, EGYPT
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between text-[11px] font-mono-tech text-[#B8B8B8]">
                  <span>
                    {isAr ? 'الهاتف:' : 'DIRECT:'} {data.personal.phone}
                  </span>
                  <a
                    href={data.personal.blueTagsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFB629] hover:underline"
                  >
                    BlueTags #bc71855
                  </a>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* =========================================================
            SECTION 2: ABOUT SHERIF MOHSEN (VERIFIED EDITORIAL BIO)
            ========================================================= */}
        <section
          id="about"
          className="py-24 sm:py-32 border-t border-[#F4F0E8]/15 bg-[#0B0B0B]/88 backdrop-blur-md"
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4 space-y-4">
                <div className="font-mono-tech text-xs uppercase tracking-[0.25em] text-[#FFB629]">
                  {isAr ? data.about.kicker.ar : data.about.kicker.en}
                </div>
                <h2 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
                  {isAr ? 'سيرة مهنية موثقة' : 'VERIFIED EXECUTIVE PROFILE'}
                </h2>
                <p className="text-xs font-mono-tech text-[#B8B8B8] leading-relaxed pt-2">
                  {isAr
                    ? data.personal.portraitDisclaimer.ar
                    : data.personal.portraitDisclaimer.en}
                </p>
              </div>

              <div className="lg:col-span-8 space-y-8">
                <p className="font-display text-xl sm:text-3xl text-[#F4F0E8] leading-relaxed font-medium">
                  {isAr
                    ? data.about.biographyParagraph1.ar
                    : data.about.biographyParagraph1.en}
                </p>
                <p className="text-base sm:text-lg text-[#B8B8B8] leading-relaxed">
                  {isAr
                    ? data.about.biographyParagraph2.ar
                    : data.about.biographyParagraph2.en}
                </p>

                {/* Verified Fact Sheet Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#F4F0E8]/15">
                  <div className="p-6 rounded-xl bg-[#1C1C1C] border border-[#F4F0E8]/15 space-y-2">
                    <div className="text-xs font-mono-tech uppercase tracking-wider text-[#FFB629]">
                      {isAr ? 'الاسم الكامل والموقع' : 'Verified Identity & Base'}
                    </div>
                    <div className="text-lg font-display font-bold text-white">
                      {data.personal.nameEn} · {data.personal.nameAr}
                    </div>
                    <div className="text-sm text-[#B8B8B8] flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#FFB629]" />
                      <span>
                        {isAr ? data.personal.location.ar : data.personal.location.en}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-[#1C1C1C] border border-[#F4F0E8]/15 space-y-2">
                    <div className="text-xs font-mono-tech uppercase tracking-wider text-[#FFB629]">
                      {isAr ? 'القطاع المهني' : 'Primary Industry'}
                    </div>
                    <div className="text-lg font-display font-bold text-white">
                      {isAr ? data.personal.industry.ar : data.personal.industry.en}
                    </div>
                    <div className="text-sm text-[#B8B8B8]">
                      {isAr
                        ? 'الإعلانات الخارجية، الشاشات الرقمية، والاتصال البصري'
                        : 'Outdoor Advertising, LED Broadcast Screens & Urban Media'}
                    </div>
                  </div>
                </div>

                {/* Explicit Governance & Attribution Notice */}
                <div className="p-6 rounded-xl bg-[#121212] border-l-4 border-[#FFB629] flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-[#FFB629] shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs sm:text-sm text-[#F4F0E8]/90 leading-relaxed">
                    <div className="font-mono-tech uppercase tracking-wider text-[#FFB629] font-semibold">
                      {isAr
                        ? 'توضيح الأدوار الإدارية'
                        : 'CORPORATE ROLE CLARIFICATION'}
                    </div>
                    <p>
                      {isAr
                        ? data.personal.ahmosChairmanNote.ar
                        : data.personal.ahmosChairmanNote.en}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 3: TWO COMPANIES (SH ADVERTISING & AHMOS ADVERTISING)
            ========================================================= */}
        <section
          id="companies"
          className="py-24 sm:py-32 border-t border-[#F4F0E8]/15 bg-[#0F0F0F]/90 backdrop-blur-md"
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-14">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="font-mono-tech text-xs uppercase tracking-[0.25em] text-[#FFB629] mb-3">
                  {isAr ? '03 / الكيانات والشركات الإعلانية' : '03 / TWO ASSOCIATED COMPANIES'}
                </div>
                <h2 className="font-display text-4xl sm:text-6xl font-bold text-white">
                  {isAr ? 'SH للإعلان · أحمس للإعلان' : 'SH ADVERTISING & AHMOS ADVERTISING'}
                </h2>
              </div>
              <p className="max-w-md text-sm text-[#B8B8B8]">
                {isAr
                  ? 'كيانان بارزان في قطاع الإعلانات الخارجية والشاشات العملاقة في المنيا والقاهرة.'
                  : 'Two distinctive advertising entities operating across Minya and Greater Cairo within one coherent executive portfolio.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Company 1: SH Advertising */}
              <div className="p-8 sm:p-12 rounded-2xl bg-[#121212] border border-[#FFB629]/35 flex flex-col gap-8 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#F4F0E8]/15 pb-5">
                  <span className="font-mono-tech text-xs uppercase tracking-[0.22em] text-[#FFB629]">
                    01 · SH ADVERTISING
                  </span>
                  <Building2 className="w-6 h-6 text-[#FFB629]" />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-4">
                  <div>
                    <h3 className="font-display text-4xl sm:text-[2.75rem] font-extrabold text-white leading-tight">
                      {isAr ? data.companies.SH.name.ar : data.companies.SH.name.en}
                    </h3>
                    <div className="mt-3 text-base sm:text-lg font-display font-semibold text-[#FFB629] leading-relaxed">
                      {isAr
                        ? `منصب شريف محسن: ${data.companies.SH.sherifRole.ar}`
                        : `Sherif Mohsen’s Role: ${data.companies.SH.sherifRole.en}`}
                    </div>
                  </div>

                  <p className="max-w-xl text-base sm:text-lg font-medium text-[#F4F0E8]/90 leading-relaxed">
                    {isAr
                      ? data.companies.SH.description.ar
                      : data.companies.SH.description.en}
                  </p>

                  <div className="w-full flex flex-col items-center gap-2.5 pt-1">
                    {(isAr
                      ? data.companies.SH.focusAreas.ar
                      : data.companies.SH.focusAreas.en
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-center gap-3 text-sm sm:text-base text-[#B8B8B8] leading-relaxed"
                      >
                        <span className="text-[#FFB629] font-mono-tech shrink-0">0{idx + 1}</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#F4F0E8]/15 flex items-center justify-between">
                  <span className="text-xs font-mono-tech text-[#B8B8B8]">
                    {isAr ? 'المنيا، مصر' : 'Minya, Egypt'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCompanyFilter('SH');
                      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase tracking-wider text-[#FFB629] hover:underline cursor-pointer"
                  >
                    <span>{isAr ? 'عرض مشاريع SH' : 'Filter SH Projects'}</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Company 2: AHMOS Advertising */}
              <div className="p-8 sm:p-12 rounded-2xl bg-[#F4F0E8] text-[#0B0B0B] border border-[#F4F0E8] flex flex-col gap-8 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#0B0B0B]/15 pb-5">
                  <span className="font-mono-tech text-xs uppercase tracking-[0.22em] text-[#0B0B0B] font-bold">
                    02 · AHMOS ADVERTISING
                  </span>
                  <Building2 className="w-6 h-6 text-[#0B0B0B]" />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-4">
                  <div>
                    <h3 className="font-display text-4xl sm:text-[2.75rem] font-extrabold text-[#0B0B0B] leading-tight">
                      {isAr ? data.companies.AHMOS.name.ar : data.companies.AHMOS.name.en}
                    </h3>
                    <div className="mt-3 text-base sm:text-lg font-display font-semibold text-[#0B0B0B]/80 leading-relaxed">
                      {isAr
                        ? `منصب شريف محسن: ${data.companies.AHMOS.sherifRole.ar}`
                        : `Sherif Mohsen’s Role: ${data.companies.AHMOS.sherifRole.en}`}
                    </div>
                  </div>

                  <p className="max-w-xl text-base sm:text-lg font-medium text-[#0B0B0B]/85 leading-relaxed">
                    {isAr
                      ? data.companies.AHMOS.description.ar
                      : data.companies.AHMOS.description.en}
                  </p>

                  {/* Explicit Chairman Attribution Box */}
                  <div className="w-full max-w-xl p-4 rounded-xl bg-[#0B0B0B] text-[#F4F0E8] text-sm font-display font-medium leading-relaxed">
                    <strong className="text-[#FFB629] block mb-1">
                      {isAr ? 'ملاحظة الحوكمة:' : 'CORPORATE GOVERNANCE NOTE:'}
                    </strong>
                    {isAr
                      ? data.companies.AHMOS.governanceNote.ar
                      : data.companies.AHMOS.governanceNote.en}
                  </div>

                  <div className="w-full flex flex-col items-center gap-2.5 pt-1">
                    {(isAr
                      ? data.companies.AHMOS.focusAreas.ar
                      : data.companies.AHMOS.focusAreas.en
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-center gap-3 text-sm sm:text-base text-[#0B0B0B]/80 leading-relaxed"
                      >
                        <span className="font-mono-tech font-bold text-[#0B0B0B]">
                          0{idx + 1}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#0B0B0B]/15 flex items-center justify-between">
                  <span className="text-xs font-mono-tech text-[#0B0B0B]/70">
                    {isAr ? 'المنيا والقاهرة، مصر' : 'Minya & Cairo, Egypt'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCompanyFilter('AHMOS');
                      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-mono-tech font-bold uppercase tracking-wider text-[#0B0B0B] hover:underline cursor-pointer"
                  >
                    <span>{isAr ? 'عرض مشاريع أحمس' : 'Filter AHMOS Projects'}</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 4: SELECTED DOCUMENTED PROJECTS (ALL / SH / AHMOS)
            ========================================================= */}
        <section
          id="projects"
          className="py-24 sm:py-32 border-t border-[#F4F0E8]/15 bg-[#0B0B0B]/90 backdrop-blur-md"
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
            {/* Header & Filter Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#F4F0E8]/15">
              <div>
                <div className="font-mono-tech text-xs uppercase tracking-[0.25em] text-[#FFB629] mb-3">
                  {isAr
                    ? '04 / المشاريع والأنشطة الموثقة للشركات'
                    : '04 / SELECTED COMPANY-LEVEL PROJECTS'}
                </div>
                <h2 className="font-display text-4xl sm:text-6xl font-bold text-white">
                  {isAr ? 'الأعمال والمشاركات الموثقة' : 'DOCUMENTED PUBLIC WORKS'}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter Buttons: ALL / SH / AHMOS */}
                <div
                  role="group"
                  aria-label="Filter projects by company"
                  className="inline-flex rounded-xl overflow-hidden border border-[#F4F0E8]/20 bg-[#1C1C1C]"
                >
                  {(['ALL', 'SH', 'AHMOS'] as CompanyCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCompanyFilter(code)}
                      className={`px-5 py-3 text-xs font-mono-tech uppercase tracking-widest transition-colors cursor-pointer ${
                        companyFilter === code
                          ? 'bg-[#FFB629] text-[#0B0B0B] font-bold'
                          : 'text-[#F4F0E8]/80 hover:text-white'
                      }`}
                    >
                      {code === 'ALL'
                        ? isAr
                          ? 'الكل (ALL)'
                          : 'ALL'
                        : code}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#B8B8B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'ابحث في المشاريع...' : 'Search projects...'}
                    className="pl-10 pr-4 py-2.5 rounded-lg bg-[#1C1C1C] border border-[#F4F0E8]/20 text-xs text-white placeholder-[#B8B8B8] focus:outline-none focus:border-[#FFB629]"
                  />
                </div>
              </div>
            </div>

            {/* Keep photo cards and text-only cards in separate grids so a photo
                cannot force an image-less article to stretch to its height. */}
            <div className="space-y-8 lg:space-y-10">
              {[true, false].map((hasPhoto) => {
                const projectsInGroup = filteredProjects.filter((project) => Boolean(project.imageUrl) === hasPhoto);
                if (!projectsInGroup.length) return null;

                return (
                  <div
                    key={hasPhoto ? 'photo-projects' : 'text-only-projects'}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 ${hasPhoto ? '' : 'items-start'}`}
                  >
                    {projectsInGroup.map((project, index) => {
                const title = isAr ? project.title.ar : project.title.en;
                const location = isAr ? project.location.ar : project.location.en;
                const summary = isAr ? project.summary.ar : project.summary.en;

                return (
                  <article
                    key={project.id}
                    className={`group rounded-2xl bg-[#121212] border border-[#F4F0E8]/15 hover:border-[#FFB629]/60 transition-all duration-300 flex flex-col overflow-hidden ${
                      !hasPhoto ? 'self-start' : ''
                    } ${
                      index === 0 && companyFilter === 'ALL' && hasPhoto && !searchQuery.trim() ? 'md:col-span-2' : ''
                    }`}
                  >
                    {/* Photograph-led case studies; text-only activities have no image slot. */}
                    {project.imageUrl && (
                      <div
                        onClick={() => setSelectedProject(project)}
                        className={`relative overflow-hidden bg-[#0A0A0A] cursor-pointer ${
                          index === 0 && companyFilter === 'ALL' && !searchQuery.trim()
                            ? 'aspect-[16/8]'
                            : 'aspect-[16/10]'
                        }`}
                      >
                        <img
                          src={project.imageUrl}
                          alt={title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-85" />

                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono-tech">
                          <span className="px-3 py-1 rounded-md bg-[#0B0B0B]/90 text-[#FFB629] border border-[#F4F0E8]/15 font-bold">
                            {project.company} ADVERTISING
                          </span>
                          <span className="px-3 py-1 rounded-md bg-[#0B0B0B]/90 text-[#F4F0E8]/80 border border-[#F4F0E8]/15">
                            {project.year}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech text-[#F4F0E8]/90">
                          <span className="px-2 py-1 rounded-md bg-[#0B0B0B]/85 border border-[#F4F0E8]/15">
                            {isAr ? project.imageCaption?.ar : project.imageCaption?.en}
                          </span>
                          <span className="text-[#FFB629] px-2 py-1 rounded-md bg-[#0B0B0B]/85">{location}</span>
                        </div>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className={`p-6 sm:p-8 space-y-6 ${hasPhoto ? 'flex-1 flex flex-col justify-between' : ''}`}>
                      <div className="space-y-3">
                        {!project.imageUrl && (
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-[#F4F0E8]/10">
                            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FFB629]">
                              {project.company} · {project.year}
                            </span>
                            <span className="text-xs text-[#B8B8B8]">{location}</span>
                          </div>
                        )}
                        <div className="text-xs font-mono-tech text-[#B8B8B8] uppercase tracking-wider">
                          {project.company} · {project.sourceName}
                        </div>
                        <h3
                          onClick={() => setSelectedProject(project)}
                          className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-[#FFB629] transition-colors cursor-pointer"
                        >
                          {title}
                        </h3>
                        <p className="text-sm text-[#B8B8B8] leading-relaxed">
                          {summary}
                        </p>
                      </div>

                      <div className="pt-5 border-t border-[#F4F0E8]/10 flex flex-wrap items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-white group-hover:text-[#FFB629] cursor-pointer"
                        >
                          <span>
                            {isAr ? 'تفاصيل النشاط والمصدر' : 'View Project & Citation'}
                          </span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>

                        <a
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-[#B8B8B8] hover:text-[#FFB629]"
                        >
                          <Newspaper className="w-3.5 h-3.5" />
                          <span>{project.sourceName}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </article>
                );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 5: PRESS AND RECOGNITION
            ========================================================= */}
        <section
          id="press"
          className="py-24 sm:py-32 border-t border-[#F4F0E8]/15 bg-[#121212]/92 backdrop-blur-md"
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#F4F0E8]/15">
              <div>
                <div className="font-mono-tech text-xs uppercase tracking-[0.25em] text-[#FFB629] mb-3">
                  {isAr ? '05 / التغطية الصحفية والتكريم' : '05 / PRESS & PUBLIC RECOGNITION'}
                </div>
                <h2 className="font-display text-4xl sm:text-6xl font-bold text-white">
                  {isAr ? 'الأخبار والتكريم الرسمي' : 'VERIFIED PRESS ARCHIVE'}
                </h2>
              </div>
              <p className="max-w-md text-sm text-[#B8B8B8]">
                {isAr
                  ? 'تغطيات صحفية موثقة لتكريم شريف محسن (SH للإعلان) وتكريم شركة أحمس للإعلان في محافظة المنيا.'
                  : 'Verified Egyptian press coverage documenting Sherif Mohsen’s SH Advertising recognition in July 2026 alongside AHMOS Advertising’s public recognition.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {data.press.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl bg-[#0B0B0B] border border-[#F4F0E8]/15 flex flex-col overflow-hidden hover:border-[#FFB629]/50 transition-colors"
                >
                  {item.imageUrl && (
                    <figure className="border-b border-[#F4F0E8]/15">
                      <div className="w-full aspect-[16/9] overflow-hidden bg-[#080808]">
                        <img
                          src={item.imageUrl}
                          alt={isAr ? item.imageCaption?.ar ?? item.title.ar : item.imageCaption?.en ?? item.title.en}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <figcaption className="px-5 py-3 flex flex-wrap items-center gap-2 justify-between text-[11px] font-mono-tech text-[#B8B8B8] leading-relaxed">
                        <span>{isAr ? item.imageCaption?.ar : item.imageCaption?.en}</span>
                        {item.imageSourceUrl ? (
                          <a
                            href={item.imageSourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-1 text-[#FFB629] hover:underline"
                          >
                            {isAr ? 'مصدر الصورة' : 'Photo source'}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span>{isAr ? 'صورة مقدمة من صاحب المشروع' : 'Client-provided photograph'}</span>
                        )}
                      </figcaption>
                    </figure>
                  )}

                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono-tech">
                      <span className="text-[#FFB629] font-bold">
                        {item.entity} ADVERTISING
                      </span>
                      <span className="text-[#B8B8B8]">{item.date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono-tech text-[#F4F0E8]/75">
                      <Award className="w-4 h-4 text-[#FFB629]" />
                      <span>{item.sourceName}</span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                      {isAr ? item.title.ar : item.title.en}
                    </h3>

                    <p className="text-sm text-[#B8B8B8] leading-relaxed">
                      {isAr ? item.summary.ar : item.summary.en}
                    </p>

                    <div className="p-3 rounded-lg bg-[#1C1C1C] border-l-2 border-[#FFB629] text-xs font-mono-tech text-[#F4F0E8]/80">
                      {isAr ? item.factualNote.ar : item.factualNote.en}
                    </div>
                  </div>

                    <div className="pt-4 border-t border-[#F4F0E8]/10">
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between w-full text-xs font-mono-tech uppercase tracking-wider text-[#FFB629] hover:underline"
                    >
                      <span>
                        {isAr ? 'قراءة الخبر من المصدر' : 'Read Original Press Article'}
                      </span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 6: CONTACT & NFC KEYCHAIN HUB
            ========================================================= */}
        <ProjectInquirySection data={data} lang={lang} />
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#F4F0E8]/15 bg-[#080808] py-12 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <FragmentLogo
            logoUrl={data.personal.logoUrl}
            nameEn={data.personal.nameEn}
            nameAr={data.personal.nameAr}
            lang={lang}
            accentColor={data.tokens.accent}
          />

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono-tech text-[#B8B8B8]">
            <a
              href={`tel:${cleanPhone}`}
              className="hover:text-[#FFB629]"
              dir="ltr"
            >
              {data.personal.phone}
            </a>
            <span>·</span>
            <a
              href={`mailto:${data.personal.email}`}
              className="hover:text-[#FFB629]"
            >
              {data.personal.email}
            </a>
            <span>·</span>
            <button
              type="button"
              onClick={handleToggleNfcMode}
              className="text-[#FFB629] hover:underline cursor-pointer"
            >
              /nfc/sherif
            </button>
          </div>
        </div>
      </footer>

      {/* PROJECT DETAIL MODAL */}
      <CaseStudyModal
        project={selectedProject}
        lang={lang}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
