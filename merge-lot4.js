const fs = require('fs');

const i18nPath = '/home/z/my-project/src/lib/i18n.ts';
let lines = fs.readFileSync(i18nPath, 'utf-8').split('\n');

// Read and normalize key files
function readKeys(file) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const keys = new Map();
  if (raw.keys && Array.isArray(raw.keys)) {
    for (const k of raw.keys) {
      keys.set(k, { fr: raw.fr?.[k]||'', en: raw.en?.[k]||'', ar: raw.ar?.[k]||'', es: raw.es?.[k]||'' });
    }
  } else {
    for (const [k, v] of Object.entries(raw)) {
      if (typeof v === 'object' && v.fr !== undefined) keys.set(k, { fr: v.fr||'', en: v.en||'', ar: v.ar||'', es: v.es||'' });
    }
  }
  return keys;
}

const allKeys = new Map([...readKeys('/home/z/my-project/lot4a-keys.json'), ...readKeys('/home/z/my-project/lot4b-keys.json')]);
console.log('Total keys to add:', allKeys.size);

// Generate additions
function quoteDots(text) { return text.replace(/^(\s+)([\w]+\.[\w.]+)(:)/gm, "$1'$2'$3"); }

let typeAdd = '\n  // LOT 4 — Support, Referral, Copilot, Jobs, Formation, Campus, Page\n';
let frAdd = '', enAdd = '', arAdd = '', esAdd = '';

for (const [key, val] of allKeys) {
  typeAdd += `  | '${key}'\n`;
  const frLine = `    ${key.includes('.') ? "'"+key+"'" : key}: '${val.fr.replace(/'/g, "\\'")}',\n`;
  const enLine = `    ${key.includes('.') ? "'"+key+"'" : key}: '${val.en.replace(/'/g, "\\'")}',\n`;
  const arLine = `    ${key.includes('.') ? "'"+key+"'" : key}: '${val.ar.replace(/'/g, "\\'")}',\n`;
  const esLine = `    ${key.includes('.') ? "'"+key+"'" : key}: '${val.es.replace(/'/g, "\\'")}',\n`;
  frAdd += frLine; enAdd += enLine; arAdd += arLine; esAdd += esLine;
}

console.log('Empty translations:', [...allKeys].filter(([k,v]) => !v.fr||!v.en||!v.ar||!v.es).length);

// Find insertion points by searching for known patterns
const constIdx = lines.findIndex(l => l.includes('const translations: Record<CVLanguage, Record<TranslationKey, string>>'));
const typeLines = typeAdd.split('\n');
lines.splice(constIdx, 0, ...typeLines);
console.log('1. Inserted type additions');

const shift = typeLines.length;

// Find section close braces by searching for '  },' patterns
function findClose(lines, startLine, target) {
  for (let i = startLine; i < lines.length; i++) {
    if (lines[i].trim() === '},') return i;
    if (lines[i].trim() === '}' && i + 1 < lines.length && (lines[i+1].startsWith('export') || lines[i+1].trim() === '')) return i;
  }
  return -1;
}

// Find language section starts
const frStart = lines.findIndex((l,i) => i >= constIdx && l.trim() === 'fr: {');
const enStart = lines.findIndex((l,i) => i >= constIdx && l.trim() === 'en: {');
const arStart = lines.findIndex((l,i) => i >= constIdx && l.trim() === 'ar: {');
const esStart = lines.findIndex((l,i) => i >= constIdx && l.trim() === 'es: {');

console.log('Sections: fr=' + frStart + ' en=' + enStart + ' ar=' + arStart + ' es=' + esStart);

// Find close braces (search backwards from next section start)
const frClose = findClose(lines, frStart, enStart);
const enClose = findClose(lines, enStart, arStart);
const arClose = findClose(lines, arStart, esStart);
const esClose = findClose(lines, esStart, lines.length);

console.log('Closes: fr=' + frClose + ' en=' + enClose + ' ar=' + arClose + ' es=' + esClose);

if (frClose === -1 || enClose === -1 || arClose === -1 || esClose === -1) {
  console.error('Missing close brace!'); process.exit(1);
}

// Insert in reverse order
const frLines = frAdd.split('\n').filter(l => l.trim());
const enLines = enAdd.split('\n').filter(l => l.trim());
const arLines = arAdd.split('\n').filter(l => l.trim());
const esLines = esAdd.split('\n').filter(l => l.trim());

lines.splice(esClose, 0, ...esLines);
lines.splice(arClose, 0, ...arLines);
lines.splice(enClose, 0, ...enLines);
lines.splice(frClose, 0, ...frLines);

console.log('2. Inserted translation lines');

fs.writeFileSync(i18nPath, lines.join('\n'));
console.log('Done! File:', lines.length, 'lines');
