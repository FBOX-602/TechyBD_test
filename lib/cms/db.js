import pg from "pg";
import crypto from "node:crypto";
import { HttpError, isPlainObject } from "./http.js";

const { Pool } = pg;

export const RESOURCES = ["projects", "services", "offers", "testimonials", "faqs", "customers", "profiles"];
const RESOURCE_SET = new Set(RESOURCES);
const GLOBAL_POOL_KEY = "__techyBdPostgresPool";

function getDatabaseUrl() {
  const value = process.env.DATABASE_URL;
  if (!value) {
    throw new HttpError(503, "Database is not configured");
  }
  return value;
}

function shouldUseSsl(connectionString) {
  if (process.env.DATABASE_SSL === "false") return false;
  if (process.env.DATABASE_SSL === "true") return true;
  return process.env.VERCEL === "1" || /supabase\.com/i.test(connectionString);
}

export function getPool() {
  const globalStore = globalThis;
  if (globalStore[GLOBAL_POOL_KEY]) return globalStore[GLOBAL_POOL_KEY];

  const connectionString = getDatabaseUrl();
  const pool = new Pool({
    connectionString,
    max: Math.min(Math.max(Number(process.env.DB_POOL_MAX) || 3, 1), 10),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 1_500,
    ...(shouldUseSsl(connectionString) ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  globalStore[GLOBAL_POOL_KEY] = pool;
  return pool;
}

export async function query(text, values = []) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Database query timed out (1.5s limit)")), 1500)
  );
  return Promise.race([getPool().query(text, values), timeoutPromise]);
}

export function assertResource(resource) {
  if (!RESOURCE_SET.has(resource)) {
    throw new HttpError(404, "Unknown content resource");
  }
  return resource;
}

export function toPublicItem(row) {
  return {
    ...row.data,
    sortOrder: row.sort_order,
    id: row.id,
  };
}

export async function listItems(resource) {
  assertResource(resource);
  const result = await query(
    `SELECT id, sort_order, data
     FROM cms_items
     WHERE resource = $1
     ORDER BY sort_order ASC, created_at ASC`,
    [resource],
  );
  return result.rows.map(toPublicItem);
}

export async function getItem(resource, id) {
  assertResource(resource);
  assertUuid(id);
  const result = await query(
    `SELECT id, sort_order, data
     FROM cms_items
     WHERE resource = $1 AND id = $2`,
    [resource, id],
  );
  return result.rows[0] ? toPublicItem(result.rows[0]) : null;
}

export async function createItem(resource, payload) {
  assertResource(resource);
  const data = extractItemData(payload);
  const id = crypto.randomUUID();
  const key = makeContentKey(payload, id);
  const sortOrder = extractSortOrder(payload);
  const result = await query(
    `INSERT INTO cms_items (id, resource, item_key, sort_order, data)
     VALUES ($1, $2, $3, $4, $5::jsonb)
     RETURNING id, sort_order, data`,
    [id, resource, key, sortOrder, JSON.stringify(data)],
  );
  return toPublicItem(result.rows[0]);
}

export async function updateItem(resource, id, payload) {
  assertResource(resource);
  assertUuid(id);
  const data = extractItemData(payload);
  const keyProvided = payload?.key !== undefined
    || payload?.item?.key !== undefined
    || payload?.slug !== undefined
    || payload?.item?.slug !== undefined;
  const sortProvided = payload?.sortOrder !== undefined
    || payload?.position !== undefined
    || payload?.item?.sortOrder !== undefined
    || payload?.item?.position !== undefined;
  const key = keyProvided ? makeContentKey(payload, id) : null;
  const sortOrder = !sortProvided
    ? null
    : extractSortOrder(payload);
  const result = await query(
    `UPDATE cms_items
     SET data = data || $3::jsonb,
         item_key = COALESCE($4, item_key),
         sort_order = COALESCE($5, sort_order),
         updated_at = NOW()
     WHERE resource = $1 AND id = $2
     RETURNING id, sort_order, data`,
    [resource, id, JSON.stringify(data), key, sortOrder],
  );
  return result.rows[0] ? toPublicItem(result.rows[0]) : null;
}

export async function deleteItem(resource, id) {
  assertResource(resource);
  assertUuid(id);
  const result = await query(
    "DELETE FROM cms_items WHERE resource = $1 AND id = $2 RETURNING id",
    [resource, id],
  );
  return Boolean(result.rows[0]);
}

export async function getSettings() {
  const result = await query(
    "SELECT value FROM site_settings WHERE setting_key = $1",
    ["global"],
  );
  return result.rows[0]?.value || {};
}

export async function updateSettings(value) {
  if (!isPlainObject(value)) {
    throw new HttpError(400, "Settings must be an object");
  }
  const result = await query(
    `INSERT INTO site_settings (setting_key, value, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (setting_key)
     DO UPDATE SET value = site_settings.value || EXCLUDED.value, updated_at = NOW()
     RETURNING value`,
    ["global", JSON.stringify(value)],
  );
  return result.rows[0].value;
}

function assertUuid(id) {
  if (typeof id !== "string" || !id.trim()) {
    throw new HttpError(400, "Invalid content id");
  }
}

function extractItemData(payload) {
  const candidate = isPlainObject(payload?.item) ? payload.item : payload;
  if (!isPlainObject(candidate)) {
    throw new HttpError(400, "Content item must be an object");
  }
  const { id, key, sortOrder, position, createdAt, updatedAt, ...data } = candidate;
  if (Object.keys(data).length === 0) {
    throw new HttpError(400, "Content item cannot be empty");
  }
  return data;
}

function extractSortOrder(payload) {
  const raw = payload?.sortOrder ?? payload?.position ?? payload?.item?.sortOrder ?? payload?.item?.position;
  if (raw === undefined || raw === null || raw === "") return 0;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < -1_000_000 || value > 1_000_000) {
    throw new HttpError(400, "sortOrder must be a whole number");
  }
  return value;
}

function makeContentKey(payload, fallback) {
  const raw = payload?.key
    ?? payload?.item?.key
    ?? payload?.slug
    ?? payload?.item?.slug
    ?? fallback;
  if (typeof raw !== "string" || !raw.trim()) return fallback;
  return raw.trim().slice(0, 160);
}
