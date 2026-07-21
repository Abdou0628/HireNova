export interface CountryPhone {
  code: string
  name: string
  flag: string
  dial: string
}

/* Popular countries grouped by region — covers all 4 app languages */
export const countries: CountryPhone[] = [
  // Africa
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', dial: '+212' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', dial: '+213' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', dial: '+216' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', dial: '+221' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', dial: '+225' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', dial: '+237' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', dial: '+227' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dial: '+223' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dial: '+226' },
  { code: 'MR', name: 'Mauritanie', flag: '🇲🇷', dial: '+222' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩', dial: '+235' },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳', dial: '+224' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬', dial: '+242' },
  { code: 'CD', name: 'RD Congo', flag: '🇨🇩', dial: '+243' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dial: '+261' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', dial: '+20' },
  { code: 'SA', name: 'Arabie Saoudite', flag: '🇸🇦', dial: '+966' },
  { code: 'AE', name: 'Émirats Arabes Unis', flag: '🇦🇪', dial: '+971' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dial: '+974' },
  { code: 'KW', name: 'Koweït', flag: '🇰🇼', dial: '+965' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', dial: '+27' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dial: '+234' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dial: '+254' },
  // Europe
  { code: 'FR', name: 'France', flag: '🇫🇷', dial: '+33' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', dial: '+32' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', dial: '+41' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dial: '+1' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', dial: '+49' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', dial: '+34' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', dial: '+39' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dial: '+351' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', dial: '+31' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', dial: '+44' },
  { code: 'IE', name: 'Irlande', flag: '🇮🇪', dial: '+353' },
  { code: 'SE', name: 'Suède', flag: '🇸🇪', dial: '+46' },
  { code: 'NO', name: 'Norvège', flag: '🇳🇴', dial: '+47' },
  { code: 'DK', name: 'Danemark', flag: '🇩🇰', dial: '+45' },
  { code: 'PL', name: 'Pologne', flag: '🇵🇱', dial: '+48' },
  { code: 'RO', name: 'Roumanie', flag: '🇷🇴', dial: '+40' },
  { code: 'RU', name: 'Russie', flag: '🇷🇺', dial: '+7' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dial: '+380' },
  // Americas
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', dial: '+1' },
  { code: 'MX', name: 'Mexique', flag: '🇲🇽', dial: '+52' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', dial: '+55' },
  { code: 'AR', name: 'Argentine', flag: '🇦🇷', dial: '+54' },
  { code: 'CO', name: 'Colombie', flag: '🇨🇴', dial: '+57' },
  { code: 'PE', name: 'Pérou', flag: '🇵🇪', dial: '+51' },
  { code: 'CL', name: 'Chili', flag: '🇨🇱', dial: '+56' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dial: '+58' },
  // Asia / Oceania
  { code: 'CN', name: 'Chine', flag: '🇨🇳', dial: '+86' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', dial: '+81' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳', dial: '+91' },
  { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷', dial: '+82' },
  { code: 'TR', name: 'Turquie', flag: '🇹🇷', dial: '+90' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺', dial: '+61' },
  { code: 'NZ', name: 'Nouvelle-Zélande', flag: '🇳🇿', dial: '+64' },
  { code: 'ID', name: 'Indonésie', flag: '🇮🇩', dial: '+62' },
  { code: 'MY', name: 'Malaisie', flag: '🇲🇾', dial: '+60' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dial: '+63' },
]

/** Find the best default country by dial code prefix */
export function findCountryByDial(phone: string): CountryPhone | undefined {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  return countries.find((c) => cleaned.startsWith(c.dial))
}