export type CVLanguage = 'fr' | 'en' | 'ar' | 'es'

export type TranslationKey =
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
  | 'planAnnual'
  | 'planAnnualPrice'
  | 'planAnnualDesc'
  | 'planAnnualBest'
  | 'pricingAnnual'
  | 'pricingAnnualUsd'
  | 'pricingAnnualPriceUsd'
  | 'pricingCv'
  | 'pricingTemplates'
  | 'pricingPdf'
  | 'pricingWord'
  | 'pricingCoverLetter'
  | 'pricingNoWatermark'
  | 'pricingAtsScore'
  | 'pricingPriority'
  | 'pricingMonthly'
  | 'pricingCurrency'
  | 'pricingProPriceUsd'
  | 'pricingMonthlyUsd'
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
  // Paymob / Africa
  | 'paymobLabel'
  | 'paymobDesc'
  | 'paymobProPrice'
  | 'paymobLifetimePrice'
  | 'paymobMonthly'
  | 'paymobOneTime'
  | 'paymobMethods'
  | 'paymobCard'
  | 'paymobWallet'
  | 'paymobAfrica'
  // Personas
  | 'personaStudent'
  | 'personaGraduate'
  | 'personaProfessional'
  | 'personaExecutive'
  | 'personaFreelance'
  | 'personaExpat'
  | 'personaStudentDesc'
  | 'personaGraduateDesc'
  | 'personaProfessionalDesc'
  | 'personaExecutiveDesc'
  | 'personaFreelanceDesc'
  | 'personaExpatDesc'
  | 'personaChoose'
  | 'ctaChooseProfile'
  | 'personaFieldsTitle'
  | 'internshipRequest'
  | 'internshipRequestDesc'
  | 'jobRequest'
  | 'jobRequestDesc'
  | 'applicationType'
  | 'importCvTitle'
  | 'importCvDesc'
  | 'importCvBtn'
  | 'importCvSuccess'
  | 'importCvParsing'
  | 'roadmapTitle'
  | 'ecosystemTitle'
  | 'ecosystemDesc'
  | 'ecosystemCv'
  | 'ecosystemAts'
  | 'ecosystemInterview'
  | 'ecosystemLinkedin'
  | 'ecosystemRecruiter'
  | 'ecosystemCareer'
  | 'ecosystemCoach'
  | 'ecosystemFormation'
  | 'ecosystemFreelance'
  | 'pfStudentField1' | 'pfStudentField1Ph'
  | 'pfStudentField2' | 'pfStudentField2Ph'
  | 'pfStudentField3' | 'pfStudentField3Ph'
  | 'pfGraduateField1' | 'pfGraduateField1Ph'
  | 'pfGraduateField2' | 'pfGraduateField2Ph'
  | 'pfGraduateField3' | 'pfGraduateField3Ph'
  | 'pfProField1' | 'pfProField1Ph'
  | 'pfProField2' | 'pfProField2Ph'
  | 'pfProField3' | 'pfProField3Ph'
  | 'pfExecField1' | 'pfExecField1Ph'
  | 'pfExecField2' | 'pfExecField2Ph'
  | 'pfExecField3' | 'pfExecField3Ph'
  | 'pfExecField4' | 'pfExecField4Ph'
  | 'pfFreeField1' | 'pfFreeField1Ph'
  | 'pfFreeField2' | 'pfFreeField2Ph'
  | 'pfFreeField3' | 'pfFreeField3Ph'
  | 'pfExpatField1' | 'pfExpatField1Ph'
  | 'pfExpatField2' | 'pfExpatField2Ph'
  | 'pfExpatField3' | 'pfExpatField3Ph'
  | 'pfExpatField4' | 'pfExpatField4Ph'
  // CV link in CL form
  | 'clNoCvCreateCta'

const translations: Record<CVLanguage, Record<TranslationKey, string>> = {
  fr: {
    siteTitle: 'HireNova',
    siteSubtitle: 'Générez un CV professionnel en 60 secondes',
    siteDescription:
      'Notre IA rédige un CV optimisé pour les ATS, parfaitement adapté à votre métier cible.',
    cta: 'Créer mon CV maintenant',
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
    freeNoSignup: 'Générez un CV pro en 60 secondes',
    ctaReadyTitle: 'Prêt à créer votre CV ?',
    ctaReadyDesc: 'En moins de 2 minutes, vous aurez un CV professionnel prêt à être envoyé.',
    photoPosition: 'Position de la photo',
    photoPositionLeft: 'Gauche',
    photoPositionCenter: 'Centre',
    photoPositionRight: 'Droite',
    availableLangs: 'Disponible en français, anglais, espagnol et arabe',
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
    pricingSubtitle: 'Choisissez le plan qui vous convient',
    planFree: 'Gratuit',
    planFreePrice: '0€',
    planFreeDesc: 'Pour découvrir notre outil',
    planPro: 'Pro',
    planProPrice: '6,99€',
    planProDesc: "Pour les chercheurs d'emploi actifs",
    planProPopular: 'Le plus populaire',
    planAnnual: 'Annuel',
    planAnnualPrice: '70€',
    planAnnualDesc: "Idéal pour une année complète de recherche d'emploi",
    planAnnualBest: 'Meilleur rapport qualité-prix',
    pricingAnnual: '/an',
    pricingAnnualUsd: '/year',
    pricingAnnualPriceUsd: '$79',
    pricingCv: 'Générations de CV',
    pricingTemplates: 'Templates premium',
    pricingPdf: 'Téléchargement PDF',
    pricingWord: 'Téléchargement Word',
    pricingCoverLetter: 'Lettre de motivation IA',
    pricingNoWatermark: 'Sans watermark',
    pricingAtsScore: 'Score ATS détaillé',
    pricingPriority: 'Génération prioritaire',
    pricingMonthly: '/mois',
    pricingCurrency: 'Devise',
    pricingProPriceUsd: '$7.99',
    pricingMonthlyUsd: '/month',
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
    paymobLabel: 'Payer avec Floos / Paymob',
    paymobDesc: 'Carte bancaire, portefeuille mobile, CashPlus, etc.',
    paymobProPrice: '70 MAD',
    paymobLifetimePrice: '300 MAD',
    paymobMonthly: '/mois',
    paymobOneTime: 'une seule fois',
    paymobMethods: 'Méthodes de paiement',
    paymobCard: 'Carte CMI, Visa, Mastercard',
    paymobWallet: 'Floos, CashPlus, MTN MoMo',
    paymobAfrica: '🌍 Paiement pour l\'Afrique',
    // Personas
    personaStudent: 'Étudiant',
    personaGraduate: 'Diplômé récent',
    personaProfessional: 'Professionnel',
    personaExecutive: 'Cadre dirigeant',
    personaFreelance: 'Freelance',
    personaExpat: 'Expatrié',
    personaStudentDesc: 'En recherche de stage ou premier emploi',
    personaGraduateDesc: 'Jeune diplômé en insertion professionnelle',
    personaProfessionalDesc: 'Professionnel en reconversion ou évolution',
    personaExecutiveDesc: 'Cadre avec expérience de direction',
    personaFreelanceDesc: 'Travailleur indépendant en recherche de missions',
    personaExpatDesc: 'Professionnel international en mobilité',
    personaChoose: 'Choisir ce profil',
    ctaChooseProfile: 'Créer mon CV',
    personaFieldsTitle: 'Informations spécifiques au profil',
    internshipRequest: 'Demande de stage',
    internshipRequestDesc: 'Adapter le CV et la lettre pour une recherche de stage.',
    jobRequest: "Demande d'emploi",
    jobRequestDesc: "Adapter le CV et la lettre pour une recherche d'emploi.",
    applicationType: "Type de candidature",
    importCvTitle: 'Importez votre CV existant',
    importCvDesc: 'Importez un CV existant (PDF, Word ou texte) et l\'IA le reformulera professionnellement avec le modèle choisi.',
    importCvBtn: 'Importer mon CV',
    importCvSuccess: 'CV importé avec succès ! Les champs ont été remplis automatiquement.',
    importCvParsing: 'Analyse de votre CV en cours...',
    roadmapTitle: 'Feuille de route',
    ecosystemTitle: 'L\'Écosystème HireNova',
    ecosystemDesc: 'Une suite complète d\'outils IA pour transformer votre parcours professionnel, de la candidature à l\'évolution de carrière.',
    ecosystemCv: 'Créez des CV professionnels optimisés ATS en 60 secondes avec l\'IA.',
    ecosystemAts: 'Analysez et optimisez le score ATS de votre CV pour passer les filtres automatiques.',
    ecosystemInterview: 'Préparez-vous aux entretiens avec des simulations IA et questions personnalisées.',
    ecosystemLinkedin: 'Optimisez votre profil LinkedIn pour attirer les recruteurs.',
    ecosystemRecruiter: 'Trouvez les meilleurs talents grâce à l\'IA et au matching intelligent.',
    ecosystemCareer: 'Orientez votre carrière avec des conseils personnalisés et des plans d\'évolution.',
    ecosystemCoach: 'Un coach IA personnel pour vous guider dans votre développement professionnel.',
    ecosystemFormation: 'Formations certifiantes en ligne adaptées à votre profil et vos objectifs.',
    ecosystemFreelance: 'Gérez vos missions freelance, clients et facturation en toute simplicité.',
    pfStudentField1: 'Établissement',
    pfStudentField1Ph: 'Ex: Université Hassan II',
    pfStudentField2: 'Filière / Spécialité',
    pfStudentField2Ph: 'Ex: Informatique, Gestion...',
    pfStudentField3: "Année d\'étude",
    pfStudentField3Ph: 'Ex: 3ème année Licence',
    pfGraduateField1: 'Diplôme obtenu',
    pfGraduateField1Ph: 'Ex: Master en Informatique',
    pfGraduateField2: 'École / Université',
    pfGraduateField2Ph: 'Ex: ENSEM, EMI...',
    pfGraduateField3: "Année d\'obtention",
    pfGraduateField3Ph: 'Ex: 2025',
    pfProField1: "Nombre d\'années d\'expérience",
    pfProField1Ph: 'Ex: 5 ans',
    pfProField2: 'Secteur actuel',
    pfProField2Ph: 'Ex: Banque, IT, Santé...',
    pfProField3: 'Niveau de responsabilité',
    pfProField3Ph: 'Ex: Chef de projet, Manager...',
    pfExecField1: 'Fonction actuelle',
    pfExecField1Ph: 'Ex: Directeur Général, CEO...',
    pfExecField2: 'Nombre de collaborateurs dirigés',
    pfExecField2Ph: 'Ex: 50 personnes',
    pfExecField3: 'Résultats clés',
    pfExecField3Ph: 'Ex: +30% CA, transformation digitale...',
    pfExecField4: 'Certifications',
    pfExecField4Ph: 'Ex: PMP, MBA, Six Sigma...',
    pfFreeField1: 'Types de missions',
    pfFreeField1Ph: 'Ex: Développement web, Consulting...',
    pfFreeField2: 'Plateformes utilisées',
    pfFreeField2Ph: 'Ex: Upwork, Malt, Fiverr...',
    pfFreeField3: 'Tarif journalier (optionnel)',
    pfFreeField3Ph: 'Ex: 500-800 MAD / jour',
    pfExpatField1: "Pays d\'origine",
    pfExpatField1Ph: 'Ex: Maroc',
    pfExpatField2: 'Pays de destination',
    pfExpatField2Ph: 'Ex: Canada, France, USA...',
    pfExpatField3: 'Statut visa / permis',
    pfExpatField3Ph: 'Ex: PVT Canada, Visa H1B...',
    pfExpatField4: 'Langues parlées',
    pfExpatField4Ph: 'Ex: Français, Anglais, Arabe',
    clNoCvCreateCta: "Créer mon CV d\'abord",
  },
  en: {
    siteTitle: 'HireNova',
    siteSubtitle: 'Generate a professional resume in 60 seconds',
    siteDescription:
      'Our AI writes an ATS-optimized resume, perfectly tailored to your target role.',
    cta: 'Create my resume now',
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
    freeNoSignup: 'Generate a pro resume in 60 seconds',
    ctaReadyTitle: 'Ready to create your resume?',
    ctaReadyDesc: 'In less than 2 minutes, you\'ll have a professional resume ready to send.',
    photoPosition: 'Photo Position',
    photoPositionLeft: 'Left',
    photoPositionCenter: 'Center',
    photoPositionRight: 'Right',
    availableLangs: 'Available in French, English, Spanish, and Arabic',
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
    pricingSubtitle: 'Choose the plan that suits you',
    planFree: 'Free',
    planFreePrice: '$0',
    planFreeDesc: 'To discover our tool',
    planPro: 'Pro',
    planProPrice: '$6.99',
    planProDesc: 'For active job seekers',
    planProPopular: 'Most popular',
    planAnnual: 'Annual',
    planAnnualPrice: '$70',
    planAnnualDesc: 'Perfect for a full year of job hunting',
    planAnnualBest: 'Best value',
    pricingAnnual: '/year',
    pricingAnnualUsd: '/year',
    pricingAnnualPriceUsd: '$79',
    pricingCv: 'Resume generations',
    pricingTemplates: 'Premium templates',
    pricingPdf: 'PDF download',
    pricingWord: 'Word download',
    pricingCoverLetter: 'AI cover letter',
    pricingNoWatermark: 'No watermark',
    pricingAtsScore: 'Detailed ATS score',
    pricingPriority: 'Priority generation',
    pricingMonthly: '/month',
    pricingCurrency: 'Currency',
    pricingProPriceUsd: '$7.99',
    pricingMonthlyUsd: '/month',
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
    paymobLabel: 'Pay with Floos / Paymob',
    paymobDesc: 'Bank card, mobile wallet, CashPlus, etc.',
    paymobProPrice: '70 MAD',
    paymobLifetimePrice: '300 MAD',
    paymobMonthly: '/month',
    paymobOneTime: 'one time',
    paymobMethods: 'Payment methods',
    paymobCard: 'CMI Card, Visa, Mastercard',
    paymobWallet: 'Floos, CashPlus, MTN MoMo',
    paymobAfrica: '🌍 Payment for Africa',
    // Personas
    personaStudent: 'Student',
    personaGraduate: 'Recent Graduate',
    personaProfessional: 'Professional',
    personaExecutive: 'Executive',
    personaFreelance: 'Freelance',
    personaExpat: 'Expat',
    personaStudentDesc: 'Looking for an internship or first job',
    personaGraduateDesc: 'Recent graduate entering the job market',
    personaProfessionalDesc: 'Professional seeking career growth',
    personaExecutiveDesc: 'Senior executive with leadership experience',
    personaFreelanceDesc: 'Independent worker seeking projects',
    personaExpatDesc: 'International professional on the move',
    personaChoose: 'Choose this profile',
    ctaChooseProfile: 'Create my resume',
    personaFieldsTitle: 'Profile-specific information',
    internshipRequest: 'Internship Request',
    internshipRequestDesc: 'Tailor the CV and cover letter for an internship search.',
    jobRequest: 'Job Application',
    jobRequestDesc: "Tailor the CV and cover letter for a job search.",
    applicationType: 'Application type',
    importCvTitle: 'Import your existing CV',
    importCvDesc: 'Import an existing CV (PDF, Word or text) and AI will professionally reformat it with your chosen template.',
    importCvBtn: 'Import my CV',
    importCvSuccess: 'CV imported successfully! Fields have been auto-filled.',
    importCvParsing: 'Analyzing your CV...',
    roadmapTitle: 'Roadmap',
    ecosystemTitle: 'The HireNova Ecosystem',
    ecosystemDesc: 'A complete suite of AI tools to transform your career journey, from applications to career growth.',
    ecosystemCv: 'Create ATS-optimized professional resumes in 60 seconds with AI.',
    ecosystemAts: 'Analyze and optimize your resume\'s ATS score to pass automated filters.',
    ecosystemInterview: 'Prepare for interviews with AI simulations and personalized questions.',
    ecosystemLinkedin: 'Optimize your LinkedIn profile to attract recruiters.',
    ecosystemRecruiter: 'Find top talent with AI-powered intelligent matching.',
    ecosystemCareer: 'Guide your career with personalized advice and growth plans.',
    ecosystemCoach: 'A personal AI coach to guide your professional development.',
    ecosystemFormation: 'Certified online training tailored to your profile and goals.',
    ecosystemFreelance: 'Manage freelance missions, clients, and billing effortlessly.',
    pfStudentField1: 'Institution',
    pfStudentField1Ph: 'Ex: Harvard University',
    pfStudentField2: 'Major / Specialization',
    pfStudentField2Ph: 'Ex: Computer Science, Business...',
    pfStudentField3: 'Year of study',
    pfStudentField3Ph: 'Ex: 3rd year Bachelor',
    pfGraduateField1: 'Degree obtained',
    pfGraduateField1Ph: 'Ex: MSc in Computer Science',
    pfGraduateField2: 'School / University',
    pfGraduateField2Ph: 'Ex: MIT, Stanford...',
    pfGraduateField3: 'Graduation year',
    pfGraduateField3Ph: 'Ex: 2025',
    pfProField1: 'Years of experience',
    pfProField1Ph: 'Ex: 5 years',
    pfProField2: 'Current industry',
    pfProField2Ph: 'Ex: Banking, Tech, Healthcare...',
    pfProField3: 'Responsibility level',
    pfProField3Ph: 'Ex: Project Manager, Team Lead...',
    pfExecField1: 'Current position',
    pfExecField1Ph: 'Ex: CEO, Managing Director...',
    pfExecField2: 'Number of direct reports',
    pfExecField2Ph: 'Ex: 50 people',
    pfExecField3: 'Key achievements',
    pfExecField3Ph: 'Ex: +30% revenue, digital transformation...',
    pfExecField4: 'Certifications',
    pfExecField4Ph: 'Ex: PMP, MBA, Six Sigma...',
    pfFreeField1: 'Types of projects',
    pfFreeField1Ph: 'Ex: Web development, Consulting...',
    pfFreeField2: 'Platforms used',
    pfFreeField2Ph: 'Ex: Upwork, Malt, Fiverr...',
    pfFreeField3: 'Daily rate (optional)',
    pfFreeField3Ph: 'Ex: $200-400 / day',
    pfExpatField1: 'Country of origin',
    pfExpatField1Ph: 'Ex: Morocco',
    pfExpatField2: 'Destination country',
    pfExpatField2Ph: 'Ex: Canada, France, USA...',
    pfExpatField3: 'Visa / permit status',
    pfExpatField3Ph: 'Ex: Working Holiday Canada, H1B Visa...',
    pfExpatField4: 'Languages spoken',
    pfExpatField4Ph: 'Ex: French, English, Arabic',
    clNoCvCreateCta: 'Create my resume first',
  },
  ar: {
    siteTitle: 'HireNova',
    siteSubtitle: 'أنشئ سيرة ذاتية احترافية في 60 ثانية',
    siteDescription:
      'يكتب الذكاء الاصطناعي لدينا سيرة ذاتية محسنة لأنظمة ATS، مصممة خصيصاً للوظيفة المستهدفة.',
    cta: 'أنشئ سيرتي الذاتية الآن',
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
    freeNoSignup: 'أنشئ سيرة ذاتية احترافية في 60 ثانية',
    ctaReadyTitle: 'مستعد لإنشاء سيرتك الذاتية؟',
    ctaReadyDesc: 'في أقل من دقيقتين، ستكون لديك سيرة ذاتية احترافية جاهزة للإرسال.',
    photoPosition: 'موضع الصورة',
    photoPositionLeft: 'يسار',
    photoPositionCenter: 'وسط',
    photoPositionRight: 'يمين',
    availableLangs: 'متاح بالفرنسية والإنجليزية والإسبانية والعربية',
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
    pricingSubtitle: 'اختر الخطة المناسبة لك',
    planFree: 'مجاني',
    planFreePrice: '0$',
    planFreeDesc: 'لاكتشاف أداتنا',
    planPro: 'Pro',
    planProPrice: '6.99$',
    planProDesc: 'للباحثين النشطين عن عمل',
    planProPopular: 'الأكثر شعبية',
    planAnnual: 'سنوي',
    planAnnualPrice: '70$€',
    planAnnualDesc: 'مثالي لسنة كاملة من البحث عن عمل',
    planAnnualBest: 'أفضل قيمة',
    pricingAnnual: '/سنة',
    pricingAnnualUsd: '/سنة',
    pricingAnnualPriceUsd: '$79',
    pricingCv: 'إنشاءات السيرة الذاتية',
    pricingTemplates: 'قوالب مميزة',
    pricingPdf: 'تحميل PDF',
    pricingWord: 'تحميل Word',
    pricingCoverLetter: 'رسالة دافع بالذكاء الاصطناعي',
    pricingNoWatermark: 'بدون علامة مائية',
    pricingAtsScore: 'درجة ATS مفصلة',
    pricingPriority: 'إنشاء ذو أولوية',
    pricingMonthly: '/شهر',
    pricingCurrency: 'العملة',
    pricingProPriceUsd: '$7.99',
    pricingMonthlyUsd: '/شهر',
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
    paymobLabel: 'ادفع عبر Floos / Paymob',
    paymobDesc: 'بطاقة بنكية، محفظة هاتفية، CashPlus، إلخ.',
    paymobProPrice: '70 MAD',
    paymobLifetimePrice: '300 MAD',
    paymobMonthly: '/شهر',
    paymobOneTime: 'مرة واحدة',
    paymobMethods: 'طرق الدفع',
    paymobCard: 'بطاقة CMI، Visa، Mastercard',
    paymobWallet: 'Floos، CashPlus، MTN MoMo',
    paymobAfrica: '🌍 الدفع لأفريقيا',
    // Personas
    personaStudent: 'طالب',
    personaGraduate: 'خريج جديد',
    personaProfessional: 'محترف',
    personaExecutive: 'مدير تنفيذي',
    personaFreelance: 'مستقل',
    personaExpat: 'مغترب',
    personaStudentDesc: 'البحث عن تدريب أو وظيفة أولى',
    personaGraduateDesc: 'خريج جديد يدخل سوق العمل',
    personaProfessionalDesc: 'محترف يسعى للتطور المهني',
    personaExecutiveDesc: 'مدير بخبرة قيادية',
    personaFreelanceDesc: 'عامل مستقل يبحث عن مشاريع',
    personaExpatDesc: 'محترف دولي متنقل',
    personaChoose: 'اختر هذا الملف',
    ctaChooseProfile: 'إنشاء سيرتي الذاتية',
    personaFieldsTitle: 'معلومات خاصة بالملف',
    internshipRequest: 'طلب تدريب',
    internshipRequestDesc: 'تكييف السيرة الذاتية والرسالة للبحث عن تدريب.',
    jobRequest: 'طلب وظيفة',
    jobRequestDesc: 'تكييف السيرة الذاتية والرسالة للبحث عن وظيفة.',
    applicationType: 'نوع الطلب',
    importCvTitle: 'استيراد سيرتك الذاتية الحالية',
    importCvDesc: 'استيراد سيرة ذاتية موجودة (PDF أو Word أو نص) وسيقوم الذكاء الاصطناعي بإعادة صياغتها باحترافية.',
    importCvBtn: 'استيراد سيرتي الذاتية',
    importCvSuccess: 'تم استيراد السيرة الذاتية بنجاح! تم ملء الحقول تلقائياً.',
    importCvParsing: 'جاري تحليل سيرتك الذاتية...',
    roadmapTitle: 'خارطة الطريق',
    ecosystemTitle: 'منظومة HireNova',
    ecosystemDesc: 'مجموعة كاملة من أدوات الذكاء الاصطناعي لتحويل مسارك المهني، من التقديم إلى النمو الوظيفي.',
    ecosystemCv: 'أنشئ سيرات ذاتية احترافية محسّنة لـ ATS في 60 ثانية بالذكاء الاصطناعي.',
    ecosystemAts: 'حلّل وحسّن نقاط ATS لسيرتك الذاتية لتجاوز الفلاتر التلقائية.',
    ecosystemInterview: 'استعد للمقابلات بمحاكيات ذكاء اصطناعي وأسئلة مخصصة.',
    ecosystemLinkedin: 'حسّن ملفك الشخصي على لينكد إن لجذب المسؤولين عن التوظيف.',
    ecosystemRecruiter: 'اعثر على أفضل المواهب بمطابقة ذكية مدعومة بالذكاء الاصطناعي.',
    ecosystemCareer: 'وجّه مسارك المهني بنصائح مخصصة وخطط نمو.',
    ecosystemCoach: 'مدرب ذكاء اصطناعي شخصي لإرشادك في تطورك المهني.',
    ecosystemFormation: 'تدريب معتمد عبر الإنترنت مصمم حسب ملفك وأهدافك.',
    ecosystemFreelance: 'أدِر مهام المستقلين والعملاء والفواتير بسهولة.',
    pfStudentField1: 'المؤسسة',
    pfStudentField1Ph: 'مثال: جامعة الحسن الثاني',
    pfStudentField2: 'التخصص',
    pfStudentField2Ph: 'مثال: علوم الحاسوب، إدارة...',
    pfStudentField3: 'سنة الدراسة',
    pfStudentField3Ph: 'مثال: السنة الثالثة إجازة',
    pfGraduateField1: 'الشهادة المحصل عليها',
    pfGraduateField1Ph: 'مثال: ماستر في علوم الحاسوب',
    pfGraduateField2: 'المدرسة / الجامعة',
    pfGraduateField2Ph: 'مثال: EMI، ENSEM...',
    pfGraduateField3: 'سنة التخرج',
    pfGraduateField3Ph: 'مثال: 2025',
    pfProField1: 'سنوات الخبرة',
    pfProField1Ph: 'مثال: 5 سنوات',
    pfProField2: 'القطاع الحالي',
    pfProField2Ph: 'مثال: بنك، تكنولوجيا، صحة...',
    pfProField3: 'مستوى المسؤولية',
    pfProField3Ph: 'مثال: مدير مشروع، مسؤول فريق...',
    pfExecField1: 'المنصب الحالي',
    pfExecField1Ph: 'مثال: مدير عام، رئيس تنفيذي...',
    pfExecField2: 'عدد الموظفين المرؤوسين',
    pfExecField2Ph: 'مثال: 50 شخص',
    pfExecField3: 'الإنجازات الرئيسية',
    pfExecField3Ph: 'مثال: +30% إيرادات، تحول رقمي...',
    pfExecField4: 'الشهادات المهنية',
    pfExecField4Ph: 'مثال: PMP، MBA، Six Sigma...',
    pfFreeField1: 'أنواع المشاريع',
    pfFreeField1Ph: 'مثال: تطوير ويب، استشارات...',
    pfFreeField2: 'المنصات المستخدمة',
    pfFreeField2Ph: 'مثال: Upwork، Malt، Fiverr...',
    pfFreeField3: 'الأتعاب اليومية (اختياري)',
    pfFreeField3Ph: 'مثال: 500-800 درهم / يوم',
    pfExpatField1: 'بلد الأصل',
    pfExpatField1Ph: 'مثال: المغرب',
    pfExpatField2: 'بلد الوجهة',
    pfExpatField2Ph: 'مثال: كندا، فرنسا، أمريكا...',
    pfExpatField3: 'حالة التأشيرة / التصريح',
    pfExpatField3Ph: 'مثال: PVT كندا، تأشيرة H1B...',
    pfExpatField4: 'اللغات المتحدثة',
    pfExpatField4Ph: 'مثال: الفرنسية، الإنجليزية، العربية',
    clNoCvCreateCta: 'إنشاء سيرتي الذاتية أولاً',
  },
  es: {
    siteTitle: 'HireNova',
    siteSubtitle: 'Genera un currículum profesional en 60 segundos',
    siteDescription:
      'Nuestra IA redacta un currículum optimizado para ATS, perfectamente adaptado a tu puesto objetivo.',
    cta: 'Crear mi currículum ahora',
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
    freeNoSignup: 'Genera un CV pro en 60 segundos',
    ctaReadyTitle: '¿Listo para crear tu currículum?',
    ctaReadyDesc: 'En menos de 2 minutos, tendrás un currículum profesional listo para enviar.',
    photoPosition: 'Posición de la foto',
    photoPositionLeft: 'Izquierda',
    photoPositionCenter: 'Centro',
    photoPositionRight: 'Derecha',
    availableLangs: 'Disponible en francés, inglés, español y árabe',
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
    pricingSubtitle: 'Elige el plan que te convenga',
    planFree: 'Gratis',
    planFreePrice: '0€',
    planFreeDesc: 'Para descubrir nuestra herramienta',
    planPro: 'Pro',
    planProPrice: '6,99€',
    planProDesc: 'Para buscadores de empleo activos',
    planProPopular: 'El más popular',
    planAnnual: 'Anual',
    planAnnualPrice: '70€',
    planAnnualDesc: 'Ideal para un año completo de búsqueda de empleo',
    planAnnualBest: 'Mejor relación calidad-precio',
    pricingAnnual: '/año',
    pricingAnnualUsd: '/año',
    pricingAnnualPriceUsd: '$79',
    pricingCv: 'Generaciones de currículum',
    pricingTemplates: 'Plantillas premium',
    pricingPdf: 'Descarga PDF',
    pricingWord: 'Descarga Word',
    pricingCoverLetter: 'Carta de motivación IA',
    pricingNoWatermark: 'Sin marca de agua',
    pricingAtsScore: 'Puntuación ATS detallada',
    pricingPriority: 'Generación prioritaria',
    pricingMonthly: '/mes',
    pricingCurrency: 'Moneda',
    pricingProPriceUsd: '$7.99',
    pricingMonthlyUsd: '/mes',
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
    paymobLabel: 'Pagar con Floos / Paymob',
    paymobDesc: 'Tarjeta bancaria, billetera móvil, CashPlus, etc.',
    paymobProPrice: '70 MAD',
    paymobLifetimePrice: '300 MAD',
    paymobMonthly: '/mes',
    paymobOneTime: 'una sola vez',
    paymobMethods: 'Métodos de pago',
    paymobCard: 'Tarjeta CMI, Visa, Mastercard',
    paymobWallet: 'Floos, CashPlus, MTN MoMo',
    paymobAfrica: '🌍 Pago para África',
    // Personas
    personaStudent: 'Estudiante',
    personaGraduate: 'Recién graduado',
    personaProfessional: 'Profesional',
    personaExecutive: 'Ejecutivo',
    personaFreelance: 'Freelance',
    personaExpat: 'Expatriado',
    personaStudentDesc: 'En búsqueda de prácticas o primer empleo',
    personaGraduateDesc: 'Recién graduado insertándose en el mercado laboral',
    personaProfessionalDesc: 'Profesional en busca de crecimiento',
    personaExecutiveDesc: 'Ejecutivo con experiencia directiva',
    personaFreelanceDesc: 'Trabajador independiente en busca de proyectos',
    personaExpatDesc: 'Profesional internacional en movilidad',
    personaChoose: 'Elegir este perfil',
    ctaChooseProfile: 'Crear mi CV',
    personaFieldsTitle: 'Información específica del perfil',
    internshipRequest: 'Solicitud de prácticas',
    internshipRequestDesc: 'Adaptar el CV y la carta para una búsqueda de prácticas.',
    jobRequest: 'Solicitud de empleo',
    jobRequestDesc: 'Adaptar el CV y la carta para una búsqueda de empleo.',
    applicationType: 'Tipo de solicitud',
    importCvTitle: 'Importa tu CV existente',
    importCvDesc: 'Importa un CV existente (PDF, Word o texto) y la IA lo reformateará profesionalmente.',
    importCvBtn: 'Importar mi CV',
    importCvSuccess: '¡CV importado con éxito! Los campos se han llenado automáticamente.',
    importCvParsing: 'Analizando tu CV...',
    roadmapTitle: 'Hoja de ruta',
    ecosystemTitle: 'El Ecosistema HireNova',
    ecosystemDesc: 'Una suite completa de herramientas IA para transformar tu trayectoria profesional.',
    ecosystemCv: 'Crea currículums profesionales optimizados para ATS en 60 segundos con IA.',
    ecosystemAts: 'Analiza y optimiza la puntuación ATS de tu currículum para pasar filtros automáticos.',
    ecosystemInterview: 'Prepárate para entrevistas con simulaciones IA y preguntas personalizadas.',
    ecosystemLinkedin: 'Optimiza tu perfil de LinkedIn para atraer reclutadores.',
    ecosystemRecruiter: 'Encuentra los mejores talentos con matching inteligente impulsado por IA.',
    ecosystemCareer: 'Orienta tu carrera con consejos personalizados y planes de crecimiento.',
    ecosystemCoach: 'Un coach IA personal para guiar tu desarrollo profesional.',
    ecosystemFormation: 'Formación certificada online adaptada a tu perfil y objetivos.',
    ecosystemFreelance: 'Gestiona misiones freelance, clientes y facturación sin esfuerzo.',
    pfStudentField1: 'Institución',
    pfStudentField1Ph: 'Ej: Universidad Complutense',
    pfStudentField2: 'Especialidad',
    pfStudentField2Ph: 'Ej: Informática, Negocios...',
    pfStudentField3: 'Año de estudio',
    pfStudentField3Ph: 'Ej: 3er año de Licenciatura',
    pfGraduateField1: 'Título obtenido',
    pfGraduateField1Ph: 'Ej: Máster en Informática',
    pfGraduateField2: 'Escuela / Universidad',
    pfGraduateField2Ph: 'Ej: MIT, Stanford...',
    pfGraduateField3: 'Año de graduación',
    pfGraduateField3Ph: 'Ej: 2025',
    pfProField1: 'Años de experiencia',
    pfProField1Ph: 'Ej: 5 años',
    pfProField2: 'Sector actual',
    pfProField2Ph: 'Ej: Banca, Tecnología, Salud...',
    pfProField3: 'Nivel de responsabilidad',
    pfProField3Ph: 'Ej: Jefe de proyecto, Manager...',
    pfExecField1: 'Cargo actual',
    pfExecField1Ph: 'Ej: Director General, CEO...',
    pfExecField2: 'Número de colaboradores a cargo',
    pfExecField2Ph: 'Ej: 50 personas',
    pfExecField3: 'Logros clave',
    pfExecField3Ph: 'Ej: +30% ingresos, transformación digital...',
    pfExecField4: 'Certificaciones',
    pfExecField4Ph: 'Ej: PMP, MBA, Six Sigma...',
    pfFreeField1: 'Tipos de proyectos',
    pfFreeField1Ph: 'Ej: Desarrollo web, Consultoría...',
    pfFreeField2: 'Plataformas utilizadas',
    pfFreeField2Ph: 'Ej: Upwork, Malt, Fiverr...',
    pfFreeField3: 'Tarifa diaria (opcional)',
    pfFreeField3Ph: 'Ej: 200-400€ / día',
    pfExpatField1: 'País de origen',
    pfExpatField1Ph: 'Ej: Marruecos',
    pfExpatField2: 'País de destino',
    pfExpatField2Ph: 'Ej: Canadá, Francia, EE.UU...',
    pfExpatField3: 'Estado visa / permiso',
    pfExpatField3Ph: 'Ej: PVT Canadá, Visa H1B...',
    pfExpatField4: 'Idiomas hablados',
    pfExpatField4Ph: 'Ej: Francés, Inglés, Árabe',
    clNoCvCreateCta: 'Crear mi CV primero',
  }
}

export function t(lang: CVLanguage, key: TranslationKey): string {
  return translations[lang]?.[key] ?? translations.fr[key] ?? key
}