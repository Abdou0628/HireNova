const fs = require('fs');
let f = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// FR
f = f.replace("siteSubtitle: 'G" + String.fromCharCode(233) + "n" + String.fromCharCode(233) + "rez un CV professionnel en 60 secondes'", "siteSubtitle: 'Votre plateforme IA de gestion de carri" + String.fromCharCode(232) + "re et recrutement'");

// EN
f = f.replace("siteSubtitle: 'Generate a professional resume in 60 seconds'", "siteSubtitle: 'Your AI career management and recruitment platform'");

// ES
f = f.replace("siteSubtitle: 'Genera un curr" + String.fromCharCode(237) + "culum profesional en 60 segundos'", "siteSubtitle: 'Tu plataforma IA de gesti" + String.fromCharCode(243) + "n de carrera y reclutamiento'");

fs.writeFileSync('src/lib/i18n.ts', f, 'utf8');
console.log('OK !');
