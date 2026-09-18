"use client";

import React from "react";
import { TranslationProvider } from "./data/TranslationContext";
import { AskingProvider } from "./data/AskingContext";
import AskingShell from "./components/AskingShell";

export default function AskingWebPage() {
  return (
    <TranslationProvider>
      <AskingProvider>
        <AskingShell />
      </AskingProvider>
    </TranslationProvider>
  );
}
