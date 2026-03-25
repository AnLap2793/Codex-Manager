"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import {
  readPersistedUiLocale,
  syncDocumentLocale,
  translateDynamicText,
} from "@/lib/i18n";
import { useAppStore } from "@/lib/store/useAppStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000,
        refetchOnWindowFocus: false,
      },
    },
  }));
  const setUiLocale = useAppStore((state) => state.setUiLocale);
  const uiLocale = useAppStore((state) => state.uiLocale);

  useEffect(() => {
    const locale = readPersistedUiLocale();
    setUiLocale(locale);
    syncDocumentLocale(locale);
  }, [setUiLocale]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const textSourceMap = new WeakMap<Text, string>();
    const attrSourceMap = new WeakMap<Element, Map<string, string>>();
    const translatableAttributes = ["placeholder", "title", "aria-label"] as const;

    const isSkippableTextNode = (node: Text) => {
      const parent = node.parentElement;
      if (!parent) return true;
      const tagName = parent.tagName;
      if (["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE"].includes(tagName)) {
        return true;
      }
      if (parent.closest("[contenteditable='true']")) {
        return true;
      }
      return false;
    };

    const translateTextNode = (node: Text) => {
      if (isSkippableTextNode(node)) {
        return;
      }

      const originalText = textSourceMap.get(node) ?? node.nodeValue ?? "";
      if (!textSourceMap.has(node)) {
        textSourceMap.set(node, originalText);
      }
      if (!originalText.trim()) {
        return;
      }

      const translated = translateDynamicText(uiLocale, originalText);
      if (node.nodeValue !== translated) {
        node.nodeValue = translated;
      }
    };

    const translateElementAttributes = (element: Element) => {
      let sourceMap = attrSourceMap.get(element);
      if (!sourceMap) {
        sourceMap = new Map<string, string>();
        attrSourceMap.set(element, sourceMap);
      }

      for (const attribute of translatableAttributes) {
        const currentValue = element.getAttribute(attribute);
        if (currentValue == null) {
          continue;
        }
        if (!sourceMap.has(attribute)) {
          sourceMap.set(attribute, currentValue);
        }
        const originalValue = sourceMap.get(attribute) || currentValue;
        const translated = translateDynamicText(uiLocale, originalValue);
        if (currentValue !== translated) {
          element.setAttribute(attribute, translated);
        }
      }
    };

    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        translateTextNode(node as Text);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const element = node as Element;
      translateElementAttributes(element);
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_ALL);
      let currentNode: Node | null = walker.currentNode;
      while (currentNode) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
          translateTextNode(currentNode as Text);
        } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
          translateElementAttributes(currentNode as Element);
        }
        currentNode = walker.nextNode();
      }
    };

    processNode(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          translateTextNode(mutation.target as Text);
          continue;
        }

        mutation.addedNodes.forEach((node) => processNode(node));
        if (mutation.type === "attributes" && mutation.target instanceof Element) {
          translateElementAttributes(mutation.target);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...translatableAttributes],
    });

    return () => observer.disconnect();
  }, [uiLocale]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="data-theme" 
        defaultTheme="tech" 
        enableSystem={false}
        disableTransitionOnChange
        themes={["tech", "dark", "dark-one", "business", "mint", "sunset", "grape", "ocean", "forest", "rose", "slate", "aurora"]}
      >
        <TooltipProvider>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            expand={false} 
            visibleToasts={3}
            theme="system"
          />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
