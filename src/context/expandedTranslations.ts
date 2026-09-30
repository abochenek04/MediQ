import es from './locales/es.json';
import zh from './locales/zh.json';
import ar from './locales/ar.json';
import pl from './locales/pl.json';
import gu from './locales/gu.json';
import hi from './locales/hi.json';
// Named locale catalogs avoid positional mistakes. Existing locales remain compatible.
export const expandedTranslations: Record<string, Record<string,string>> = {es,zh,ar,pl,gu,hi};
