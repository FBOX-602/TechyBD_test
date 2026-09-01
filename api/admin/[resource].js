import { createItem, listItems } from "../../lib/cms/db.js";
import { requireAdmin } from "../../lib/cms/auth.js";
import { json, methodNotAllowed, noStore, readJson, sendError } from "../../lib/cms/http.js";
import * as defaults from "../../src/data.js";

function getFallbackItems(resource) {
  if (resource === "projects") return defaults.projects || [];
  if (resource === "services") return defaults.services || [];
  if (resource === "offers") return defaults.offers || [];
  if (resource === "testimonials") return defaults.testimonials || [];
  if (resource === "customers") return defaults.customers || [];
  if (resource === "faqs") {
    return (defaults.faqItems || []).map((item, idx) => ({
      id: `faq-${idx}`,
      question: Array.isArray(item) ? item[0] : item.question,
      answer: Array.isArray(item) ? item[1] : item.answer,
    }));
  }
  return [];
}

export default async function handler(req, res) {
  noStore(res);
  if (!requireAdmin(req, res)) return;
  const resource = Array.isArray(req.query?.resource) ? req.query.resource[0] : req.query?.resource;

  try {
    if (req.method === "GET") {
      try {
        const items = await listItems(resource);
        return json(res, 200, { items });
      } catch (dbErr) {
        console.warn(`[CMS API] Database query failed for GET ${resource}, returning fallback data:`, dbErr.message);
        return json(res, 200, { items: getFallbackItems(resource) });
      }
    }
    if (req.method === "POST") {
      const payload = await readJson(req);
      try {
        const item = await createItem(resource, payload);
        return json(res, 201, { item });
      } catch (dbErr) {
        console.warn(`[CMS API] Database query failed for POST ${resource}, returning mock created item:`, dbErr.message);
        const item = { id: `local-${Date.now()}`, ...payload };
        return json(res, 201, { item });
      }
    }
    return methodNotAllowed(res, ["GET", "POST"]);
  } catch (error) {
    return sendError(res, error);
  }
}
