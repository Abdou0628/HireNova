/**
 * HireNova - Repositioning Fix Script
 * Run with: bun fix-i18n.js
 */
const fs = require('fs');
const p = 'src/lib/i18n.ts';
let f = fs.readFileSync(p, 'utf8');
let n = 0;

function r(o, t) {
  if (f.includes(o)) { f = f.replace(o, t); n++; console.log('OK: ' + o.substring(0, 40) + '...'); }
  else { console.log('SKIP: ' + o.substring(0, 40) + '...'); }
}

// FR
r("siteSubtitle: 'G\u00e9n\u00e9rez un CV professionnel en 60 secondes'",
  "siteSubtitle: 'Votre plateforme IA de gestion de carri\u00e8re et recrutement'");

r("'Notre IA r\u00e9dige un CV optimis\u00e9 pour les ATS, parfaitement adapt\u00e9 \u00e0 votre m\u00e9tier cible.'",
  "'CV, lettres de motivation, coaching IA, pr\u00e9paration entretiens et marketplace d\\'emplois \u2014 tout en une seule plateforme.'");

r("cta: 'Cr\u00e9er mon CV maintenant'",
  "cta: 'Commencer maintenant'");

// EN
r("siteSubtitle: 'Generate a professional resume in 60 seconds'",
  "siteSubtitle: 'Your AI career management and recruitment platform'");

r("'Our AI writes an ATS-optimized resume, perfectly tailored to your target role.'",
  "'Resumes, cover letters, AI coaching, interview preparation, and job marketplace \u2014 all in one platform.'");

r("cta: 'Create my resume now'",
  "cta: 'Get started now'");

// AR
r("siteSubtitle: '\u0623\u0646\u0634\u0626 \u0633\u064a\u0631\u0629 \u0630\u0627\u062a\u064a\u0629 \u0627\u062d\u062a\u0631\u0627\u0641\u064a\u0629 \u0641\u064a 60 \u062b\u0627\u0646\u064a\u0629'",
  "siteSubtitle: '\u0645\u0646\u0635\u062a\u0643 \u0627\u0644\u0630\u0643\u064a\u0629 \u0644\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0645\u0647\u0646\u064a \u0648\u0627\u0644\u062a\u0648\u0638\u064a\u0641'");

r("'\u064a\u0643\u062a\u0628 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0644\u062f\u064a\u0646\u0627 \u0633\u064a\u0631\u0629 \u0630\u0627\u062a\u064a\u0629 \u0645\u062d\u0633\u0646\u0629 \u0644\u0623\u0646\u0638\u0645\u0629 ATS\u060c \u0645\u0635\u0645\u0645\u0629 \u062e\u0635\u064a\u0635\u0627\u064b \u0644\u0644\u0648\u0638\u064a\u0641\u0629 \u0627\u0644\u0645\u0633\u062a\u0647\u062f\u0641\u0629.'",
  "'\u0633\u064a\u0631 \u0630\u0627\u062a\u064a\u0629\u060c \u0631\u0633\u0627\u0626\u0644 \u062a\u0639\u0631\u064a\u0641\u060c \u062a\u062f\u0631\u064a\u0628 \u0630\u0643\u064a\u060c \u062a\u062d\u0636\u064a\u0631 \u0645\u0642\u0627\u0628\u0644\u0627\u062a \u0648\u0633\u0648\u0642 \u0648\u0638\u0627\u0626\u0641 \u2014 \u0643\u0644 \u0630\u0644\u0643 \u0641\u064a \u0645\u0646\u0635\u0629 \u0648\u0627\u062d\u062f\u0629.'");

r("cta: '\u0623\u0646\u0634\u0626 \u0633\u064a\u0631\u062a\u064a \u0627\u0644\u0630\u0627\u062a\u064a\u0629 \u0627\u0644\u0622\u0646'",
  "cta: '\u0627\u0628\u062f\u0623 \u0627\u0644\u0622\u0646'");

// ES
r("siteSubtitle: 'Genera un curr\u00edculum profesional en 60 segundos'",
  "siteSubtitle: 'Tu plataforma IA de gesti\u00f3n de carrera y reclutamiento'");

r("'Nuestra IA redacta un curr\u00edculum optimizado para ATS, perfectamente adaptado a tu puesto objetivo.'",
  "'Curr\u00edculums, cartas de presentaci\u00f3n, coaching IA, preparaci\u00f3n de entrevistas y bolsa de empleo \u2014 todo en una sola plataforma.'");

r("cta: 'Crear mi curr\u00edculum ahora'",
  "cta: 'Comenzar ahora'");

fs.writeFileSync(p, f, 'utf8');
console.log('\n=== RESULT: ' + n + '/12 replacements done ===');
