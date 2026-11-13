import {
  CompanyCode,
  DEFAULT_SHERIF_PORTFOLIO,
  DocumentedProject,
  LanguageCode,
  SherifPortfolioData,
} from '../data/studioData';

export interface ContactSubmissionInput {
  name: string;
  email: string;
  phone: string;
  companyTarget: 'SH' | 'AHMOS' | 'BOTH';
  scope: string;
  message: string;
}

export interface Monolith3DPose {
  index: number;
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  scale: number;
}

/**
 * Pure 3D spatial layout calculator for the Three.js WebGL scene.
 * Computes genuine 3D world-space positions (x, y, z) and 3-axis rotations (rx, ry, rz)
 * for the beveled 3D architectural monoliths across scroll stages and ambient orbital time.
 */
export function compute3DMonolithLayout(
  scrollProgress: number,
  pointerX: number,
  pointerY: number,
  elapsedSec: number,
  monolithCount: number,
  motionIntensity = 1.0
): Monolith3DPose[] {
  const count = Math.max(4, Math.min(12, Math.round(monolithCount)));
  const s = Math.max(0, Math.min(2, scrollProgress));
  const px = Math.max(-1, Math.min(1, pointerX)) * motionIntensity;
  const py = Math.max(-1, Math.min(1, pointerY)) * motionIntensity;
  const waveTime = elapsedSec * 0.65 * motionIntensity;

  const poses: Monolith3DPose[] = [];

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1); // 0 .. 1

    // Hero formation: sweeping 3D helical arc from top-left (-5.8, 2.2, -1.5) to bottom-right (5.8, -1.8, 1.2)
    const heroX = -5.6 + t * 11.2;
    const heroY = 2.1 - t * 3.8 + Math.sin(t * Math.PI) * 0.55;
    const heroZ = -1.8 + Math.sin(t * Math.PI * 1.2) * 2.4;
    const heroRx = 0.38 - t * 0.28 + Math.sin(waveTime + i * 0.7) * 0.08;
    const heroRy = -0.82 + t * 0.72 + Math.cos(waveTime * 0.8 + i * 0.5) * 0.1;
    const heroRz = 0.42 - t * 0.24;

    // Scrolled formation (About / Companies / Projects): architectural colonnade arch in upper depth
    const archAngle = (t - 0.5) * Math.PI * 0.88;
    const archX = Math.sin(archAngle) * 6.8;
    const archY = 1.65 + Math.cos(archAngle) * 1.15;
    const archZ = -2.6 - Math.cos(archAngle) * 1.4;
    const archRx = 0.28 + Math.sin(waveTime + i) * 0.06;
    const archRy = -archAngle * 0.85;
    const archRz = -0.18 + t * 0.36;

    const blend = smoothstep(0, 0.75, Math.min(0.75, s));

    const x = lerp(heroX, archX, blend) + px * (0.45 + t * 0.35);
    const y =
      lerp(heroY, archY, blend) +
      py * (0.35 + t * 0.25) +
      Math.sin(waveTime + i * 0.9) * 0.12 * motionIntensity;
    const z = lerp(heroZ, archZ, blend);
    const rx = lerp(heroRx, archRx, blend) - py * 0.18;
    const ry = lerp(heroRy, archRy, blend) + px * 0.24;
    const rz = lerp(heroRz, archRz, blend);

    poses.push({
      index: i,
      x,
      y,
      z,
      rx,
      ry,
      rz,
      scale: 0.88 + Math.sin(t * Math.PI) * 0.18,
    });
  }

  return poses;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Generates an RFC-6350 / vCard 3.0 compliant contact card for Sherif Mohsen
 * suitable for instant NFC smartphone saving.
 */
export function generateSherifVcf(data: SherifPortfolioData): string {
  const p = data.personal;
  const cleanPhone = p.phone.replace(/\s+/g, '');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${p.nameEn} (${p.nameAr})`,
    `N:Mohsen;Sherif;;;`,
    `ORG:SH Advertising / AHMOS Advertising`,
    `TITLE:${p.shRole.en} | ${p.ahmosRole.en}`,
    `TEL;TYPE=CELL,VOICE:${cleanPhone}`,
    `EMAIL;TYPE=INTERNET,WORK:${p.email}`,
    `ADR;TYPE=WORK:;;Minya;Minya Governorate;;Egypt;Minya, Egypt`,
    `URL:${p.blueTagsUrl}`,
    `NOTE:SH Advertising (Owner / Chairman) | AHMOS Advertising (Former Manager) | Nation's Future Party, Minya (Assistant Media Secretary). Location: Minya, Egypt.`,
    'END:VCARD',
  ];
  return lines.join('\r\n');
}

export function filterSherifProjects(
  projects: DocumentedProject[],
  companyFilter: CompanyCode,
  searchQuery = '',
  includeHidden = false
): DocumentedProject[] {
  const q = searchQuery.trim().toLowerCase();

  return [...projects]
    .filter((proj) => {
      if (!includeHidden && !proj.visible) return false;
      const matchesCompany =
        companyFilter === 'ALL' || proj.company === companyFilter;
      if (!matchesCompany) return false;

      if (!q) return true;
      return (
        proj.title.en.toLowerCase().includes(q) ||
        proj.title.ar.toLowerCase().includes(q) ||
        proj.summary.en.toLowerCase().includes(q) ||
        proj.summary.ar.toLowerCase().includes(q) ||
        proj.location.en.toLowerCase().includes(q) ||
        proj.location.ar.toLowerCase().includes(q) ||
        proj.sourceName.toLowerCase().includes(q) ||
        proj.company.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Show sourced event photographs first, then concise text-only source cards. */
export function orderSherifProjectsForDisplay(projects: DocumentedProject[]): DocumentedProject[] {
  return [...projects].sort((a, b) => {
    const photoPriority = Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl));
    return photoPriority || a.sortOrder - b.sortOrder;
  });
}

export function togglePortfolioLanguage(
  data: SherifPortfolioData,
  targetLang: LanguageCode
): SherifPortfolioData {
  if (data.language === targetLang) return data;
  return {
    ...data,
    language: targetLang,
  };
}

export function updateSherifProject(
  data: SherifPortfolioData,
  projectId: string,
  updates: Partial<DocumentedProject>
): SherifPortfolioData {
  return {
    ...data,
    projects: data.projects.map((p) =>
      p.id === projectId ? { ...p, ...updates } : p
    ),
  };
}

export function addSherifProject(
  data: SherifPortfolioData,
  draft: Omit<DocumentedProject, 'id' | 'slug' | 'sortOrder'>
): SherifPortfolioData {
  const id = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const slug =
    draft.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || id;

  const newProj: DocumentedProject = {
    ...draft,
    id,
    slug,
    sortOrder: data.projects.length + 1,
  };

  return {
    ...data,
    projects: [...data.projects, newProj],
  };
}

export function removeSherifProject(
  data: SherifPortfolioData,
  projectId: string
): SherifPortfolioData {
  if (data.projects.length <= 1) return data;
  const remaining = data.projects
    .filter((p) => p.id !== projectId)
    .map((p, idx) => ({ ...p, sortOrder: idx + 1 }));
  return {
    ...data,
    projects: remaining,
  };
}

export function reorderSherifProjects(
  data: SherifPortfolioData,
  fromIndex: number,
  toIndex: number
): SherifPortfolioData {
  const sorted = [...data.projects].sort((a, b) => a.sortOrder - b.sortOrder);
  if (
    fromIndex < 0 ||
    fromIndex >= sorted.length ||
    toIndex < 0 ||
    toIndex >= sorted.length ||
    fromIndex === toIndex
  ) {
    return data;
  }
  const [moved] = sorted.splice(fromIndex, 1);
  sorted.splice(toIndex, 0, moved);
  const reindexed = sorted.map((p, idx) => ({ ...p, sortOrder: idx + 1 }));
  return {
    ...data,
    projects: reindexed,
  };
}

export function validateContactSubmission(input: ContactSubmissionInput): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!input.phone || input.phone.trim().length < 7) {
    errors.phone = 'Please provide a valid phone or WhatsApp number.';
  }

  if (!input.scope || !input.scope.trim()) {
    errors.scope = 'Please select an inquiry category.';
  }

  if (!input.message || input.message.trim().length < 10) {
    errors.message = 'Please enter a message (at least 10 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSherifJsonImport(rawJson: string): {
  valid: boolean;
  data?: SherifPortfolioData;
  error?: string;
} {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'Root JSON must be an object.' };
    }
    if (!parsed.personal || typeof parsed.personal.nameEn !== 'string') {
      return { valid: false, error: 'Missing required "personal.nameEn" string.' };
    }
    if (!Array.isArray(parsed.projects)) {
      return { valid: false, error: 'Missing required "projects" array.' };
    }
    return {
      valid: true,
      data: {
        ...DEFAULT_SHERIF_PORTFOLIO,
        ...parsed,
        personal: { ...DEFAULT_SHERIF_PORTFOLIO.personal, ...parsed.personal },
        hero: { ...DEFAULT_SHERIF_PORTFOLIO.hero, ...(parsed.hero || {}) },
        about: { ...DEFAULT_SHERIF_PORTFOLIO.about, ...(parsed.about || {}) },
        companies: {
          ...DEFAULT_SHERIF_PORTFOLIO.companies,
          ...(parsed.companies || {}),
        },
        tokens: { ...DEFAULT_SHERIF_PORTFOLIO.tokens, ...(parsed.tokens || {}) },
        scene: { ...DEFAULT_SHERIF_PORTFOLIO.scene, ...(parsed.scene || {}) },
      },
    };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Invalid JSON syntax.',
    };
  }
}
