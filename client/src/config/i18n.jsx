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
    ns: ["navbar", "footer", "introUnregistred", "search", "data", "helpful-tips", "testimonials", "analysis", "ready-to-start", "acordion-unregistered", "categories", "login", "pre-register", "register", "gig", "reviews", "gigs", "sort-dropdown", "about-us", "introTasker", "introClient", "acordion-tasker", "acordion-client", "add", "admin"],
    defaultNS: "navbar",
  });

export default i18n;
