import { defineI18nUI } from 'fumadocs-ui/i18n';

export const i18n = defineI18nUI({
  defaultLanguage: 'es',
  languages: ['es', 'en'],
}, {
  es: {
    displayName: 'Espanol',
    search: 'Buscar',
    searchNoResult: 'Sin resultados',
    toc: 'En esta pagina',
    chooseLanguage: 'Idioma',
    nextPage: 'Siguiente',
    previousPage: 'Anterior',
  },
  en: {
    displayName: 'English',
  },
});
