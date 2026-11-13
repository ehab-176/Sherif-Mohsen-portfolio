import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { DEFAULT_SHERIF_PORTFOLIO } from '../data/studioData';
import { verifiedSocialUrl } from '../components/SocialLinks';
import {
  addSherifProject,
  compute3DMonolithLayout,
  filterSherifProjects,
  generateSherifVcf,
  orderSherifProjectsForDisplay,
  removeSherifProject,
  reorderSherifProjects,
  togglePortfolioLanguage,
  updateSherifProject,
  validateContactSubmission,
  validateSherifJsonImport,
} from './studioLogic';

test('compute3DMonolithLayout computes 3D positions and rotations across scroll and time', () => {
  const heroPoses = compute3DMonolithLayout(0, 0, 0, 0, 8, 1.0);
  assert.equal(heroPoses.length, 8);
  assert.ok(heroPoses[0].x < 0);
  assert.ok(heroPoses[7].x > 0);

  const scrolledPoses = compute3DMonolithLayout(0.8, 0.4, -0.3, 2.5, 8, 1.0);
  assert.equal(scrolledPoses.length, 8);
  assert.notEqual(heroPoses[2].y, scrolledPoses[2].y);
  assert.notEqual(heroPoses[2].ry, scrolledPoses[2].ry);
});

test('generateSherifVcf outputs valid vCard 3.0 with verified Sherif Mohsen details', () => {
  const vcf = generateSherifVcf(DEFAULT_SHERIF_PORTFOLIO);
  assert.ok(vcf.includes('BEGIN:VCARD'));
  assert.ok(vcf.includes('FN:Sherif Mohsen (شريف محسن)'));
  assert.ok(vcf.includes('TEL;TYPE=CELL,VOICE:+201000098600'));
  assert.ok(vcf.includes('EMAIL;TYPE=INTERNET,WORK:sherif2rb@gmail.com'));
  assert.ok(vcf.includes('AHMOS Advertising (Former Manager)'));
  assert.ok(vcf.includes('END:VCARD'));
});

test('profile content uses former AHMOS role and the user-provided social URLs', () => {
  const p = DEFAULT_SHERIF_PORTFOLIO.personal;
  assert.match(p.ahmosRole.ar, /المدير السابق/);
  assert.match(p.communityRole.ar, /أمين مساعد الإعلام/);
  assert.deepEqual(p.socialLinks, {
    facebook: 'https://www.facebook.com/share/1DyC588ixh/',
    instagram: 'https://www.instagram.com/sherif2rb/',
  });
  assert.equal(verifiedSocialUrl(p.socialLinks.facebook, 'facebook'), p.socialLinks.facebook);
  assert.equal(verifiedSocialUrl(p.socialLinks.instagram, 'instagram'), p.socialLinks.instagram);
});

test('social links require real HTTPS URLs for the matching platform', () => {
  assert.equal(verifiedSocialUrl('', 'facebook'), null);
  assert.equal(verifiedSocialUrl('https://facebook.com/sherif.example', 'facebook'), 'https://facebook.com/sherif.example');
  assert.equal(verifiedSocialUrl('https://instagram.com/sherif.example', 'instagram'), 'https://instagram.com/sherif.example');
  assert.equal(verifiedSocialUrl('http://instagram.com/sherif.example', 'instagram'), null);
  assert.equal(verifiedSocialUrl('https://evil-instagram.com/sherif.example', 'instagram'), null);
  assert.equal(verifiedSocialUrl('javascript:alert(1)', 'facebook'), null);
  assert.equal(verifiedSocialUrl('https://instagram.com/sherif.example', 'facebook'), null);
});

test('filterSherifProjects filters accurately by ALL, SH, AHMOS and bilingual search', () => {
  const all = filterSherifProjects(DEFAULT_SHERIF_PORTFOLIO.projects, 'ALL');
  assert.equal(all.length, 7);

  const shOnly = filterSherifProjects(DEFAULT_SHERIF_PORTFOLIO.projects, 'SH');
  assert.equal(shOnly.length, 3);
  assert.ok(shOnly.every((p) => p.company === 'SH'));

  const ahmosOnly = filterSherifProjects(DEFAULT_SHERIF_PORTFOLIO.projects, 'AHMOS');
  assert.equal(ahmosOnly.length, 4);
  assert.ok(ahmosOnly.every((p) => p.company === 'AHMOS'));

  const arabicSearch = filterSherifProjects(
    DEFAULT_SHERIF_PORTFOLIO.projects,
    'ALL',
    'المتحف المصري الكبير'
  );
  assert.equal(arabicSearch.length, 1);
  assert.equal(arabicSearch[0].id, 'sh-gem-broadcast-minya');
});

test('documented event photos are attributed; unmatched projects have no images', () => {
  const projects = new Map(DEFAULT_SHERIF_PORTFOLIO.projects.map((project) => [project.id, project]));
  const realEventPhotos = [
    'sh-abu-shanab-square',
    'sh-gem-broadcast-minya',
    'sh-egypt-fanzone',
    'ahmos-cairo-art-house-square',
  ];
  const textOnlyCards = [
    'ahmos-minya-led-installations',
    'ahmos-minya-station-square',
    'ahmos-sadat-city-concession',
  ];

  for (const id of realEventPhotos) {
    const project = projects.get(id);
    assert.ok(project, `Missing project: ${id}`);
    assert.ok(project.imageUrl, id);
    assert.ok(project.imageSourceUrl?.startsWith('https://'), id);
    assert.ok(project.imageCaption?.ar, id);
    assert.ok(existsSync(new URL(`../../public${project.imageUrl}`, import.meta.url)), `Missing image for ${id}`);
  }

  for (const id of textOnlyCards) {
    const project = projects.get(id);
    assert.ok(project, `Missing project: ${id}`);
    assert.equal(project.imageUrl, undefined, `Expected no image slot for ${id}`);
  }

  const displayed = orderSherifProjectsForDisplay(DEFAULT_SHERIF_PORTFOLIO.projects);
  assert.equal(displayed.length, 7);
  assert.ok(displayed.slice(0, 4).every((project) => Boolean(project.imageUrl)));
  assert.ok(displayed.slice(4).every((project) => !project.imageUrl));
  assert.deepEqual(displayed.slice(4).map((project) => project.id), textOnlyCards);
  assert.equal(DEFAULT_SHERIF_PORTFOLIO.projects.length, 7, 'Display ordering does not mutate the original records');

  assert.match(projects.get('ahmos-cairo-art-house-square')!.attributionNote.ar, /٢٠٢٢/);
  assert.equal(projects.get('sh-abu-shanab-square')!.year, '2025');

  const press = new Map(DEFAULT_SHERIF_PORTFOLIO.press.map((item) => [item.id, item]));
  const sherifAward = press.get('press-sh-july-2026')!;
  const ahmosAward = press.get('press-ahmos-minya-2026')!;
  assert.match(sherifAward.imageUrl!, /press_sh_sherif_award_user_2026/);
  assert.match(ahmosAward.imageCaption!.ar, /محمود عبد الدايم/);
  assert.notEqual(sherifAward.imageUrl, ahmosAward.imageUrl);
});

test('project CRUD, visibility, and reordering work deterministically', () => {
  const added = addSherifProject(DEFAULT_SHERIF_PORTFOLIO, {
    company: 'SH',
    year: '2026',
    location: { en: 'Minya, Egypt', ar: 'المنيا، مصر' },
    title: { en: 'Corniche Digital Totems', ar: 'شاشات كورنيش النيل بالمنيا' },
    summary: { en: 'Urban screen network.', ar: 'شبكة شاشات حضرية.' },
    details: { en: 'Conceptual study.', ar: 'دراسة تصورية.' },
    attributionNote: { en: 'Conceptual.', ar: 'تصوري.' },
    sourceName: 'SH Archive',
    sourceUrl: 'https://bluetags.online/bc71855',
    imageUrl: DEFAULT_SHERIF_PORTFOLIO.projects[0].imageUrl,
    visible: true,
  });
  assert.equal(added.projects.length, 8);

  const hidden = updateSherifProject(added, added.projects[7].id, { visible: false });
  assert.equal(filterSherifProjects(hidden.projects, 'ALL', '', false).length, 7);
  assert.equal(filterSherifProjects(hidden.projects, 'ALL', '', true).length, 8);

  const reordered = reorderSherifProjects(hidden, 0, 2);
  assert.equal(reordered.projects[2].id, 'sh-abu-shanab-square');

  const removed = removeSherifProject(reordered, added.projects[7].id);
  assert.equal(removed.projects.length, 7);
});

test('togglePortfolioLanguage and validateContactSubmission work properly', () => {
  const arData = togglePortfolioLanguage(DEFAULT_SHERIF_PORTFOLIO, 'AR');
  assert.equal(arData.language, 'AR');

  const badContact = validateContactSubmission({
    name: 'S',
    email: 'invalid',
    phone: '123',
    companyTarget: 'SH',
    scope: '',
    message: 'short',
  });
  assert.equal(badContact.valid, false);
  assert.ok(badContact.errors.name);
  assert.ok(badContact.errors.email);
  assert.ok(badContact.errors.phone);

  const validContact = validateContactSubmission({
    name: 'Tarek Mansour',
    email: 'tarek@agency-eg.com',
    phone: '+20 1001234567',
    companyTarget: 'SH',
    scope: 'Outdoor LED Campaign in Minya',
    message: 'We would like to book outdoor LED screen placements in Minya for Q4.',
  });
  assert.equal(validContact.valid, true);

  const jsonCheck = validateSherifJsonImport(JSON.stringify(DEFAULT_SHERIF_PORTFOLIO));
  assert.equal(jsonCheck.valid, true);
});
