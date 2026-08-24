"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

/**
 * Auto-detect user locale based on:
 * 1. Saved preference in localStorage ('asking_language')
 * 2. Browser language preferences (navigator.languages / navigator.language)
 * 3. System Timezone (Intl.DateTimeFormat().resolvedOptions().timeZone)
 * 
 * Returns 'id' if user is detected from Indonesia or has Indonesian locale,
 * otherwise returns 'en' for all international visitors.
 */
export function detectUserLocale() {
  if (typeof window === "undefined") return "id";

  // 1. Priority #1: Check explicitly saved user preference
  try {
    const saved = localStorage.getItem("asking_language");
    if (saved === "id" || saved === "en") {
      return saved;
    }
  } catch (e) {
    // Ignore localStorage access errors
  }

  // 2. Priority #2: Check browser language settings
  try {
    const navLanguages = [
      ...(navigator.languages || []),
      navigator.language,
      navigator.userLanguage,
    ]
      .filter(Boolean)
      .map((l) => l.toLowerCase());

    const hasIndonesianLang = navLanguages.some(
      (lang) =>
        lang === "id" ||
        lang === "in" ||
        lang.startsWith("id-") ||
        lang.startsWith("in-") ||
        lang.includes("-id") ||
        lang.includes("_id")
    );

    if (hasIndonesianLang) {
      return "id";
    }
  } catch (e) {
    // Ignore language inspection errors
  }

  // 3. Priority #3: Check system timezone (Indonesia: WIB, WITA, WIT)
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const idTimeZones = [
      "Asia/Jakarta",
      "Asia/Pontianak",
      "Asia/Makassar",
      "Asia/Jayapura",
      "Asia/Ujung_Pandang",
    ];

    const isIdTimezone =
      idTimeZones.some((tz) => timeZone.toLowerCase().includes(tz.toLowerCase())) ||
      timeZone.toLowerCase().includes("jakarta") ||
      timeZone.toLowerCase().includes("makassar") ||
      timeZone.toLowerCase().includes("jayapura") ||
      timeZone.toLowerCase().includes("pontianak");

    if (isIdTimezone) {
      return "id";
    }
  } catch (e) {
    // Ignore Intl timezone errors
  }

  // 4. Default for all international users outside Indonesia
  return "en";
}

const LanguageContext = createContext({
  language: "id",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => key,
  isMounted: false,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("id");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const resolvedLocale = detectUserLocale();
    setLanguageState(resolvedLocale);
  }, []);

  const setLanguage = (newLang) => {
    if (newLang === "id" || newLang === "en") {
      setLanguageState(newLang);
      try {
        localStorage.setItem("asking_language", newLang);
      } catch (e) {
        // Ignore localStorage quota errors
      }
    }
  };

  const toggleLanguage = () => {
    const next = language === "id" ? "en" : "id";
    setLanguage(next);
  };

  const t = (path, params = {}) => {
    const currentDict = translations[language] || translations["id"];
    const fallbackDict = translations["id"];

    const keys = path.split(".");
    let result = currentDict;
    let fallbackResult = fallbackDict;

    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key];
      } else {
        result = undefined;
        break;
      }
    }

    if (result === undefined) {
      for (const key of keys) {
        if (fallbackResult && typeof fallbackResult === "object" && key in fallbackResult) {
          fallbackResult = fallbackResult[key];
        } else {
          fallbackResult = path;
          break;
        }
      }
      result = fallbackResult;
    }

    if (typeof result === "string" && params) {
      return Object.entries(params).reduce((acc, [k, v]) => {
        return acc.replace(new RegExp(`{${k}}`, "g"), String(v));
      }, result);
    }

    return result !== undefined ? result : path;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isMounted,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
