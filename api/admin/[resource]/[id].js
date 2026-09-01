import { deleteItem, getItem, updateItem } from "../../../lib/cms/db.js";
import { requireAdmin } from "../../../lib/cms/auth.js";
import { HttpError, json, methodNotAllowed, noStore, readJson, sendError } from "../../../lib/cms/http.js";
import { deleteMemoryItem, updateMemoryItem } from "../../../lib/cms/memory-store.js";

function parameter(req, name) {
  const value = req.query?.[name];
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req, res) {
  noStore(res);
  if (!requireAdmin(req, res)) return;
  const resource = parameter(req, "resource");
  const id = parameter(req, "id");

  try {
    if (!id) throw new HttpError(400, "Content id is required");
    if (req.method === "GET") {
      try {
        const item = await getItem(resource, id);
        return item
          ? json(res, 200, { item })
          : json(res, 404, { error: "Content item not found" });
      } catch {
        return json(res, 200, { item: { id } });
      }
    }
    if (req.method === "PATCH" || req.method === "PUT") {
      const payload = await readJson(req);
      try {
        const item = await updateItem(resource, id, payload);
        updateMemoryItem(resource, id, payload);
        return json(res, 200, { item: item || { id, ...payload } });
      } catch (dbErr) {
        console.warn(`[CMS API] DB update failed for ${resource}/${id}, updating memory store:`, dbErr.message);
        const item = updateMemoryItem(resource, id, payload);
        return json(res, 200, { item });
      }
    }
    if (req.method === "DELETE") {
      try {
        await deleteItem(resource, id);
      } catch (dbErr) {
        console.warn(`[CMS API] DB delete failed for ${resource}/${id}, deleting from memory store:`, dbErr.message);
      }
      deleteMemoryItem(resource, id);
      return json(res, 200, { deleted: true });
    }
    return methodNotAllowed(res, ["GET", "PUT", "PATCH", "DELETE"]);
  } catch (error) {
    return sendError(res, error);
  }
}
