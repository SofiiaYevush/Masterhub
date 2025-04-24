// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";

// // Отримуємо мову з localStorage або визначаємо за мовою браузера
// const storedLanguage = localStorage.getItem("language");
// const browserLanguage = navigator.language.split("-")[0];
// const defaultLanguage = storedLanguage || (browserLanguage === "uk" ? "uk" : "en");

// // Зберігаємо вибрану мову, якщо її ще немає в localStorage
// if (!storedLanguage) {
//   localStorage.setItem("language", defaultLanguage);
// }

// // Імпортуємо файли перекладів
// import enNavbar from "../../public/locales/en/navbar.json";
// import enFooter from "../../public/locales/en/footer.json";
// import enIntroUnregistred from "../../public/locales/en/introUnregistred.json";
// import enSearch from "../../public/locales/en/search.json";
// import enData from "../../public/locales/en/data.json";

// import ukNavbar from "../../public/locales/uk/navbar.json";
// import ukFooter from "../../public/locales/uk/footer.json";
// import ukIntroUnregistred from "../../public/locales/uk/introUnregistred.json";
// import ukSearch from "../../public/locales/uk/search.json";
// import ukData from "../../public/locales/uk/data.json";

// // Створюємо об'єкти перекладів для кожної мови
// const resources = {
//   en: {
//     navbar: enNavbar,
//     footer: enFooter,
//     introUnregistred: enIntroUnregistred,
//     search: enSearch,
//     data: enData,
//   },
//   uk: {
//     navbar: ukNavbar,
//     footer: ukFooter,
//     introUnregistred: ukIntroUnregistred,
//     search: ukSearch,
//     data: ukData,
//   },
// };

// i18n
//   .use(LanguageDetector) // Додаємо автоматичне визначення мови
//   .use(initReactI18next) // Інтеграція з React
//   .init({
//     lng: defaultLanguage, // Початкова мова
//     fallbackLng: "en", // Запасна мова, якщо вибрана недоступна
//     debug: true, // Увімкни debug-режим у консолі для зручності
//     interpolation: {
//       escapeValue: false, // Вимикаємо екранування HTML (не потрібно для React)
//     },
//     resources, // Мапа з перекладами
//     detection: {
//       order: ["localStorage", "navigator"], // Визначаємо мову за localStorage, потім за браузером
//       caches: ["localStorage"], // Зберігаємо мову в localStorage
//     },
//     ns: ["navbar", "footer", "introUnregistred", "search", "data"], // Список файлів з перекладами
//     defaultNS: "navbar", // Простір імен за замовчуванням
//   });

// export default i18n;




import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';

let initialLanguage = localStorage.getItem("language");

if (!initialLanguage) {
  const browserLanguage = navigator.language.split('-')[0];
  initialLanguage = browserLanguage === "uk" ? "uk" : "en";
  localStorage.setItem("language", initialLanguage);
}

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: initialLanguage,
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    ns: ["navbar", "footer", "introUnregistred", "search", "data", "helpful-tips", "testimonials", "analysis", "ready-to-start", "acordion-unregistered", "categories", "login", "pre-register", "register", "gig", "reviews", "gigs", "sort-dropdown", "about-us", "introTasker", "introClient", "acordion-tasker", "acordion-client", "add"],
    defaultNS: "navbar",
  });

export default i18n;
