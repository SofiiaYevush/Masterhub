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
      loadPath: "../../public/locales/{{lng}}/navbar.json", // Вказуємо шлях до файлів локалізації
    },
    ns: ["navbar"], // Використовуємо цей namespace
    defaultNS: "navbar",
  });

export default i18n;
