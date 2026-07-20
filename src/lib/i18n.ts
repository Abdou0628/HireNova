export type CVLanguage = 'fr' | 'en' | 'ar'

type TranslationKey =
  | 'siteTitle'
  | 'siteSubtitle'
  | 'siteDescription'
  | 'cta'
  | 'step1Title'
  | 'step2Title'
  | 'step3Title'
  | 'step4Title'
  | 'fullName'
  | 'email'
  | 'phone'
  | 'location'
  | 'linkedin'
  | 'website'
  | 'targetJob'
  | 'industry'
  | 'experience'
  | 'experiencePlaceholder'
  | 'education'
  | 'educationPlaceholder'
  | 'skills'
  | 'skillsPlaceholder'
  | 'languages'
  | 'languagesPlaceholder'
  | 'summary'
  | 'summaryPlaceholder'
  | 'next'
  | 'previous'
  | 'generate'
  | 'generating'
  | 'generatingSubtitle'
  | 'downloadPdf'
  | 'startOver'
  | 'previewTitle'
  | 'feature1Title'
  | 'feature1Desc'
  | 'feature2Title'
  | 'feature2Desc'
  | 'feature3Title'
  | 'feature3Desc'
  | 'feature4Title'
  | 'feature4Desc'
  | 'templateModern'
  | 'templateClassic'
  | 'templateCreative'
  | 'templateLabel'
  | 'languageLabel'
  | 'required'
  | 'errorFillFields'
  | 'footerText'
  | 'footerMadeWith'

const translations: Record<CVLanguage, Record<TranslationKey, string>> = {
  fr: {
    siteTitle: 'CV Genius IA',
    siteSubtitle: 'Générez un CV professionnel en 60 secondes',
    siteDescription:
      'Notre IA rédige un CV optimisé pour les ATS, parfaitement adapté à votre métier cible. Disponible en français, anglais et arabe.',
    cta: 'Créer mon CV gratuitement',
    step1Title: 'Informations personnelles',
    step2Title: 'Projet professionnel',
    step3Title: 'Expérience & Formation',
    step4Title: 'Compétences & Résumé',
    fullName: 'Nom complet',
    email: 'Adresse e-mail',
    phone: 'Téléphone',
    location: 'Ville / Pays',
    linkedin: 'LinkedIn (optionnel)',
    website: 'Site web (optionnel)',
    targetJob: 'Poste visé',
    industry: 'Secteur d\'activité',
    experience: 'Expérience professionnelle',
    experiencePlaceholder:
      'Décrivez vos postes précédents (ex: Développeur Web chez ABC Corp de 2020 à 2023 - responsabilités, projets, résultats...)',
    education: 'Formation',
    educationPlaceholder:
      'Décrivez vos diplômes (ex: Master en Informatique à l\'Université X de 2016 à 2020...)',
    skills: 'Compétences',
    skillsPlaceholder:
      'Listez vos compétences techniques et humaines séparées par des virgules (ex: JavaScript, React, gestion de projet, travail d\'équipe...)',
    languages: 'Langues parlées',
    languagesPlaceholder:
      'Listez vos langues avec niveau (ex: Français - natif, Anglais - courant, Arabe - intermédiaire...)',
    summary: 'Résumé professionnel (optionnel)',
    summaryPlaceholder:
      'Un court paragraphe décrivant votre profil, vos forces et vos ambitions...',
    next: 'Suivant',
    previous: 'Précédent',
    generate: 'Générer mon CV avec l\'IA',
    generating: 'L\'IA rédige votre CV...',
    generatingSubtitle:
      'Analyse de vos informations et création du contenu optimisé',
    downloadPdf: 'Télécharger en PDF',
    startOver: 'Créer un autre CV',
    previewTitle: 'Votre CV est prêt !',
    feature1Title: 'IA Avancée',
    feature1Desc:
      'Notre IA analyse vos informations et génère un contenu professionnel optimisé pour chaque section de votre CV.',
    feature2Title: 'Multilingue',
    feature2Desc:
      'Créez votre CV en français, anglais ou arabe. L\'IA adapte le vocabulaire et le style à chaque langue.',
    feature3Title: 'Optimisé ATS',
    feature3Desc:
      'Vos CV sont structurés pour passer les filtres automatiques des logiciels de recrutement.',
    feature4Title: '3 Templates',
    feature4Desc:
      'Choisissez parmi 3 designs professionnels : Moderne, Classique ou Créatif.',
    templateModern: 'Moderne',
    templateClassic: 'Classique',
    templateCreative: 'Créatif',
    templateLabel: 'Modèle',
    languageLabel: 'Langue du CV',
    required: 'Ce champ est requis',
    errorFillFields: 'Veuillez remplir tous les champs obligatoires',
    footerText: 'Tous droits réservés',
    footerMadeWith: 'Propulsé par',
  },
  en: {
    siteTitle: 'CV Genius AI',
    siteSubtitle: 'Generate a professional resume in 60 seconds',
    siteDescription:
      'Our AI writes an ATS-optimized resume, perfectly tailored to your target role. Available in French, English, and Arabic.',
    cta: 'Create my free resume',
    step1Title: 'Personal Information',
    step2Title: 'Career Goals',
    step3Title: 'Experience & Education',
    step4Title: 'Skills & Summary',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone',
    location: 'City / Country',
    linkedin: 'LinkedIn (optional)',
    website: 'Website (optional)',
    targetJob: 'Target Position',
    industry: 'Industry',
    experience: 'Work Experience',
    experiencePlaceholder:
      'Describe your previous roles (e.g. Web Developer at ABC Corp from 2020 to 2023 - responsibilities, projects, results...)',
    education: 'Education',
    educationPlaceholder:
      'Describe your degrees (e.g. Master\'s in Computer Science at University X from 2016 to 2020...)',
    skills: 'Skills',
    skillsPlaceholder:
      'List your technical and soft skills separated by commas (e.g. JavaScript, React, project management, teamwork...)',
    languages: 'Spoken Languages',
    languagesPlaceholder:
      'List your languages with level (e.g. French - native, English - fluent, Arabic - intermediate...)',
    summary: 'Professional Summary (optional)',
    summaryPlaceholder:
      'A short paragraph describing your profile, strengths, and career ambitions...',
    next: 'Next',
    previous: 'Previous',
    generate: 'Generate my resume with AI',
    generating: 'AI is writing your resume...',
    generatingSubtitle:
      'Analyzing your information and creating optimized content',
    downloadPdf: 'Download PDF',
    startOver: 'Create another resume',
    previewTitle: 'Your resume is ready!',
    feature1Title: 'Advanced AI',
    feature1Desc:
      'Our AI analyzes your information and generates professional, optimized content for each section of your resume.',
    feature2Title: 'Multilingual',
    feature2Desc:
      'Create your resume in French, English, or Arabic. The AI adapts vocabulary and style to each language.',
    feature3Title: 'ATS Optimized',
    feature3Desc:
      'Your resumes are structured to pass automatic filters of recruitment software.',
    feature4Title: '3 Templates',
    feature4Desc:
      'Choose from 3 professional designs: Modern, Classic, or Creative.',
    templateModern: 'Modern',
    templateClassic: 'Classic',
    templateCreative: 'Creative',
    templateLabel: 'Template',
    languageLabel: 'Resume Language',
    required: 'This field is required',
    errorFillFields: 'Please fill in all required fields',
    footerText: 'All rights reserved',
    footerMadeWith: 'Powered by',
  },
  ar: {
    siteTitle: 'CV Genious الذكاء الاصطناعي',
    siteSubtitle: 'أنشئ سيرة ذاتية احترافية في 60 ثانية',
    siteDescription:
      'يكتب الذكاء الاصطناعي لدينا سيرة ذاتية محسنة لأنظمة ATS، مصممة خصيصاً للوظيفة المستهدفة. متاحة بالفرنسية والإنجليزية والعربية.',
    cta: 'أنشئ سيرتي الذاتية مجاناً',
    step1Title: 'المعلومات الشخصية',
    step2Title: 'الأهداف المهنية',
    step3Title: 'الخبرة والتعليم',
    step4Title: 'المهارات والملخص',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    location: 'المدينة / البلد',
    linkedin: 'لينكد إن (اختياري)',
    website: 'الموقع الإلكتروني (اختياري)',
    targetJob: 'الوظيفة المستهدفة',
    industry: 'قطاع النشاط',
    experience: 'الخبرة المهنية',
    experiencePlaceholder:
      'صف وظائفك السابقة (مثال: مطور ويب في شركة ABC من 2020 إلى 2023 - المسؤوليات، المشاريع، النتائج...)',
    education: 'التعليم',
    educationPlaceholder:
      'صف شهاداتك (مثال: ماجستير في علوم الكمبيوتر من جامعة X من 2016 إلى 2020...)',
    skills: 'المهارات',
    skillsPlaceholder:
      'اذكر مهاراتك التقنية والشخصية مفصولة بفواصل (مثال: جافاسكريبت، رياكت، إدارة المشاريع، العمل الجماعي...)',
    languages: 'اللغات',
    languagesPlaceholder:
      'اذكر لغاتك مع المستوى (مثال: الفرنسية - لغة أم، الإنجليزية - بطلاقة، العربية - متوسط...)',
    summary: 'الملخص المهني (اختياري)',
    summaryPlaceholder:
      'فقرة قصصة تصف ملفك الشخصي ونقاط قوتك وطموحاتك المهنية...',
    next: 'التالي',
    previous: 'السابق',
    generate: 'أنشئ سيرتي الذاتية بالذكاء الاصطناعي',
    generating: 'الذكاء الاصطناعي يكتب سيرتك الذاتية...',
    generatingSubtitle: 'تحليل معلوماتك وإنشاء محتوى محسن',
    downloadPdf: 'تحميل PDF',
    startOver: 'إنشاء سيرة ذاتية أخرى',
    previewTitle: 'سيرتك الذاتية جاهزة!',
    feature1Title: 'ذكاء اصطناعي متقدم',
    feature1Desc:
      'يحلل الذكاء الاصطناعي لدينا معلوماتك وينشئ محتوى احترافياً محسناً لكل قسم من سيرتك الذاتية.',
    feature2Title: 'متعدد اللغات',
    feature2Desc:
      'أنشئ سيرتك الذاتية بالفرنسية أو الإنجليزية أو العربية. يتكيف الذكاء الاصطناعي مع المفردات والأسلوب لكل لغة.',
    feature3Title: 'محسن لـ ATS',
    feature3Desc:
      'سيرك الذاتية منظمة لتجاوز الفلاتر التلقائية لبرامج التوظيف.',
    feature4Title: '3 قوالب',
    feature4Desc:
      'اختر من بين 3 تصميمات احترافية: عصري، كلاسيكي، أو إبداعي.',
    templateModern: 'عصري',
    templateClassic: 'كلاسيكي',
    templateCreative: 'إبداعي',
    templateLabel: 'القالب',
    languageLabel: 'لغة السيرة الذاتية',
    required: 'هذا الحقل مطلوب',
    errorFillFields: 'يرجى ملء جميع الحقول المطلوبة',
    footerText: 'جميع الحقوق محفوظة',
    footerMadeWith: 'بدعم من',
  },
}

export function t(lang: CVLanguage, key: TranslationKey): string {
  return translations[lang]?.[key] ?? translations.fr[key] ?? key
}
