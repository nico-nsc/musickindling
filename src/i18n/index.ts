import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'

function getInitialLanguage(): string {
  try {
    const raw = localStorage.getItem('musickindling_settings')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.language === 'en' || parsed.language === 'fr') return parsed.language
    }
  } catch { /* ignore */ }
  return 'fr'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
