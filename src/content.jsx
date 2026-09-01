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
  faqs: normalizeFaqs(faqItems),
});

function normalizeContent(payload) {
  const localStore = getLocalCmsData() || {};

  const mergedProjects = [
    ...(Array.isArray(payload?.projects) ? payload.projects : []),
    ...(Array.isArray(localStore?.projects) ? localStore.projects : []),
  ];
  const uniqueProjectsMap = new Map();
  mergedProjects.forEach((p) => {
    if (p) {
      const key = p.id || p.slug || p.title || p.name;
      if (key) uniqueProjectsMap.set(key, p);
    }
  });
  const finalProjects = Array.from(uniqueProjectsMap.values());

  const mergedServices = [
    ...(Array.isArray(payload?.services) ? payload.services : []),
    ...(Array.isArray(localStore?.services) ? localStore.services : []),
  ];
  const uniqueServicesMap = new Map();
  mergedServices.forEach((s) => {
    if (s) {
      const key = s.id || s.slug || s.title || s.name;
      if (key) uniqueServicesMap.set(key, s);
    }
  });
  const finalServices = Array.from(uniqueServicesMap.values());

  const mergedOffers = [
    ...(Array.isArray(payload?.offers) ? payload.offers : []),
    ...(Array.isArray(localStore?.offers) ? localStore.offers : []),
  ];
  const uniqueOffersMap = new Map();
  mergedOffers.forEach((o) => {
    if (o) {
      const key = o.id || o.slug || o.title || o.name;
      if (key) uniqueOffersMap.set(key, o);
    }
  });
  const finalOffers = Array.from(uniqueOffersMap.values());

  const settings = mergeSettings(siteSettings, payload?.settings);

  return {
    settings,
    assets: { ...assets, ...(settings.assets || {}) },
    projects: normalizeCollection(finalProjects, projects, "project"),
    services: normalizeCollection(finalServices, services, "service"),
    offers: normalizeCollection(finalOffers, offers, "offer"),
    testimonials: normalizeCollection(payload?.testimonials, testimonials, "testimonial"),
    faqs: normalizeFaqs(payload?.faqs),
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
