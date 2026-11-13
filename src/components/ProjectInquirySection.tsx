import React, { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Share2,
} from 'lucide-react';
import { LanguageCode, SherifPortfolioData } from '../data/studioData';
import { generateSherifVcf, validateContactSubmission } from '../utils/studioLogic';
import { saveLocalInquiry } from '../utils/localStore';

interface ProjectInquirySectionProps {
  data: SherifPortfolioData;
  lang: LanguageCode;
}

export const ProjectInquirySection: React.FC<ProjectInquirySectionProps> = ({
  data,
  lang,
}) => {
  const isAr = lang === 'AR';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyTarget, setCompanyTarget] = useState<'SH' | 'AHMOS' | 'BOTH'>('SH');
  const [scope, setScope] = useState('Outdoor LED Campaign');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [shareCopied, setShareCopied] = useState(false);

  const cleanPhone = data.personal.phone.replace(/\s+/g, '');
  const whatsappUrl = `https://wa.me/${data.personal.whatsappNumber}`;

  const handleDownloadVcf = () => {
    try {
      const vcfString = generateSherifVcf(data);
      const blob = new Blob([vcfString], { type: 'text/vcard;charset=utf-8' });
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

  const handleShareProfile = async () => {
    const shareData = {
      title: 'Sherif Mohsen (شريف محسن) — SH & AHMOS Advertising',
      text: isAr
        ? 'شريف محسن — صاحب شركة SH للإعلان | المدير السابق في أحمس للإعلان، المنيا'
        : 'Sherif Mohsen — Owner & Chairman of SH Advertising | Former Manager at AHMOS Advertising, Minya, Egypt',
      url: window.location.origin + '/nfc/sherif',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const validation = validateContactSubmission({
      name,
      email,
      phone,
      companyTarget,
      scope,
      message,
    });

    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0] || 'Please check your input.';
      setFeedback({ type: 'error', text: firstError });
      return;
    }

    setSubmitting(true);
    try {
      saveLocalInquiry({ name, email, phone, companyTarget, scope, message });
      setFeedback({
        type: 'success',
        text: isAr
          ? 'تم حفظ الرسالة في هذا المتصفح فقط للمعاينة المحلية. لم يتم إرسالها لأي جهة.'
          : 'Saved in this browser for local preview only. This inquiry was not sent.',
      });
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to send message right now.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative z-10 py-24 sm:py-32 border-t border-[#F4F0E8]/15 bg-[#0B0B0B]/92 backdrop-blur-md"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-14 border-b border-[#F4F0E8]/15">
          <div>
            <div className="font-mono-tech text-xs uppercase tracking-[0.25em] text-[#FFB629] mb-4">
              {isAr ? '06 / التواصل المباشر وبطاقة NFC' : '06 / DIRECT CONTACT & NFC ACTION HUB'}
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white">
              {isAr ? 'تواصل مع شريف محسن' : 'CONNECT WITH SHERIF MOHSEN'}
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#B8B8B8] leading-relaxed">
            {isAr
              ? 'مصمم للوصول الفوري عبر ميدالية NFC الذكية أو المتصفح. احفظ جهة الاتصال مباشرة بصيغة VCF أو تواصل عبر الهاتف أو واتساب أو البريد الإلكتروني.'
              : 'Engineered for instant smartphone access via physical NFC keychain. Save verified contact credentials directly as a VCF card or reach out regarding SH Advertising and AHMOS Advertising.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-14">
          {/* Left Column: Instant NFC Actions & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#1C1C1C] border border-[#F4F0E8]/15 space-y-6">
              <div className="flex items-center justify-between border-b border-[#F4F0E8]/10 pb-5">
                <div>
                  <div className="text-xs font-mono-tech uppercase tracking-widest text-[#FFB629]">
                    {isAr ? 'بطاقة الأعمال الرقمية الموثقة' : 'VERIFIED EXECUTIVE vCARD'}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mt-1">
                    {isAr ? data.personal.nameAr : data.personal.nameEn}
                  </h3>
                  <p className="text-xs text-[#B8B8B8] mt-0.5">
                    {isAr ? data.personal.location.ar : data.personal.location.en}
                  </p>
                </div>
                <img
                  src={data.personal.logoUrl}
                  alt="Sherif Mohsen Emblem"
                  className="w-12 h-12 rounded-full border border-[#F4F0E8]/25 object-cover object-top bg-black p-1"
                />
              </div>

              {/* Primary Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDownloadVcf}
                  className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2.5 px-5 py-4 rounded-lg bg-[#FFB629] text-[#0B0B0B] font-bold text-xs uppercase tracking-[0.16em] hover:bg-[#F4F0E8] transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isAr ? 'حفظ جهة الاتصال (.VCF)' : 'Save Contact Card (.VCF)'}
                  </span>
                </button>

                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg bg-[#0B0B0B] border border-[#F4F0E8]/20 text-white hover:border-[#FFB629] hover:text-[#FFB629] text-xs font-mono-tech uppercase tracking-wider transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#FFB629]" />
                  <span>{isAr ? 'اتصال هاتفي' : 'Click to Call'}</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg bg-[#0B0B0B] border border-[#F4F0E8]/20 text-white hover:border-[#FFB629] hover:text-[#FFB629] text-xs font-mono-tech uppercase tracking-wider transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#FFB629]" />
                  <span>{isAr ? 'واتساب مباشر' : 'WhatsApp'}</span>
                </a>

                <a
                  href={`mailto:${data.personal.email}`}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg bg-[#0B0B0B] border border-[#F4F0E8]/20 text-white hover:border-[#FFB629] hover:text-[#FFB629] text-xs font-mono-tech uppercase tracking-wider transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#FFB629]" />
                  <span>{isAr ? 'إرسال بريد' : 'Direct Email'}</span>
                </a>

                <button
                  type="button"
                  onClick={handleShareProfile}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg bg-[#0B0B0B] border border-[#F4F0E8]/20 text-white hover:border-[#FFB629] hover:text-[#FFB629] text-xs font-mono-tech uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#FFB629]" />
                  <span>
                    {shareCopied
                      ? isAr
                        ? 'تم نسخ الرابط!'
                        : 'NFC Link Copied!'
                      : isAr
                      ? 'مشاركة البطاقة'
                      : 'Share NFC Link'}
                  </span>
                </button>
              </div>

              {/* Direct Details List */}
              <div className="pt-4 border-t border-[#F4F0E8]/10 space-y-3 text-xs font-mono-tech">
                <div className="flex items-center justify-between text-[#B8B8B8]">
                  <span>{isAr ? 'الهاتف:' : 'PHONE:'}</span>
                  <a
                    href={`tel:${cleanPhone}`}
                    dir="ltr"
                    className="text-white hover:text-[#FFB629]"
                  >
                    {data.personal.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between text-[#B8B8B8]">
                  <span>{isAr ? 'البريد الإلكتروني:' : 'EMAIL:'}</span>
                  <a
                    href={`mailto:${data.personal.email}`}
                    className="text-white hover:text-[#FFB629]"
                  >
                    {data.personal.email}
                  </a>
                </div>
                <div className="flex items-center justify-between text-[#B8B8B8]">
                  <span>{isAr ? 'بطاقة BlueTags الأصلية:' : 'ORIGINAL BLUETAGS CARD:'}</span>
                  <a
                    href={data.personal.blueTagsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#FFB629] hover:underline"
                  >
                    <span>bluetags.online/bc71855</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Local-only inquiry form for development previews */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-10 rounded-2xl bg-[#1C1C1C] border border-[#F4F0E8]/15 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#F4F0E8]/10 pb-4">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {isAr ? 'نموذج استفسار تجريبي (محلي)' : 'INQUIRY FORM (LOCAL PREVIEW)'}
                </h3>
                <span className="font-mono-tech text-xs text-[#FFB629]">
                  {isAr ? 'معاينة' : 'PREVIEW'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono-tech uppercase tracking-wider text-[#B8B8B8] mb-2">
                    {isAr ? 'الاسم الكامل *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'الاسم أو المؤسسة' : 'Full Name or Organization'}
                    className="w-full px-4 py-3 rounded-lg bg-[#0B0B0B] border border-[#F4F0E8]/20 text-white text-sm focus:outline-none focus:border-[#FFB629]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech uppercase tracking-wider text-[#B8B8B8] mb-2">
                    {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-lg bg-[#0B0B0B] border border-[#F4F0E8]/20 text-white text-sm focus:outline-none focus:border-[#FFB629]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-mono-tech uppercase tracking-wider text-[#B8B8B8] mb-2">
                    {isAr ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 10..."
                    className="w-full px-4 py-3 rounded-lg bg-[#0B0B0B] border border-[#F4F0E8]/20 text-white text-sm focus:outline-none focus:border-[#FFB629]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech uppercase tracking-wider text-[#B8B8B8] mb-2">
                    {isAr ? 'الجهة المطلوبة' : 'Target Affiliation'}
                  </label>
                  <select
                    value={companyTarget}
                    onChange={(e) =>
                      setCompanyTarget(e.target.value as 'SH' | 'AHMOS' | 'BOTH')
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[#0B0B0B] border border-[#F4F0E8]/20 text-white text-sm focus:outline-none focus:border-[#FFB629]"
                  >
                    <option value="SH">
                      {isAr ? 'SH للدعاية والإعلان' : 'SH Advertising'}
                    </option>
                    <option value="AHMOS">
                      {isAr ? 'أحمس للدعاية والإعلان' : 'AHMOS Advertising'}
                    </option>
                    <option value="BOTH">
                      {isAr ? 'كلا الشركتين / عام' : 'Both / Executive Inquiry'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech uppercase tracking-wider text-[#B8B8B8] mb-2">
                    {isAr ? 'نطاق الطلب' : 'Inquiry Scope'}
                  </label>
                  <input
                    type="text"
                    required
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#0B0B0B] border border-[#F4F0E8]/20 text-white text-sm focus:outline-none focus:border-[#FFB629]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech uppercase tracking-wider text-[#B8B8B8] mb-2">
                  {isAr ? 'تفاصيل الرسالة أو المشروع *' : 'Project or Inquiry Details *'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isAr
                      ? 'اكتب تفاصيل الحملة الإعلانية أو الشاشات الخارجية أو طلب التواصل...'
                      : 'Describe your outdoor LED campaign, urban media project, or executive inquiry...'
                  }
                    className="w-full px-4 py-3 rounded-lg bg-[#0B0B0B] border border-[#F4F0E8]/20 text-white text-sm focus:outline-none focus:border-[#FFB629]"
                />
              </div>

              {feedback && (
                <div
                  className={`p-4 rounded-lg border text-xs font-mono-tech flex items-center gap-2.5 ${
                    feedback.type === 'success'
                      ? 'bg-[#FFB629]/10 border-[#FFB629] text-[#FFB629]'
                      : 'bg-red-500/10 border-red-400 text-red-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{feedback.text}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <span className="text-xs text-[#B8B8B8]">
                  {isAr
                    ? 'الحفظ على هذا الجهاز فقط؛ لا يتم إرسال رسائل فعلية.'
                    : 'Local-only storage: no real messages are delivered.'}
                </span>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-lg bg-[#F4F0E8] text-[#0B0B0B] font-bold text-xs uppercase tracking-[0.18em] hover:bg-[#FFB629] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submitting
                      ? isAr
                        ? 'جاري الإرسال...'
                        : 'Sending...'
                      : isAr
                      ? 'إرسال الرسالة'
                      : 'Send Inquiry'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
