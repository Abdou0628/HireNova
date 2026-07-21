export type CVLanguage = 'fr' | 'en' | 'ar' | 'es'

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
  | 'phoneCountry'
  | 'phoneCountryPlaceholder'
  | 'phoneNumber'
  | 'address'
  | 'location'
  | 'linkedin'
  | 'website'
  | 'photo'
  | 'photoPlaceholder'
  | 'photoRemove'
  | 'photoNote'
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
  | 'downloadWord'
  | 'downloadFormat'
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
  | 'dateOfBirth'
  | 'birthPlace'
  | 'birthCountry'
  | 'birthCountryPlaceholder'
  | 'softSkills'
  | 'softSkillsPlaceholder'
  | 'personalInfo'
  | 'footerText'
  | 'footerMadeWith'
  | 'freeNoSignup'
  | 'ctaReadyTitle'
  | 'ctaReadyDesc'
  | 'photoPosition'
  | 'photoPositionLeft'
  | 'photoPositionCenter'
  | 'photoPositionRight'
  | 'availableLangs'
  | 'freeNoSignup'
  | 'ctaReadyTitle'
  | 'ctaReadyDesc'
  // Cover letter keys
  | 'clTitle'
  | 'clSubtitle'
  | 'clDescription'
  | 'clCta'
  | 'clBackToCv'
  | 'clCompanyName'
  | 'clCompanyNamePlaceholder'
  | 'clHiringManager'
  | 'clHiringManagerPlaceholder'
  | 'clJobTitle'
  | 'clJobTitlePlaceholder'
  | 'clJobReference'
  | 'clJobReferencePlaceholder'
  | 'clWhyCompany'
  | 'clWhyCompanyPlaceholder'
  | 'clKeyStrengths'
  | 'clKeyStrengthsPlaceholder'
  | 'clTone'
  | 'clToneFormal'
  | 'clToneSemiFormal'
  | 'clToneDynamic'
  | 'clAdditionalNotes'
  | 'clAdditionalNotesPlaceholder'
  | 'clGenerate'
  | 'clGenerating'
  | 'clGeneratingSubtitle'
  | 'clPreviewTitle'
  | 'clDownloadPdf'
  | 'clDownloadWord'
  | 'clStartOver'
  | 'clAlsoGenerate'
  | 'clStep1'
  | 'clStep2'
  | 'clFeatureTitle'
  | 'clFeatureDesc'
  | 'clReadyTitle'
  | 'clReadyDesc'
  | 'clAddress'
  | 'clCountry'
  | 'clCountryPlaceholder'
  | 'clLinkedToCv'
  | 'clLinkedToCvDesc'
  | 'clNoCvLinked'
  | 'clNoCvLinkedDesc'
  // Simultaneous generation
  | 'tabCv'
  | 'tabCoverLetter'
  | 'generatingBoth'
  | 'generatingBothSubtitle'
  | 'companyNameForCl'
  | 'companyNameForClPlaceholder'
  | 'hiringManagerForCl'
  | 'hiringManagerForClPlaceholder'
  | 'clToneForCl'
  | 'step2TitleNew'
  | 'generatingCv'
  | 'generatingCl'
  | 'generatingClDone'
  | 'generatingCvDone'
  | 'cvAndClReady'
  // Pricing & Auth
  | 'pricingTitle'
  | 'pricingSubtitle'
  | 'planFree'
  | 'planFreePrice'
  | 'planFreeDesc'
  | 'planPro'
  | 'planProPrice'
  | 'planProDesc'
  | 'planProPopular'
  | 'planLifetime'
  | 'planLifetimePrice'
  | 'planLifetimeDesc'
  | 'planLifetimeBest'
  | 'pricingCv'
  | 'pricingTemplates'
  | 'pricingPdf'
  | 'pricingWord'
  | 'pricingCoverLetter'
  | 'pricingNoWatermark'
  | 'pricingAtsScore'
  | 'pricingPriority'
  | 'pricingMonthly'
  | 'pricingOneTime'
  | 'pricingCurrency'
  | 'pricingProPriceUsd'
  | 'pricingLifetimePriceUsd'
  | 'pricingMonthlyUsd'
  | 'pricingOneTimeUsd'
  | 'pricingStartFree'
  | 'loginTitle'
  | 'registerTitle'
  | 'loginEmail'
  | 'loginPassword'
  | 'loginButton'
  | 'registerButton'
  | 'loginNoAccount'
  | 'registerHasAccount'
  | 'loginName'
  | 'loginSuccess'
  | 'registerSuccess'
  | 'loginError'
  | 'registerError'
  | 'profileMenu'
  | 'myAccount'
  | 'logout'
  | 'remainingCvs'
  | 'remainingCls'
  | 'upgradeToPro'
  | 'pricingFeatureIncluded'
  | 'pricingFeatureExcluded'

const translations: Record<CVLanguage, Record<TranslationKey, string>> = {
  fr: {
    siteTitle: 'CV Genius IA',
    siteSubtitle: 'Générez un CV professionnel en 60 secondes',
    siteDescription:
      'Notre IA rédige un CV optimisé pour les ATS, parfaitement adapté à votre métier cible.',
    cta: 'Créer mon CV gratuitement',
    step1Title: 'Informations personnelles',
    step2Title: 'Projet professionnel',
    step3Title: 'Expérience & Formation',
    step4Title: 'Compétences & Résumé',
    fullName: 'Nom complet',
    email: 'Adresse e-mail',
    phone: 'Téléphone',
    phoneCountry: 'Pays',
    phoneCountryPlaceholder: 'Choisir le pays...',
    phoneNumber: 'Numéro de téléphone',
    address: 'Adresse complète',
    location: 'Ville / Pays',
    linkedin: 'LinkedIn (optionnel)',
    website: 'Site web (optionnel)',
    photo: 'Photo de profil',
    photoPlaceholder: 'Cliquez ou glissez une photo ici',
    photoRemove: 'Supprimer',
    photoNote: 'Recommandé pour les CV en français et arabe. Non recommandé pour les CV en anglais (pratique anti-discrimination).',
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
    downloadWord: 'Télécharger en Word',
    downloadFormat: 'Format de téléchargement',
    startOver: 'Créer un autre CV',
    previewTitle: 'Votre CV est prêt !',
    feature1Title: 'IA Avancée',
    feature1Desc:
      'Notre IA analyse vos informations et génère un contenu professionnel optimisé pour chaque section de votre CV.',
    feature2Title: 'Multilingue',
    feature2Desc:
      'Créez votre CV en français, anglais, espagnol ou arabe. L\'IA adapte le vocabulaire et le style à chaque langue.',
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
    dateOfBirth: 'Date de naissance',
    birthPlace: 'Lieu de naissance',
    birthCountry: 'Pays de naissance',
    birthCountryPlaceholder: 'Maroc, France, Algérie...',
    softSkills: 'Soft Skills / Savoir-être (optionnel)',
    softSkillsPlaceholder: 'Listez vos soft skills séparés par des virgules (ex: leadership, communication, résolution de problèmes, adaptabilité...)',
    personalInfo: 'Informations de naissance',
    required: 'Ce champ est requis',
    errorFillFields: 'Veuillez remplir tous les champs obligatoires',
    footerText: 'Tous droits réservés',
    footerMadeWith: 'Propulsé par',
    freeNoSignup: 'Gratuit et sans inscription',
    ctaReadyTitle: 'Prêt à créer votre CV ?',
    ctaReadyDesc: 'En moins de 2 minutes, vous aurez un CV professionnel prêt à être envoyé.',
    photoPosition: 'Position de la photo',
    photoPositionLeft: 'Gauche',
    photoPositionCenter: 'Centre',
    photoPositionRight: 'Droite',
    availableLangs: 'Disponible en français, anglais, espagnol et arabe',
    freeNoSignup: 'Gratuit et sans inscription',
    ctaReadyTitle: 'Prêt à créer votre CV ?',
    ctaReadyDesc: 'En moins de 2 minutes, vous aurez un CV professionnel prêt à être envoyé.',
    // Cover letter
    clTitle: 'Lettre de Motivation',
    clSubtitle: 'Générez une lettre de motivation persuasive en 30 secondes',
    clDescription: 'Notre IA rédige une lettre de motivation personnalisée, parfaitement adaptée à l\'offre d\'emploi visée. Disponible en français, anglais, arabe et espagnol.',
    clCta: 'Créer ma lettre de motivation',
    clBackToCv: 'Retour au CV',
    clCompanyName: 'Nom de l\'entreprise',
    clCompanyNamePlaceholder: 'Ex: Google, Renault, Société Générale...',
    clHiringManager: 'Nom du recruteur (optionnel)',
    clHiringManagerPlaceholder: 'Ex: M. Dupont, Mme Martin...',
    clJobTitle: 'Intitulé du poste',
    clJobTitlePlaceholder: 'Ex: Développeur Full-Stack, Chef de projet...',
    clJobReference: 'Référence de l\'offre (optionnel)',
    clJobReferencePlaceholder: 'Ex: REF-2024-123...',
    clWhyCompany: 'Pourquoi cette entreprise ? (optionnel)',
    clWhyCompanyPlaceholder: 'Ex: J\'apprécie votre engagement en matière d\'innovation et de développement durable...',
    clKeyStrengths: 'Points forts à mettre en avant (optionnel)',
    clKeyStrengthsPlaceholder: 'Ex: 5 ans d\'expérience en gestion de projet, certification PMP...',
    clTone: 'Ton de la lettre',
    clToneFormal: 'Formel',
    clToneSemiFormal: 'Semi-formel',
    clToneDynamic: 'Dynamique',
    clAdditionalNotes: 'Notes supplémentaires (optionnel)',
    clAdditionalNotesPlaceholder: 'Toute information supplémentaire que vous souhaitez inclure...',
    clGenerate: 'Générer ma lettre de motivation avec l\'IA',
    clGenerating: "L'IA rédige votre lettre de motivation...",
    clGeneratingSubtitle: 'Analyse du poste et création du contenu personnalisé',
    clPreviewTitle: 'Votre lettre de motivation est prête !',
    clDownloadPdf: 'Télécharger en PDF',
    clDownloadWord: 'Télécharger en Word',
    clStartOver: 'Créer une autre lettre',
    clAlsoGenerate: 'Générer aussi une lettre de motivation',
    clStep1: 'Vos informations',
    clStep2: 'Le poste visé',
    clFeatureTitle: 'Lettre de Motivation IA',
    clFeatureDesc: 'Générez une lettre de motivation personnalisée et persuasive, adaptée à chaque offre d\'emploi.',
    clReadyTitle: 'Prêt à créer votre lettre ?',
    clReadyDesc: 'En moins d\'une minute, vous aurez une lettre de motivation professionnelle prête à envoyer.',
    clAddress: 'Adresse physique (optionnel)',
    clCountry: 'Pays',
    clCountryPlaceholder: 'Choisir le pays...',
    clLinkedToCv: 'CV lié détecté',
    clLinkedToCvDesc: 'Votre CV généré sera utilisé automatiquement pour personnaliser cette lettre de motivation.',
    clNoCvLinked: 'Aucun CV lié',
    clNoCvLinkedDesc: 'Créez d\'abord un CV pour que la lettre de motivation soit automatiquement enrichie avec vos expériences et compétences.',
    // Simultaneous generation
    tabCv: 'CV',
    tabCoverLetter: 'Lettre de motivation',
    generatingBoth: 'L\'IA rédige votre CV et votre lettre de motivation...',
    generatingBothSubtitle: 'Analyse de vos informations et création simultanée des deux documents',
    companyNameForCl: 'Entreprise cible (pour la lettre de motivation)',
    companyNameForClPlaceholder: 'Ex: Google, Renault, Société Générale...',
    hiringManagerForCl: 'Recruteur (optionnel)',
    hiringManagerForClPlaceholder: 'Ex: M. Dupont, Mme Martin...',
    clToneForCl: 'Ton de la lettre de motivation',
    step2TitleNew: 'Projet professionnel & Lettre',
    generatingCv: 'Rédaction du CV...',
    generatingCl: 'Rédaction de la lettre de motivation...',
    generatingClDone: 'Lettre de motivation générée !',
    generatingCvDone: 'CV généré !',
    cvAndClReady: 'Votre CV et lettre de motivation sont prêts !',
    // Pricing & Auth
    pricingTitle: 'Tarifs simples et transparents',
    pricingSubtitle: 'Commencez gratuitement, passez à Pro quand vous en avez besoin',
    planFree: 'Gratuit',
    planFreePrice: '0€',
    planFreeDesc: 'Pour découvrir notre outil',
    planPro: 'Pro',
    planProPrice: '6,99€',
    planProDesc: "Pour les chercheurs d'emploi actifs",
    planProPopular: 'Le plus populaire',
    planLifetime: 'À Vie',
    planLifetimePrice: '29,99€',
    planLifetimeDesc: 'Un seul paiement, pour toujours',
    planLifetimeBest: 'Meilleure offre',
    pricingCv: 'Générations de CV',
    pricingTemplates: 'Templates premium',
    pricingPdf: 'Téléchargement PDF',
    pricingWord: 'Téléchargement Word',
    pricingCoverLetter: 'Lettre de motivation IA',
    pricingNoWatermark: 'Sans watermark',
    pricingAtsScore: 'Score ATS détaillé',
    pricingPriority: 'Génération prioritaire',
    pricingMonthly: '/mois',
    pricingOneTime: 'une seule fois',
    pricingCurrency: 'Devise',
    pricingProPriceUsd: '$7.99',
    pricingLifetimePriceUsd: '$34.99',
    pricingMonthlyUsd: '/month',
    pricingOneTimeUsd: 'one time',
    pricingStartFree: 'Commencer gratuitement',
    loginTitle: 'Connexion',
    registerTitle: 'Créer un compte',
    loginEmail: 'Adresse e-mail',
    loginPassword: 'Mot de passe',
    loginButton: 'Se connecter',
    registerButton: "Créer mon compte",
    loginNoAccount: 'Pas encore de compte ?',
    registerHasAccount: 'Déjà un compte ?',
    loginName: 'Nom complet',
    loginSuccess: 'Connexion réussie !',
    registerSuccess: 'Compte créé avec succès !',
    loginError: 'Email ou mot de passe incorrect',
    registerError: 'Cet email est déjà utilisé',
    profileMenu: 'Mon compte',
    myAccount: 'Mon compte',
    logout: 'Se déconnecter',
    remainingCvs: 'CVs restants ce mois',
    remainingCls: 'Lettres restantes ce mois',
    upgradeToPro: 'Passer à Pro',
    pricingFeatureIncluded: '✓',
    pricingFeatureExcluded: '✕',
  },
  en: {
    siteTitle: 'CV Genius AI',
    siteSubtitle: 'Generate a professional resume in 60 seconds',
    siteDescription:
      'Our AI writes an ATS-optimized resume, perfectly tailored to your target role.',
    cta: 'Create my free resume',
    step1Title: 'Personal Information',
    step2Title: 'Career Goals',
    step3Title: 'Experience & Education',
    step4Title: 'Skills & Summary',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone',
    phoneCountry: 'Country',
    phoneCountryPlaceholder: 'Select country...',
    phoneNumber: 'Phone number',
    address: 'Full Address',
    location: 'City / Country',
    linkedin: 'LinkedIn (optional)',
    website: 'Website (optional)',
    photo: 'Profile Photo',
    photoPlaceholder: 'Click or drag a photo here',
    photoRemove: 'Remove',
    photoNote: 'Not recommended for English resumes (anti-discrimination practice). Recommended for French and Arabic CVs.',
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
    downloadWord: 'Download Word',
    downloadFormat: 'Download format',
    startOver: 'Create another resume',
    previewTitle: 'Your resume is ready!',
    feature1Title: 'Advanced AI',
    feature1Desc:
      'Our AI analyzes your information and generates professional, optimized content for each section of your resume.',
    feature2Title: 'Multilingual',
    feature2Desc:
      'Create your resume in French, English, Spanish, or Arabic. The AI adapts vocabulary and style to each language.',
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
    dateOfBirth: 'Date of Birth',
    birthPlace: 'Place of Birth',
    birthCountry: 'Country of Birth',
    birthCountryPlaceholder: 'Morocco, France, Algeria...',
    softSkills: 'Soft Skills (optional)',
    softSkillsPlaceholder: 'List your soft skills separated by commas (e.g. leadership, communication, problem-solving, adaptability...)',
    personalInfo: 'Birth Information',
    required: 'This field is required',
    errorFillFields: 'Please fill in all required fields',
    footerText: 'All rights reserved',
    footerMadeWith: 'Powered by',
    freeNoSignup: 'Free and no sign-up required',
    ctaReadyTitle: 'Ready to create your resume?',
    ctaReadyDesc: 'In less than 2 minutes, you\'ll have a professional resume ready to send.',
    photoPosition: 'Photo Position',
    photoPositionLeft: 'Left',
    photoPositionCenter: 'Center',
    photoPositionRight: 'Right',
    availableLangs: 'Available in French, English, Spanish, and Arabic',
    freeNoSignup: 'Free and no sign-up required',
    ctaReadyTitle: 'Ready to create your resume?',
    ctaReadyDesc: "In less than 2 minutes, you'll have a professional resume ready to send.",
    // Cover letter
    clTitle: 'Cover Letter',
    clSubtitle: 'Generate a persuasive cover letter in 30 seconds',
    clDescription: 'Our AI writes a personalized cover letter, perfectly tailored to the job posting. Available in French, English, Arabic, and Spanish.',
    clCta: 'Create my cover letter',
    clBackToCv: 'Back to CV',
    clCompanyName: 'Company Name',
    clCompanyNamePlaceholder: 'E.g. Google, Renault, Société Générale...',
    clHiringManager: 'Hiring Manager (optional)',
    clHiringManagerPlaceholder: 'E.g. Mr. Smith, Ms. Johnson...',
    clJobTitle: 'Job Title',
    clJobTitlePlaceholder: 'E.g. Full-Stack Developer, Project Manager...',
    clJobReference: 'Job Reference (optional)',
    clJobReferencePlaceholder: 'E.g. REF-2024-123...',
    clWhyCompany: 'Why this company? (optional)',
    clWhyCompanyPlaceholder: 'E.g. I appreciate your commitment to innovation and sustainability...',
    clKeyStrengths: 'Key strengths to highlight (optional)',
    clKeyStrengthsPlaceholder: 'E.g. 5 years of project management experience, PMP certification...',
    clTone: 'Letter Tone',
    clToneFormal: 'Formal',
    clToneSemiFormal: 'Semi-formal',
    clToneDynamic: 'Dynamic',
    clAdditionalNotes: 'Additional notes (optional)',
    clAdditionalNotesPlaceholder: 'Any additional information you want to include...',
    clGenerate: 'Generate my cover letter with AI',
    clGenerating: 'AI is writing your cover letter...',
    clGeneratingSubtitle: 'Analyzing the position and creating personalized content',
    clPreviewTitle: 'Your cover letter is ready!',
    clDownloadPdf: 'Download PDF',
    clDownloadWord: 'Download Word',
    clStartOver: 'Create another letter',
    clAlsoGenerate: 'Also generate a cover letter',
    clStep1: 'Your Information',
    clStep2: 'Target Position',
    clFeatureTitle: 'AI Cover Letter',
    clFeatureDesc: 'Generate a personalized and persuasive cover letter, tailored to each job posting.',
    clReadyTitle: 'Ready to create your letter?',
    clReadyDesc: 'In less than a minute, you\'ll have a professional cover letter ready to send.',
    clAddress: 'Physical Address (optional)',
    clCountry: 'Country',
    clCountryPlaceholder: 'Select country...',
    clLinkedToCv: 'Linked CV detected',
    clLinkedToCvDesc: 'Your generated CV will automatically be used to personalize this cover letter.',
    clNoCvLinked: 'No CV linked',
    clNoCvLinkedDesc: 'Create a CV first so the cover letter is automatically enriched with your experience and skills.',
    // Simultaneous generation
    tabCv: 'Resume',
    tabCoverLetter: 'Cover Letter',
    generatingBoth: 'AI is writing your resume and cover letter...',
    generatingBothSubtitle: 'Analyzing your information and creating both documents simultaneously',
    companyNameForCl: 'Target company (for cover letter)',
    companyNameForClPlaceholder: 'E.g. Google, Renault, Société Générale...',
    hiringManagerForCl: 'Hiring manager (optional)',
    hiringManagerForClPlaceholder: 'E.g. Mr. Smith, Ms. Johnson...',
    clToneForCl: 'Cover letter tone',
    step2TitleNew: 'Career Goals & Cover Letter',
    generatingCv: 'Writing resume...',
    generatingCl: 'Writing cover letter...',
    generatingClDone: 'Cover letter generated!',
    generatingCvDone: 'Resume generated!',
    cvAndClReady: 'Your resume and cover letter are ready!',
    // Pricing & Auth
    pricingTitle: 'Simple & transparent pricing',
    pricingSubtitle: 'Start for free, upgrade to Pro when you need it',
    planFree: 'Free',
    planFreePrice: '$0',
    planFreeDesc: 'To discover our tool',
    planPro: 'Pro',
    planProPrice: '$6.99',
    planProDesc: 'For active job seekers',
    planProPopular: 'Most popular',
    planLifetime: 'Lifetime',
    planLifetimePrice: '$29.99',
    planLifetimeDesc: 'One-time payment, forever',
    planLifetimeBest: 'Best value',
    pricingCv: 'Resume generations',
    pricingTemplates: 'Premium templates',
    pricingPdf: 'PDF download',
    pricingWord: 'Word download',
    pricingCoverLetter: 'AI cover letter',
    pricingNoWatermark: 'No watermark',
    pricingAtsScore: 'Detailed ATS score',
    pricingPriority: 'Priority generation',
    pricingMonthly: '/month',
    pricingOneTime: 'one time',
    pricingCurrency: 'Currency',
    pricingProPriceUsd: '$7.99',
    pricingLifetimePriceUsd: '$34.99',
    pricingMonthlyUsd: '/month',
    pricingOneTimeUsd: 'one time',
    pricingStartFree: 'Start for free',
    loginTitle: 'Sign In',
    registerTitle: 'Create an account',
    loginEmail: 'Email address',
    loginPassword: 'Password',
    loginButton: 'Sign in',
    registerButton: 'Create my account',
    loginNoAccount: "Don't have an account?",
    registerHasAccount: 'Already have an account?',
    loginName: 'Full name',
    loginSuccess: 'Successfully signed in!',
    registerSuccess: 'Account created successfully!',
    loginError: 'Invalid email or password',
    registerError: 'This email is already in use',
    profileMenu: 'My account',
    myAccount: 'My account',
    logout: 'Sign out',
    remainingCvs: 'Resumes remaining this month',
    remainingCls: 'Letters remaining this month',
    upgradeToPro: 'Upgrade to Pro',
    pricingFeatureIncluded: '✓',
    pricingFeatureExcluded: '✕',
  },
  ar: {
    siteTitle: 'CV Genious الذكاء الاصطناعي',
    siteSubtitle: 'أنشئ سيرة ذاتية احترافية في 60 ثانية',
    siteDescription:
      'يكتب الذكاء الاصطناعي لدينا سيرة ذاتية محسنة لأنظمة ATS، مصممة خصيصاً للوظيفة المستهدفة.',
    cta: 'أنشئ سيرتي الذاتية مجاناً',
    step1Title: 'المعلومات الشخصية',
    step2Title: 'الأهداف المهنية',
    step3Title: 'الخبرة والتعليم',
    step4Title: 'المهارات والملخص',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    phoneCountry: 'البلد',
    phoneCountryPlaceholder: 'اختر البلد...',
    phoneNumber: 'رقم الهاتف',
    address: 'العنوان الكامل',
    location: 'المدينة / البلد',
    linkedin: 'لينكد إن (اختياري)',
    website: 'الموقع الإلكتروني (اختياري)',
    photo: 'الصورة الشخصية',
    photoPlaceholder: 'انقر أو اسحب صورة هنا',
    photoRemove: 'إزالة',
    photoNote: 'يُنصح بها للسير الذاتية بالفرنسية والعربية. غير موصى بها للسير الذاتية بالإنجليزية.',
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
      'فقرة قصيرة تصف ملفك الشخصي ونقاط قوتك وطموحاتك المهنية...',
    next: 'التالي',
    previous: 'السابق',
    generate: 'أنشئ سيرتي الذاتية بالذكاء الاصطناعي',
    generating: 'الذكاء الاصطناعي يكتب سيرتك الذاتية...',
    generatingSubtitle: 'تحليل معلوماتك وإنشاء محتوى محسن',
    downloadPdf: 'تحميل PDF',
    downloadWord: 'تحميل Word',
    downloadFormat: 'صيغة التحميل',
    startOver: 'إنشاء سيرة ذاتية أخرى',
    previewTitle: 'سيرتك الذاتية جاهزة!',
    feature1Title: 'ذكاء اصطناعي متقدم',
    feature1Desc:
      'يحلل الذكاء الاصطناعي لدينا معلوماتك وينشئ محتوى احترافياً محسناً لكل قسم من سيرتك الذاتية.',
    feature2Title: 'متعدد اللغات',
    feature2Desc:
      'أنشئ سيرتك الذاتية بالفرنسية أو الإنجليزية أو الإسبانية أو العربية. يتكيف الذكاء الاصطناعي مع المفردات والأسلوب لكل لغة.',
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
    dateOfBirth: 'تاريخ الميلاد',
    birthPlace: 'مكان الميلاد',
    birthCountry: 'بلد الميلاد',
    birthCountryPlaceholder: 'المغرب، فرنسا، الجزائر...',
    softSkills: 'المهارات الشخصية (اختياري)',
    softSkillsPlaceholder: 'اذكر مهاراتك الشخصية مفصولة بفواصل (مثال: القيادة، التواصل، حل المشكلات، التكيف...)',
    personalInfo: 'معلومات الميلاد',
    required: 'هذا الحقل مطلوب',
    errorFillFields: 'يرجى ملء جميع الحقول المطلوبة',
    footerText: 'جميع الحقوق محفوظة',
    footerMadeWith: 'بدعم من',
    freeNoSignup: 'مجاني وبدون تسجيل',
    ctaReadyTitle: 'مستعد لإنشاء سيرتك الذاتية؟',
    ctaReadyDesc: 'في أقل من دقيقتين، ستكون لديك سيرة ذاتية احترافية جاهزة للإرسال.',
    photoPosition: 'موضع الصورة',
    photoPositionLeft: 'يسار',
    photoPositionCenter: 'وسط',
    photoPositionRight: 'يمين',
    availableLangs: 'متاح بالفرنسية والإنجليزية والإسبانية والعربية',
    freeNoSignup: 'مجاني وبدون تسجيل',
    ctaReadyTitle: 'مستعد لإنشاء سيرتك الذاتية؟',
    ctaReadyDesc: 'في أقل من دقيقتين، ستكون لديك سيرة ذاتية احترافية جاهزة للإرسال.',
    // Cover letter
    clTitle: 'رسالة الدافع',
    clSubtitle: 'أنشئ رسالة دافع مقنعة في 30 ثانية',
    clDescription: 'يكتب الذكاء الاصطناعي لدينا رسالة دافع مخصصة، مصممة بشكل مثالي للوظيفة المستهدفة. متاحة بالفرنسية والإنجليزية والعربية والإسبانية.',
    clCta: 'إنشاء رسالة الدافع الخاصة بي',
    clBackToCv: 'العودة إلى السيرة الذاتية',
    clCompanyName: 'اسم الشركة',
    clCompanyNamePlaceholder: 'مثال: Google, Renault, Société Générale...',
    clHiringManager: 'اسم المسؤول عن التوظيف (اختياري)',
    clHiringManagerPlaceholder: 'مثال: السيد دوبون، السيدة مارتين...',
    clJobTitle: 'المسمى الوظيفي',
    clJobTitlePlaceholder: 'مثال: مطور Full-Stack، مدير مشاريع...',
    clJobReference: 'مرجع العرض (اختياري)',
    clJobReferencePlaceholder: 'مثال: REF-2024-123...',
    clWhyCompany: 'لماذا هذه الشركة؟ (اختياري)',
    clWhyCompanyPlaceholder: 'مثال: أقدّر التزامكم بالابتكار والتنمية المستدامة...',
    clKeyStrengths: 'نقاط القوة المراد إبرازها (اختياري)',
    clKeyStrengthsPlaceholder: 'مثال: 5 سنوات خبرة في إدارة المشاريع، شهادة PMP...',
    clTone: 'نبرة الرسالة',
    clToneFormal: 'رسمي',
    clToneSemiFormal: 'شبه رسمي',
    clToneDynamic: 'ديناميكي',
    clAdditionalNotes: 'ملاحظات إضافية (اختياري)',
    clAdditionalNotesPlaceholder: 'أي معلومات إضافية تريد إضافتها...',
    clGenerate: 'إنشاء رسالة الدافع بالذكاء الاصطناعي',
    clGenerating: 'الذكاء الاصطناعي يكتب رسالة الدافع الخاصة بك...',
    clGeneratingSubtitle: 'تحليل المنصب وإنشاء محتوى مخصص',
    clPreviewTitle: 'رسالة الدافع جاهزة!',
    clDownloadPdf: 'تحميل PDF',
    clDownloadWord: 'تحميل Word',
    clStartOver: 'إنشاء رسالة أخرى',
    clAlsoGenerate: 'إنشاء أيضاً رسالة دافع',
    clStep1: 'معلوماتك',
    clStep2: 'المنصب المستهدف',
    clFeatureTitle: 'رسالة دافع بالذكاء الاصطناعي',
    clFeatureDesc: 'أنشئ رسالة دافع مخصصة ومقنعة، مصممة لكل عرض توظيف.',
    clReadyTitle: 'مستعد لإنشاء رسالتك؟',
    clReadyDesc: 'في أقل من دقيقة، ستكون لديك رسالة دافع احترافية جاهزة للإرسال.',
    clAddress: 'العنوان الفعلي (اختياري)',
    clCountry: 'البلد',
    clCountryPlaceholder: 'اختر البلد...',
    clLinkedToCv: 'تم ربط السيرة الذاتية',
    clLinkedToCvDesc: 'سيتم استخدام سيرتك الذاتية المُنشأة تلقائياً لتخصيص رسالة الدافع هذه.',
    clNoCvLinked: 'لم يتم ربط سيرة ذاتية',
    clNoCvLinkedDesc: 'أنشئ سيرة ذاتية أولاً لتتم إثراء رسالة الدافع تلقائياً بخبراتك ومهاراتك.',
    // Simultaneous generation
    tabCv: 'السيرة الذاتية',
    tabCoverLetter: 'رسالة الدافع',
    generatingBoth: 'الذكاء الاصطناعي يكتب سيرتك الذاتية ورسالة الدافع...',
    generatingBothSubtitle: 'تحليل معلوماتك وإنشاء الوثيقتين في وقت واحد',
    companyNameForCl: 'الشركة المستهدفة (لرسالة الدافع)',
    companyNameForClPlaceholder: 'مثال: Google, Renault, Société Générale...',
    hiringManagerForCl: 'المسؤول عن التوظيف (اختياري)',
    hiringManagerForClPlaceholder: 'مثال: السيد دوبون، السيدة مارتين...',
    clToneForCl: 'نبرة رسالة الدافع',
    step2TitleNew: 'الأهداف المهنية والرسالة',
    generatingCv: 'كتابة السيرة الذاتية...',
    generatingCl: 'كتابة رسالة الدافع...',
    generatingClDone: 'تم إنشاء رسالة الدافع!',
    generatingCvDone: 'تم إنشاء السيرة الذاتية!',
    cvAndClReady: 'سيرتك الذاتية ورسالة الدافع جاهزتان!',
    // Pricing & Auth
    pricingTitle: 'أسعار بسيطة وشفافة',
    pricingSubtitle: 'ابدأ مجاناً، انتقل إلى Pro عندما تحتاجها',
    planFree: 'مجاني',
    planFreePrice: '0$',
    planFreeDesc: 'لاكتشاف أداتنا',
    planPro: 'Pro',
    planProPrice: '6.99$',
    planProDesc: 'للباحثين النشطين عن عمل',
    planProPopular: 'الأكثر شعبية',
    planLifetime: 'مدى الحياة',
    planLifetimePrice: '29.99$',
    planLifetimeDesc: 'دفعة واحدة، للأبد',
    planLifetimeBest: 'أفضل قيمة',
    pricingCv: 'إنشاءات السيرة الذاتية',
    pricingTemplates: 'قوالب مميزة',
    pricingPdf: 'تحميل PDF',
    pricingWord: 'تحميل Word',
    pricingCoverLetter: 'رسالة دافع بالذكاء الاصطناعي',
    pricingNoWatermark: 'بدون علامة مائية',
    pricingAtsScore: 'درجة ATS مفصلة',
    pricingPriority: 'إنشاء ذو أولوية',
    pricingMonthly: '/شهر',
    pricingOneTime: 'مرة واحدة',
    pricingCurrency: 'العملة',
    pricingProPriceUsd: '$7.99',
    pricingLifetimePriceUsd: '$34.99',
    pricingMonthlyUsd: '/شهر',
    pricingOneTimeUsd: 'مرة واحدة',
    pricingStartFree: 'البدء مجاناً',
    loginTitle: 'تسجيل الدخول',
    registerTitle: 'إنشاء حساب',
    loginEmail: 'البريد الإلكتروني',
    loginPassword: 'كلمة المرور',
    loginButton: 'تسجيل الدخول',
    registerButton: 'إنشاء حسابي',
    loginNoAccount: 'ليس لديك حساب؟',
    registerHasAccount: 'لديك حساب بالفعل؟',
    loginName: 'الاسم الكامل',
    loginSuccess: 'تم تسجيل الدخول بنجاح!',
    registerSuccess: 'تم إنشاء الحساب بنجاح!',
    loginError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    registerError: 'هذا البريد الإلكتروني مستخدم بالفعل',
    profileMenu: 'حسابي',
    myAccount: 'حسابي',
    logout: 'تسجيل الخروج',
    remainingCvs: 'السير الذاتية المتبقية هذا الشهر',
    remainingCls: 'الرسائل المتبقية هذا الشهر',
    upgradeToPro: 'الترقية إلى Pro',
    pricingFeatureIncluded: '✓',
    pricingFeatureExcluded: '✕',
  },
  es: {
    siteTitle: 'CV Genius IA',
    siteSubtitle: 'Genera un currículum profesional en 60 segundos',
    siteDescription:
      'Nuestra IA redacta un currículum optimizado para ATS, perfectamente adaptado a tu puesto objetivo.',
    cta: 'Crear mi currículum gratis',
    step1Title: 'Información personal',
    step2Title: 'Objetivos profesionales',
    step3Title: 'Experiencia y Formación',
    step4Title: 'Habilidades y Resumen',
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    phoneCountry: 'País',
    phoneCountryPlaceholder: 'Seleccionar país...',
    phoneNumber: 'Número de teléfono',
    address: 'Dirección completa',
    location: 'Ciudad / País',
    linkedin: 'LinkedIn (opcional)',
    website: 'Sitio web (opcional)',
    photo: 'Foto de perfil',
    photoPlaceholder: 'Haz clic o arrastra una foto aquí',
    photoRemove: 'Eliminar',
    photoNote: 'Recomendado para currículums en francés, árabe y español. No recomendado para currículums en inglés (práctica anti-discriminación).',
    targetJob: 'Puesto objetivo',
    industry: 'Sector de actividad',
    experience: 'Experiencia profesional',
    experiencePlaceholder:
      'Describe tus puestos anteriores (ej: Desarrollador Web en ABC Corp de 2020 a 2023 - responsabilidades, proyectos, resultados...)',
    education: 'Formación',
    educationPlaceholder:
      'Describe tus títulos (ej: Máster en Informática en la Universidad X de 2016 a 2020...)',
    skills: 'Habilidades',
    skillsPlaceholder:
      'Lista tus habilidades técnicas y humanas separadas por comas (ej: JavaScript, React, gestión de proyectos, trabajo en equipo...)',
    languages: 'Idiomas hablados',
    languagesPlaceholder:
      'Lista tus idiomas con nivel (ej: Español - nativo, Inglés - fluido, Francés - intermedio...)',
    summary: 'Resumen profesional (opcional)',
    summaryPlaceholder:
      'Un párrafo corto que describa tu perfil, fortalezas y ambiciones profesionales...',
    next: 'Siguiente',
    previous: 'Anterior',
    generate: 'Generar mi currículum con IA',
    generating: 'La IA está redactando tu currículum...',
    generatingSubtitle:
      'Analizando tu información y creando contenido optimizado',
    downloadPdf: 'Descargar PDF',
    downloadWord: 'Descargar Word',
    downloadFormat: 'Formato de descarga',
    startOver: 'Crear otro currículum',
    previewTitle: '¡Tu currículum está listo!',
    feature1Title: 'IA Avanzada',
    feature1Desc:
      'Nuestra IA analiza tu información y genera contenido profesional optimizado para cada sección de tu currículum.',
    feature2Title: 'Multilingüe',
    feature2Desc:
      'Crea tu currículum en francés, inglés, español o árabe. La IA adapta el vocabulario y el estilo a cada idioma.',
    feature3Title: 'Optimizado para ATS',
    feature3Desc:
      'Tus currículums están estructurados para superar los filtros automáticos de los software de reclutamiento.',
    feature4Title: '3 Plantillas',
    feature4Desc:
      'Elige entre 3 diseños profesionales: Moderno, Clásico o Creativo.',
    templateModern: 'Moderno',
    templateClassic: 'Clásico',
    templateCreative: 'Creativo',
    templateLabel: 'Plantilla',
    languageLabel: 'Idioma del currículum',
    dateOfBirth: 'Fecha de nacimiento',
    birthPlace: 'Lugar de nacimiento',
    birthCountry: 'País de nacimiento',
    birthCountryPlaceholder: 'Marruecos, Francia, Argelia...',
    softSkills: 'Soft Skills / Habilidades blandas (opcional)',
    softSkillsPlaceholder: 'Lista tus soft skills separados por comas (ej: liderazgo, comunicación, resolución de problemas, adaptabilidad...)',
    personalInfo: 'Información de nacimiento',
    required: 'Este campo es obligatorio',
    errorFillFields: 'Por favor, completa todos los campos obligatorios',
    footerText: 'Todos los derechos reservados',
    footerMadeWith: 'Desarrollado por',
    freeNoSignup: 'Gratis y sin registro',
    ctaReadyTitle: '¿Listo para crear tu currículum?',
    ctaReadyDesc: 'En menos de 2 minutos, tendrás un currículum profesional listo para enviar.',
    photoPosition: 'Posición de la foto',
    photoPositionLeft: 'Izquierda',
    photoPositionCenter: 'Centro',
    photoPositionRight: 'Derecha',
    availableLangs: 'Disponible en francés, inglés, español y árabe',
    freeNoSignup: 'Gratis y sin registro',
    ctaReadyTitle: '¿Listo para crear tu currículum?',
    ctaReadyDesc: 'En menos de 2 minutos, tendrás un currículum profesional listo para enviar.',
    // Cover letter
    clTitle: 'Carta de Motivación',
    clSubtitle: 'Genera una carta de motivación persuasiva en 30 segundos',
    clDescription: 'Nuestra IA redacta una carta de motivación personalizada, perfectamente adaptada a la oferta de empleo. Disponible en francés, inglés, árabe y español.',
    clCta: 'Crear mi carta de motivación',
    clBackToCv: 'Volver al CV',
    clCompanyName: 'Nombre de la empresa',
    clCompanyNamePlaceholder: 'Ej: Google, Renault, Société Générale...',
    clHiringManager: 'Nombre del reclutador (opcional)',
    clHiringManagerPlaceholder: 'Ej: Sr. García, Sra. López...',
    clJobTitle: 'Título del puesto',
    clJobTitlePlaceholder: 'Ej: Desarrollador Full-Stack, Director de proyectos...',
    clJobReference: 'Referencia de la oferta (opcional)',
    clJobReferencePlaceholder: 'Ej: REF-2024-123...',
    clWhyCompany: '¿Por qué esta empresa? (opcional)',
    clWhyCompanyPlaceholder: 'Ej: Valoro su compromiso con la innovación y la sostenibilidad...',
    clKeyStrengths: 'Puntos fuertes a destacar (opcional)',
    clKeyStrengthsPlaceholder: 'Ej: 5 años de experiencia en gestión de proyectos, certificación PMP...',
    clTone: 'Tono de la carta',
    clToneFormal: 'Formal',
    clToneSemiFormal: 'Semi-formal',
    clToneDynamic: 'Dinámico',
    clAdditionalNotes: 'Notas adicionales (opcional)',
    clAdditionalNotesPlaceholder: 'Cualquier información adicional que desees incluir...',
    clGenerate: 'Generar mi carta de motivación con IA',
    clGenerating: 'La IA está redactando tu carta de motivación...',
    clGeneratingSubtitle: 'Analizando el puesto y creando contenido personalizado',
    clPreviewTitle: '¡Tu carta de motivación está lista!',
    clDownloadPdf: 'Descargar PDF',
    clDownloadWord: 'Descargar Word',
    clStartOver: 'Crear otra carta',
    clAlsoGenerate: 'Generar también una carta de motivación',
    clStep1: 'Tu información',
    clStep2: 'Puesto objetivo',
    clFeatureTitle: 'Carta de Motivación IA',
    clFeatureDesc: 'Genera una carta de motivación personalizada y persuasiva, adaptada a cada oferta de empleo.',
    clReadyTitle: '¿Listo para crear tu carta?',
    clReadyDesc: 'En menos de un minuto, tendrás una carta de motivación profesional lista para enviar.',
    clAddress: 'Dirección física (opcional)',
    clCountry: 'País',
    clCountryPlaceholder: 'Seleccionar país...',
    clLinkedToCv: 'CV vinculado detectado',
    clLinkedToCvDesc: 'Tu currículum generado se usará automáticamente para personalizar esta carta de motivación.',
    clNoCvLinked: 'Ningún CV vinculado',
    clNoCvLinkedDesc: 'Crea primero un currículum para que la carta de motivación se enriquezca automáticamente con tu experiencia y habilidades.',
    // Simultaneous generation
    tabCv: 'Currículum',
    tabCoverLetter: 'Carta de Motivación',
    generatingBoth: 'La IA está redactando tu currículum y carta de motivación...',
    generatingBothSubtitle: 'Analizando tu información y creando ambos documentos simultáneamente',
    companyNameForCl: 'Empresa objetivo (para la carta de motivación)',
    companyNameForClPlaceholder: 'Ej: Google, Renault, Société Générale...',
    hiringManagerForCl: 'Reclutador (opcional)',
    hiringManagerForClPlaceholder: 'Ej: Sr. García, Sra. López...',
    clToneForCl: 'Tono de la carta de motivación',
    step2TitleNew: 'Objetivos profesionales y Carta',
    generatingCv: 'Redactando currículum...',
    generatingCl: 'Redactando carta de motivación...',
    generatingClDone: '¡Carta de motivación generada!',
    generatingCvDone: '¡Currículum generado!',
    cvAndClReady: '¡Tu currículum y carta de motivación están listos!',
    // Pricing & Auth
    pricingTitle: 'Precios simples y transparentes',
    pricingSubtitle: 'Empieza gratis, pasa a Pro cuando lo necesites',
    planFree: 'Gratis',
    planFreePrice: '0€',
    planFreeDesc: 'Para descubrir nuestra herramienta',
    planPro: 'Pro',
    planProPrice: '6,99€',
    planProDesc: 'Para buscadores de empleo activos',
    planProPopular: 'El más popular',
    planLifetime: 'De por vida',
    planLifetimePrice: '29,99€',
    planLifetimeDesc: 'Un solo pago, para siempre',
    planLifetimeBest: 'Mejor oferta',
    pricingCv: 'Generaciones de currículum',
    pricingTemplates: 'Plantillas premium',
    pricingPdf: 'Descarga PDF',
    pricingWord: 'Descarga Word',
    pricingCoverLetter: 'Carta de motivación IA',
    pricingNoWatermark: 'Sin marca de agua',
    pricingAtsScore: 'Puntuación ATS detallada',
    pricingPriority: 'Generación prioritaria',
    pricingMonthly: '/mes',
    pricingOneTime: 'una sola vez',
    pricingCurrency: 'Moneda',
    pricingProPriceUsd: '$7.99',
    pricingLifetimePriceUsd: '$34.99',
    pricingMonthlyUsd: '/mes',
    pricingOneTimeUsd: 'una sola vez',
    pricingStartFree: 'Empezar gratis',
    loginTitle: 'Iniciar sesión',
    registerTitle: 'Crear una cuenta',
    loginEmail: 'Correo electrónico',
    loginPassword: 'Contraseña',
    loginButton: 'Iniciar sesión',
    registerButton: 'Crear mi cuenta',
    loginNoAccount: '¿No tienes cuenta?',
    registerHasAccount: '¿Ya tienes cuenta?',
    loginName: 'Nombre completo',
    loginSuccess: '¡Sesión iniciada correctamente!',
    registerSuccess: '¡Cuenta creada con éxito!',
    loginError: 'Correo o contraseña incorrectos',
    registerError: 'Este correo ya está en uso',
    profileMenu: 'Mi cuenta',
    myAccount: 'Mi cuenta',
    logout: 'Cerrar sesión',
    remainingCvs: 'Currículums restantes este mes',
    remainingCls: 'Cartas restantes este mes',
    upgradeToPro: 'Pasar a Pro',
    pricingFeatureIncluded: '✓',
    pricingFeatureExcluded: '✕',
  }
}

export function t(lang: CVLanguage, key: TranslationKey): string {
  return translations[lang]?.[key] ?? translations.fr[key] ?? key
}