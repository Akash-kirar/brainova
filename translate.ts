import { translations } from './src/i18n';
import * as fs from 'fs';

async function translateText(text: string, targetLang: string) {
  const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
  const data = await res.json();
  return data[0].map((x: any) => x[0]).join('');
}

async function translateObj(obj: any, targetLang: string) {
  const translated: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      try {
        translated[key] = await translateText(value, targetLang);
        console.log(`Translated ${key} to ${targetLang}`);
        await new Promise(r => setTimeout(r, 50));
      } catch (e) {
        console.error(`Failed to translate ${key} to ${targetLang}`, e);
        translated[key] = value;
      }
    }
  }
  return translated;
}

async function main() {
  const en = translations.en;
  
  console.log('Translating to Bengali...');
  const bn = await translateObj(en, 'bn');
  
  console.log('Translating to Marathi...');
  const mr = await translateObj(en, 'mr');
  
  console.log('Translating to Telugu...');
  const te = await translateObj(en, 'te');
  
  console.log('Translating to Tamil...');
  const ta = await translateObj(en, 'ta');
  
  const newTranslations = {
    en,
    hi: translations.hi,
    bn,
    mr,
    te,
    ta
  };
  
  const fileContent = `export const translations = ${JSON.stringify(newTranslations, null, 2)};

export type Language = 'en' | 'hi' | 'bn' | 'mr' | 'te' | 'ta';

export function t(key: string, lang: Language): string {
  const keys = key.split('.');
  let current: any = translations[lang];
  for (const k of keys) {
    if (current && current[k] !== undefined) {
      current = current[k];
    } else {
      // Fallback to English
      let fallback: any = translations['en'];
      for (const fk of keys) {
        if (fallback && fallback[fk] !== undefined) {
          fallback = fallback[fk];
        } else {
          return key;
        }
      }
      return fallback;
    }
  }
  return current;
}
`;

  fs.writeFileSync('src/i18n.ts', fileContent);
  console.log('Done!');
}

main().catch(console.error);
