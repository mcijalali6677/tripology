import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from 'fs';

const en = require('./lib/i18n/locales/en.ts').default;
const fa = require('./lib/i18n/locales/fa.ts').default;

function getTranslation(translations, key) {
  const keys = key.split('.');
  let value = translations;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return null;
    }
  }
  return typeof value === 'string' ? value : null;
}

const files = [
  'components/hero-search.tsx',
  'components/how-it-works-advanced.tsx',
  'components/featured-destinations.tsx',
  'components/trust-section.tsx',
  'components/testimonials-advanced.tsx',
  'components/pricing-section.tsx',
  'components/cta-section.tsx',
  'components/footer-advanced.tsx',
  'app/explore/page.tsx',
  'app/checkout/page.tsx',
];

let missing = [];
const re = /t\(["']([^"']+)["']\)/g;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = re.exec(content)) !== null) {
    const key = m[1];
    const enVal = getTranslation(en, key);
    const faVal = getTranslation(fa, key);
    if (!enVal) missing.push('EN MISS: ' + key + ' in ' + f);
    if (!faVal) missing.push('FA MISS: ' + key + ' in ' + f);
  }
  re.lastIndex = 0;
});

if (missing.length === 0) {
  console.log('ALL KEYS OK! (0 missing)');
} else {
  missing.forEach(m => console.log(m));
}
console.log('Total missing:', missing.length);
