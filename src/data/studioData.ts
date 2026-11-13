export type LanguageCode = 'EN' | 'AR';
export type CompanyCode = 'ALL' | 'SH' | 'AHMOS';

export interface BilingualText {
  en: string;
  ar: string;
}

export interface SocialProfileLinks {
  facebook: string;
  instagram: string;
}

export interface BrandTokens {
  background: string; // default #0B0B0B
  lightSurface: string; // default #F4F0E8
  primaryText: string; // default #FFFFFF
  accent: string; // default #FFB629
  secondaryText: string; // default #B8B8B8
}

export interface Scene3DSettings {
  monolithCount: number;
  finish: 'electric-lime' | 'titanium' | 'obsidian-gold' | 'warm-ivory';
  ambientParticles: boolean;
  orbitalRings: boolean;
  medallionVisible: boolean;
  motionIntensity: number;
}

export interface DocumentedProject {
  id: string;
  slug: string;
  company: 'SH' | 'AHMOS';
  year: string;
  location: BilingualText;
  title: BilingualText;
  summary: BilingualText;
  details: BilingualText;
  attributionNote: BilingualText;
  sourceName: string;
  sourceUrl: string;
  imageUrl?: string;
  imageCaption?: BilingualText;
  imageSourceName?: string;
  imageSourceUrl?: string;
  visible: boolean;
  sortOrder: number;
}

export interface PressRecognitionItem {
  id: string;
  date: string;
  entity: 'SH' | 'AHMOS';
  title: BilingualText;
  summary: BilingualText;
  factualNote: BilingualText;
  sourceName: string;
  sourceUrl: string;
  imageUrl?: string;
  imageCaption?: BilingualText;
  imageSourceName?: string;
  imageSourceUrl?: string;
}

export interface CompanyProfile {
  code: 'SH' | 'AHMOS';
  name: BilingualText;
  sherifRole: BilingualText;
  governanceNote: BilingualText;
  description: BilingualText;
  focusAreas: { en: string[]; ar: string[] };
}

export interface SherifPortfolioData {
  profileId: string;
  language: LanguageCode;
  personal: {
    nameEn: string;
    nameAr: string;
    industry: BilingualText;
    location: BilingualText;
    shRole: BilingualText;
    ahmosRole: BilingualText;
    communityRole: BilingualText;
    ahmosChairmanNote: BilingualText;
    phone: string;
    whatsappNumber: string;
    email: string;
    blueTagsUrl: string;
    socialLinks: SocialProfileLinks;
    nfcRoutePath: string;
    logoUrl: string;
    portraitUrl: string;
    portraitDisclaimer: BilingualText;
  };
  hero: {
    kicker: BilingualText;
    headlineLine1: BilingualText;
    headlineLine2: BilingualText;
    headlineLine3: BilingualText;
    subtext: BilingualText;
    ctaExplore: BilingualText;
    ctaSaveContact: BilingualText;
    ctaGetInTouch: BilingualText;
  };
  about: {
    kicker: BilingualText;
    heading: BilingualText;
    biographyParagraph1: BilingualText;
    biographyParagraph2: BilingualText;
    verifiedFactsTitle: BilingualText;
  };
  companies: {
    SH: CompanyProfile;
    AHMOS: CompanyProfile;
  };
  projects: DocumentedProject[];
  press: PressRecognitionItem[];
  tokens: BrandTokens;
  scene: Scene3DSettings;
}

export const SHERIF_LOGO_ASSET = '/assets/sherif-mohsen-gold-logo.jpg';
export const SHERIF_PORTRAIT_ASSET = '/assets/aistudio/Screenshot_2026-11-10_212319_c5c595a0.png';

export const DEFAULT_SHERIF_PORTFOLIO: SherifPortfolioData = {
  profileId: 'sherif-mohsen-canonical',
  language: 'EN',
  personal: {
    nameEn: 'Sherif Mohsen',
    nameAr: 'شريف محسن',
    industry: {
      en: 'Advertising & Marketing',
      ar: 'الإعلان والتسويق',
    },
    location: {
      en: 'Minya, Egypt',
      ar: 'المنيا، مصر',
    },
    shRole: {
      en: 'Owner & Chairman — SH Advertising',
      ar: 'المالك ورئيس مجلس الإدارة — SH للدعاية والإعلان',
    },
    ahmosRole: {
      en: 'Former Manager — AHMOS Advertising',
      ar: 'المدير السابق — شركة أحمس للدعاية والإعلان',
    },
    communityRole: {
      en: "Assistant Media Secretary — Nation's Future Party, Minya",
      ar: 'أمين مساعد الإعلام — حزب مستقبل وطن، المنيا',
    },
    ahmosChairmanNote: {
      en: 'AHMOS Advertising is chaired by Mahmoud Abdel-Daim. Sherif Mohsen identifies his role there as Former Manager. Older business directory listings may still show his previous management/marketing titles.',
      ar: 'رئيس مجلس إدارة شركة أحمس للدعاية والإعلان هو الأستاذ محمود عبد الدايم. يذكر شريف محسن أن منصبه في الشركة كان المدير السابق. وقد تعرض بعض أدلة الشركات بيانات وظيفية أقدم.',
    },
    phone: '+20 1000098600',
    whatsappNumber: '201000098600',
    email: 'sherif2rb@gmail.com',
    blueTagsUrl: 'https://bluetags.online/bc71855',
    // Add ONLY the verified URLs belonging to this Sherif Mohsen.
    // Only these two provided and verified social profiles are displayed.
    socialLinks: {
      facebook: 'https://www.facebook.com/share/1DyC588ixh/',
      instagram: 'https://www.instagram.com/sherif2rb/',
    },
    nfcRoutePath: '/nfc/sherif',
    logoUrl: SHERIF_LOGO_ASSET,
    portraitUrl: SHERIF_PORTRAIT_ASSET,
    portraitDisclaimer: {
      en: 'Reference portrait (contains Remini enhancement watermark; replace with owner-approved unwatermarked original prior to commercial publication).',
      ar: 'صورة مرجعية (تحتوي على علامة Remini المائية؛ يُستبدل بها الأصل المعتمد قبل النشر التجاري).',
    },
  },
  hero: {
    kicker: {
      en: 'MINYA, EGYPT · OUTDOOR MEDIA, CIVIC SCREENS & ADVERTISING',
      ar: 'المنيا، مصر · الإعلانات الخارجية والشاشات الرقمية والتسويق',
    },
    headlineLine1: {
      en: 'Sherif Mohsen.',
      ar: 'شريف محسن.',
    },
    headlineLine2: {
      en: 'Civic Scale.',
      ar: 'حضور إعلاني بارز.',
    },
    headlineLine3: {
      en: 'Advertising Impact.',
      ar: 'رؤية تسويقية متكاملة.',
    },
    subtext: {
      en: "Advertising executive, Owner & Chairman of SH Advertising, Former Manager of AHMOS Advertising, and Assistant Media Secretary at Nation's Future Party in Minya.",
      ar: 'شريف محسن، صاحب شركة SH للدعاية والإعلان، والمدير السابق لشركة أحمس للدعاية والإعلان، وأمين مساعد الإعلام بحزب مستقبل وطن في المنيا.',
    },
    ctaExplore: {
      en: 'Explore Work',
      ar: 'استكشف الأعمال',
    },
    ctaSaveContact: {
      en: 'Save Contact (VCF)',
      ar: 'حفظ جهة الاتصال',
    },
    ctaGetInTouch: {
      en: 'Get in Touch',
      ar: 'تواصل الآن',
    },
  },
  about: {
    kicker: {
      en: '01 · VERIFIED EXECUTIVE PROFILE',
      ar: '٠١ · الملف المهني الموثق',
    },
    heading: {
      en: 'Executive leadership across outdoor media, urban landmarks, and public-space advertising in Egypt.',
      ar: 'قيادة تنفيذية في قطاع الإعلانات الطرقية، الشاشات العملاقة، والمشروعات الإعلانية الحضرية في مصر.',
    },
    biographyParagraph1: {
      en: 'Based in Minya, Egypt, Sherif Mohsen (شريف محسن) is an advertising and marketing professional operating across Upper Egypt and national Egyptian urban markets. He is the Owner and Chairman of SH Advertising, leading its brand presence and public-space media participations.',
      ar: 'انطلاقاً من محافظة المنيا في مصر، يعمل شريف محسن في قطاع الإعلان والتسويق وتطوير الوسائل الإعلانية الخارجية. يشغل منصب المالك ورئيس مجلس الإدارة لشركة SH للدعاية والإعلان، حيث يقود توجهاتها الإعلانية ومشاركاتها في الفعاليات والميادين العامة.',
    },
    biographyParagraph2: {
      en: "He previously served as Manager of AHMOS Advertising and also identifies as Assistant Media Secretary of Nation's Future Party in Minya. Some public business directories still display earlier management titles for AHMOS.",
      ar: 'شغل سابقًا منصب المدير في شركة أحمس للدعاية والإعلان، ويذكر ضمن بياناته أنه أمين مساعد الإعلام بحزب مستقبل وطن بمحافظة المنيا. بعض أدلة الشركات لا تزال تعرض بيانات من مناصبه السابقة في أحمس.',
    },
    verifiedFactsTitle: {
      en: 'Professional Roles & Company Governance',
      ar: 'المناصب المهنية والأدوار المؤسسية',
    },
  },
  companies: {
    SH: {
      code: 'SH',
      name: {
        en: 'SH Advertising',
        ar: 'SH للدعاية والإعلان',
      },
      sherifRole: {
        en: 'Owner / Chairman',
        ar: 'المالك / رئيس مجلس الإدارة',
      },
      governanceNote: {
        en: 'Led directly by Sherif Mohsen as Owner and Chairman in Minya, Egypt.',
        ar: 'تحت القيادة المباشرة لشريف محسن بصفته المالك ورئيس مجلس الإدارة في المنيا.',
      },
      description: {
        en: 'Specializing in urban screen broadcasts, civic square inaugurations, public fan zones, and modern outdoor advertising formats in Minya Governorate.',
        ar: 'متخصصة في شاشات العرض الحضرية، والمشاركة في تطوير وافتتاح الميادين العامة، ومناطق المشجعين، وحلول الإعلانات الخارجية الحديثة في محافظة المنيا.',
      },
      focusAreas: {
        en: [
          'Civic Square Media Participation',
          'Live Public Broadcast Screens',
          'National Fan Zone Displays',
          'Outdoor Brand Visibility',
        ],
        ar: [
          'المشاركة الإعلانية في الميادين العامة',
          'شاشات البث المباشر للفعاليات الكبرى',
          'تجهيزات مناطق المشجعين الوطنية',
          'الإعلانات الخارجية واللوحات الإعلانية',
        ],
      },
    },
    AHMOS: {
      code: 'AHMOS',
      name: {
        en: 'AHMOS Advertising',
        ar: 'أحمس للدعاية والإعلان',
      },
      sherifRole: {
        en: 'Former Manager',
        ar: 'المدير السابق',
      },
      governanceNote: {
        en: 'Chairman of AHMOS Advertising: Mahmoud Abdel-Daim. Sherif Mohsen: Former Manager.',
        ar: 'رئيس مجلس إدارة شركة أحمس: الأستاذ محمود عبد الدايم. شريف محسن: المدير السابق.',
      },
      description: {
        en: 'Established Egyptian outdoor advertising and urban development partner documented across large-scale LED installations in Minya, Cairo square developments, and municipal advertising concessions.',
        ar: 'شركة رائدة في مجال الإعلانات الخارجية وتطوير الميادين في مصر، لها مشاركات موثقة في تركيب شاشات LED العملاقة بالمنيا، وتطوير الميادين بالقاهرة، والامتيازات الإعلانية بالمدن الجديدة.',
      },
      focusAreas: {
        en: [
          'Large-Format Outdoor LED Screens',
          'Municipal Advertising Concessions',
          'Public Square Enhancement Partnerships',
          'Regional Highway & Urban Media',
        ],
        ar: [
          'شاشات LED الخارجية العملاقة',
          'حقوق الامتياز الإعلاني بالمدن والمحافظات',
          'شراكات تطوير وتجميل الميادين العامة',
          'إعلانات الطرق والمحاور الرئيسية',
        ],
      },
    },
  },
  projects: [
    {
      id: 'sh-abu-shanab-square',
      slug: 'sh-safy-el-din-abu-shanab-square',
      company: 'SH',
      year: '2025',
      location: { en: 'Minya, Egypt', ar: 'المنيا، مصر' },
      title: {
        en: 'Safy El-Din Abu Shanaf Square Inauguration Participation',
        ar: 'المشاركة في افتتاح ميدان صفي الدين أبو شناف بالمنيا',
      },
      summary: {
        en: 'Documented SH Advertising participation in the civic inauguration of Safy El-Din Abu Shanaf Square in Minya.',
        ar: 'مشاركة موثقة لشركة SH للدعاية والإعلان في فعاليات افتتاح ميدان صفي الدين أبو شناف بمحافظة المنيا.',
      },
      details: {
        en: 'Publicly documented company-level participation by SH Advertising during the official inauguration of Safy El-Din Abu Shanaf Square in Minya.',
        ar: 'نشاط مؤسسي موثق لشركة SH للدعاية والإعلان ضمن المشاركة المجتمعية في افتتاح ميدان صفي الدين أبو شناف بالمنيا وفق التغطية الصحفية المنشورة.',
      },
      attributionNote: {
        en: 'This is a real photograph of Safy El-Din Abu Shanaf Square published by Watani. It documents the location, not a construction contract or execution by SH. SH participation in the inauguration is separately reported by El-Watan News.',
        ar: 'هذه صورة صحفية حقيقية لميدان صفي الدين أبو شناف من موقع وطني؛ توثّق المكان ولا تثبت أن SH هي التي نفذت أعمال الإنشاء. مشاركة SH في الافتتاح مذكورة بشكل منفصل في جريدة الوطن.',
      },
      sourceName: 'El-Watan News',
      sourceUrl: 'https://www.elwatannews.com/news/details/8327886',
      imageUrl: '/images/event_safy_abu_shanaf_square_wataninet_2026.jpg',
      imageCaption: {
        en: 'Actual square · Watani press photo',
        ar: 'صورة فعلية للميدان · موقع وطني',
      },
      imageSourceName: 'Watani',
      imageSourceUrl: 'https://img.wataninet.com/2026/01/FB_IMG_1769873137722.jpg',
      visible: true,
      sortOrder: 1,
    },
    {
      id: 'sh-gem-broadcast-minya',
      slug: 'sh-grand-egyptian-museum-broadcast-minya',
      company: 'SH',
      year: '2025',
      location: { en: 'Minya, Egypt', ar: 'المنيا، مصر' },
      title: {
        en: 'Grand Egyptian Museum Inauguration Broadcast Screens in Minya',
        ar: 'شاشات بث حفل افتتاح المتحف المصري الكبير في المنيا',
      },
      summary: {
        en: 'Provision of outdoor display screens in Minya to broadcast the historic Grand Egyptian Museum inauguration ceremony.',
        ar: 'توفير شاشات عرض خارجية في ميادين المنيا لنقل وبث فعاليات افتتاح المتحف المصري الكبير للجمهور.',
      },
      details: {
        en: 'Documented company-level initiative enabling citizens across public gathering points in Minya to watch the Grand Egyptian Museum ceremony via high-brightness outdoor display screens.',
        ar: 'مبادرة مؤسسية موثقة لشركة SH للدعاية والإعلان لإتاحة متابعة الحدث التاريخي لافتتاح المتحف المصري الكبير عبر شاشات عرض في المنيا.',
      },
      attributionNote: {
        en: 'Press photograph of outdoor screen preparations in Minya for the Grand Egyptian Museum opening, published by Al-Masry Al-Youm on 1 November 2025. This venue photo does not establish which company supplied the pictured screen; the separate SH initiative is reported by Dar El-Hilal.',
        ar: 'صورة صحفية لتجهيزات شاشة العرض في المنيا خلال افتتاح المتحف المصري الكبير، منشورة في المصري اليوم بتاريخ ١ نوفمبر ٢٠٢٥. الصورة لا تثبت اسم الشركة التي ركّبت الشاشة الظاهرة؛ ومبادرة SH واردة بصورة منفصلة في خبر دار الهلال.',
      },
      sourceName: 'Dar El-Hilal',
      sourceUrl: 'https://darelhilal.com/News/3276081.aspx',
      imageUrl: '/images/event_gem_public_screen_minya_2025.jpg',
      imageCaption: {
        en: 'Actual public-screen setup · Al-Masry Al-Youm',
        ar: 'تجهيزات العرض الفعلية · المصري اليوم',
      },
      imageSourceName: 'Al-Masry Al-Youm',
      imageSourceUrl: 'https://www.almasryalyoum.com/news/details/3589833',
      visible: true,
      sortOrder: 2,
    },
    {
      id: 'sh-egypt-fanzone',
      slug: 'sh-egypt-national-team-fan-zone',
      company: 'SH',
      year: '2026',
      location: { en: 'Minya, Egypt', ar: 'المنيا، مصر' },
      title: {
        en: 'Egypt National Football Team Fan Zone Participation',
        ar: 'المشاركة في تجهيز منطقة مشجعي المنتخب الوطني المصري بالمنيا',
      },
      summary: {
        en: 'Outdoor screen and event media participation supporting public Fan Zone gatherings for the Egyptian national football team.',
        ar: 'مشاركة إعلانية وتقنية عبر شاشات العرض في منطقة المشجعين لدعم مباريات منتخب مصر الوطني في المنيا.',
      },
      details: {
        en: 'Reported company-level participation by SH Advertising delivering public viewing screen infrastructure for football supporters in Minya.',
        ar: 'مشاركة موثقة لشركة SH للدعاية والإعلان في توفير التجهيزات المرئية وشاشات العرض الجماهيرية لمباريات المنتخب الوطني.',
      },
      attributionNote: {
        en: 'Real press photograph of seating arrangements at the 2026 Minya football fan-zone event (Veto). It records the event setting but does not identify the contractor behind any individual screen. SH involvement is separately reported by Soot El-Minya.',
        ar: 'صورة صحفية حقيقية لتجهيز مقاعد منطقة المشجعين بالمنيا في ٢٠٢٦ (فيتو). توثّق أجواء الفعالية ولا تحدد الشركة التي نفذت شاشة بعينها؛ ومشاركة SH مذكورة في صوت المنيا.',
      },
      sourceName: 'Soot El-Minya',
      sourceUrl: 'https://www.soot-elminya.com/8082',
      imageUrl: '/images/event_egypt_fanzone_minya_vetogate_2026.webp',
      imageCaption: {
        en: 'Actual fan-zone preparations · Veto',
        ar: 'تجهيزات فعلية لمنطقة المشجعين · فيتو',
      },
      imageSourceName: 'Veto',
      imageSourceUrl: 'https://www.vetogate.com/5689035',
      visible: true,
      sortOrder: 3,
    },
    {
      id: 'ahmos-minya-led-installations',
      slug: 'ahmos-outdoor-led-installations-minya',
      company: 'AHMOS',
      year: '2026',
      location: { en: 'Minya, Egypt', ar: 'المنيا، مصر' },
      title: {
        en: 'Large Outdoor LED Installations in Minya (NBE & Eastern Entrance)',
        ar: 'تركيب شاشات LED خارجية عملاقة بالمنيا (منطقة البنك الأهلي والمدخل الشرقي)',
      },
      summary: {
        en: 'Deployment of prominent outdoor digital LED advertising screens near the National Bank of Egypt and Minya’s eastern entrance.',
        ar: 'إقامة وتشغيل شاشات إعلانية رقمية عملاقة في المواقع الحيوية بجوار البنك الأهلي والمدخل الشرقي لمدينة المنيا.',
      },
      details: {
        en: 'Company-level outdoor media infrastructure executed by AHMOS Advertising across key arterial corridors in Minya Governorate.',
        ar: 'مشروعات بنية تحتية للإعلانات الرقمية الخارجية نفذتها شركة أحمس للدعاية والإعلان في المحاور الرئيسية بمدينة المنيا.',
      },
      attributionNote: {
        en: 'AHMOS Advertising installations are reported by El-Watan News. No image of the specified screens could be reliably linked to the company, so this entry is intentionally text-only.',
        ar: 'شاشات شركة أحمس موثقة في خبر جريدة الوطن. لم تتوفر صورة يمكن إسنادها بثقة للشاشات المذكورة، لذلك يُعرض هذا النشاط كنص فقط.',
      },
      sourceName: 'El-Watan News',
      sourceUrl: 'https://www.elwatannews.com/news/details/8321966',
      visible: true,
      sortOrder: 4,
    },
    {
      id: 'ahmos-minya-station-square',
      slug: 'ahmos-minya-station-square-improvements',
      company: 'AHMOS',
      year: '2026',
      location: { en: 'Minya, Egypt', ar: 'المنيا، مصر' },
      title: {
        en: 'Contribution to Minya Station Square Improvements',
        ar: 'المساهمة في أعمال تطوير وتجميل ميدان المحطة بالمنيا',
      },
      summary: {
        en: 'Documented AHMOS Advertising contribution to urban enhancement and media coordination at Minya Railway Station Square.',
        ar: 'مساهمة موثقة لشركة أحمس للدعاية والإعلان في أعمال التطوير الحضري والتنسيق الإعلاني بميدان محطة المنيا.',
      },
      details: {
        en: 'Reported company-level civic and advertising contribution supporting the visual upgrade of Minya Station Square.',
        ar: 'مشاركة مؤسسية لشركة أحمس للدعاية والإعلان ضمن جهود تطوير المظهر الحضاري لميدان المحطة بمحافظة المنيا.',
      },
      attributionNote: {
        en: 'AHMOS company-level involvement was reported by El-Watan News. Other available pictures show unrelated work or different years, so no photograph is included here.',
        ar: 'تذكر جريدة الوطن مساهمة شركة أحمس. الصور المتاحة لميدان المحطة تتعلق بأعمال أخرى أو بفترات زمنية مختلفة، ولذلك لم نضع صورة غير مؤكدة.',
      },
      sourceName: 'El-Watan News',
      sourceUrl: 'https://www.elwatannews.com/news/details/8321966',
      visible: true,
      sortOrder: 5,
    },
    {
      id: 'ahmos-cairo-art-house-square',
      slug: 'ahmos-art-house-square-cairo-2021',
      company: 'AHMOS',
      year: '2021',
      location: { en: 'Cairo, Egypt', ar: 'القاهرة، مصر' },
      title: {
        en: 'Joint Art House Square Development in Cairo',
        ar: 'المشاركة في تطوير ميدان آرت هاوس بحي البساتين بالقاهرة (٢٠٢١)',
      },
      summary: {
        en: 'Collaborative urban square development and aesthetic enhancement project in Cairo documented in 2021.',
        ar: 'مشروع مشترك لتطوير وتجميل ميدان آرت هاوس بحي البساتين في القاهرة وفق التغطية الصحفية المنشورة عام ٢٠٢١.',
      },
      details: {
        en: 'Company-level public-private urban beautification and outdoor advertising coordination executed by AHMOS Advertising in Cairo.',
        ar: 'عمل مؤسسي لشركة أحمس للدعاية والإعلان بالتعاون مع الجهات المعنية لتطوير الهوية البصرية والميدانية في القاهرة.',
      },
      attributionNote: {
        en: 'Archival photograph of the four obelisks and Ahmose monument at the Maadi/Basateen square, reported by El-Watan in August 2021. This is a historical record: press reports state that the installation was removed in January 2022 following public complaints. AHMOS joint participation is documented by Al-Dostor.',
        ar: 'صورة أرشيفية حقيقية للمسلات الأربع وتمثال أحمس بالميدان في حي البساتين، منشورة بالوطن في أغسطس ٢٠٢١. هذه صورة تاريخية؛ تذكر تقارير صحفية إزالة النصب في يناير ٢٠٢٢ بعد شكاوى الأهالي. مشاركة أحمس مع آرت هاوس موثقة في الدستور.',
      },
      sourceName: 'Al-Dostor',
      sourceUrl: 'https://www.dostor.org/3547014',
      imageUrl: '/images/event_arthouse_square_elwatan_2021.jpg',
      imageCaption: {
        en: '2021 archive · Monument removed in 2022',
        ar: 'صورة من أرشيف ٢٠٢١ · أُزيل النصب سنة ٢٠٢٢',
      },
      imageSourceName: 'El-Watan News',
      imageSourceUrl: 'https://www.elwatannews.com/news/details/5667817',
      visible: true,
      sortOrder: 6,
    },
    {
      id: 'ahmos-sadat-city-concession',
      slug: 'ahmos-sadat-city-advertising-concession',
      company: 'AHMOS',
      year: '2017',
      location: { en: 'Sadat City, Egypt', ar: 'مدينة السادات، مصر' },
      title: {
        en: 'Historic Advertising Concession for Sadat City',
        ar: 'امتياز الإعلانات الطرقية لمدينة السادات',
      },
      summary: {
        en: 'Landmark municipal outdoor advertising concession awarded to AHMOS Advertising in Sadat City.',
        ar: 'حصول شركة أحمس للدعاية والإعلان على امتياز استغلال وتنظيم الإعلانات في مدينة السادات.',
      },
      details: {
        en: 'Documented company-level milestone in the Egyptian outdoor advertising sector reported by financial press in May 2017.',
        ar: 'إنجاز مؤسسي تاريخي لشركة أحمس للدعاية والإعلان في قطاع امتيازات الإعلانات بالمدن الجديدة موثق في الصحافة الاقتصادية عام ٢٠١٧.',
      },
      attributionNote: {
        en: 'AHMOS concession award is documented by Al-Borsa News (2017). We could not verify any photograph depicting this specific concession or its installations; this archive entry is intentionally text-only.',
        ar: 'امتياز شركة أحمس موثق في جريدة البورصة (مايو ٢٠١٧). لم نعثر على صورة مؤكدة من أعمال هذا الامتياز أو توقيع عقده؛ لهذا يظهر الخبر كنص فقط.',
      },
      sourceName: 'Al-Borsa News',
      sourceUrl: 'https://www.alborsanews.com/2017/05/16/1021718',
      visible: true,
      sortOrder: 7,
    },
  ],
  press: [
    {
      id: 'press-sh-july-2026',
      date: 'July 2026',
      entity: 'SH',
      title: {
        en: 'Minya Governor Honors Sherif Mohsen and SH Advertising for Community Support',
        ar: 'محافظ المنيا يكرم شريف محسن وشركة SH للدعاية والإعلان لدعم الفعاليات والمشاركة المجتمعية',
      },
      summary: {
        en: 'July 2026 recognition of SH Advertising and Chairman Sherif Mohsen by the Minya governor for civic events, including the Safy El-Din Abu Shanaf Square inauguration, public screens and fan-zone support.',
        ar: 'تكريم شريف محسن وشركة SH من محافظ المنيا في يوليو ٢٠٢٦ لدعم الفعاليات، ومنها افتتاح ميدان صفي الدين أبو شناف وشاشات البث ومناطق المشجعين.',
      },
      factualNote: {
        en: 'Direct recognition of Sherif Mohsen in his capacity as Owner/Chairman of SH Advertising.',
        ar: 'تغطية موثقة لشريف محسن بصفته المالك ورئيس مجلس الإدارة لشركة SH للدعاية والإعلان.',
      },
      sourceName: 'El-Watan News',
      sourceUrl: 'https://www.elwatannews.com/news/details/8327886',
      imageUrl: '/images/press_sh_sherif_award_user_2026.png',
      imageCaption: {
        en: 'Sherif Mohsen receiving a Minya governorate award · Photo supplied by the project owner',
        ar: 'شريف محسن يتسلّم درع محافظة المنيا · الصورة مقدمة من صاحب المشروع',
      },
      imageSourceName: 'Client-supplied photo',
    },
    {
      id: 'press-sh-gem-broadcast',
      date: '2025 / 2026',
      entity: 'SH',
      title: {
        en: 'Public Broadcast Screens for the Grand Egyptian Museum Opening in Minya',
        ar: 'تخصيص شاشات عرض بالمنيا لنقل حفل افتتاح المتحف المصري الكبير',
      },
      summary: {
        en: 'Dar El-Hilal coverage documenting outdoor broadcast screens in Minya during the Grand Egyptian Museum inauguration.',
        ar: 'تغطية بوابة دار الهلال لمبادرة عرض حفل افتتاح المتحف المصري الكبير عبر الشاشات الخارجية في محافظة المنيا.',
      },
      factualNote: {
        en: 'Documented SH Advertising civic broadcast initiative in Minya.',
        ar: 'مبادرة موثقة لشركة SH للدعاية والإعلان في محافظة المنيا.',
      },
      sourceName: 'Dar El-Hilal',
      sourceUrl: 'https://darelhilal.com/News/3276081.aspx',
      imageUrl: '/images/event_gem_public_screen_minya_2025.jpg',
      imageCaption: {
        en: 'Public screen preparation in Minya (1 Nov 2025); site image, not contractor proof',
        ar: 'تجهيز شاشة العرض بالمنيا (١ نوفمبر ٢٠٢٥)؛ صورة للموقع وليست دليلًا على المقاول المنفذ',
      },
      imageSourceName: 'Al-Masry Al-Youm',
      imageSourceUrl: 'https://www.almasryalyoum.com/news/details/3589833',
    },
    {
      id: 'press-ahmos-minya-2026',
      date: 'July 2026',
      entity: 'AHMOS',
      title: {
        en: 'AHMOS Advertising Recognized for Minya Outdoor LED Screens & Station Square Contributions',
        ar: 'إشادة بجهود شركة أحمس للدعاية والإعلان في تطوير ميادين المنيا وشاشات العرض الحديثة',
      },
      summary: {
        en: 'Coverage of AHMOS Advertising (chaired by Mahmoud Abdel-Daim) regarding large outdoor LED installations near the National Bank of Egypt, the eastern entrance, and Minya Station Square.',
        ar: 'تغطية صحفية لأعمال شركة أحمس للدعاية والإعلان (برئاسة مجلس إدارة الأستاذ محمود عبد الدايم) في تركيب الشاشات الإعلانية الحديثة والمساهمة في تطوير ميدان المحطة بالمنيا.',
      },
      factualNote: {
        en: 'Separate AHMOS Advertising coverage. AHMOS Chairman is Mahmoud Abdel-Daim; Sherif Mohsen previously served as Manager.',
        ar: 'تغطية خاصة بشركة أحمس للدعاية والإعلان (رئيس مجلس الإدارة: محمود عبد الدايم؛ وشريف محسن هو المدير السابق).',
      },
      sourceName: 'El-Watan News',
      sourceUrl: 'https://www.elwatannews.com/news/details/8321966',
      imageUrl: '/images/press_ahmos_chairman_award_elwatan_2026.jpg',
      imageCaption: {
        en: 'AHMOS Chairman Mahmoud Abdel-Daim receiving recognition, not a photograph of Sherif Mohsen',
        ar: 'تكريم محمود عبد الدايم رئيس مجلس إدارة أحمس، وليست صورة لشريف محسن',
      },
      imageSourceName: 'El-Watan News',
      imageSourceUrl: 'https://www.elwatannews.com/news/details/8321966',
    },
    {
      id: 'press-ahmos-cairo-sadat',
      date: '2017 – 2021',
      entity: 'AHMOS',
      title: {
        en: 'AHMOS Advertising National Footprint: Cairo Art House Square & Sadat City Concession',
        ar: 'سجل شركة أحمس الإعلاني: تطوير ميدان آرت هاوس بالقاهرة وامتياز إعلانات مدينة السادات',
      },
      summary: {
        en: 'Archival press in Al-Dostor and Al-Borsa News documenting AHMOS Advertising’s long-standing role in Egyptian municipal concessions and square enhancements.',
        ar: 'تقارير صحفية أرشيفية في جريدتي الدستور والبورصة توثق حضور شركة أحمس للدعاية والإعلان في امتيازات المدن الجديدة وتطوير الميادين بالقاهرة.',
      },
      factualNote: {
        en: 'Historical company-level press archives for AHMOS Advertising.',
        ar: 'أرشيف صحفي مؤسسي لشركة أحمس للدعاية والإعلان.',
      },
      sourceName: 'Al-Dostor / Al-Borsa News',
      sourceUrl: 'https://www.dostor.org/3547014',
      imageUrl: '/images/event_arthouse_square_elwatan_2021.jpg',
      imageCaption: {
        en: 'Art House Square, 2021 archival view (not the 2017 Sadat City concession); the monument was later removed',
        ar: 'ميدان آرت هاوس عام ٢٠٢١، وليس امتياز السادات ٢٠١٧؛ أُزيل النصب لاحقًا',
      },
      imageSourceName: 'El-Watan News',
      imageSourceUrl: 'https://www.elwatannews.com/news/details/5667817',
    },
  ],
  tokens: {
    background: '#0B0B0B',
    lightSurface: '#F4F0E8',
    primaryText: '#FFFFFF',
    accent: '#FFB629',
    secondaryText: '#B8B8B8',
  },
  scene: {
    monolithCount: 8,
    finish: 'obsidian-gold',
    ambientParticles: true,
    orbitalRings: true,
    medallionVisible: true,
    motionIntensity: 1.0,
  },
};
