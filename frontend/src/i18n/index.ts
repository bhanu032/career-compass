import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import bn from "./locales/bn.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";
import mr from "./locales/mr.json";
import gu from "./locales/gu.json";
import pa from "./locales/pa.json";
import kn from "./locales/kn.json";
import ml from "./locales/ml.json";
import or from "./locales/or.json";
import ur from "./locales/ur.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: bn },
      ta: { translation: ta },
      te: { translation: te },
      mr: { translation: mr },
      gu: { translation: gu },
      pa: { translation: pa },
      kn: { translation: kn },
      ml: { translation: ml },
      or: { translation: or },
      ur: { translation: ur },
    },
    fallbackLng: "en",
    lng: localStorage.getItem("deshkiseva.lang") || "en",
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "deshkiseva.lang",
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
