"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  getIntlLocale,
  persistUiLocale,
  readPersistedUiLocale,
  selectLocaleText,
  syncDocumentLocale,
  translateText,
  type UiLocale,
} from "@/lib/i18n";

export function useI18n() {
  const locale = useAppStore((state) => state.uiLocale);
  const setUiLocale = useAppStore((state) => state.setUiLocale);

  useEffect(() => {
    const initialLocale = readPersistedUiLocale();
    if (initialLocale !== locale) {
      setUiLocale(initialLocale);
    }
    syncDocumentLocale(initialLocale);
  }, [locale, setUiLocale]);

  const setLocale = useCallback(
    (nextLocale: UiLocale) => {
      setUiLocale(nextLocale);
      persistUiLocale(nextLocale);
    },
    [setUiLocale],
  );

  return useMemo(
    () => ({
      locale,
      intlLocale: getIntlLocale(locale),
      setLocale,
      t: (
        sourceText: string,
        params?: Record<string, unknown>,
        overrides?: Partial<Record<UiLocale, string>>,
      ) => translateText(locale, sourceText, params, overrides),
      tl: (
        overrides: Record<UiLocale, string>,
        params?: Record<string, unknown>,
      ) => selectLocaleText(locale, overrides, params),
    }),
    [locale, setLocale],
  );
}
