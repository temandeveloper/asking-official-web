"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UI_STRINGS } from "../constants/uiStrings";

const TranslationContext = createContext(null);

export function getTranslation(keyPath, lang = "id", params = null) {
  if (!keyPath) return "";
  const targetLang = lang === "en" || lang === "id" ? lang : "id";
  const keys = keyPath.split(".");

  let value = UI_STRINGS[targetLang];
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      value = undefined;
      break;
    }
  }

  // Fallback to English if key missing in Indonesian
  if (value === undefined && targetLang !== "en") {
    let fallbackVal = UI_STRINGS.en;
    for (const k of keys) {
      if (fallbackVal && typeof fallbackVal === "object" && k in fallbackVal) {
        fallbackVal = fallbackVal[k];
      } else {
        fallbackVal = undefined;
        break;
      }
    }
    if (fallbackVal !== undefined) {
      value = fallbackVal;
    }
  }

  // Fallback to Indonesian if key missing in English
  if (value === undefined && targetLang !== "id") {
    let fallbackVal = UI_STRINGS.id;
    for (const k of keys) {
      if (fallbackVal && typeof fallbackVal === "object" && k in fallbackVal) {
        fallbackVal = fallbackVal[k];
      } else {
        fallbackVal = undefined;
        break;
      }
    }
    if (fallbackVal !== undefined) {
      value = fallbackVal;
    }
  }

  // Fallback to empty string if not found so fallback expressions evaluate cleanly without rendering raw key path
  if (value === undefined) {
    return "";
  }

  if (typeof value !== "string") {
    return String(value);
  }

  // Parameter replacement: {paramName}
  if (params && typeof params === "object") {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return paramKey in params ? params[paramKey] : match;
    });
  }

  return value;
}

export function TranslationProvider({ children }) {
  const [language, setLanguageState] = useState("id");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language setting from localStorage on startup
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedLang = localStorage.getItem("asking_web_language");
        if (savedLang === "id" || savedLang === "en") {
          setLanguageState(savedLang);
        }
      }
    } catch (err) {
      console.warn("[TranslationContext] Failed to load language setting:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update language and persist to localStorage
  const setLanguage = useCallback((newLang) => {
    if (newLang !== "id" && newLang !== "en") return;
    setLanguageState(newLang);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("asking_web_language", newLang);
      }
    } catch (err) {
      console.warn("[TranslationContext] Failed to persist language:", err);
    }
  }, []);

  // Toggle between ID and EN
  const toggleLanguage = useCallback(() => {
    setLanguage(language === "id" ? "en" : "id");
  }, [language, setLanguage]);

  // Translate helper: t('module.key', { paramKey: value })
  const t = useCallback(
    (keyPath, params = null) => getTranslation(keyPath, language, params),
    [language]
  );

  const contextValue = {
    language,
    isLoaded,
    setLanguage,
    toggleLanguage,
    t,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}

export default TranslationContext;
