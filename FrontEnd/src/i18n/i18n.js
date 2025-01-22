import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar arquivos de tradução
import en from '../locales/en.json';
import pt from '../locales/pt.json';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

i18n
  .use(LanguageDetector) // Detectar idioma automaticamente
  .use(initReactI18next) // Inicializar integração com React
  .init({
    resources,
    fallbackLng: 'en', // Idioma padrão
    interpolation: { escapeValue: false }, // Não precisa escapar os valores
  });

export default i18n;
