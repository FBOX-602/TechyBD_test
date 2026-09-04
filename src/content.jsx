import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { assets, faqItems, offers, profiles, projects, services, siteSettings, testimonials } from "./data";

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

const LOCAL_STORAGE_KEY = "techy_bd_cms_local_store_v1";

export function getLocalCmsData() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const fallbackContent = Object.freeze({
  settings: siteSettings,
  assets,
  projects: normalizeCollection(projects, projects, "project"),
  services: normalizeCollection(services, services, "service"),
  offers: normalizeCollection(offers, offers, "offer"),
  testimonials: normalizeCollection(testimonials, testimonials, "testimonial"),
  profiles: normalizeCollection(profiles, profiles, "profile"),
  faqs: normalizeFaqs(faqItems),
});

function mergeResourceCollection(localItems, serverItems, fallbackDefaults, prefix) {
  let baseList = null;

  if (Array.isArray(localItems)) {
    baseList = localItems;
  } else if (Array.isArray(serverItems) && serverItems.length > 0) {
    baseList = serverItems;
  } else {
    baseList = fallbackDefaults;
  }

  return (baseList || [])
    .filter((item) => item && item.published !== false)
    .map((item, index) => ({
      ...item,
      id: item.id || item.slug || `${prefix}-${index}`,
      sortOrder: item.sortOrder ?? index,
    }))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function normalizeContent(payload) {
  const localStore = getLocalCmsData() || {};
  const settings = mergeSettings(siteSettings, payload?.settings);

  return {
    settings,
    assets: { ...assets, ...(settings.assets || {}) },
    projects: mergeResourceCollection(localStore?.projects, payload?.projects, projects, "project"),
    services: mergeResourceCollection(localStore?.services, payload?.services, services, "service"),
    offers: mergeResourceCollection(localStore?.offers, payload?.offers, offers, "offer"),
    testimonials: mergeResourceCollection(localStore?.testimonials, payload?.testimonials, testimonials, "testimonial"),
    profiles: mergeResourceCollection(localStore?.profiles, payload?.profiles, profiles, "profile"),
    faqs: normalizeFaqs(localStore?.faqs || payload?.faqs),
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
