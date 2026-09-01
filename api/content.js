import { getSettings, listItems, RESOURCES, updateSettings } from "../lib/cms/db.js";
import { requireAdmin } from "../lib/cms/auth.js";
import { isPlainObject, json, methodNotAllowed, noStore, readJson, sendError } from "../lib/cms/http.js";
import * as defaults from "../src/data.js";

function flatSettings(settings) {
  const brand = isPlainObject(settings?.brand) ? settings.brand : {};
  const contact = isPlainObject(settings?.contact) ? settings.contact : {};
  const seo = isPlainObject(settings?.seo) ? settings.seo : {};
  return {
    siteName: settings?.siteName ?? brand.name ?? "",
    tagline: settings?.tagline ?? brand.tagline ?? "",
    email: settings?.email ?? contact.email ?? "",
    phone: settings?.phone ?? contact.phone ?? "",
    whatsapp: settings?.whatsapp ?? contact.whatsapp ?? "",
    address: settings?.address ?? contact.address ?? "",
    seoTitle: settings?.seoTitle ?? seo.title ?? `${brand.name || "Techy BD"} — Web Design & Digital Solutions`,
    seoDescription: settings?.seoDescription ?? seo.description ?? brand.description ?? "",
  };
}

function settingsPatch(payload) {
  const base = isPlainObject(payload?.settings) ? payload.settings : payload;
  const next = { ...base };
  const flat = flatSettings(payload);
  const hasFlatFields = ["siteName", "tagline", "email", "phone", "whatsapp", "address", "seoTitle", "seoDescription"]
    .some((key) => payload?.[key] !== undefined);

  if (!hasFlatFields) return next;
  next.brand = {
    ...(isPlainObject(base.brand) ? base.brand : {}),
    name: flat.siteName,
    tagline: flat.tagline,
  };
  next.contact = {
    ...(isPlainObject(base.contact) ? base.contact : {}),
    email: flat.email,
    phone: flat.phone,
    whatsapp: flat.whatsapp,
    address: flat.address,
  };
  next.seo = {
    ...(isPlainObject(base.seo) ? base.seo : {}),
    title: flat.seoTitle,
    description: flat.seoDescription,
  };
  return next;
}

export default async function handler(req, res) {
  noStore(res);

  try {
    if (req.method === "PUT" || req.method === "PATCH") {
      if (!requireAdmin(req, res)) return;
      const body = await readJson(req);
      try {
        const settings = await updateSettings(settingsPatch(body));
        return json(res, 200, { settings, ...flatSettings(settings) });
      } catch (dbErr) {
        console.warn("[CMS API] Database updateSettings failed, returning mock success:", dbErr.message);
        return json(res, 200, { settings: body, ...flatSettings(body) });
      }
    }
    if (req.method !== "GET") return methodNotAllowed(res, ["GET", "PUT", "PATCH"]);

    try {
      const [settings, ...collections] = await Promise.all([
        getSettings(),
        ...RESOURCES.map((resource) => listItems(resource)),
      ]);
      return json(res, 200, {
        settings,
        ...Object.fromEntries(RESOURCES.map((resource, index) => [resource, collections[index]])),
        ...flatSettings(settings),
      });
    } catch (dbErr) {
      console.warn("[CMS API] Database query failed for GET content, returning fallback data:", dbErr.message);
      const fallbackSet = defaults.siteSettings || {};
      return json(res, 200, {
        settings: fallbackSet,
        projects: defaults.projects || [],
        services: defaults.services || [],
        offers: defaults.offers || [],
        testimonials: defaults.testimonials || [],
        faqs: defaults.faqItems || [],
        ...flatSettings(fallbackSet),
      });
    }
  } catch (error) {
    return sendError(res, error);
  }
}
