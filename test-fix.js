const fs = require('fs');

// Simulate the original local file content
let test = '';
test += "siteSubtitle: 'G\u00e9n\u00e9rez un CV professionnel en 60 secondes',\n";
test += "siteDescription:\n  'Notre IA r\u00e9dige un CV optimis\u00e9 pour les ATS, parfaitement adapt\u00e9 \u00e0 votre m\u00e9tier cible.',\n";
test += "cta: 'Cr\u00e9er mon CV maintenant',\n";
test += "siteSubtitle: 'Generate a professional resume in 60 seconds',\n";
test += "siteDescription:\n  'Our AI writes an ATS-optimized resume, perfectly tailored to your target role.',\n";
test += "cta: 'Create my resume now',\n";
test += "siteSubtitle: 'Genera un curr\u00edculum profesional en 60 segundos',\n";
test += "siteDescription:\n  'Nuestra IA redacta un curr\u00edculum optimizado para ATS, perfectly adaptado a tu puesto objetivo.',\n";
test += "cta: 'Crear mi curr\u00edculum ahora',\n";

// Now test the replacement logic from fix-i18n.js
let f = test;
let n = 0;
function r(o, t) {
  if (f.includes(o)) { f = f.replace(o, t); n++; console.log('OK: ' + o.substring(0, 40) + '...'); }
  else { console.log('SKIP: ' + o.substring(0, 40) + '...'); }
}

r("siteSubtitle: 'G\u00e9n\u00e9rez un CV professionnel en 60 seconds'",
  "siteSubtitle: 'Votre plateforme IA de gestion de carri\u00e8re et recrutement'");

console.log('\nDone: ' + n + '/3');
