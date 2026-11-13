import React, { useEffect } from 'react';
import { ArrowUpRight, Building2, Calendar, Info, MapPin, Newspaper, X } from 'lucide-react';
import { DocumentedProject, LanguageCode } from '../data/studioData';

interface CaseStudyModalProps {
  project: DocumentedProject | null;
  lang: LanguageCode;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  lang,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const isAr = lang === 'AR';
  const title = isAr ? project.title.ar : project.title.en;
  const location = isAr ? project.location.ar : project.location.en;
  const summary = isAr ? project.summary.ar : project.summary.en;
  const details = isAr ? project.details.ar : project.details.en;
  const attributionNote = isAr ? project.attributionNote.ar : project.attributionNote.en;

  const companyName =
    project.company === 'SH'
      ? isAr
        ? 'SH للدعاية والإعلان (المالك ورئيس مجلس الإدارة: شريف محسن)'
        : 'SH Advertising (Owner / Chairman: Sherif Mohsen)'
      : isAr
      ? 'أحمس للدعاية والإعلان AHMOS (المدير السابق: شريف محسن · رئيس مجلس الإدارة: محمود عبد الدايم)'
      : 'AHMOS Advertising (Former Manager: Sherif Mohsen · Chairman: Mahmoud Abdel-Daim)';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-[#121212] border border-[#F4F0E8]/20 text-white shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F0E8]/15 bg-[#0B0B0B]">
          <div className="flex items-center gap-3 font-mono-tech text-xs uppercase tracking-widest text-[#FFB629]">
            <span>{project.company} ADVERTISING</span>
            <span className="text-[#B8B8B8]">·</span>
            <span className="text-[#F4F0E8]/80">{project.sourceName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[#B8B8B8] hover:text-white border border-transparent hover:border-[#F4F0E8]/20 transition-colors cursor-pointer"
              aria-label={isAr ? 'إغلاق' : 'Close modal'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image-less projects open a clean source-led detail view without a blank image area. */}
        {project.imageUrl && (
          <div className="relative aspect-[16/9] w-full bg-[#080808] overflow-hidden border-b border-[#F4F0E8]/15">
            <img
              src={project.imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90" />

            <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2 rounded-lg text-xs font-mono-tech text-[#F4F0E8]/85 bg-[#0B0B0B]/90 border border-[#F4F0E8]/20 px-3.5 py-2 backdrop-blur-md">
              <span className="inline-flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#FFB629] shrink-0" />
                {isAr ? project.imageCaption?.ar : project.imageCaption?.en}
              </span>
              <span className="text-[#FFB629]">{project.year}</span>
            </div>
          </div>
        )}

        {/* Project Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono-tech text-[#B8B8B8] mb-3">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FFB629]" />
                {location}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FFB629]" />
                {project.year}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5 text-[#FFB629]" />
                {project.sourceName}
              </span>
            </div>

            <h2
              id="modal-project-title"
              className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight"
            >
              {title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 border-t border-[#F4F0E8]/15">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#FFB629]">
                {isAr ? 'ملخص النشاط الموثق' : 'Documented Activity Overview'}
              </h3>
              <p className="text-base sm:text-lg text-[#F4F0E8] leading-relaxed font-medium">
                {summary}
              </p>
              <p className="text-sm sm:text-base text-[#B8B8B8] leading-relaxed">
                {details}
              </p>
              <aside className="p-4 rounded-xl border-l-2 border-[#FFB629] bg-[#1C1C1C] text-xs sm:text-sm text-[#F4F0E8]/85 leading-relaxed space-y-2">
                <p>{attributionNote}</p>
                {project.imageSourceUrl && (
                  <a
                    href={project.imageSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#FFB629] hover:underline"
                  >
                    {isAr ? `مصدر الصورة: ${project.imageSourceName}` : `Photograph source: ${project.imageSourceName}`}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </aside>
            </div>

            <div className="bg-[#0B0B0B] rounded-xl border border-[#F4F0E8]/15 p-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] font-mono-tech uppercase tracking-wider text-[#B8B8B8]">
                    {isAr ? 'الجهة والشركة' : 'Company Attribution'}
                  </div>
                  <div className="mt-1.5 text-sm text-white font-medium flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-[#FFB629] shrink-0 mt-0.5" />
                    <span>{companyName}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F4F0E8]/10">
                  <div className="text-[11px] font-mono-tech uppercase tracking-wider text-[#B8B8B8]">
                    {isAr ? 'المصدر الصحفي الموثق' : 'Verified Press Citation'}
                  </div>
                  <div className="mt-1 text-sm text-[#F4F0E8] font-medium">
                    {project.sourceName}
                  </div>
                </div>
              </div>

              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-between px-4 py-3 rounded-lg bg-[#FFB629] text-[#0B0B0B] font-semibold text-xs uppercase tracking-wider hover:bg-[#F4F0E8] transition-colors"
              >
                <span>{isAr ? 'قراءة التغطية الصحفية الأصلية' : 'Read Verified Press Source'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
