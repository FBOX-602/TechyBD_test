import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { assets, faqItems, offers, projects, services, siteSettings, testimonials } from "./data";

const ContentContext = createContext(null);

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeSettings(base, incoming) {
  if (!isRecord(incoming)) return base;
  const result = { ...base };
  for (const [key, value] of Object.entries(incoming)) {
    result[key] = isRecord(base[key]) && isRecord(value) ? mergeSettings(base[key], value) : value;
  }
  return result;
}

function normalizeFaqs(items) {
  const source = Array.isArray(items) ? items : faqItems;
  return source.map((item, index) => {
    if (Array.isArray(item)) return { id: `faq-${index}`, question: item[0], answer: item[1], sortOrder: index, published: true };
    return { id: item.id || `faq-${index}`, question: item.question || "", answer: item.answer || "", sortOrder: item.sortOrder ?? index, published: item.published !== false };
  });
}

function normalizeCollection(items, fallback, prefix) {
  const source = Array.isArray(items) ? items : fallback;
  return source
    .filter((item) => item && item.published !== false)
    .map((item, index) => ({ ...item, id: item.id || item.slug || `${prefix}-${index}`, sortOrder: item.sortOrder ?? index }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export const fallbackContent = Object.freeze({
  settings: siteSettings,
  assets,
  projects: normalizeCollection(projects, projects, "project"),
  services: normalizeCollection(services, services, "service"),
  offers: normalizeCollection(offers, offers, "offer"),
  testimonials: normalizeCollection(testimonials, testimonials, "testimonial"),
  faqs: normalizeFaqs(faqItems),
});

function normalizeContent(payload) {
  if (!isRecord(payload)) return fallbackContent;
  const settings = mergeSettings(siteSettings, payload.settings);
  return {
    settings,
    assets: { ...assets, ...(settings.assets || {}) },
    projects: normalizeCollection(payload.projects, projects, "project"),
    services: normalizeCollection(payload.services, services, "service"),
    offers: normalizeCollection(payload.offers, offers, "offer"),
    testimonials: normalizeCollection(payload.testimonials, testimonials, "testimonial"),
    faqs: normalizeFaqs(Array.isArray(payload.faqs) && payload.faqs.length ? payload.faqs : faqItems),
  };
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(fallbackContent);

  const reloadContent = useCallback(() => {
    fetch("/api/content", { headers: { Accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error(`Content request failed (${response.status})`);
        return response.json();
      })
      .then((payload) => setContent(normalizeContent(payload)))
      .catch((error) => {
        if (error.name !== "AbortError") console.info("Using local content fallback until the CMS API is configured.");
      });
  }, []);

  useEffect(() => {
    reloadContent();
    window.addEventListener("cms-content-update", reloadContent);
    window.addEventListener("focus", reloadContent);
    return () => {
      window.removeEventListener("cms-content-update", reloadContent);
      window.removeEventListener("focus", reloadContent);
    };
  }, [reloadContent]);

  const value = useMemo(() => content, [content]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(ContentContext) || fallbackContent;
}
