import { createItem, listItems } from "../../lib/cms/db.js";
import { requireAdmin } from "../../lib/cms/auth.js";
import { json, methodNotAllowed, noStore, readJson, sendError } from "../../lib/cms/http.js";
import { addMemoryItem, getMemoryItems } from "../../lib/cms/memory-store.js";

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
        console.warn(`[CMS API] Database query failed for GET ${resource}, returning fallback memory items:`, dbErr.message);
        return json(res, 200, { items: getMemoryItems(resource) });
      }
    }
    if (req.method === "POST") {
      const payload = await readJson(req);
      try {
        const item = await createItem(resource, payload);
        addMemoryItem(resource, item);
        return json(res, 201, { item });
      } catch (dbErr) {
        console.warn(`[CMS API] Database query failed for POST ${resource}, returning fallback created item:`, dbErr.message);
        const item = addMemoryItem(resource, payload);
        return json(res, 201, { item });
      }
    }
    return methodNotAllowed(res, ["GET", "POST"]);
  } catch (error) {
    return sendError(res, error);
  }
}
