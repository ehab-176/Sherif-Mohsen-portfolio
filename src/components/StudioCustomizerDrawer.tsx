import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Download,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import {
  DocumentedProject,
  LanguageCode,
  SherifPortfolioData,
} from '../data/studioData';
import {
  addSherifProject,
  removeSherifProject,
  reorderSherifProjects,
  updateSherifProject,
} from '../utils/studioLogic';
import { listLocalInquiries, type LocalInquiry } from '../utils/localStore';

interface StudioCustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: SherifPortfolioData;
  lang: LanguageCode;
  initialProjectToEdit: DocumentedProject | null;
  onUpdateData: (next: SherifPortfolioData) => void;
  onResetDefault: () => void;
}

export const StudioCustomizerDrawer: React.FC<StudioCustomizerDrawerProps> = ({
  isOpen,
  onClose,
  data,
  lang,
  initialProjectToEdit,
  onUpdateData,
  onResetDefault,
}) => {
  const isAr = lang === 'AR';
  const [activeTab, setActiveTab] = useState<'identity' | 'projects' | 'theme3d' | 'inquiries'>(
    'identity'
  );
  const [editingProject, setEditingProject] = useState<DocumentedProject | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<LocalInquiry[]>([]);

  useEffect(() => {
    if (initialProjectToEdit) {
      setActiveTab('projects');
      setIsAddingNew(false);
      setEditingProject(initialProjectToEdit);
    }
  }, [initialProjectToEdit]);

  useEffect(() => {
    if (isOpen && activeTab === 'inquiries') {
      setInquiries(listLocalInquiries());
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleLocalSave = (nextData: SherifPortfolioData) => {
    onUpdateData(nextData);
    setSaveMessage(
      isAr ? 'تم الحفظ محليًا في هذا المتصفح.' : 'Changes saved in this browser.'
    );
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'sherif-portfolio-data.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleStartNewProject = () => {
    const newProj: DocumentedProject = {
      id: `proj-${Date.now()}`,
      slug: `proj-${Date.now()}`,
      company: 'SH',
      year: '2026',
      location: { en: 'Minya, Egypt', ar: 'المنيا، مصر' },
      title: {
        en: 'New Advertising Campaign or Installation',
        ar: 'مشروع إعلاني أو شاشات عرض جديدة',
      },
      summary: {
        en: 'Documented company-level advertising installation or public participation.',
        ar: 'نشاط إعلاني موثق على مستوى الشركة.',
      },
      details: {
        en: 'Provide verified public details and source citation link for this project.',
        ar: 'أدخل التفاصيل الموثقة ورابط المصدر الصحفي لهذا المشروع.',
      },
      attributionNote: {
        en: 'Company-level activity reported in public press. Original Conceptual Illustration.',
        ar: 'نشاط على مستوى الشركة موثق في الصحافة العامة. تصميم تصوري تعبيري.',
      },
      sourceName: 'El-Watan News',
      sourceUrl: 'https://www.elwatannews.com/news/details/8327886',
      imageUrl:
        data.projects[0]?.imageUrl ||
        '/assets/aistudio/Screenshot_2026-11-10_212319_c5c595a0.png',
      isConceptualIllustration: true,
      visible: true,
      sortOrder: data.projects.length + 1,
    };
    setIsAddingNew(true);
    setEditingProject(newProj);
  };

  const handleSaveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (isAddingNew) {
      const next = addSherifProject(data, {
        company: editingProject.company,
        year: editingProject.year,
        location: editingProject.location,
        title: editingProject.title,
        summary: editingProject.summary,
        details: editingProject.details,
        attributionNote: editingProject.attributionNote,
        sourceName: editingProject.sourceName,
        sourceUrl: editingProject.sourceUrl,
        imageUrl: editingProject.imageUrl,
        isConceptualIllustration: editingProject.isConceptualIllustration,
        visible: editingProject.visible,
      });
      handleLocalSave(next);
    } else {
      const next = updateSherifProject(data, editingProject.id, editingProject);
      handleLocalSave(next);
    }
    setEditingProject(null);
    setIsAddingNew(false);
  };

  const sortedProjects = [...data.projects].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio Admin CMS"
    >
      <div className="w-full max-w-2xl bg-[#141414] border-l border-[#F4F0E8]/20 text-white h-full flex flex-col shadow-2xl">
        {/* Top Drawer Bar */}
        <div className="px-6 py-5 border-b border-[#F4F0E8]/15 bg-[#0F0F0F] flex items-center justify-between gap-4">
          <div>
            <div className="font-mono-tech text-[11px] uppercase tracking-[0.22em] text-[#FFB629]">
              {isAr ? 'لوحة إدارة المحتوى والهوية 3D' : 'ADMIN CMS & 3D ENGINE STUDIO'}
            </div>
            <h2 className="font-display text-xl font-bold text-white mt-0.5">
              {isAr ? 'إدارة موقع شريف محسن' : 'Sherif Mohsen Portfolio CMS'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#FFB629] font-mono-tech border border-[#FFB629]/35 px-2.5 py-1.5">
              {isAr ? 'وضع التطوير المحلي' : 'LOCAL EDIT MODE'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#B8B8B8] hover:text-white border border-transparent hover:border-[#F4F0E8]/20 cursor-pointer"
              aria-label="Close Admin Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 border-b border-[#F4F0E8]/15 bg-[#0B0B0B] text-xs font-mono-tech uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('identity')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'identity'
                ? 'border-[#FFB629] text-[#FFB629] bg-[#1C1C1C]'
                : 'border-transparent text-[#B8B8B8] hover:text-white'
            }`}
          >
            {isAr ? 'الهوية والبيانات' : '1. Identity'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'projects'
                ? 'border-[#FFB629] text-[#FFB629] bg-[#1C1C1C]'
                : 'border-transparent text-[#B8B8B8] hover:text-white'
            }`}
          >
            {isAr ? `المشاريع (${data.projects.length})` : `2. Projects (${data.projects.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('theme3d')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'theme3d'
                ? 'border-[#FFB629] text-[#FFB629] bg-[#1C1C1C]'
                : 'border-transparent text-[#B8B8B8] hover:text-white'
            }`}
          >
            {isAr ? 'الألوان و 3D' : '3. Brand & 3D'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'inquiries'
                ? 'border-[#FFB629] text-[#FFB629] bg-[#1C1C1C]'
                : 'border-transparent text-[#B8B8B8] hover:text-white'
            }`}
          >
            {isAr ? 'الرسائل' : '4. Inquiries'}
          </button>
        </div>

        {/* Status Toast */}
        {saveMessage && (
          <div className="px-6 py-2.5 bg-[#FFB629] text-[#0B0B0B] text-xs font-mono-tech font-semibold flex items-center justify-between">
            <span>{saveMessage}</span>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: IDENTITY & PERSONAL INFO */}
          {activeTab === 'identity' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech uppercase text-[#B8B8B8] mb-1.5">
                    Name (English)
                  </label>
                  <input
                    type="text"
                    value={data.personal.nameEn}
                    onChange={(e) =>
                      handleLocalSave({
                        ...data,
                        personal: { ...data.personal, nameEn: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1C1C1C] border border-[#F4F0E8]/20 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tech uppercase text-[#B8B8B8] mb-1.5">
                    الاسم (بالعربية)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={data.personal.nameAr}
                    onChange={(e) =>
                      handleLocalSave({
                        ...data,
                        personal: { ...data.personal, nameAr: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1C1C1C] border border-[#F4F0E8]/20 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech uppercase text-[#B8B8B8] mb-1.5">
                    SH Advertising Role (EN)
                  </label>
                  <input
                    type="text"
                    value={data.personal.shRole.en}
                    onChange={(e) =>
                      handleLocalSave({
                        ...data,
                        personal: {
                          ...data.personal,
                          shRole: { ...data.personal.shRole, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1C1C1C] border border-[#F4F0E8]/20 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tech uppercase text-[#B8B8B8] mb-1.5">
                    المنصب في SH للإعلان (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={data.personal.shRole.ar}
                    onChange={(e) =>
                      handleLocalSave({
                        ...data,
                        personal: {
                          ...data.personal,
                          shRole: { ...data.personal.shRole, ar: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1C1C1C] border border-[#F4F0E8]/20 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech uppercase text-[#B8B8B8] mb-1.5">
                    AHMOS Role (EN)
                  </label>
                  <input
                    type="text"
                    value={data.personal.ahmosRole.en}
                    onChange={(e) =>
                      handleLocalSave({
                        ...data,
                        personal: {
                          ...data.personal,
                          ahmosRole: { ...data.personal.ahmosRole, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1C1C1C] border border-[#F4F0E8]/20 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tech uppercase text-[#B8B8B8] mb-1.5">
                    المنصب في أحمس AHMOS (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={data.personal.ahmosRole.ar}
                    onChange={(e) =>
                      handleLocalSave({
                        ...data,
                        personal: {
                          ...data.personal,
                          ahmosRole: { ...data.personal.ahmosRole, ar: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1C1C1C] border border-[#F4F0E8]/20 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech uppercase text-[#B8B8B8] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={data.personal.phone}
                    onChange={(e) =>
                      handleLocalSave({
                        ...data,
                        personal: { ...data.personal, phone: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1C1C1C] border border-[#F4F0E8]/20 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tech uppercase text-[#B8B8B8] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={data.personal.email}
                    onChange={(e) =>
                      handleLocalSave({
                        ...data,
                        personal: { ...data.personal, email: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1C1C1C] border border-[#F4F0E8]/20 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech uppercase text-[#B8B8B8] mb-1.5">
                    Portrait Image URL
                  </label>
                  <input
                    type="text"
                    value={data.personal.portraitUrl}
                    onChange={(e) =>
                      handleLocalSave({
                        ...data,
                        personal: { ...data.personal, portraitUrl: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1C1C1C] border border-[#F4F0E8]/20 text-xs font-mono-tech text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tech uppercase text-[#B8B8B8] mb-1.5">
                    Calligraphic Logo URL (3D Medallion)
                  </label>
                  <input
                    type="text"
                    value={data.personal.logoUrl}
                    onChange={(e) =>
                      handleLocalSave({
                        ...data,
                        personal: { ...data.personal, logoUrl: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1C1C1C] border border-[#F4F0E8]/20 text-xs font-mono-tech text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech uppercase text-[#B8B8B8] mb-1.5">
                  Executive Biography (English)
                </label>
                <textarea
                  rows={3}
                  value={data.about.biographyParagraph1.en}
                  onChange={(e) =>
                    handleLocalSave({
                      ...data,
                      about: {
                        ...data.about,
                        biographyParagraph1: {
                          ...data.about.biographyParagraph1,
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#1C1C1C] border border-[#F4F0E8]/20 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-tech uppercase text-[#B8B8B8] mb-1.5">
                  السيرة المهنية الموثقة (بالعربية)
                </label>
                <textarea
                  rows={3}
                  dir="rtl"
                  value={data.about.biographyParagraph1.ar}
                  onChange={(e) =>
                    handleLocalSave({
                      ...data,
                      about: {
                        ...data.about,
                        biographyParagraph1: {
                          ...data.about.biographyParagraph1,
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#1C1C1C] border border-[#F4F0E8]/20 text-sm text-white"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {editingProject ? (
                <form
                  onSubmit={handleSaveProjectForm}
                  className="p-5 bg-[#1C1C1C] border border-[#FFB629]/40 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#F4F0E8]/15 pb-3">
                    <h3 className="font-display font-bold text-base text-[#FFB629]">
                      {isAr ? 'تحرير بيانات المشروع' : 'Edit Documented Project'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setIsAddingNew(false);
                      }}
                      className="text-xs font-mono-tech text-[#B8B8B8] hover:text-white cursor-pointer"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono-tech text-[#B8B8B8] mb-1">
                        Company (SH / AHMOS)
                      </label>
                      <select
                        value={editingProject.company}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            company: e.target.value as 'SH' | 'AHMOS',
                          })
                        }
                        className="w-full px-3 py-2 bg-[#0B0B0B] border border-[#F4F0E8]/20 text-sm text-white"
                      >
                        <option value="SH">SH Advertising</option>
                        <option value="AHMOS">AHMOS Advertising</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono-tech text-[#B8B8B8] mb-1">
                        Year / Period
                      </label>
                      <input
                        type="text"
                        value={editingProject.year}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, year: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#0B0B0B] border border-[#F4F0E8]/20 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech text-[#B8B8B8] mb-1">
                      Title (English)
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.title.en}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          title: { ...editingProject.title, en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#0B0B0B] border border-[#F4F0E8]/20 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech text-[#B8B8B8] mb-1">
                      العنوان (بالعربية)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      required
                      value={editingProject.title.ar}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          title: { ...editingProject.title, ar: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#0B0B0B] border border-[#F4F0E8]/20 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech text-[#B8B8B8] mb-1">
                      Summary (English)
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.summary.en}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          summary: { ...editingProject.summary, en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#0B0B0B] border border-[#F4F0E8]/20 text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono-tech text-[#B8B8B8] mb-1">
                        Source Publication
                      </label>
                      <input
                        type="text"
                        value={editingProject.sourceName}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            sourceName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#0B0B0B] border border-[#F4F0E8]/20 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono-tech text-[#B8B8B8] mb-1">
                        Verified Source URL
                      </label>
                      <input
                        type="url"
                        value={editingProject.sourceUrl}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            sourceUrl: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#0B0B0B] border border-[#F4F0E8]/20 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFB629] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isAr ? 'حفظ المشروع' : 'Save Project'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tech text-[#B8B8B8]">
                    {isAr
                      ? 'إدارة مشاريع SH وأحمس الموثقة (إضافة / تعديل / ترتيب / إخفاء)'
                      : 'Manage SH & AHMOS documented projects (Add / Edit / Reorder / Hide)'}
                  </span>
                  <button
                    type="button"
                    onClick={handleStartNewProject}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FFB629] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider hover:bg-[#F4F0E8] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إضافة مشروع' : 'Add Project'}</span>
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {sortedProjects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className={`p-4 border flex items-center justify-between gap-4 ${
                      proj.visible
                        ? 'bg-[#1C1C1C] border-[#F4F0E8]/15'
                        : 'bg-[#0B0B0B]/50 border-[#F4F0E8]/5 opacity-60'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[11px] font-mono-tech text-[#FFB629]">
                        <span>{proj.company}</span>
                        <span>·</span>
                        <span className="text-[#B8B8B8]">{proj.year}</span>
                      </div>
                      <div className="font-display font-semibold text-sm text-white truncate mt-0.5">
                        {isAr ? proj.title.ar : proj.title.en}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleLocalSave(reorderSherifProjects(data, idx, idx - 1))
                        }
                        disabled={idx === 0}
                        className="p-1.5 border border-[#F4F0E8]/15 text-[#B8B8B8] hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleLocalSave(reorderSherifProjects(data, idx, idx + 1))
                        }
                        disabled={idx === sortedProjects.length - 1}
                        className="p-1.5 border border-[#F4F0E8]/15 text-[#B8B8B8] hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleLocalSave(
                            updateSherifProject(data, proj.id, { visible: !proj.visible })
                          )
                        }
                        className="p-1.5 border border-[#F4F0E8]/15 text-[#B8B8B8] hover:text-[#FFB629] cursor-pointer"
                        title="Toggle Visibility"
                      >
                        {proj.visible ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNew(false);
                          setEditingProject(proj);
                        }}
                        className="px-2.5 py-1 border border-[#F4F0E8]/20 text-xs font-mono-tech text-white hover:border-[#FFB629] cursor-pointer"
                      >
                        {isAr ? 'تعديل' : 'Edit'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleLocalSave(removeSherifProject(data, proj.id))
                        }
                        className="p-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BRAND PALETTE & THREE.JS 3D SCENE */}
          {activeTab === 'theme3d' && (
            <div className="space-y-6">
              <div className="p-5 bg-[#1C1C1C] border border-[#F4F0E8]/15 space-y-4">
                <h3 className="font-mono-tech text-xs uppercase tracking-widest text-[#FFB629]">
                  {isAr ? 'رموز الألوان (Tokens)' : 'Brand Color Tokens'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tech text-[#B8B8B8] mb-1.5">
                      Accent (#FFB629)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={data.tokens.accent}
                        onChange={(e) =>
                          handleLocalSave({
                            ...data,
                            tokens: { ...data.tokens, accent: e.target.value },
                          })
                        }
                        className="w-9 h-9 bg-transparent border border-[#F4F0E8]/20 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={data.tokens.accent}
                        onChange={(e) =>
                          handleLocalSave({
                            ...data,
                            tokens: { ...data.tokens, accent: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-[#0B0B0B] border border-[#F4F0E8]/20 text-xs font-mono-tech text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech text-[#B8B8B8] mb-1.5">
                      Light Surface (#F4F0E8)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={data.tokens.lightSurface}
                        onChange={(e) =>
                          handleLocalSave({
                            ...data,
                            tokens: { ...data.tokens, lightSurface: e.target.value },
                          })
                        }
                        className="w-9 h-9 bg-transparent border border-[#F4F0E8]/20 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={data.tokens.lightSurface}
                        onChange={(e) =>
                          handleLocalSave({
                            ...data,
                            tokens: { ...data.tokens, lightSurface: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-[#0B0B0B] border border-[#F4F0E8]/20 text-xs font-mono-tech text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech text-[#B8B8B8] mb-1.5">
                      Background (#0B0B0B)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={data.tokens.background}
                        onChange={(e) =>
                          handleLocalSave({
                            ...data,
                            tokens: { ...data.tokens, background: e.target.value },
                          })
                        }
                        className="w-9 h-9 bg-transparent border border-[#F4F0E8]/20 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={data.tokens.background}
                        onChange={(e) =>
                          handleLocalSave({
                            ...data,
                            tokens: { ...data.tokens, background: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-[#0B0B0B] border border-[#F4F0E8]/20 text-xs font-mono-tech text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-[#1C1C1C] border border-[#F4F0E8]/15 space-y-5">
                <h3 className="font-mono-tech text-xs uppercase tracking-widest text-[#FFB629]">
                  {isAr ? 'إعدادات مجسمات WebGL الثلاثية الأبعاد' : 'Three.js WebGL 3D Geometry Controls'}
                </h3>

                <div>
                  <div className="flex justify-between text-xs font-mono-tech mb-1.5">
                    <span>Extruded 3D Monolith Count</span>
                    <span className="text-[#FFB629]">{data.scene.monolithCount}</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={12}
                    step={1}
                    value={data.scene.monolithCount}
                    onChange={(e) =>
                      handleLocalSave({
                        ...data,
                        scene: { ...data.scene, monolithCount: Number(e.target.value) },
                      })
                    }
                    className="w-full accent-[#FFB629]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono-tech mb-1.5">
                    <span>3D Orbital &amp; Medallion Motion Intensity</span>
                    <span className="text-[#FFB629]">{data.scene.motionIntensity.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2.0}
                    step={0.1}
                    value={data.scene.motionIntensity}
                    onChange={(e) =>
                      handleLocalSave({
                        ...data,
                        scene: {
                          ...data.scene,
                          motionIntensity: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-[#FFB629]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-mono-tech cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.scene.medallionVisible}
                      onChange={(e) =>
                        handleLocalSave({
                          ...data,
                          scene: { ...data.scene, medallionVisible: e.target.checked },
                        })
                      }
                      className="accent-[#FFB629]"
                    />
                    <span>3D Medallion</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-mono-tech cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.scene.orbitalRings}
                      onChange={(e) =>
                        handleLocalSave({
                          ...data,
                          scene: { ...data.scene, orbitalRings: e.target.checked },
                        })
                      }
                      className="accent-[#FFB629]"
                    />
                    <span>3D Rings</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-mono-tech cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.scene.ambientParticles}
                      onChange={(e) =>
                        handleLocalSave({
                          ...data,
                          scene: { ...data.scene, ambientParticles: e.target.checked },
                        })
                      }
                      className="accent-[#FFB629]"
                    />
                    <span>Particles</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              {inquiries.length === 0 ? (
                <div className="p-6 bg-[#1C1C1C] border border-[#F4F0E8]/15 text-xs font-mono-tech text-[#B8B8B8]">
                  {isAr ? 'لا توجد رسائل واردة حتى الآن.' : 'No inquiries recorded yet.'}
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 bg-[#1C1C1C] border border-[#F4F0E8]/15 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-mono-tech text-[#FFB629]">
                      <span>
                        {inq.name} ({inq.email})
                      </span>
                      <span>{inq.companyTarget || 'SH'}</span>
                    </div>
                    <p className="text-sm text-white">{inq.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#F4F0E8]/15 bg-[#0F0F0F] flex flex-wrap gap-4 items-center justify-between">
          <button
            type="button"
            onClick={onResetDefault}
            className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-[#B8B8B8] hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'استعادة الإعدادات الأصلية' : 'Reset Verified Defaults'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button type="button" onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-[#FFB629] hover:underline cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              {isAr ? 'تصدير نسخة JSON' : 'Export JSON Backup'}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-2 bg-[#FFB629] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider hover:bg-[#F4F0E8] cursor-pointer">
              {isAr ? 'تم' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
